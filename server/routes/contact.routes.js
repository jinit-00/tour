const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        message,
      },
    });

    res.status(201).json({
      message: 'Thank you for contacting Silvan Tours! Our expedition team will respond within 24 hours.',
      contactMsg,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
