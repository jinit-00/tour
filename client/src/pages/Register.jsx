import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { user, signup, verify, resendCode, openAuthModal, pendingEmail, setPendingEmail } = useAuth();

  // If already logged in, redirect to dashboard or home
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Form states
  const [step, setStep] = useState('register'); // 'register' | 'otp'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // 1. Submit Registration & Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please create a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    setLoading(true);
    try {
      await signup(trimmedName, trimmedEmail, password, confirmPassword);
      setSuccessMsg(`OTP sent successfully to ${trimmedEmail}!`);
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Finalize Account Creation
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetEmail = pendingEmail || email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await verify(cleanCode, targetEmail);
      setSuccessMsg('Account created and verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      const targetEmail = pendingEmail || email.trim().toLowerCase();
      await resendCode(targetEmail);
      setSuccessMsg(`A new 6-digit OTP has been sent to ${targetEmail}.`);
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP. Please try again in a moment.');
    }
  };

  // 4. Google Auth
  const handleGoogleAuth = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const returnUrl = encodeURIComponent(`${window.location.origin}/dashboard`);
    window.location.href = `${apiUrl}/auth/google?returnUrl=${returnUrl}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-sand-gradient">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-sand-900 border border-sand-700 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle decorative top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pine-850 via-pine-700 to-pine-850" />

          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-pine-800 bg-pine-800/10 px-3 py-1 rounded-full border border-pine-800/20 inline-block mb-3">
              JungleE Expeditions
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {step === 'register' ? 'Create Your Account' : 'Verify Your Email'}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1.5 font-sans">
              {step === 'register'
                ? 'Join to book luxury wildlife safaris and personalized tours.'
                : `Enter the 6-digit code sent to ${pendingEmail || email}`}
            </p>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-medium">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: Registration Form */}
          {step === 'register' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 font-sans">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder-charcoal-400/60 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="photographer@expedition.com"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder-charcoal-400/60 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 font-sans">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder-charcoal-400/60 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 font-sans">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-charcoal-900 placeholder-charcoal-400/60 focus:outline-none focus:border-pine-800 focus:ring-1 focus:ring-pine-800 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-700 focus:outline-none"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Button: Send OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-pine-850 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-lg transition-all duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sand-700"></div>
                </div>
                <span className="relative bg-sand-900 px-3 text-[11px] font-sans text-charcoal-500 uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* Google Auth */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 rounded-xl bg-sand-950 border border-sand-700 hover:border-pine-800/50 text-charcoal-800 font-medium text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Sign In Link */}
              <div className="pt-2 text-center text-xs text-charcoal-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-pine-800 font-bold hover:underline cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification & Account Finalization */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-pine-800/10 text-pine-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>

              <div>
                <p className="text-xs text-charcoal-700">
                  Please enter the 6-digit OTP sent to:
                </p>
                <p className="text-sm font-bold text-pine-850 mt-0.5">
                  {pendingEmail || email}
                </p>
              </div>

              {/* OTP Input */}
              <div className="pt-1">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full bg-sand-950 border border-pine-800/40 rounded-2xl py-3.5 text-center text-2xl font-mono tracking-[10px] text-pine-850 focus:outline-none focus:border-pine-800 focus:ring-2 focus:ring-pine-800/20 shadow-inner"
                />
              </div>

              {/* Verify OTP & Create Account Button */}
              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 px-4 rounded-xl bg-pine-850 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-lg transition-all duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Verifying OTP...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify OTP & Create Account</span>
                  </>
                )}
              </button>

              {/* Sub-actions */}
              <div className="flex items-center justify-between text-xs pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-charcoal-600 hover:text-pine-800 underline transition-colors cursor-pointer"
                >
                  Edit details / change email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  className={`font-semibold transition-colors cursor-pointer ${
                    resendCooldown > 0
                      ? 'text-charcoal-400 cursor-not-allowed'
                      : 'text-pine-800 hover:underline'
                  }`}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
