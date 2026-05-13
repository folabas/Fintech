'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [accountId, setAccountId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(accountId.trim(), passcode);
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Top accent stripe */}
      <div className="accent-stripe" />

      {/* Logo section */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px 0' }}>
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minWidth: 280,
          }}
        >
          <Logo size="lg" />
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="accent-stripe" style={{ marginTop: 32 }} />

      {/* Form area */}
      <div className="login-body">
        <div className="login-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="accountId" className="login-form-label">
                Account ID:
              </label>
              <input
                id="accountId"
                type="text"
                className="login-form-input"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder=""
                autoComplete="username"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="passcode" className="login-form-label">
                Account Passcode:
              </label>
              <input
                id="passcode"
                type="password"
                className="login-form-input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder=""
                autoComplete="current-password"
                required
              />
            </div>

            <button
              id="proceed-btn"
              type="submit"
              className="proceed-btn"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Proceed'}
            </button>
          </form>

          <div className="login-tagline">Achieving Your Financial Potential</div>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="accent-stripe" style={{ marginBottom: 0 }} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
