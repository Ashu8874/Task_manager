import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../utils/apiClient';
import { validateEmail } from '../utils/userUtils';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const session = await api.login({
          email: form.email,
          password: form.password,
        });
        await onLogin(session);
      } else {
        if (!form.name || !form.email || !form.password)
          return setErr('All fields required.');
        if (!validateEmail(form.email))
          return setErr('Please enter a valid email address.');

        const session = await api.signup(form);
        await onLogin(session);
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: [
                '#6366f1',
                '#8b5cf6',
                '#0ea5e9',
                '#10b981',
                '#f59e0b',
                '#ec4899',
              ][i],
              opacity: 0.06,
              width: [400, 300, 500, 250, 350, 280][i],
              height: [400, 300, 500, 250, 350, 280][i],
              top: [`${[10, 60, 30, 80, 5, 50][i]}%`],
              left: [`${[70, 10, 80, 5, 40, 60][i]}%`],
              transform: 'translate(-50%, -50%)',
              filter: 'blur(60px)',
            }}
          />
        ))}
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '0 20px',
          position: 'relative',
          animation: 'fadeUp 0.5s ease',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 16,
              marginBottom: 20,
              fontSize: 24,
            }}
          >
            ⚡
          </div>
          <h1 className="serif" style={{ fontSize: 36, color: '#f1f5f9', marginBottom: 8 }}>
            TeamFlow
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Manage projects. Ship faster. Together.
          </p>
        </div>

        <div
          style={{
            background: '#13131f',
            border: '1px solid #2d2d3d',
            borderRadius: 24,
            padding: '36px 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              padding: 4,
              background: '#0d0d1a',
              borderRadius: 12,
              marginBottom: 28,
            }}
          >
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setErr('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 9,
                  border: 'none',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: mode === m ? '#6366f1' : 'transparent',
                  color: mode === m ? '#fff' : '#64748b',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="Alice Johnson"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="alice@team.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />

          {mode === 'signup' && (
            <Input
              label="Role"
              as="select"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option>Member</option>
              <option>Admin</option>
            </Input>
          )}

          {err && (
            <p
              style={{
                color: '#ef4444',
                fontSize: 13,
                marginBottom: 16,
                padding: '10px 14px',
                background: '#ef444410',
                borderRadius: 8,
              }}
            >
              {err}
            </p>
          )}

          <Button
            onClick={handle}
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px 0',
              borderRadius: 12,
              fontSize: 15,
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </Button>

          {mode === 'login' && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: '#0d0d1a',
                borderRadius: 12,
                fontSize: 12,
                color: '#64748b',
                lineHeight: 1.8,
              }}
            >
              <strong style={{ color: '#94a3b8' }}>Demo accounts</strong>
              <br />
              Admin: alice@team.com / admin123
              <br />
              Member: bob@team.com / member123
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
