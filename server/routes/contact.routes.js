const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { contactLimiter } = require('../middleware/rateLimiter.middleware');
const { isValidEmail, sanitizeString } = require('../utils/validation.utils');

const prisma = new PrismaClient();

// POST /api/contact - Submit contact query (Protected by contactLimiter & sanitization)
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const rawName = req.body.name;
    const rawEmail = req.body.email;
    const rawTourInterest = req.body.tourInterest;
    const rawMessage = req.body.message;

    const name = sanitizeString(rawName, 100);
    const email = rawEmail ? rawEmail.toLowerCase().trim() : '';
    const tourInterest = sanitizeString(rawTourInterest, 100) || 'General Inquiry';
    const message = sanitizeString(rawMessage, 2000);

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        tourInterest,
        message,
      },
    });

    res.status(201).json({
      message: 'Thank you for contacting JungleE Wildlife Expeditions! Our expedition team will respond within 24 hours.',
      contactMsg,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
