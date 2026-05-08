export default function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#13131f',
          border: '1px solid #2d2d3d',
          borderRadius: 20,
          width: '100%',
          maxWidth: width,
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'fadeUp 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid #1e1e2e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontWeight: 600, fontSize: 17 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 20,
              lineHeight: 1,
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '24px 28px' }}>{children}</div>
      </div>
    </div>
  );
}
