import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    signup,
    verify,
    resendCode,
    pendingEmail,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      setSuccessMsg('Account created! Enter the 6-digit verification code.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verify(otpCode);
      setSuccessMsg('Verified successfully! Logging in...');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendCode();
      setSuccessMsg('A new verification code was sent.');
    } catch (err) {
      setError('Failed to resend code.');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-sand-900 border border-sand-700 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-charcoal-700 hover:text-pine-800 p-1.5 rounded-full hover:bg-sand-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        {authModalTab !== 'otp' && (
          <div className="flex gap-4 border-b border-sand-700 pb-4 mb-6">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`text-lg font-bold transition-colors pb-1 ${
                authModalTab === 'login'
                  ? 'text-pine-800 border-b-2 border-pine-800'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('signup');
                setError('');
              }}
              className={`text-lg font-bold transition-colors pb-1 ${
                authModalTab === 'signup'
                  ? 'text-pine-800 border-b-2 border-pine-800'
                  : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-4 p-3 bg-rose-100 border border-rose-300 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="photographer@expedition.com"
                  className="w-full bg-sand-950 border border-sand-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder-charcoal-500/50 focus:outline-none focus:border-pine-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sand-950 border border-sand-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900 placeholder-charcoal-500/50 focus:outline-none focus:border-pine-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-pine-850 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-lg transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sand-700"></div></div>
              <span className="relative bg-sand-900 px-3 text-[11px] font-mono text-charcoal-500 uppercase">or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 rounded-lg bg-sand-950 border border-sand-700 hover:border-pine-800/50 text-charcoal-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* 2. Signup Form */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full bg-sand-950 border border-sand-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="photographer@expedition.com"
                  className="w-full bg-sand-950 border border-sand-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-sand-950 border border-sand-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-pine-850 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-lg transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sand-700"></div></div>
              <span className="relative bg-sand-900 px-3 text-[11px] font-mono text-charcoal-500 uppercase">or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 rounded-lg bg-sand-950 border border-sand-700 hover:border-pine-800/50 text-charcoal-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* 3. OTP Verification Form */}
        {authModalTab === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-pine-800/10 text-pine-800 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-charcoal-900">Verify Your Email</h3>
              <p className="text-xs text-charcoal-700 mt-1">
                We sent a 6-digit verification code to <span className="text-pine-800 font-mono font-bold">{pendingEmail}</span>
              </p>
            </div>

            <div className="pt-2">
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-sand-950 border border-pine-800/40 rounded-xl py-3 text-center text-2xl font-mono tracking-[10px] text-pine-800 focus:outline-none focus:border-pine-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-pine-850 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code & Sign In'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="text-xs text-charcoal-500 hover:text-pine-800 transition-colors block mx-auto pt-1"
            >
              Didn't receive a code? Click to resend
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
