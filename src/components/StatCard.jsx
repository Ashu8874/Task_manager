export default function StatCard({ label, value, icon, color, sub }) {
  return (
    <div
      style={{
        background: '#13131f',
        border: '1px solid #1e1e2e',
        borderRadius: 16,
        padding: '22px 24px',
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {icon}
        </div>
      </div>
      <p style={{ fontSize: 30, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 13, color: '#64748b' }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}
