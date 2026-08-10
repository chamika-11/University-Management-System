import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/authSlice';
import AuthLayout from '@/layouts/AuthLayout';
import { FormField, Input } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { parseError } from '@/utils/errorParser';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = parseError(err);
      console.error('[Login Error]', err);
      showToast({ message: msg, type: 'error' });
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-8">Sign in to access your student portal</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.api && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium flex items-center gap-2 animate-fade-in" role="alert">
            <span>⚠️</span> {errors.api}
          </div>
        )}

        <FormField label="Email address" id="email" error={errors.email} required>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="pl-10"
            />
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </FormField>

        <FormField label="Password" id="password" error={errors.password} required>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              autoComplete="current-password"
              className="pl-10 pr-10"
            />
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <Button type="submit" variant="primary" loading={loading} className="w-full" size="md">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-xs text-center text-slate-600">
        Student accounts are provisioned by your institution's admin.
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
