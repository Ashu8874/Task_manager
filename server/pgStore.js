import pg from 'pg';
import { DB } from '../src/data/mockData.js';
import { hashPassword } from './auth.js';

const { Pool } = pg;

const userFields =
  'id, name, email, password_hash as "passwordHash", role, avatar, color, created_at as "createdAt"';
const projectFields =
  'id, name, description, color, created_by as "createdBy", members, created_at as "createdAt"';
const taskFields =
  'id, project_id as "projectId", title, description, status, priority, assignee_id as "assigneeId", created_by as "createdBy", due_date as "dueDate", created_at as "createdAt"';

export function createPgStore() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
  });

  const query = (text, params) => pool.query(text, params);

  return {
    async init() {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('Admin', 'Member')),
          avatar TEXT NOT NULL,
          color TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT DEFAULT '',
          color TEXT NOT NULL,
          created_by INTEGER NOT NULL REFERENCES users(id),
          members INTEGER[] NOT NULL DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
          priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
          assignee_id INTEGER NOT NULL REFERENCES users(id),
          created_by INTEGER NOT NULL REFERENCES users(id),
          due_date TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);

      const count = await query('SELECT COUNT(*)::int AS count FROM users');
      if (count.rows[0].count) return;

      const userIds = new Map();
      for (const user of DB.users) {
        const inserted = await query(
          `INSERT INTO users (name, email, password_hash, role, avatar, color)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [user.name, user.email, hashPassword(user.password), user.role, user.avatar, user.color]
        );
        userIds.set(user.id, inserted.rows[0].id);
      }

      const projectIds = new Map();
      for (const project of DB.projects) {
        const inserted = await query(
          `INSERT INTO projects (name, description, color, created_by, members, created_at)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [
            project.name,
            project.description,
            project.color,
            userIds.get(project.createdBy),
            project.members.map(id => userIds.get(id)),
            project.createdAt,
          ]
        );
        projectIds.set(project.id, inserted.rows[0].id);
      }

      for (const task of DB.tasks) {
        await query(
          `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, created_by, due_date, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            projectIds.get(task.projectId),
            task.title,
            task.description,
            task.status,
            task.priority,
            userIds.get(task.assigneeId),
            userIds.get(task.createdBy),
            task.dueDate,
            task.createdAt,
          ]
        );
      }
    },
    async findUserByEmail(email) {
      const result = await query(`SELECT ${userFields} FROM users WHERE lower(email) = lower($1)`, [email]);
      return result.rows[0] || null;
    },
    async findUserById(id) {
      const result = await query(`SELECT ${userFields} FROM users WHERE id = $1`, [id]);
      return result.rows[0] || null;
    },
    async createUser(data) {
      const result = await query(
        `INSERT INTO users (name, email, password_hash, role, avatar, color)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${userFields}`,
        [data.name, data.email, data.passwordHash, data.role, data.avatar, data.color]
      );
      return result.rows[0];
    },
    async listUsers() {
      return (await query(`SELECT ${userFields} FROM users ORDER BY id`)).rows;
    },
    async listProjects(user) {
      const where = user.role === 'Admin' ? '' : 'WHERE $1 = ANY(members)';
      const params = user.role === 'Admin' ? [] : [user.id];
      return (await query(`SELECT ${projectFields} FROM projects ${where} ORDER BY id`, params)).rows;
    },
    async findProject(id) {
      return (await query(`SELECT ${projectFields} FROM projects WHERE id = $1`, [id])).rows[0] || null;
    },
    async createProject(data) {
      const result = await query(
        `INSERT INTO projects (name, description, color, created_by, members)
         VALUES ($1, $2, $3, $4, $5) RETURNING ${projectFields}`,
        [data.name, data.description, data.color, data.createdBy, data.members]
      );
      return result.rows[0];
    },
    async deleteProject(id) {
      await query('DELETE FROM projects WHERE id = $1', [id]);
    },
    async listTasks(user) {
      const where =
        user.role === 'Admin'
          ? ''
          : 'WHERE assignee_id = $1 OR project_id IN (SELECT id FROM projects WHERE $1 = ANY(members))';
      const params = user.role === 'Admin' ? [] : [user.id];
      return (await query(`SELECT ${taskFields} FROM tasks ${where} ORDER BY id`, params)).rows;
    },
    async findTask(id) {
      return (await query(`SELECT ${taskFields} FROM tasks WHERE id = $1`, [id])).rows[0] || null;
    },
    async createTask(data) {
      const result = await query(
        `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, created_by, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ${taskFields}`,
        [
          data.projectId,
          data.title,
          data.description,
          data.status,
          data.priority,
          data.assigneeId,
          data.createdBy,
          data.dueDate,
        ]
      );
      return result.rows[0];
    },
    async updateTask(id, data) {
      const result = await query(
        `UPDATE tasks
         SET project_id = $2, title = $3, description = $4, status = $5, priority = $6, assignee_id = $7, due_date = $8
         WHERE id = $1 RETURNING ${taskFields}`,
        [id, data.projectId, data.title, data.description, data.status, data.priority, data.assigneeId, data.dueDate]
      );
      return result.rows[0] || null;
    },
    async deleteTask(id) {
      await query('DELETE FROM tasks WHERE id = $1', [id]);
    },
  };
}
