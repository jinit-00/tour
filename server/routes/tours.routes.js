const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

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

const DESIRED_TOUR_ORDER = [
  'gir-lion-safari',
  'sanjay-dubri-tiger-safari',
  'jawai-leopard-safari',
  'ranthambore-tiger-safari',
  'velavadar-deer-safari',
  'pench-tiger-safari',
  'panna-tiger-safari',
  'bandhavgarh-tiger-safari',
  'kanha-tiger-safari',
  'tadoba-tiger-safari',
  'chitwan-rhino-safari',
  'jim-corbett-safari'
];

function sortTours(toursList) {
  if (!Array.isArray(toursList)) return toursList;
  return [...toursList].sort((a, b) => {
    const getOrder = (item) => {
      const slug = (item.slug || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      if (slug.includes('gir') || title.includes('gir')) return 0;
      if (slug.includes('sanjay') || title.includes('sanjay')) return 1;
      if (slug.includes('jawai') || title.includes('jawai')) return 2;
      if (slug.includes('ranthambore') || title.includes('ranthambore')) return 3;
      if (slug.includes('velavadar') || title.includes('velavadar')) return 4;
      if (slug.includes('pench') || title.includes('pench')) return 5;
      if (slug.includes('panna') || title.includes('panna')) return 6;
      if (slug.includes('bandhavgarh') || title.includes('bandhavgarh')) return 7;
      if (slug.includes('kanha') || title.includes('kanha')) return 8;
      if (slug.includes('tadoba') || title.includes('tadoba')) return 9;
      if (slug.includes('chitwan') || title.includes('chitwan')) return 10;
      if (slug.includes('corbett') || title.includes('corbett')) return 11;
      const idx = DESIRED_TOUR_ORDER.indexOf(slug);
      return idx !== -1 ? idx : 999;
    };
    return getOrder(a) - getOrder(b);
  });
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
    if (req.query.includeHidden !== 'true') {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
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
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }
    if (location && location !== 'All') {
      where.location = { contains: location };
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        packages: true,
        hotels: {
          where: req.query.includeHidden === 'true' ? {} : { isHidden: false },
          include: {
            roomCategories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(sortTours(tours.map(formatTour)));
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours.' });
  }
});

// Get tour by slug or ID
router.get('/:slugOrId', async (req, res) => {
  try {
    if (req.query.includeHidden !== 'true') {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
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
          where: req.query.includeHidden === 'true' ? {} : { isHidden: false },
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
