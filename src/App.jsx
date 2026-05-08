import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Sidebar from './components/Sidebar';
import { api, clearSession, saveSession } from './utils/apiClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('teamflow_token')));
  const [error, setError] = useState('');

  const applyState = data => {
    setCurrentUser(data.user);
    setAllUsers(data.users);
    setProjects(data.projects);
    setTasks(data.tasks);
  };

  useEffect(() => {
    if (!localStorage.getItem('teamflow_token')) return;
    api
      .state()
      .then(applyState)
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  const refreshState = async () => {
    const data = await api.state();
    applyState(data);
  };

  const handleLogin = async session => {
    saveSession(session);
    await refreshState();
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setAllUsers([]);
    setProjects([]);
    setTasks([]);
    setPage('dashboard');
  };

  const runMutation = async action => {
    setError('');
    try {
      await action();
      await refreshState();
    } catch (err) {
      setError(err.message);
    }
  };

  const addProject = p => runMutation(() => api.createProject(p));

  const deleteProject = id => runMutation(() => api.deleteProject(id));

  const addTask = t => runMutation(() => api.createTask(t));

  const updateTask = t => runMutation(() => api.updateTask(t));

  const deleteTask = id => runMutation(() => api.deleteTask(id));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0a0a0f', color: '#94a3b8' }}>
        Loading workspace...
      </div>
    );
  }

  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  const userProjects =
    currentUser.role === 'Admin'
      ? projects
      : projects.filter(p => p.members.includes(currentUser.id));

  const renderPage = () => {
    if (page.startsWith('project-')) {
      const pid = Number(page.split('-')[1]);
      return (
        <ProjectDetailPage
          projectId={pid}
          projects={userProjects}
          tasks={tasks}
          users={allUsers}
          user={currentUser}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      );
    }

    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            tasks={tasks}
            projects={userProjects}
            users={allUsers}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            user={currentUser}
            projects={userProjects}
            tasks={tasks}
            users={allUsers}
            onAddProject={addProject}
            onDeleteProject={deleteProject}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            user={currentUser}
            tasks={tasks}
            projects={userProjects}
            users={allUsers}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        );
      case 'team':
        return currentUser.role === 'Admin' ? (
          <TeamPage
            user={currentUser}
            users={allUsers}
            tasks={tasks}
            projects={projects}
          />
        ) : (
          <div style={{ color: '#ef4444' }}>Access denied.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar
        user={currentUser}
        page={page}
        setPage={setPage}
        projects={userProjects}
        onLogout={handleLogout}
      />
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          padding: '40px 48px',
          minHeight: '100vh',
        }}
      >
        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 16px',
              background: '#ef444410',
              border: '1px solid #ef444430',
              borderRadius: 10,
              color: '#fca5a5',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}
