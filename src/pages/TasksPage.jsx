import { useState } from 'react';
import Button from '../components/Button';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import AIInsight from '../components/AIInsight';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../data/constants';
import { getTaskRecommendation } from '../utils/aiService';
import { formatDate } from '../utils/dateUtils';

export default function TasksPage({
  user,
  tasks,
  projects,
  users,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [view, setView] = useState('kanban');
  const [filter, setFilter] = useState({
    project: 'all',
    priority: 'all',
    assignee: 'all',
  });
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  const myTasks =
    user.role === 'Admin'
      ? tasks
      : tasks.filter(
          t =>
            t.assigneeId === user.id ||
            projects.find(p => p.id === t.projectId)?.members.includes(user.id)
        );

  const filtered = myTasks.filter(
    t =>
      (filter.project === 'all' || t.projectId === Number(filter.project)) &&
      (filter.priority === 'all' || t.priority === filter.priority) &&
      (filter.assignee === 'all' || t.assigneeId === Number(filter.assignee))
  );

  const getAISuggestion = async () => {
    setInsightLoading(true);
    setInsight('');
    const overdue = filtered.filter(
      t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
    ).length;
    const critical = filtered.filter(t => t.priority === 'Critical').length;
    const result = await getTaskRecommendation(
      filtered.length,
      overdue,
      critical
    );
    setInsight(result);
    setInsightLoading(false);
  };

  const saveTask = formData => {
    if (editTask)
      onUpdateTask({ ...editTask, ...formData });
    else
      onAddTask({
        ...formData,
        id: Date.now(),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      });
    setEditTask(null);
    setShowForm(false);
  };

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="fade-up">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 32, color: '#f1f5f9', marginBottom: 4 }}
          >
            {user.role === 'Admin' ? 'All Tasks' : 'My Tasks'}
          </h2>
          <p style={{ color: '#64748b' }}>{filtered.length} tasks</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="secondary"
            onClick={getAISuggestion}
            disabled={insightLoading}
            small
          >
            ✦ AI Suggest
          </Button>
          <div
            style={{
              display: 'flex',
              gap: 4,
              background: '#1e1e2e',
              borderRadius: 10,
              padding: 3,
            }}
          >
            {['kanban', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  background: view === v ? '#6366f1' : 'transparent',
                  color: view === v ? '#fff' : '#64748b',
                }}
              >
                {v === 'kanban' ? '⊞ Kanban' : '☰ List'}
              </button>
            ))}
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
      </div>

      {(insight || insightLoading) && (
        <div style={{ marginBottom: 20 }}>
          <AIInsight text={insight} loading={insightLoading} />
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            label: 'Project',
            key: 'project',
            opts: [
              { value: 'all', label: 'All Projects' },
              ...projects.map(p => ({ value: p.id, label: p.name })),
            ],
          },
          {
            label: 'Priority',
            key: 'priority',
            opts: [
              { value: 'all', label: 'All Priorities' },
              ...Object.keys(PRIORITY_CONFIG).map(p => ({
                value: p,
                label: p,
              })),
            ],
          },
          {
            label: 'Assignee',
            key: 'assignee',
            opts: [
              { value: 'all', label: 'All Members' },
              ...users.map(u => ({ value: u.id, label: u.name })),
            ],
          },
        ].map(({ key, opts }) => (
          <select
            key={key}
            value={filter[key]}
            onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}
            style={{
              padding: '8px 14px',
              background: '#13131f',
              border: '1px solid #2d2d3d',
              borderRadius: 10,
              color: '#94a3b8',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {opts.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        {(filter.project !== 'all' ||
          filter.priority !== 'all' ||
          filter.assignee !== 'all') && (
          <Button
            variant="ghost"
            onClick={() =>
              setFilter({ project: 'all', priority: 'all', assignee: 'all' })
            }
            small
          >
            Clear filters ✕
          </Button>
        )}
      </div>

      {view === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {statuses.map(status => {
            const colTasks = filtered.filter(t => t.status === status);
            return (
              <div key={status}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                    padding: '0 4px',
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
      ) : (
        <div
          style={{
            background: '#13131f',
            border: '1px solid #1e1e2e',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
              padding: '12px 20px',
              borderBottom: '1px solid #1e1e2e',
              background: '#0d0d1a',
            }}
          >
            {['Task', 'Project', 'Assignee', 'Status', 'Priority', 'Due'].map(
              h => (
                <span
                  key={h}
                  style={{
                    fontSize: 12,
                    color: '#475569',
                    fontWeight: 600,
                  }}
                >
                  {h}
                </span>
              )
            )}
          </div>
          {filtered.map((t, i) => {
            const assignee = users.find(u => u.id === t.assigneeId);
            const project = projects.find(p => p.id === t.projectId);
            const isOverdue =
              new Date(t.dueDate) < new Date() && t.status !== 'Done';
            const canEdit = user.role === 'Admin' || t.assigneeId === user.id;

            return (
              <div
                key={t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                  padding: '14px 20px',
                  borderBottom:
                    i < filtered.length - 1 ? '1px solid #1e1e2e' : 'none',
                  alignItems: 'center',
                  background: isOverdue ? '#ef444408' : 'transparent',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      color: '#e2e8f0',
                      fontWeight: 500,
                      marginBottom: 2,
                    }}
                  >
                    {t.title}
                  </p>
                  {t.description && (
                    <p
                      style={{
                        fontSize: 12,
                        color: '#475569',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 280,
                      }}
                    >
                      {t.description}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 12, color: project?.color || '#64748b' }}>
                  {project?.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {assignee && (
                    <>
                      <Avatar user={assignee} size={22} />
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {assignee.name.split(' ')[0]}
                      </span>
                    </>
                  )}
                </div>
                <Badge label={t.status} />
                <Badge label={t.priority} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: isOverdue ? '#ef4444' : '#64748b',
                    }}
                  >
                    {formatDate(t.dueDate)}
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => {
                        setEditTask(t);
                        setShowForm(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#475569',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      ✎
                    </button>
                  )}
                  {user.role === 'Admin' && (
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                color: '#334155',
              }}
            >
              No tasks match your filters
            </div>
          )}
        </div>
      )}

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
