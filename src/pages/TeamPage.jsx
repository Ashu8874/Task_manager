import { useState } from 'react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import AIInsight from '../components/AIInsight';
import { getWorkloadAnalysis } from '../utils/aiService';

export default function TeamPage({ users, tasks, projects }) {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setAiAnalysis('');

    const userData = users.map(u => {
      const ut = tasks.filter(t => t.assigneeId === u.id);
      return {
        name: u.name,
        role: u.role,
        tasks: ut.length,
        done: ut.filter(t => t.status === 'Done').length,
        overdue: ut.filter(
          t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
        ).length,
      };
    });

    const result = await getWorkloadAnalysis(userData);
    setAiAnalysis(result);
    setLoading(false);
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
            style={{ fontSize: 32, color: '#f1f5f9', marginBottom: 4 }}
          >
            Team
          </h2>
          <p style={{ color: '#64748b' }}>{users.length} members</p>
        </div>
        <Button onClick={analyze} disabled={loading}>
          ✦ Analyze Workload
        </Button>
      </div>

      {(aiAnalysis || loading) && (
        <div style={{ marginBottom: 24 }}>
          <AIInsight text={aiAnalysis} loading={loading} />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {users.map(u => {
          const uTasks = tasks.filter(t => t.assigneeId === u.id);
          const done = uTasks.filter(t => t.status === 'Done');
          const inProg = uTasks.filter(t => t.status === 'In Progress');
          const overdue = uTasks.filter(
            t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
          );
          const uProjects = projects.filter(p => p.members.includes(u.id));

          return (
            <div
              key={u.id}
              style={{
                background: '#13131f',
                border: '1px solid #1e1e2e',
                borderRadius: 18,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <Avatar user={u} size={48} />
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#f1f5f9',
                      marginBottom: 3,
                    }}
                  >
                    {u.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 999,
                        background:
                          u.role === 'Admin' ? '#6366f120' : '#1e1e2e',
                        color: u.role === 'Admin' ? '#818cf8' : '#64748b',
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
                    {u.email}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  ['Total', uTasks.length, '#94a3b8'],
                  ['Done', done.length, '#10b981'],
                  ['Active', inProg.length, '#6366f1'],
                  ['Overdue', overdue.length, overdue.length ? '#ef4444' : '#64748b'],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      textAlign: 'center',
                      padding: '10px 4px',
                      background: '#0d0d1a',
                      borderRadius: 10,
                    }}
                  >
                    <p style={{ fontSize: 18, fontWeight: 700, color: c }}>
                      {v}
                    </p>
                    <p style={{ fontSize: 10, color: '#475569' }}>{l}</p>
                  </div>
                ))}
              </div>

              {uTasks.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      height: 4,
                      background: '#1e1e2e',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.round((done.length / uTasks.length) * 100)}%`,
                        background: u.color,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>
                    {Math.round((done.length / uTasks.length) * 100)}% completion
                    rate
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {uProjects.map(p => (
                  <span
                    key={p.id}
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${p.color}15`,
                      color: p.color,
                    }}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
