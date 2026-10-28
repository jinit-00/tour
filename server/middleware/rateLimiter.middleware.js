const rateLimit = require('express-rate-limit');

/**
 * Standard error response formatter for rate limit triggers
 */
const rateLimitHandler = (message) => (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  console.warn(`⚠️ [RATE LIMIT TRIGGERED] IP: ${clientIp} - Path: ${req.originalUrl}`);
  res.status(429).json({
    error: message || 'Too many requests. Please slow down and try again later.',
    retryAfterMinutes: Math.ceil((req.rateLimit?.resetTime?.getTime() - Date.now()) / 60000) || 15,
  });
};

// 1. General API rate limiter for broad endpoint abuse prevention
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests from this IP. Please try again after 15 minutes.'),
});

// 2. Strict rate limiter for Login and Passwordless authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many failed authentication attempts. Please try again in 15 minutes.'),
});

// 3. Strict rate limiter for User Registration / Account Creation
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 account creations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many accounts created from this IP. Please wait before creating more accounts.'),
});

// 4. Rate limiter for OTP verification & resends
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many verification attempts. Please wait 15 minutes before trying again.'),
});

// 5. Rate limiter for Contact message submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 contact messages per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many messages sent. Please wait a few minutes before sending another inquiry.'),
});

module.exports = {
  apiLimiter,
  authLimiter,
  signupLimiter,
  otpLimiter,
  contactLimiter,
};
