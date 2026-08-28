const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery photos.' });
  }
});

module.exports = router;
