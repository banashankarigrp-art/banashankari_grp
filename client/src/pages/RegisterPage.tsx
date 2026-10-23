import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Home,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const redirectMessage = (location.state as any)?.message;
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer' as 'customer' | 'seller',
    password: '',
    confirmPassword: '',
    agreeToTerms: true,
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password rules calculation
  const ruleMinLength = formData.password.length >= 6;
  const ruleHasLetter = /[a-zA-Z]/.test(formData.password);
  const ruleHasNumber = /[0-9]/.test(formData.password);
  const rulePasswordsMatch =
    Boolean(formData.password && formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  const strengthScore =
    (ruleMinLength ? 1 : 0) +
    (ruleHasLetter ? 1 : 0) +
    (ruleHasNumber ? 1 : 0);

  const strengthLabel =
    formData.password.length === 0
      ? ''
      : strengthScore <= 1
      ? 'Weak'
      : strengthScore === 2
      ? 'Fair'
      : 'Strong';

  const strengthColor =
    strengthScore <= 1 ? 'bg-red-500' : strengthScore === 2 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthBadgeBg =
    strengthScore <= 1 ? 'bg-red-50 text-red-700 border-red-200' : strengthScore === 2 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const registeredUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const fromLocation = (location.state as any)?.from;
      if (fromLocation) {
        navigate(`${fromLocation.pathname}${fromLocation.search || ''}`);
      } else if (registeredUser.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/properties');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-navy-900">
            Create {formData.role === 'seller' ? 'Seller / Owner' : 'Customer'} Account
          </h1>
          <p className="text-xs text-slate-500">
            {formData.role === 'seller'
              ? 'List your Bangalore property, track verified buyers, and review approvals.'
              : 'Discover verified plots, schedule site visits, apply for loans, and build turnkey homes.'}
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
          {/* Role Selection Option: Customer vs Seller */}
          <div>
            <label className="font-semibold text-slate-700 block mb-2">I am registering as *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  formData.role === 'customer'
                    ? 'border-gold-500 bg-gold-50/60 ring-2 ring-gold-500/30 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <User className={`w-3.5 h-3.5 ${formData.role === 'customer' ? 'text-gold-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${formData.role === 'customer' ? 'text-navy-950' : 'text-slate-700'}`}>
                      Customer
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.role === 'customer' ? 'border-gold-600 bg-gold-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {formData.role === 'customer' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Looking to buy plots, rent homes, or build turnkey house
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'seller' })}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  formData.role === 'seller'
                    ? 'border-gold-500 bg-gold-50/60 ring-2 ring-gold-500/30 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Home className={`w-3.5 h-3.5 ${formData.role === 'seller' ? 'text-gold-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${formData.role === 'seller' ? 'text-navy-950' : 'text-slate-700'}`}>
                      Seller / Owner
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.role === 'seller' ? 'border-gold-600 bg-gold-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {formData.role === 'seller' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Have land, plot, or building to sell or rent in Bengaluru
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 XXXXX"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
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

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Rules & Strength Meter (Appears when typing password or focused) */}
          {(formData.password.length > 0 || isPasswordFocused) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 transition-all">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Password Requirements:</span>
                {strengthScore > 0 && (
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md text-[10px] border ${strengthBadgeBg}`}
                  >
                    {strengthLabel}
                  </span>
                )}
              </div>

              {/* Dynamic Strength Bar */}
              <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                <div
                  className={`rounded-full transition-all duration-300 ${
                    strengthScore >= 1 ? strengthColor : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`rounded-full transition-all duration-300 ${
                    strengthScore >= 2 ? strengthColor : 'bg-slate-200'
                  }`}
                />
                <div
                  className={`rounded-full transition-all duration-300 ${
                    strengthScore >= 3 ? strengthColor : 'bg-slate-200'
                  }`}
                />
              </div>

              {/* Live Rules Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div
                  className={`flex items-center space-x-1.5 transition ${
                    ruleMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'
                  }`}
                >
                  {ruleMinLength ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span>At least 6 characters</span>
                </div>

                <div
                  className={`flex items-center space-x-1.5 transition ${
                    ruleHasLetter ? 'text-emerald-700 font-medium' : 'text-slate-500'
                  }`}
                >
                  {ruleHasLetter ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span>Contains at least one letter</span>
                </div>

                <div
                  className={`flex items-center space-x-1.5 transition ${
                    ruleHasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'
                  }`}
                >
                  {ruleHasNumber ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span>Contains at least one number</span>
                </div>

                {formData.confirmPassword.length > 0 && (
                  <div
                    className={`flex items-center space-x-1.5 transition ${
                      rulePasswordsMatch ? 'text-emerald-700 font-medium' : 'text-red-500'
                    }`}
                  >
                    {rulePasswordsMatch ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-red-300 shrink-0" />
                    )}
                    <span>{rulePasswordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-start space-x-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="w-4 h-4 text-gold-600 rounded mt-0.5"
              />
              <span>
                I agree to Banashankari Enterprises privacy terms and consent to property communications.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition shadow flex items-center justify-center space-x-2"
          >
            <span>
              {isSubmitting
                ? 'Creating Account...'
                : `Register as ${formData.role === 'seller' ? 'Seller / Owner' : 'Customer'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link
            to="/login"
            state={location.state}
            className="font-bold text-navy-900 hover:text-gold-600"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
