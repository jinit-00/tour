const express = require('express');
const prisma = require('../config/prisma');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');
const { isValidPrice } = require('../utils/validation.utils');

const router = express.Router();

const DESTINATION_NAMES = {
  gir: 'Gir National Park',
  jawai: 'Jawai Bera',
  'sanjay-dubri': 'Sanjay Dubri Tiger Reserve',
  ranthambore: 'Ranthambore National Park',
  velavadar: 'Velavadar Blackbuck National Park',
  panna: 'Panna Tiger Reserve',
  pench: 'Pench Tiger Reserve',
  kanha: 'Kanha National Park',
  bandhavgarh: 'Bandhavgarh National Park',
  tadoba: 'Tadoba National Park',
  corbett: 'Jim Corbett National Park',
  chitwan: 'Chitwan National Park',
};

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

// 1. Get all destinations with their hotels
router.get('/destinations', async (req, res) => {
  try {
    const includeHidden = req.query.includeHidden === 'true';
    if (!includeHidden) {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    const where = includeHidden ? {} : { isHidden: false };

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        roomCategories: true,
      },
      orderBy: { name: 'asc' },
    });

    const formattedHotels = hotels.map(formatHotel);

    // Group by destinationSlug
    const destKeys = [
      { id: 'gir', slug: 'gir-lion-safari' },
      { id: 'jawai', slug: 'jawai-leopard-safari' },
      { id: 'sanjay-dubri', slug: 'sanjay-dubri-tiger-safari' },
      { id: 'ranthambore', slug: 'ranthambore-tiger-safari' },
      { id: 'velavadar', slug: 'velavadar-deer-safari' },
      { id: 'panna', slug: 'panna-tiger-safari' },
      { id: 'pench', slug: 'pench-tiger-safari' },
      { id: 'kanha', slug: 'kanha-tiger-safari' },
      { id: 'bandhavgarh', slug: 'bandhavgarh-tiger-safari' },
      { id: 'tadoba', slug: 'tadoba-tiger-safari' },
      { id: 'corbett', slug: 'jim-corbett-safari' },
      { id: 'chitwan', slug: 'chitwan-rhino-safari' },
    ];

    const result = destKeys.map(({ id, slug }) => {
      const destHotels = formattedHotels.filter((h) => h.destinationSlug === id || h.tourSlug === slug);
      return {
        id,
        name: DESTINATION_NAMES[id] || id,
        slug,
        hotels: destHotels,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching destination hotels:', error);
    res.status(500).json({ error: 'Failed to fetch destination hotels.' });
  }
});

// 2. Get all hotels with optional filters
router.get('/', async (req, res) => {
  try {
    const { destinationSlug, tourSlug, includeHidden } = req.query;
    const where = {};

    if (includeHidden !== 'true') {
      where.isHidden = false;
    }
    if (destinationSlug) {
      where.destinationSlug = destinationSlug;
    }
    if (tourSlug) {
      where.tourSlug = tourSlug;
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        roomCategories: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(hotels.map(formatHotel));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels.' });
  }
});

// 3. Get all hotel custom pricing
router.get('/pricing/all', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        roomCategories: true,
      },
    });

    const pricingMap = {};
    for (const h of hotels) {
      const roomCats = {};
      for (const r of h.roomCategories) {
        roomCats[r.id] = {
          apai: r.apaiPrice || 0,
          mapai: r.mapaiPrice || 0,
          cpai: r.cpaiPrice || 0,
        };
      }
      pricingMap[h.id] = {
        price: h.price || 0,
        roomCategories: roomCats,
        updatedAt: h.updatedAt.getTime(),
      };
    }

    res.json(pricingMap);
  } catch (error) {
    console.error('Error fetching hotel pricing map:', error);
    res.status(500).json({ error: 'Failed to fetch hotel pricing.' });
  }
});

// 4. Get single hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        roomCategories: true,
      },
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found.' });
    }

    res.json(formatHotel(hotel));
  } catch (error) {
    console.error('Error fetching hotel detail:', error);
    res.status(500).json({ error: 'Failed to fetch hotel detail.' });
  }
});

// 5. Toggle hotel visibility (Show / Hide) - Restricted to authenticated Admins
router.patch('/:id/visibility', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const existingHotel = await prisma.hotel.findFirst({
      where: {
        OR: [
          { id },
          { id: String(id).toLowerCase().trim() },
        ],
      },
    });
    if (!existingHotel) {
      return res.status(404).json({ error: 'Hotel not found.' });
    }

    const updated = await prisma.hotel.update({
      where: { id: existingHotel.id },
      data: { isHidden: Boolean(isHidden) },
      include: { roomCategories: true },
    });

    res.json({ message: 'Hotel visibility updated successfully.', hotel: formatHotel(updated) });
  } catch (error) {
    console.error('Error updating hotel visibility:', error);
    res.status(500).json({ error: 'Failed to update hotel visibility.' });
  }
});

// 6. Update hotel pricing (hotel price & room APAI / MAPAI / CPAI) - Restricted to authenticated Admins
router.put('/:id/pricing', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { price, roomCategories } = req.body;

    const existingHotel = await prisma.hotel.findUnique({ where: { id } });
    if (!existingHotel) {
      return res.status(404).json({ error: 'Hotel not found.' });
    }

    const updateHotelData = {};
    if (price !== undefined) {
      if (!isValidPrice(price)) {
        return res.status(400).json({ error: 'Invalid price value.' });
      }
      updateHotelData.price = parseFloat(price);
    }

    if (Object.keys(updateHotelData).length > 0) {
      await prisma.hotel.update({
        where: { id },
        data: updateHotelData,
      });
    }

    if (roomCategories && typeof roomCategories === 'object') {
      for (const [roomId, catPricing] of Object.entries(roomCategories)) {
        const updateRoomData = {};
        if (catPricing.price !== undefined && isValidPrice(catPricing.price)) {
          updateRoomData.price = parseFloat(catPricing.price);
        }
        if (catPricing.apai !== undefined && isValidPrice(catPricing.apai)) {
          updateRoomData.apaiPrice = parseFloat(catPricing.apai);
        }
        if (catPricing.mapai !== undefined && isValidPrice(catPricing.mapai)) {
          updateRoomData.mapaiPrice = parseFloat(catPricing.mapai);
        }
        if (catPricing.cpai !== undefined && isValidPrice(catPricing.cpai)) {
          updateRoomData.cpaiPrice = parseFloat(catPricing.cpai);
        }

        if (Object.keys(updateRoomData).length > 0) {
          await prisma.roomCategory.updateMany({
            where: { id: roomId, hotelId: id },
            data: updateRoomData,
          });
        }
      }
    }

    const updatedHotel = await prisma.hotel.findUnique({
      where: { id },
      include: { roomCategories: true },
    });

    res.json({ message: 'Hotel pricing updated successfully.', hotel: formatHotel(updatedHotel) });
  } catch (error) {
    console.error('Error updating hotel pricing:', error);
    res.status(500).json({ error: 'Failed to update hotel pricing.' });
  }
});

module.exports = router;
