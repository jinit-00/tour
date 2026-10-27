require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('./config/passport');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const toursRoutes = require('./routes/tours.routes');
const hotelsRoutes = require('./routes/hotels.routes');
const pricingRoutes = require('./routes/pricing.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const galleryRoutes = require('./routes/gallery.routes');
const blogRoutes = require('./routes/blog.routes');
const contactRoutes = require('./routes/contact.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Log incoming API call immediately when it arrives in terminal
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const time = new Date().toLocaleTimeString();
    console.log(`\x1b[90m[${time}]\x1b[0m \x1b[36m[INCOMING CALL]\x1b[0m \x1b[1m${req.method}\x1b[0m ${req.originalUrl}`);
  }
  next();
});

// 2. Morgan Logger to print completed API calls with their HTTP Status Code & Duration
app.use(morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = Number(tokens.status(req, res));
  const time = tokens['response-time'](req, res);
  const timestamp = new Date().toLocaleTimeString();

  let statusBadge = `${status}`;
  if (status >= 500) {
    statusBadge = `\x1b[41m\x1b[37m ${status} SERVER ERROR \x1b[0m`;
  } else if (status >= 400) {
    statusBadge = `\x1b[43m\x1b[30m ${status} CLIENT ERROR \x1b[0m`;
  } else if (status >= 300) {
    statusBadge = `\x1b[46m\x1b[30m ${status} REDIRECT \x1b[0m`;
  } else if (status >= 200) {
    statusBadge = `\x1b[42m\x1b[30m ${status} OK \x1b[0m`;
  }

  return [
    `\x1b[90m[${timestamp}]\x1b[0m`,
    `\x1b[35m[API LOG]\x1b[0m`,
    `\x1b[1m${method.padEnd(6)}\x1b[0m`,
    url,
    '➜ Status Code:',
    statusBadge,
    `\x1b[90m(${time} ms)\x1b[0m`,
  ].join(' ');
}));

app.use(passport.initialize());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'JungleE Wildlife Expeditions API', time: new Date() });
});

// Live Synchronization Route (Cross-device visibility & pricing database connector)
const syncHandler = require('../api/sync.js');
app.all('/api/sync', (req, res) => syncHandler(req, res));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌲 JungleE Wildlife Expeditions Backend Server listening on http://localhost:${PORT}`);
  console.log(`📡 Terminal API logging active: watching all endpoints and status codes...`);
});
