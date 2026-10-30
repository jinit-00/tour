const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
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
