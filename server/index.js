require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('./config/passport');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const toursRoutes = require('./routes/tours.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const galleryRoutes = require('./routes/gallery.routes');
const blogRoutes = require('./routes/blog.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Silvan Tours API', time: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌲 Silvan Tours Backend Server listening on http://localhost:${PORT}`);
});
