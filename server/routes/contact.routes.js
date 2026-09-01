const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/contact - Submit contact query
router.post('/', async (req, res, next) => {
  try {
    const { name, email, tourInterest, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        tourInterest: tourInterest || 'General Inquiry',
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
