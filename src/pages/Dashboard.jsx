import { useState } from 'react';
import StatCard from '../components/StatCard';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import AIInsight from '../components/AIInsight';
import { STATUS_CONFIG } from '../data/constants';
import { getDashboardInsight } from '../utils/aiService';
import { getGreeting, getTodayFormatted } from '../utils/dateUtils';

export default function Dashboard({ user, tasks, projects, users }) {
  const myTasks =
    tasks.filter(t => t.assigneeId === user.id || user.role === 'Admin');
  const overdue = myTasks.filter(
    t => new Date(t.dueDate) < new Date() && t.status !== 'Done'
  );
  const done = myTasks.filter(t => t.status === 'Done');
  const inProgress = myTasks.filter(t => t.status === 'In Progress');

  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  const getInsight = async () => {
    setInsightLoading(true);
    setInsight('');
    const result = await getDashboardInsight(
      tasks,
      projects,
      done,
      inProgress,
      overdue
    );
    setInsight(result);
    setInsightLoading(false);
  };

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
            Good {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>{getTodayFormatted()}</p>
        </div>
        <Button onClick={getInsight} disabled={insightLoading}>
          ✦ AI Insight
        </Button>
      </div>

      <AIInsight text={insight} loading={insightLoading} />
      {insight && <div style={{ marginBottom: 24 }} />}

      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 32,
          flexWrap: 'wrap',
        }}
      >
        <StatCard
          label="Total Tasks"
          value={myTasks.length}
          icon="✓"
          color="#6366f1"
        />
        <StatCard
          label="In Progress"
          value={inProgress.length}
          icon="◑"
          color="#0ea5e9"
        />
        <StatCard
          label="Completed"
          value={done.length}
          icon="●"
          color="#10b981"
          sub={
            myTasks.length
              ? `${Math.round((done.length / myTasks.length) * 100)}% completion rate`
              : ''
          }
        />
        <StatCard
          label="Overdue"
          value={overdue.length}
          icon="⚠"
          color="#ef4444"
          sub={overdue.length ? 'Needs attention' : 'All on track!'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div
          style={{
            background: '#13131f',
            border: '1px solid #1e1e2e',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
              color: '#94a3b8',
            }}
          >
            Recent Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentTasks.map(t => {
              const assignee = users.find(u => u.id === t.assigneeId);
              const project = projects.find(p => p.id === t.projectId);
              return (
                <div
                  key={t.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: STATUS_CONFIG[t.status]?.color,
                    }}
                  >
                    {STATUS_CONFIG[t.status]?.icon}
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#e2e8f0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.title}
                    </p>
                    <p style={{ fontSize: 11, color: project?.color }}>
                      {project?.name}
                    </p>
                  </div>
                  {assignee && <Avatar user={assignee} size={26} />}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: '#13131f',
            border: '1px solid #1e1e2e',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 18,
              color: '#94a3b8',
            }}
          >
            Projects Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map(p => {
              const ptasks = tasks.filter(t => t.projectId === p.id);
              const pdone = ptasks.filter(t => t.status === 'Done').length;
              const pct = ptasks.length
                ? Math.round((pdone / ptasks.length) * 100)
                : 0;
              return (
                <div key={p.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#e2e8f0' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
