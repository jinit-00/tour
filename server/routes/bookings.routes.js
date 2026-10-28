const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth.middleware');
const {
  isValidPositiveInt,
  isValidPrice,
  isValidDate,
} = require('../utils/validation.utils');

const router = express.Router();
const prisma = new PrismaClient();

// 1. Create a new booking (Protected with input validation & authentic user binding)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { tourId, packageId, bookingDate, numPeople, safariPrice } = req.body;
    const userId = req.user.id;

    if (!tourId || !bookingDate) {
      return res.status(400).json({ error: 'Tour and booking date are required.' });
    }

    if (!isValidDate(bookingDate)) {
      return res.status(400).json({ error: 'Please provide a valid booking date.' });
    }

    const parsedDate = new Date(bookingDate);
    // Disallow dates more than 1 day in the past (allowing for timezone variations)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (parsedDate < yesterday) {
      return res.status(400).json({ error: 'Booking date cannot be in the past.' });
    }

    if (!isValidPositiveInt(numPeople, 1, 50)) {
      return res.status(400).json({ error: 'Number of people must be between 1 and 50.' });
    }
    const guestCount = parseInt(numPeople, 10);

    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found.' });
    }

    let packagePrice = 0;
    let validPackageId = null;

    if (packageId) {
      const pkg = await prisma.tourPackage.findFirst({
        where: { id: packageId, tourId: tour.id },
      });
      if (pkg) {
        packagePrice = pkg.price;
        validPackageId = pkg.id;
      }
    }

    let validSafariFee = 0;
    if (safariPrice !== undefined && isValidPrice(safariPrice)) {
      validSafariFee = parseFloat(safariPrice);
    }

    const totalAmount = (tour.basePrice + packagePrice) * guestCount + validSafariFee;

    const booking = await prisma.booking.create({
      data: {
        userId,
        tourId: tour.id,
        packageId: validPackageId,
        bookingDate: parsedDate,
        numPeople: guestCount,
        totalAmount,
        status: 'PENDING',
      },
      include: {
        tour: true,
        tourPackage: true,
      },
    });

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: {
        ...booking,
        tourImages: JSON.parse(booking.tour.imagesJson || '[]'),
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ error: 'Failed to place booking.' });
  }
});

// 2. Get user's own bookings (IDOR-safe: bound strictly to req.user.id)
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        tour: true,
        tourPackage: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedBookings = bookings.map((b) => ({
      ...b,
      tour: {
        ...b.tour,
        images: JSON.parse(b.tour.imagesJson || '[]'),
      },
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// 3. Get single booking by ID (IDOR-safe: enforces ownership check)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tour: true,
        tourPackage: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Ownership check: user can only view their own booking unless they are an admin
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      console.warn(`[SECURITY WARNING] IDOR attempt by user ${req.user.id} on booking ${id}`);
      return res.status(403).json({ error: 'Access denied. You do not have permission to view this booking.' });
    }

    res.json({
      ...booking,
      tour: {
        ...booking.tour,
        images: JSON.parse(booking.tour.imagesJson || '[]'),
      },
    });
  } catch (error) {
    console.error('Error fetching booking detail:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking.' });
  }
});

// 4. Cancel a booking (IDOR-safe: enforces ownership or admin privileges)
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Ownership check: user can only cancel their own booking unless they are an admin
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      console.warn(`[SECURITY WARNING] IDOR cancellation attempt by user ${req.user.id} on booking ${id}`);
      return res.status(403).json({ error: 'Access denied. You do not have permission to cancel this booking.' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        tour: true,
        tourPackage: true,
      },
    });

    res.json({ message: 'Booking cancelled successfully.', booking: updatedBooking });
  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;
