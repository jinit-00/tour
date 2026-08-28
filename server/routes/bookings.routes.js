const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Create a new booking
router.post('/', requireAuth, async (req, res) => {
  try {
    const { tourId, packageId, bookingDate, numPeople } = req.body;
    const userId = req.user.id;

    if (!tourId || !bookingDate) {
      return res.status(400).json({ error: 'Tour and booking date are required.' });
    }

    const guestCount = parseInt(numPeople || 1);
    if (isNaN(guestCount) || guestCount < 1) {
      return res.status(400).json({ error: 'Number of people must be at least 1.' });
    }

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

    const totalAmount = tour.basePrice * guestCount + packagePrice;

    const booking = await prisma.booking.create({
      data: {
        userId,
        tourId: tour.id,
        packageId: validPackageId,
        bookingDate: new Date(bookingDate),
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
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to place booking.' });
  }
});

// Get user's own bookings
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
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Cancel a booking
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
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
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;
