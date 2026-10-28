/**
 * Security Validation & Sanitization Utilities
 * Prevents Injection, XSS, and Malformed Input Data
 */

// Email regex conforming to standard RFC 5322 pattern
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validate and normalize email address
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Sanitize strings by stripping HTML tags, control characters, and trimming
 */
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip ASCII control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate password requirements
 */
function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  // Minimum 6 characters, max 128 characters (prevent DoS via bcrypt max length)
  return password.length >= 6 && password.length <= 128;
}

/**
 * Validate positive integer (e.g. for guest count or pagination)
 */
function isValidPositiveInt(val, min = 1, max = 100) {
  const num = parseInt(val, 10);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Validate finite non-negative number (e.g. for pricing)
 */
function isValidPrice(val) {
  const num = parseFloat(val);
  if (isNaN(num) || !isFinite(num)) return false;
  return num >= 0 && num <= 10000000; // Sensible upper bound to prevent overflow
}

/**
 * Validate ISO date string
 */
function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d.getTime());
}

module.exports = {
  isValidEmail,
  sanitizeString,
  isValidPassword,
  isValidPositiveInt,
  isValidPrice,
  isValidDate,
};
