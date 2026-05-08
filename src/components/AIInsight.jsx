export default function AIInsight({ text, loading }) {
  if (loading)
    return (
      <div
        style={{
          padding: '14px 18px',
          background: '#0d0d1a',
          borderRadius: 12,
          border: '1px solid #2d2d3d',
          fontSize: 13,
          color: '#64748b',
        }}
      >
        <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>
          ✦ Analyzing...
        </span>
      </div>
    );

  if (!text) return null;

  return (
    <div
      style={{
        padding: '14px 18px',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: 12,
        border: '1px solid #6366f130',
        fontSize: 13,
        color: '#a5b4fc',
        lineHeight: 1.7,
      }}
    >
      <span style={{ color: '#6366f1', fontWeight: 600 }}>✦ AI Insight</span>
      <br />
      {text}
    </div>
  );
}
