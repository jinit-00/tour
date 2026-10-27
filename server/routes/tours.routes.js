const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

function formatHotel(hotel) {
  return {
    ...hotel,
    amenities: typeof hotel.amenitiesJson === 'string' ? JSON.parse(hotel.amenitiesJson || '[]') : (hotel.amenities || []),
    images: typeof hotel.imagesJson === 'string' ? JSON.parse(hotel.imagesJson || '[]') : (hotel.images || []),
    roomCategories: (hotel.roomCategories || []).map((room) => ({
      ...room,
      images: typeof room.imagesJson === 'string' ? JSON.parse(room.imagesJson || '[]') : (room.images || []),
      pricing: {
        apai: room.apaiPrice || 0,
        mapai: room.mapaiPrice || 0,
        cpai: room.cpaiPrice || 0,
      },
    })),
  };
}

function formatTour(tour) {
  return {
    ...tour,
    images: typeof tour.imagesJson === 'string' ? JSON.parse(tour.imagesJson || '[]') : (tour.images || []),
    itinerary: typeof tour.itineraryJson === 'string' ? JSON.parse(tour.itineraryJson || '[]') : [],
    highlights: typeof tour.highlightsJson === 'string' ? JSON.parse(tour.highlightsJson || '[]') : [],
    inclusions: typeof tour.inclusionsJson === 'string' ? JSON.parse(tour.inclusionsJson || '[]') : [],
    exclusions: typeof tour.exclusionsJson === 'string' ? JSON.parse(tour.exclusionsJson || '[]') : [],
    packages: tour.packages || [],
    hotels: (tour.hotels || []).map(formatHotel),
  };
}

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { featured, search, location } = req.query;

    const where = {};
    if (req.query.includeHidden !== 'true') {
      where.isHidden = false;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (location && location !== 'All') {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        packages: true,
        hotels: {
          include: {
            roomCategories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tours.map(formatTour));
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
        hotels: {
          include: {
            roomCategories: true,
          },
        },
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found.' });
    }

    res.json(formatTour(tour));
  } catch (error) {
    console.error('Error fetching tour detail:', error);
    res.status(500).json({ error: 'Failed to fetch tour detail.' });
  }
});

module.exports = router;
