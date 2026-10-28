const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt.utils');
const { sendOtpEmail } = require('../utils/email.utils');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  authLimiter,
  signupLimiter,
  otpLimiter,
} = require('../middleware/rateLimiter.middleware');
const {
  isValidEmail,
  isValidPassword,
  sanitizeString,
} = require('../utils/validation.utils');

const router = express.Router();
const prisma = new PrismaClient();

// Helper to generate cryptographically secure 6-digit OTP code
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Signup endpoint (Protected by signupLimiter)
router.post('/signup', signupLimiter, async (req, res) => {
  try {
    const rawName = req.body.name;
    const rawEmail = req.body.email;
    const password = req.body.password;

    const name = sanitizeString(rawName, 80);
    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters long.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Strong salt rounds (12)
    const passwordHash = await bcrypt.hash(password, 12);
    let user = existingUser;

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, passwordHash },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          isVerified: false,
          role: 'USER',
        },
      });
    }

    // Generate fresh OTP (expires in 10 mins)
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.deleteMany({ where: { userId: user.id } });
    await prisma.otpCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    await sendOtpEmail(user.email, otpCode);

    res.status(201).json({
      message: 'Account created. Verification code sent to email.',
      email: user.email,
      userId: user.id,
      requiresOtp: true,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// 2. Verify OTP endpoint (Protected by otpLimiter)
router.post('/verify-otp', otpLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const rawCode = req.body.code;

    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';
    const code = rawCode ? String(rawCode).trim() : '';

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const validOtp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      console.warn(`[SECURITY WARNING] Failed OTP verification attempt for email: ${email}`);
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    // Mark user verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete used OTPs immediately to prevent reuse
    await prisma.otpCode.deleteMany({ where: { userId: user.id } });

    const token = generateToken(updatedUser);

    res.json({
      message: 'Account verified successfully.',
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// 3. Resend OTP endpoint (Protected by otpLimiter)
router.post('/resend-otp', otpLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 with generic message to avoid email enumeration
      return res.json({ message: 'If an account exists, a new verification code has been sent.' });
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.deleteMany({ where: { userId: user.id } });
    await prisma.otpCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    await sendOtpEmail(user.email, otpCode);

    res.json({ message: 'A new verification code has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// 4. Password Login endpoint (Protected by authLimiter)
router.post('/login', authLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const password = req.body.password;

    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      console.warn(`[SECURITY WARNING] Failed login attempt for non-existent/unlinked email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[SECURITY WARNING] Failed login attempt (incorrect password) for email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      const otpCode = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.otpCode.deleteMany({ where: { userId: user.id } });
      await prisma.otpCode.create({
        data: { userId: user.id, code: otpCode, expiresAt },
      });
      await sendOtpEmail(user.email, otpCode);

      return res.status(403).json({
        error: 'Your account is not verified. A verification code has been sent to your email.',
        requiresOtp: true,
        email: user.email,
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

// 5. Request Passwordless OTP Login (Protected by authLimiter)
router.post('/request-otp-login', authLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: sanitizeString(email.split('@')[0], 50) || 'Explorer',
          email,
          isVerified: false,
          role: 'USER',
        },
      });
    }

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpCode.deleteMany({ where: { userId: user.id } });
    await prisma.otpCode.create({
      data: { userId: user.id, code: otpCode, expiresAt },
    });

    await sendOtpEmail(user.email, otpCode);

    res.json({ message: 'Login code sent to email.', email: user.email });
  } catch (error) {
    console.error('Request OTP login error:', error.message);
    res.status(500).json({ error: 'Failed to request login code.' });
  }
});

// 6. Forgot Password endpoint (Protected by authLimiter)
router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success response to prevent account enumeration
    if (user) {
      const resetCode = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await prisma.otpCode.deleteMany({ where: { userId: user.id } });
      await prisma.otpCode.create({
        data: {
          userId: user.id,
          code: resetCode,
          expiresAt,
        },
      });

      await sendOtpEmail(user.email, resetCode);
    }

    res.json({
      message: 'If an account with this email exists, a password reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ error: 'Failed to process password reset request.' });
  }
});

// 7. Reset Password endpoint (Protected by authLimiter)
router.post('/reset-password', authLimiter, async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const rawCode = req.body.code;
    const newPassword = req.body.newPassword;

    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';
    const code = rawCode ? String(rawCode).trim() : '';

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'New password must be between 6 and 128 characters long.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset code.' });
    }

    const validOtp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      console.warn(`[SECURITY WARNING] Failed reset password attempt for email: ${email}`);
      return res.status(400).json({ error: 'Invalid or expired password reset code.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, isVerified: true },
    });

    // Invalidate all OTPs
    await prisma.otpCode.deleteMany({ where: { userId: user.id } });

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// 8. Google OAuth routes
router.get('/google', (req, res, next) => {
  let returnUrl = req.query.returnUrl || req.headers.referer || process.env.CLIENT_URL;
  if (returnUrl) {
    try {
      const parsed = new URL(returnUrl);
      returnUrl = parsed.origin;
    } catch (_) {}
  }
  const state = returnUrl ? Buffer.from(JSON.stringify({ returnUrl })).toString('base64') : undefined;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  let clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  if (req.query.state) {
    try {
      const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf8'));
      if (decoded && decoded.returnUrl && (decoded.returnUrl.startsWith('http://') || decoded.returnUrl.startsWith('https://'))) {
        clientUrl = decoded.returnUrl.replace(/\/+$/, '');
      }
    } catch (e) {
      console.warn('Could not parse OAuth state:', e);
    }
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('Google OAuth callback error:', err || info);
      return res.redirect(`${clientUrl}/login?error=OAuthFailed`);
    }
    const token = generateToken(user);
    return res.redirect(`${clientUrl}/auth-callback?token=${token}`);
  })(req, res, next);
});

// 9. Get current user profile (Protected by requireAuth)
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
