import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Phone,
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

  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
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

    let identifier = '';
    if (loginMethod === 'mobile') {
      const cleanDigits = mobileNumber.replace(/\D/g, '');
      if (cleanDigits.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      identifier = `+91 ${cleanDigits}`;
    } else {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid Gmail / Email address');
        return;
      }
      identifier = email.trim().toLowerCase();
    }

    try {
      setIsSubmitting(true);
      const user = await login({ identifier, password });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(fromLocation ? from : '/properties');
      }
    } catch (err: any) {
      setError(
        err.message ||
          (loginMethod === 'mobile'
            ? 'Invalid mobile number or password'
            : 'Invalid Gmail / Email or password')
      );
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

        {/* Login Method Toggle: Mobile (+91) vs Gmail / Email */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('mobile');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              loginMethod === 'mobile'
                ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-gold-600" />
            <span>Mobile (+91)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setError('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              loginMethod === 'email'
                ? 'bg-white text-navy-950 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-gold-600" />
            <span>Gmail / Email</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {loginMethod === 'mobile' ? (
            /* Mobile Number Login with Static +91 Prefix */
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
              <div className="relative flex rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-gold-500 overflow-hidden bg-white">
                <span className="inline-flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-slate-800 font-bold text-xs select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '');
                    setMobileNumber(digits);
                  }}
                  maxLength={10}
                  placeholder="98450 12345"
                  className="w-full px-3 py-3 text-xs focus:outline-none"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your registered 10-digit mobile number
              </p>
            </div>
          ) : (
            /* Gmail / Email Login */
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gmail / Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your registered email address
              </p>
            </div>
          )}

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
