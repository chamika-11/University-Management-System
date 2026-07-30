import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '@/store/authSlice';
import { authClient } from '@/api/authClient';
import { parseErrorMessage } from '@/utils/errorParser';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authClient.login({ email, password, mfaToken: showMfa ? mfaToken : null });
      const data = response.data || response;

      const accessToken = data.accessToken;
      const user = data.user;

      if (!user) {
        throw new Error('Invalid server response during authentication');
      }

      dispatch(setCredentials({ accessToken, user }));
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.data?.code === 'MFA_REQUIRED') {
        setShowMfa(true);
        setError('Multi-factor authentication required. Enter your authenticator code.');
      } else {
        setError(parseErrorMessage(err, 'Invalid credentials. Please verify email and password.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Glow backdrop decorative effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-2xl tracking-tighter mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            U
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">ULMS Platform</h1>
          <p className="text-xs text-slate-400 mt-1">Unified University Learning Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu or faculty@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {showMfa && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                MFA Authenticator Code
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  placeholder="6-digit TOTP code"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" loading={loading} className="w-full py-2.5 text-sm font-semibold">
            Sign In to Platform
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
          Protected by API Gateway RBAC & httpOnly Cookie Auth.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
