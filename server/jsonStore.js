import fs from 'node:fs/promises';
import path from 'node:path';
import { DB } from '../src/data/mockData.js';
import { hashPassword } from './auth.js';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

async function seed() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    const users = DB.users.map(user => ({
      ...user,
      passwordHash: hashPassword(user.password),
      password: undefined,
    }));
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify({ users, projects: DB.projects, tasks: DB.tasks }, null, 2)
    );
  }
}

async function readDb() {
  await seed();
  return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
}

async function writeDb(db) {
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
}

const nextId = rows => (rows.length ? Math.max(...rows.map(row => row.id)) + 1 : 1);

export function createJsonStore() {
  return {
    async init() {
      await seed();
    },
    async findUserByEmail(email) {
      const db = await readDb();
      return db.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    },
    async findUserById(id) {
      const db = await readDb();
      return db.users.find(user => user.id === Number(id)) || null;
    },
    async createUser(data) {
      const db = await readDb();
      const user = { ...data, id: nextId(db.users) };
      db.users.push(user);
      await writeDb(db);
      return user;
    },
    async listUsers() {
      const db = await readDb();
      return db.users;
    },
    async listProjects(user) {
      const db = await readDb();
      if (user.role === 'Admin') return db.projects;
      return db.projects.filter(project => project.members.includes(user.id));
    },
    async findProject(id) {
      const db = await readDb();
      return db.projects.find(project => project.id === Number(id)) || null;
    },
    async createProject(data) {
      const db = await readDb();
      const project = { ...data, id: nextId(db.projects), createdAt: new Date().toISOString() };
      db.projects.push(project);
      await writeDb(db);
      return project;
    },
    async deleteProject(id) {
      const db = await readDb();
      db.projects = db.projects.filter(project => project.id !== Number(id));
      db.tasks = db.tasks.filter(task => task.projectId !== Number(id));
      await writeDb(db);
    },
    async listTasks(user) {
      const db = await readDb();
      if (user.role === 'Admin') return db.tasks;
      const allowedProjects = new Set(
        db.projects.filter(project => project.members.includes(user.id)).map(project => project.id)
      );
      return db.tasks.filter(task => task.assigneeId === user.id || allowedProjects.has(task.projectId));
    },
    async findTask(id) {
      const db = await readDb();
      return db.tasks.find(task => task.id === Number(id)) || null;
    },
    async createTask(data) {
      const db = await readDb();
      const task = { ...data, id: nextId(db.tasks), createdAt: new Date().toISOString() };
      db.tasks.push(task);
      await writeDb(db);
      return task;
    },
    async updateTask(id, data) {
      const db = await readDb();
      const index = db.tasks.findIndex(task => task.id === Number(id));
      if (index === -1) return null;
      db.tasks[index] = { ...db.tasks[index], ...data };
      await writeDb(db);
      return db.tasks[index];
    },
    async deleteTask(id) {
      const db = await readDb();
      db.tasks = db.tasks.filter(task => task.id !== Number(id));
      await writeDb(db);
    },
  };
}
