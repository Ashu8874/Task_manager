export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  style = {},
  small,
}) {
  const base = {
    border: 'none',
    borderRadius: 10,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: small ? 13 : 14,
    padding: small ? '7px 14px' : '10px 20px',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: '#fff',
    },
    secondary: {
      background: '#1e1e2e',
      color: '#94a3b8',
      border: '1px solid #2d2d3d',
    },
    danger: {
      background: '#ef444420',
      color: '#ef4444',
      border: '1px solid #ef444430',
    },
    success: {
      background: '#10b98120',
      color: '#10b981',
      border: '1px solid #10b98130',
    },
    ghost: { background: 'transparent', color: '#94a3b8', border: 'none' },
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
