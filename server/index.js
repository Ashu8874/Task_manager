import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJsonStore } from './jsonStore.js';
import { createPgStore } from './pgStore.js';
import { createToken, hashPassword, publicUser, verifyPassword, verifyToken } from './auth.js';
import {
  PRIORITIES,
  ROLES,
  STATUSES,
  cleanString,
  isEmail,
  requireFields,
  uniqueNumbers,
} from './validation.js';

const avatarColors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
const generateAvatar = name =>
  String(name)
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
const getRandomColor = () => avatarColors[Math.floor(Math.random() * avatarColors.length)];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const port = Number(process.env.PORT || 8080);
const store = process.env.DATABASE_URL ? createPgStore() : createJsonStore();

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const parseBody = req =>
  new Promise(resolve => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(null);
      }
    });
  });

async function currentUser(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const session = verifyToken(token);
  return session ? store.findUserById(session.sub) : null;
}

function canAccessProject(user, project) {
  return user.role === 'Admin' || project.members.includes(user.id);
}

async function sendState(res, user) {
  const [users, projects, tasks] = await Promise.all([
    store.listUsers(),
    store.listProjects(user),
    store.listTasks(user),
  ]);
  json(res, 200, {
    user: publicUser(user),
    users: users.map(publicUser),
    projects,
    tasks,
  });
}

async function requireAuth(req, res) {
  const user = await currentUser(req);
  if (!user) json(res, 401, { error: 'Authentication required.' });
  return user;
}

async function requireAdmin(req, res) {
  const user = await requireAuth(req, res);
  if (user && user.role !== 'Admin') {
    json(res, 403, { error: 'Admin access required.' });
    return null;
  }
  return user;
}

async function handleApi(req, res, url) {
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await parseBody(req) : {};
  if (body === null) return json(res, 400, { error: 'Invalid JSON body.' });

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return json(res, 200, { ok: true, database: process.env.DATABASE_URL ? 'postgres' : 'json' });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
    const missing = requireFields(body, ['name', 'email', 'password']);
    if (missing) return json(res, 400, { error: missing });

    const email = cleanString(body.email).toLowerCase();
    if (!isEmail(email)) return json(res, 400, { error: 'Please enter a valid email address.' });
    if (String(body.password).length < 6) {
      return json(res, 400, { error: 'Password must be at least 6 characters.' });
    }
    if (await store.findUserByEmail(email)) return json(res, 409, { error: 'Email already registered.' });

    const role = ROLES.includes(body.role) ? body.role : 'Member';
    const user = await store.createUser({
      name: cleanString(body.name),
      email,
      passwordHash: hashPassword(body.password),
      role,
      avatar: generateAvatar(body.name),
      color: getRandomColor(),
    });
    return json(res, 201, { token: createToken(user), user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const missing = requireFields(body, ['email', 'password']);
    if (missing) return json(res, 400, { error: missing });
    const user = await store.findUserByEmail(cleanString(body.email));
    if (!user || !verifyPassword(body.password, user.passwordHash)) {
      return json(res, 401, { error: 'Invalid email or password.' });
    }
    return json(res, 200, { token: createToken(user), user: publicUser(user) });
  }

  if (req.method === 'GET' && url.pathname === '/api/me') {
    const user = await requireAuth(req, res);
    if (!user) return;
    return sendState(res, user);
  }

  if (req.method === 'GET' && url.pathname === '/api/users') {
    const user = await requireAuth(req, res);
    if (!user) return;
    const users = await store.listUsers();
    return json(res, 200, users.map(publicUser));
  }

  if (req.method === 'POST' && url.pathname === '/api/projects') {
    const user = await requireAdmin(req, res);
    if (!user) return;
    const missing = requireFields(body, ['name']);
    if (missing) return json(res, 400, { error: missing });

    const memberIds = uniqueNumbers(body.members);
    if (!memberIds.includes(user.id)) memberIds.push(user.id);
    const project = await store.createProject({
      name: cleanString(body.name),
      description: cleanString(body.description, 1000),
      color: cleanString(body.color) || '#6366f1',
      createdBy: user.id,
      members: memberIds,
    });
    return json(res, 201, project);
  }

  const projectDeleteMatch = url.pathname.match(/^\/api\/projects\/(\d+)$/);
  if (req.method === 'DELETE' && projectDeleteMatch) {
    const user = await requireAdmin(req, res);
    if (!user) return;
    await store.deleteProject(Number(projectDeleteMatch[1]));
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/tasks') {
    const user = await requireAuth(req, res);
    if (!user) return;
    const missing = requireFields(body, ['title', 'projectId', 'assigneeId', 'dueDate']);
    if (missing) return json(res, 400, { error: missing });

    const project = await store.findProject(Number(body.projectId));
    if (!project || !canAccessProject(user, project)) return json(res, 403, { error: 'Project access denied.' });

    const assigneeId = Number(body.assigneeId);
    if (!project.members.includes(assigneeId)) {
      return json(res, 400, { error: 'Assignee must be a project member.' });
    }
    if (user.role !== 'Admin' && assigneeId !== user.id) {
      return json(res, 403, { error: 'Members can only create tasks assigned to themselves.' });
    }

    const task = await store.createTask({
      projectId: project.id,
      title: cleanString(body.title),
      description: cleanString(body.description, 2000),
      status: STATUSES.includes(body.status) ? body.status : 'To Do',
      priority: PRIORITIES.includes(body.priority) ? body.priority : 'Medium',
      assigneeId,
      createdBy: user.id,
      dueDate: new Date(body.dueDate).toISOString(),
    });
    return json(res, 201, task);
  }

  const taskMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch && req.method === 'PUT') {
    const user = await requireAuth(req, res);
    if (!user) return;
    const task = await store.findTask(Number(taskMatch[1]));
    if (!task) return json(res, 404, { error: 'Task not found.' });
    if (user.role !== 'Admin' && task.assigneeId !== user.id) {
      return json(res, 403, { error: 'Members can only update their assigned tasks.' });
    }

    const project = await store.findProject(Number(body.projectId || task.projectId));
    if (!project || !canAccessProject(user, project)) return json(res, 403, { error: 'Project access denied.' });

    const assigneeId = Number(body.assigneeId || task.assigneeId);
    if (!project.members.includes(assigneeId)) {
      return json(res, 400, { error: 'Assignee must be a project member.' });
    }
    const next = await store.updateTask(task.id, {
      projectId: project.id,
      title: cleanString(body.title || task.title),
      description: cleanString(body.description ?? task.description, 2000),
      status: STATUSES.includes(body.status) ? body.status : task.status,
      priority: PRIORITIES.includes(body.priority) ? body.priority : task.priority,
      assigneeId,
      dueDate: new Date(body.dueDate || task.dueDate).toISOString(),
    });
    return json(res, 200, next);
  }

  if (taskMatch && req.method === 'DELETE') {
    const user = await requireAdmin(req, res);
    if (!user) return;
    await store.deleteTask(Number(taskMatch[1]));
    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: 'API route not found.' });
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(distDir, requested));
  if (!filePath.startsWith(distDir)) return json(res, 403, { error: 'Forbidden.' });
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    const index = await fs.readFile(path.join(distDir, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  }
}

await store.init();

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
      return await serveStatic(req, res, url);
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: 'Unexpected server error.' });
    }
  })
  .listen(port, () => {
    console.log(`TeamFlow running on port ${port}`);
  });
