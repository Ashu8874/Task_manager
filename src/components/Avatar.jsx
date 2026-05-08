export default function Avatar({ user, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: user?.color || '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color: '#fff',
        flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.08)',
      }}
    >
      {user?.avatar || '?'}
    </div>
  );
}
