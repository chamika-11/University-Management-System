import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../app/store';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(
      setCredentials({
        accessToken: 'demo-access-token',
        user: { id: 'admin-1', role: 'ADMIN', email: 'admin@ulms.local', permissions: ['*'] },
      }),
    );
    navigate('/dashboard');
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">ULMS Admin Portal</p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--brand-strong)]">Sign in</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
        This starter interface is wired for the admin role flow in the architecture doc. Connect the real auth form and API next.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)]">
          Demo credentials are not required yet. Use the button to enter the dashboard shell.
        </div>
        <Button className="w-full" onClick={handleLogin}>
          Enter dashboard
        </Button>
      </div>
    </div>
  );
}