let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  prisma = null;
}

// In-memory cache for ultra-fast reads
let globalCache = null;

async function getDatabaseState() {
  if (!prisma) return null;
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

    return {
      hidden: hiddenTourSlugs,
      safariPricing: {
        weekday: defaultSafari.weekdayPrice,
        weekend: defaultSafari.weekendPrice,
        bySlug,
        updatedAt: defaultSafari.updatedAt.getTime(),
      },
      hiddenHotels: hiddenHotelIds,
      hotelPricing,
      updatedAt: Date.now(),
    };
  } catch (err) {
    console.error('Error fetching database sync state:', err);
    return null;
  }
}

async function saveDatabaseState(data) {
  if (!prisma) return;
  try {
    // 1. Update hidden tours
    if (Array.isArray(data.hidden)) {
      await prisma.tour.updateMany({
        data: { isHidden: false },
      });
      if (data.hidden.length > 0) {
        await prisma.tour.updateMany({
          where: {
            OR: [
              { slug: { in: data.hidden } },
              { id: { in: data.hidden } },
            ],
          },
          data: { isHidden: true },
        });
      }
    }

    // 2. Update hidden hotels
    if (Array.isArray(data.hiddenHotels)) {
      await prisma.hotel.updateMany({
        data: { isHidden: false },
      });
      if (data.hiddenHotels.length > 0) {
        await prisma.hotel.updateMany({
          where: { id: { in: data.hiddenHotels } },
          data: { isHidden: true },
        });
      }
    }

    // 3. Update safari pricing
    if (data.safariPricing && typeof data.safariPricing === 'object') {
      const { weekday, weekend, bySlug } = data.safariPricing;
      if (weekday !== undefined || weekend !== undefined) {
        await prisma.safariPricing.upsert({
          where: { slug: 'default' },
          create: {
            slug: 'default',
            weekdayPrice: Number(weekday) || 6000,
            weekendPrice: Number(weekend) || 8000,
          },
          update: {
            ...(weekday !== undefined ? { weekdayPrice: Number(weekday) } : {}),
            ...(weekend !== undefined ? { weekendPrice: Number(weekend) } : {}),
          },
        });
      }

      if (bySlug && typeof bySlug === 'object') {
        for (const [slug, rates] of Object.entries(bySlug)) {
          await prisma.safariPricing.upsert({
            where: { slug },
            create: {
              slug,
              weekdayPrice: Number(rates.weekday) || 6000,
              weekendPrice: Number(rates.weekend) || 8000,
            },
            update: {
              weekdayPrice: Number(rates.weekday) || 6000,
              weekendPrice: Number(rates.weekend) || 8000,
            },
          });
        }
      }
    }

    // 4. Update hotel pricing
    if (data.hotelPricing && typeof data.hotelPricing === 'object') {
      for (const [hotelId, hInfo] of Object.entries(data.hotelPricing)) {
        if (hInfo.price !== undefined) {
          await prisma.hotel.updateMany({
            where: { id: hotelId },
            data: { price: Number(hInfo.price) || 0 },
          });
        }
        if (hInfo.roomCategories && typeof hInfo.roomCategories === 'object') {
          for (const [roomId, roomRates] of Object.entries(hInfo.roomCategories)) {
            await prisma.roomCategory.updateMany({
              where: { id: roomId, hotelId },
              data: {
                apaiPrice: Number(roomRates.apai) || 0,
                mapaiPrice: Number(roomRates.mapai) || 0,
                cpaiPrice: Number(roomRates.cpai) || 0,
              },
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error saving database sync state:', err);
  }
}

module.exports = async function handler(req, res) {
  // Universal open CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // WRITE (POST or PUT) - Restricted to authenticated Admins
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required to push sync updates.' });
      }
      const token = authHeader.split(' ')[1];
      const { verifyToken } = require('../utils/jwt.utils');
      const decoded = verifyToken(token);
      if (!decoded || decoded.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin privileges required to push database sync updates.' });
      }

      let data = req.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (_) {}
      }

      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }

      const syncPayload = {
        hidden: Array.isArray(data.hidden) ? data.hidden : (globalCache?.hidden || []),
        safariPricing: data.safariPricing || globalCache?.safariPricing || { weekday: 6000, weekend: 8000, bySlug: {} },
        hiddenHotels: Array.isArray(data.hiddenHotels) ? data.hiddenHotels : (globalCache?.hiddenHotels || []),
        hotelPricing: data.hotelPricing || globalCache?.hotelPricing || {},
        updatedAt: Date.now(),
      };

      globalCache = syncPayload;

      // Save directly to PostgreSQL Database
      await saveDatabaseState(syncPayload);

      return res.status(200).json({ success: true, data: syncPayload });
    } catch (err) {
      console.error('Sync POST error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // READ (GET)
  try {
    const dbState = await getDatabaseState();
    if (dbState) {
      globalCache = dbState;
      return res.status(200).json(dbState);
    }
  } catch (err) {
    console.warn('Sync GET from database failed:', err.message);
  }

  if (globalCache) {
    return res.status(200).json(globalCache);
  }

  return res.status(200).json({
    hidden: [],
    safariPricing: { weekday: 6000, weekend: 8000, bySlug: {} },
    hiddenHotels: [],
    hotelPricing: {},
    updatedAt: Date.now(),
  });
};
