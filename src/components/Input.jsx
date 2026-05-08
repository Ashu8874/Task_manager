export default function Input({ label, as, style, children, ...props }) {
  const baseStyle = {
    width: '100%',
    padding: '10px 14px',
    background: '#0d0d1a',
    border: '1px solid #2d2d3d',
    borderRadius: 10,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    ...style,
  };

  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: '#94a3b8',
            marginBottom: 7,
          }}
        >
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          {...props}
          style={{ ...baseStyle, resize: 'vertical', minHeight: 80 }}
        />
      ) : as === 'select' ? (
        <select {...props} style={baseStyle}>
          {children}
        </select>
      ) : (
        <input {...props} style={baseStyle} />
      )}
    </div>
  );
}
