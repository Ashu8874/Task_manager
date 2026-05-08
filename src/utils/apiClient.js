const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function token() {
  return localStorage.getItem('teamflow_token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

export const api = {
  login: credentials =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: data =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  state: () => request('/api/me'),
  createProject: project =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  deleteProject: id => request(`/api/projects/${id}`, { method: 'DELETE' }),
  createTask: task =>
    request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  updateTask: task =>
    request(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  deleteTask: id => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};

export function saveSession(session) {
  localStorage.setItem('teamflow_token', session.token);
}

export function clearSession() {
  localStorage.removeItem('teamflow_token');
}
