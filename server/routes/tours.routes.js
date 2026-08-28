const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { featured, search, location } = req.query;

    const where = {};
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (location) {
      where.location = { contains: location };
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        packages: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedTours = tours.map((tour) => ({
      ...tour,
      images: JSON.parse(tour.imagesJson || '[]'),
    }));

    res.json(formattedTours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours.' });
  }
});

// Get tour by slug or ID
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;

    const tour = await prisma.tour.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
        ],
      },
      include: {
        packages: true,
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found.' });
    }

    res.json({
      ...tour,
      images: JSON.parse(tour.imagesJson || '[]'),
    });
  } catch (error) {
    console.error('Error fetching tour detail:', error);
    res.status(500).json({ error: 'Failed to fetch tour detail.' });
  }
});

module.exports = router;
