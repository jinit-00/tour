const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// 1. Get Safari Pricing
router.get('/safari', async (req, res) => {
  try {
    const allPricings = await prisma.safariPricing.findMany();
    const defaultPricing = allPricings.find((p) => p.slug === 'default') || {
      weekdayPrice: 6000,
      weekendPrice: 8000,
      updatedAt: new Date(),
    };

    const bySlug = {};
    for (const p of allPricings) {
      if (p.slug !== 'default') {
        bySlug[p.slug] = {
          weekday: p.weekdayPrice,
          weekend: p.weekendPrice,
        };
      }
    }

    res.json({
      weekday: defaultPricing.weekdayPrice,
      weekend: defaultPricing.weekendPrice,
      bySlug,
      updatedAt: defaultPricing.updatedAt.getTime(),
    });
  } catch (error) {
    console.error('Error fetching safari pricing:', error);
    res.status(500).json({ error: 'Failed to fetch safari pricing.' });
  }
});

// 2. Update Safari Pricing
router.put('/safari', async (req, res) => {
  try {
    const { weekday, weekend, bySlug, resetBySlug } = req.body;

    const defaultUpdate = {};
    if (weekday !== undefined) defaultUpdate.weekdayPrice = parseFloat(weekday);
    if (weekend !== undefined) defaultUpdate.weekendPrice = parseFloat(weekend);

    if (Object.keys(defaultUpdate).length > 0) {
      await prisma.safariPricing.upsert({
        where: { slug: 'default' },
        create: {
          slug: 'default',
          weekdayPrice: defaultUpdate.weekdayPrice || 6000,
          weekendPrice: defaultUpdate.weekendPrice || 8000,
        },
        update: defaultUpdate,
      });
    }

    if (resetBySlug) {
      await prisma.safariPricing.deleteMany({
        where: { slug: { not: 'default' } },
      });
    } else if (bySlug && typeof bySlug === 'object') {
      for (const [slug, rates] of Object.entries(bySlug)) {
        await prisma.safariPricing.upsert({
          where: { slug },
          create: {
            slug,
            weekdayPrice: parseFloat(rates.weekday || 6000),
            weekendPrice: parseFloat(rates.weekend || 8000),
          },
          update: {
            weekdayPrice: parseFloat(rates.weekday || 6000),
            weekendPrice: parseFloat(rates.weekend || 8000),
          },
        });
      }
    }

    // Return the fresh state
    const allPricings = await prisma.safariPricing.findMany();
    const defaultPricing = allPricings.find((p) => p.slug === 'default') || {
      weekdayPrice: 6000,
      weekendPrice: 8000,
      updatedAt: new Date(),
    };

    const updatedBySlug = {};
    for (const p of allPricings) {
      if (p.slug !== 'default') {
        updatedBySlug[p.slug] = {
          weekday: p.weekdayPrice,
          weekend: p.weekendPrice,
        };
      }
    }

    res.json({
      message: 'Safari pricing updated successfully.',
      pricing: {
        weekday: defaultPricing.weekdayPrice,
        weekend: defaultPricing.weekendPrice,
        bySlug: updatedBySlug,
        updatedAt: defaultPricing.updatedAt.getTime(),
      },
    });
  } catch (error) {
    console.error('Error updating safari pricing:', error);
    res.status(500).json({ error: 'Failed to update safari pricing.' });
  }
});

// 3. Complete system live state (Replacing external cloud sync bins with native database)
router.get('/sync-state', async (req, res) => {
  try {
    const hiddenTours = await prisma.tour.findMany({
      where: { isHidden: true },
      select: { slug: true, id: true },
    });
    const hiddenTourSlugs = Array.from(new Set(hiddenTours.flatMap((t) => [t.slug, t.id]).filter(Boolean)));

    const hiddenHotels = await prisma.hotel.findMany({
      where: { isHidden: true },
      select: { id: true },
    });
    const hiddenHotelIds = hiddenHotels.map((h) => h.id);

    const safariPricings = await prisma.safariPricing.findMany();
    const defaultSafari = safariPricings.find((p) => p.slug === 'default') || {
      weekdayPrice: 6000,
      weekendPrice: 8000,
      updatedAt: new Date(),
    };
    const bySlug = {};
    for (const p of safariPricings) {
      if (p.slug !== 'default') {
        bySlug[p.slug] = {
          weekday: p.weekdayPrice,
          weekend: p.weekendPrice,
        };
      }
    }

    const hotels = await prisma.hotel.findMany({
      include: { roomCategories: true },
    });
    const hotelPricing = {};
    for (const h of hotels) {
      const roomCats = {};
      for (const r of h.roomCategories) {
        roomCats[r.id] = {
          apai: r.apaiPrice || 0,
          mapai: r.mapaiPrice || 0,
          cpai: r.cpaiPrice || 0,
        };
      }
      hotelPricing[h.id] = {
        price: h.price || 0,
        roomCategories: roomCats,
        updatedAt: h.updatedAt.getTime(),
      };
    }

    res.json({
      hidden: hiddenTourSlugs,
      hiddenHotels: hiddenHotelIds,
      safariPricing: {
        weekday: defaultSafari.weekdayPrice,
        weekend: defaultSafari.weekendPrice,
        bySlug,
        updatedAt: defaultSafari.updatedAt.getTime(),
      },
      hotelPricing,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching sync state:', error);
    res.status(500).json({ error: 'Failed to fetch sync state.' });
  }
});

module.exports = router;
