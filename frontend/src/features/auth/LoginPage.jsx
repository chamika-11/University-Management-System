import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '@/store/authSlice';
import { authClient } from '@/api/authClient';
import { parseErrorMessage } from '@/utils/errorParser';
import { Button } from '@/components/ui/Button';
import AuthLayout from '@/layouts/AuthLayout';
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await authClient.login({
        email: email.trim(),
        password,
        mfaToken: showMfa ? mfaToken : undefined,
      });
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
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to access your ULMS portal</p>
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
              placeholder="student@ulms.edu or faculty@ulms.edu"
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
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
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

      {/* Demo Credentials Quick-Fill */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
          Quick Sign-In (Password: <span className="text-indigo-400 font-mono">Password123</span>)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@ulms.edu');
              setPassword('Password123');
              setError(null);
            }}
            className="flex items-center justify-between px-3 py-2 bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/50 rounded-lg text-left transition-all group"
          >
            <div>
              <span className="block text-xs font-medium text-slate-200 group-hover:text-indigo-300">👑 Admin</span>
              <span className="block text-[10px] text-slate-500 font-mono">admin@ulms.edu</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('student@ulms.edu');
              setPassword('Password123');
              setError(null);
            }}
            className="flex items-center justify-between px-3 py-2 bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/50 rounded-lg text-left transition-all group"
          >
            <div>
              <span className="block text-xs font-medium text-slate-200 group-hover:text-emerald-300">🎓 Student</span>
              <span className="block text-[10px] text-slate-500 font-mono">student@ulms.edu</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('faculty@ulms.edu');
              setPassword('Password123');
              setError(null);
            }}
            className="flex items-center justify-between px-3 py-2 bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-500/50 rounded-lg text-left transition-all group"
          >
            <div>
              <span className="block text-xs font-medium text-slate-200 group-hover:text-cyan-300">👨‍🏫 Faculty</span>
              <span className="block text-[10px] text-slate-500 font-mono">faculty@ulms.edu</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('staff@ulms.edu');
              setPassword('Password123');
              setError(null);
            }}
            className="flex items-center justify-between px-3 py-2 bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 hover:border-amber-500/50 rounded-lg text-left transition-all group"
          >
            <div>
              <span className="block text-xs font-medium text-slate-200 group-hover:text-amber-300">💼 Staff</span>
              <span className="block text-[10px] text-slate-500 font-mono">staff@ulms.edu</span>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Protected by API Gateway RBAC & httpOnly Cookie Auth.
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
