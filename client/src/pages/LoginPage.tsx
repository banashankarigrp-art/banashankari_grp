import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectMessage = (location.state as any)?.message;
  const fromLocation = (location.state as any)?.from;
  const from = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search || ''}`
    : '/properties';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const raw = identifier.trim();
    if (!raw) {
      setError('Please enter your mobile number or Gmail / email address');
      return;
    }

    let normalizedIdentifier = '';
    if (raw.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        setError('Please enter a valid Gmail / email address');
        return;
      }
      normalizedIdentifier = raw.toLowerCase();
    } else {
      const cleanDigits = raw.replace(/\D/g, '');
      if (cleanDigits.length < 10) {
        setError('Please enter a valid 10-digit mobile number or Gmail / email address');
        return;
      }
      normalizedIdentifier = `+91 ${cleanDigits.slice(-10)}`;
    }

    try {
      setIsSubmitting(true);
      const user = await login({ identifier: normalizedIdentifier, password });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(fromLocation ? from : '/properties');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid mobile number / email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-bold text-navy-900">Sign in to Your Account</h1>
          <p className="text-xs text-slate-500">
            Sign in using your mobile number or Gmail address with your password.
          </p>
        </div>

        {redirectMessage && !error && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-gold-300 text-navy-950 text-xs flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Single Identifier Field: Mobile Number or Gmail / Email */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Mobile Number or Gmail / Email *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9845012345 or name@gmail.com"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Enter your registered 10-digit mobile number or Gmail / email address
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password *</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-navy-900 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition shadow flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider & Prominent Create Account Button */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Don't have an account?
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Link
            to="/register"
            state={location.state}
            className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-gold-500 text-navy-900 hover:text-gold-600 font-bold py-3.5 rounded-xl transition shadow-2xs flex items-center justify-center space-x-2 text-sm"
          >
            <UserPlus className="w-4 h-4 text-gold-600" />
            <span>Create Account / Sign Up</span>
          </Link>
        </div>

        <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
          <p className="text-[11px] text-slate-400">
            For administrator access, visit{' '}
            <Link to="/admin/login" className="text-slate-500 hover:text-navy-900 underline font-semibold">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
