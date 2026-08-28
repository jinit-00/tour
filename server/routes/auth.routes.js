const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt.utils');
const { sendOtpEmail } = require('../utils/email.utils');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Helper to generate 6-digit OTP code
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
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
          email: email.toLowerCase().trim(),
          passwordHash,
          isVerified: false,
          role: 'USER',
        },
      });
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Clear old OTPs for user
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
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const validOtp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: code.trim(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    // Mark user verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Delete used OTPs
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
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// Resend OTP endpoint
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
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
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
});

// Password Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      // Send fresh OTP for unverified user
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Request Passwordless OTP Login
router.post('/request-otp-login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: email.split('@')[0],
          email: email.toLowerCase().trim(),
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
    console.error('Request OTP login error:', error);
    res.status(500).json({ error: 'Failed to request login code.' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=OAuthFailed` }), (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?token=${token}`);
});

// Get current user profile
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
