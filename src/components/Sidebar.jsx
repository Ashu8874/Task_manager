import Avatar from './Avatar';
import Button from './Button';

export default function Sidebar({ user, page, setPage, projects, onLogout }) {
  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'projects', icon: '◈', label: 'Projects' },
    { id: 'tasks', icon: '✓', label: 'My Tasks' },
    ...(user.role === 'Admin' ? [{ id: 'team', icon: '◎', label: 'Team' }] : []),
  ];

  return (
    <div
      style={{
        width: 240,
        background: '#0d0d1a',
        borderRight: '1px solid #1e1e2e',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid #1e1e2e',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ⚡
          </div>
          <span className="serif" style={{ fontSize: 20, color: '#f1f5f9' }}>
            TeamFlow
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
              textAlign: 'left',
              transition: 'all 0.2s',
              background: page === item.id ? '#6366f115' : 'transparent',
              color: page === item.id ? '#818cf8' : '#64748b',
              fontWeight: page === item.id ? 500 : 400,
              fontSize: 14,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
            {page === item.id && (
              <div
                style={{
                  marginLeft: 'auto',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#6366f1',
                }}
              />
            )}
          </button>
        ))}

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1e1e2e' }}>
          <p
            style={{
              fontSize: 11,
              color: '#334155',
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              padding: '0 12px',
              marginBottom: 8,
            }}
          >
            Projects
          </p>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setPage(`project-${p.id}`)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                textAlign: 'left',
                transition: 'all 0.2s',
                background:
                  page === `project-${p.id}` ? '#6366f115' : 'transparent',
                color: page === `project-${p.id}` ? '#e2e8f0' : '#64748b',
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: p.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div
        style={{
          padding: '16px 16px 20px',
          borderTop: '1px solid #1e1e2e',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar user={user} size={36} />
          <div style={{ overflow: 'hidden' }}>
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
              {user.name}
            </p>
            <p style={{ fontSize: 11, color: '#64748b' }}>{user.role}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={onLogout}
          small
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
