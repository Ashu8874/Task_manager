import { useState } from 'react';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import { STATUS_CONFIG } from '../data/constants';

export default function ProjectDetailPage({
  projectId,
  projects,
  tasks,
  users,
  user,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const project = projects.find(p => p.id === projectId);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  if (!project)
    return (
      <div style={{ color: '#64748b', padding: 40 }}>Project not found.</div>
    );

  const ptasks = tasks.filter(t => t.projectId === projectId);
  const statuses = ['To Do', 'In Progress', 'Done'];

  const saveTask = fd => {
    if (editTask)
      onUpdateTask({ ...editTask, ...fd, projectId });
    else
      onAddTask({
        ...fd,
        id: Date.now(),
        projectId,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      });
    setEditTask(null);
    setShowForm(false);
  };

  return (
    <div className="fade-up">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 10,
            height: 48,
            borderRadius: 999,
            background: project.color,
          }}
        />
        <div style={{ flex: 1 }}>
          <h2
            className="serif"
            style={{ fontSize: 32, color: '#f1f5f9', marginBottom: 4 }}
          >
            {project.name}
          </h2>
          <p style={{ color: '#64748b' }}>{project.description}</p>
        </div>
        <Button
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
          small
        >
          + Task
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          ['Total', ptasks.length, '#94a3b8'],
          ['To Do', ptasks.filter(t => t.status === 'To Do').length, '#64748b'],
          [
            'In Progress',
            ptasks.filter(t => t.status === 'In Progress').length,
            '#6366f1',
          ],
          ['Done', ptasks.filter(t => t.status === 'Done').length, '#10b981'],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              padding: '14px 20px',
              background: '#13131f',
              border: '1px solid #1e1e2e',
              borderRadius: 12,
              flex: 1,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: c,
                marginBottom: 4,
              }}
            >
              {v}
            </p>
            <p style={{ fontSize: 12, color: '#64748b' }}>{l}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {statuses.map(status => {
          const colTasks = ptasks.filter(t => t.status === status);
          return (
            <div key={status}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: STATUS_CONFIG[status].color,
                  }}
                >
                  {STATUS_CONFIG[status].icon}
                </span>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#94a3b8',
                  }}
                >
                  {status}
                </h3>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 12,
                    color: '#334155',
                    background: '#1e1e2e',
                    borderRadius: 999,
                    padding: '2px 8px',
                  }}
                >
                  {colTasks.length}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {colTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    users={users}
                    projects={projects}
                    currentUser={user}
                    onEdit={t => {
                      setEditTask(t);
                      setShowForm(true);
                    }}
                    onDelete={onDeleteTask}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div
                    style={{
                      padding: '24px 16px',
                      textAlign: 'center',
                      color: '#334155',
                      fontSize: 13,
                      borderRadius: 12,
                      border: '1px dashed #1e1e2e',
                    }}
                  >
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <TaskFormModal
          task={editTask}
          projects={projects}
          users={users}
          currentUser={user}
          onSave={saveTask}
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
}
