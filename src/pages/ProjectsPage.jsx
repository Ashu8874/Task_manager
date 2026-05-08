import { useState } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import { PROJECT_COLORS } from '../data/constants';

export default function ProjectsPage({
  user,
  projects,
  tasks,
  users,
  onAddProject,
  onDeleteProject,
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    members: [user.id],
  });

  const save = () => {
    if (!form.name) return;
    onAddProject({
      ...form,
      id: Date.now(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    });
    setShowForm(false);
    setForm({
      name: '',
      description: '',
      color: '#6366f1',
      members: [user.id],
    });
  };

  return (
    <div className="fade-up">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 32, color: '#f1f5f9', marginBottom: 6 }}
          >
            Projects
          </h2>
          <p style={{ color: '#64748b' }}>{projects.length} active projects</p>
        </div>
        {user.role === 'Admin' && (
          <Button onClick={() => setShowForm(true)}>+ New Project</Button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {projects.map(p => {
          const ptasks = tasks.filter(t => t.projectId === p.id);
          const pdone = ptasks.filter(t => t.status === 'Done').length;
          const pct = ptasks.length
            ? Math.round((pdone / ptasks.length) * 100)
            : 0;
          const pMembers = users.filter(u => p.members.includes(u.id));
          const overdue = ptasks.filter(
            t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
          ).length;

          return (
            <div
              key={p.id}
              style={{
                background: '#13131f',
                border: '1px solid #1e1e2e',
                borderRadius: 18,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ height: 6, background: p.color }} />
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9' }}>
                    {p.name}
                  </h3>
                  {user.role === 'Admin' && (
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#334155',
                        cursor: 'pointer',
                        fontSize: 16,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: '#475569',
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  {p.description}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[
                    ['Tasks', ptasks.length, '#94a3b8'],
                    ['Done', pdone, '#10b981'],
                    ['Overdue', overdue, overdue ? '#ef4444' : '#64748b'],
                  ].map(([l, v, c]) => (
                    <div
                      key={l}
                      style={{
                        textAlign: 'center',
                        padding: '10px 6px',
                        background: '#0d0d1a',
                        borderRadius: 10,
                      }}
                    >
                      <p style={{ fontSize: 20, fontWeight: 700, color: c }}>
                        {v}
                      </p>
                      <p style={{ fontSize: 11, color: '#475569' }}>{l}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      Progress
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: p.color,
                        fontWeight: 600,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: '#1e1e2e',
                      borderRadius: 999,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: p.color,
                        borderRadius: 999,
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex' }}>
                    {pMembers.slice(0, 4).map((m, i) => (
                      <div
                        key={m.id}
                        style={{
                          marginLeft: i ? -8 : 0,
                          border: '2px solid #13131f',
                          borderRadius: '50%',
                        }}
                      >
                        <Avatar user={m} size={28} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: '#475569' }}>
                    {pMembers.length} member{pMembers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Modal title="New Project" onClose={() => setShowForm(false)}>
          <Input
            label="Project Name *"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Website Redesign"
          />
          <Input
            label="Description"
            as="textarea"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What is this project about?"
          />
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#94a3b8',
                marginBottom: 7,
              }}
            >
              Color
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PROJECT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: c,
                    border:
                      form.color === c
                        ? '3px solid #fff'
                        : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#94a3b8',
                marginBottom: 7,
              }}
            >
              Team Members
            </label>
            {users.map(u => (
              <label
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={form.members.includes(u.id)}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      members: e.target.checked
                        ? [...f.members, u.id]
                        : f.members.filter(id => id !== u.id),
                    }))
                  }
                />
                <Avatar user={u} size={26} />
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>{u.name}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  ({u.role})
                </span>
              </label>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Create Project</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
