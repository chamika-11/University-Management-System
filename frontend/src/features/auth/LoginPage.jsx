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

      <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
        Protected by API Gateway RBAC & httpOnly Cookie Auth.
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
