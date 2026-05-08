import Avatar from './Avatar';
import Badge from './Badge';
import { isOverdue } from '../utils/dateUtils';

export default function TaskCard({
  task,
  users,
  projects,
  onEdit,
  onDelete,
  currentUser,
}) {
  const assignee = users.find(u => u.id === task.assigneeId);
  const project = projects.find(p => p.id === task.projectId);
  const overdue = isOverdue(task.dueDate, task.status);
  const canEdit =
    currentUser.role === 'Admin' || task.assigneeId === currentUser.id;

  return (
    <div
      style={{
        background: '#13131f',
        border: `1px solid ${overdue ? '#ef444330' : '#1e1e2e'}`,
        borderRadius: 14,
        padding: '18px 20px',
        transition: 'all 0.2s',
        cursor: 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <h4
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#e2e8f0',
            lineHeight: 1.4,
          }}
        >
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {canEdit && (
            <button
              onClick={() => onEdit(task)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ✎
            </button>
          )}
          {currentUser.role === 'Admin' && (
            <button
              onClick={() => onDelete(task.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p
          style={{
            fontSize: 12,
            color: '#475569',
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <Badge label={task.status} type="status" />
        <Badge label={task.priority} type="priority" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {assignee && (
            <>
              <Avatar user={assignee} size={24} />
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {assignee.name.split(' ')[0]}
              </span>
            </>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {project && (
            <p style={{ fontSize: 11, color: project.color, marginBottom: 2 }}>
              {project.name}
            </p>
          )}
          <p style={{ fontSize: 11, color: overdue ? '#ef4444' : '#475569' }}>
            {overdue ? '⚠ ' : ''}Due{' '}
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
