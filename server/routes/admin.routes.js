const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth & admin middleware to all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// 1. Analytics Dashboard
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTours = await prisma.tour.count();
    const totalBookings = await prisma.booking.count();
    const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } });

    const bookings = await prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'PENDING'] } },
      select: { totalAmount: true, status: true, createdAt: true },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.status === 'CONFIRMED' ? b.totalAmount : 0), 0);

    const topTours = await prisma.tour.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      take: 5,
    });

    const formattedTopTours = topTours.map(t => ({
      id: t.id,
      title: t.title,
      location: t.location,
      price: t.basePrice,
      bookingCount: t._count.bookings,
    })).sort((a, b) => b.bookingCount - a.bookingCount);

    res.json({
      metrics: {
        totalRevenue,
        totalBookings,
        totalTours,
        totalUsers,
        unreadMessages,
      },
      topTours: formattedTopTours,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics.' });
  }
});

// 2. Manage Tours CRUD
router.get('/tours', async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      include: { packages: true, _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = tours.map(t => ({
      ...t,
      images: JSON.parse(t.imagesJson || '[]'),
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin tours.' });
  }
});

router.post('/tours', async (req, res) => {
  try {
    const { title, description, location, basePrice, duration, isFeatured, images, packages } = req.body;

    if (!title || !description || !location || !basePrice || !duration) {
      return res.status(400).json({ error: 'All core tour fields are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        location,
        basePrice: parseFloat(basePrice),
        duration,
        isFeatured: Boolean(isFeatured),
        imagesJson: JSON.stringify(Array.isArray(images) ? images : [images]),
        packages: {
          create: (packages || []).map(p => ({
            name: p.name,
            price: parseFloat(p.price || 0),
            description: p.description || '',
          })),
        },
      },
      include: { packages: true },
    });

    res.status(201).json({ message: 'Tour created successfully.', tour });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: 'Failed to create tour.' });
  }
});

router.put('/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, basePrice, duration, isFeatured, images, packages } = req.body;

    // Delete old packages & update tour
    await prisma.tourPackage.deleteMany({ where: { tourId: id } });

    const updatedTour = await prisma.tour.update({
      where: { id },
      data: {
        title,
        description,
        location,
        basePrice: parseFloat(basePrice),
        duration,
        isFeatured: Boolean(isFeatured),
        imagesJson: JSON.stringify(Array.isArray(images) ? images : [images]),
        packages: {
          create: (packages || []).map(p => ({
            name: p.name,
            price: parseFloat(p.price || 0),
            description: p.description || '',
          })),
        },
      },
      include: { packages: true },
    });

    res.json({ message: 'Tour updated successfully.', tour: updatedTour });
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: 'Failed to update tour.' });
  }
});

router.delete('/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tour.delete({ where: { id } });
    res.json({ message: 'Tour deleted successfully.' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: 'Failed to delete tour.' });
  }
});

// 3. Manage Bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        tour: { select: { id: true, title: true, location: true } },
        tourPackage: { select: { id: true, name: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin bookings.' });
  }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, CONFIRMED, CANCELLED

    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { user: true, tour: true },
    });

    res.json({ message: `Booking status updated to ${status}.`, booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id } });
    res.json({ message: 'Booking deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

// 4. Manage Users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // USER, ADMIN

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ message: `User role updated to ${role}.`, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isVerified: Boolean(isVerified) },
      select: { id: true, name: true, email: true, isVerified: true },
    });

    res.json({ message: 'User verification status updated.', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update verification status.' });
  }
});

// 5. Manage Content (Gallery & Blog)
router.post('/gallery', async (req, res) => {
  try {
    const { title, category, imageUrl, aspect } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and Image URL are required.' });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        category: category || 'Wildlife',
        imageUrl,
        aspect: aspect || 'vertical',
      },
    });

    res.status(201).json({ message: 'Gallery item added.', item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add gallery item.' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ message: 'Gallery item deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
});

router.post('/blog', async (req, res) => {
  try {
    const { title, summary, content, coverImage, category } = req.body;
    if (!title || !summary || !content || !coverImage) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        coverImage,
        category: category || 'Photography Guide',
      },
    });

    res.status(201).json({ message: 'Blog post published.', post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish blog post.' });
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({ where: { id } });
    res.json({ message: 'Blog post deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

router.patch('/messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    res.json({ message: 'Message marked as read.', msg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message.' });
  }
});

module.exports = router;
