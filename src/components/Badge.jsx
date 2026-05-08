import { PRIORITY_CONFIG, STATUS_CONFIG } from '../data/constants';

export default function Badge({ label }) {
  const cfg = PRIORITY_CONFIG[label] || STATUS_CONFIG[label];

  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: cfg?.bg || '#1e1e2e',
        color: cfg?.color || '#94a3b8',
        border: `1px solid ${cfg?.color || '#334155'}22`,
        letterSpacing: 0.3,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {STATUS_CONFIG[label] && (
        <span style={{ fontSize: 9 }}>{STATUS_CONFIG[label].icon}</span>
      )}
      {label}
    </span>
  );
}
