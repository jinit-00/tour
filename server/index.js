require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const prisma = require('./config/prisma');
const passport = require('./config/passport');
const errorHandler = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');

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

// Trust reverse proxy (Vercel, Cloudflare, AWS, Nginx) so req.ip and rate limits work correctly
app.set('trust proxy', 1);

// Response compression (gzip/brotli) for reduced payload transfer sizes
app.use(compression());

// Security Headers via Helmet (disables X-Powered-By, adds X-Content-Type-Options, HSTS, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : []),
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser tools (e.g. Postman, mobile)
    if (!origin) return callback(null, true);
    // Allow configured origins or any vercel.app preview domain
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked origin: ' + origin));
  },
  credentials: true,
}));

// Payload size limit to prevent Denial of Service via large JSON payloads
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply broad API rate limiting across all /api routes
app.use('/api', apiLimiter);

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

// Health Check (Lightweight, no DB)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'JungleE Wildlife Expeditions API', time: new Date() });
});

// Database Health Check (SELECT 1 ping for uptime checks and latency profiling)
app.get('/api/health/db', async (req, res) => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    res.json({ status: 'ok', database: 'connected', latencyMs, time: new Date() });
  } catch (err) {
    const latencyMs = Date.now() - start;
    res.status(500).json({ status: 'error', database: 'disconnected', latencyMs, error: err.message });
  }
});

// Live Synchronization Route (Cross-device visibility & pricing database connector)
const syncHandler = require('./routes/sync.js');
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

// Catch-all for unmatched /api routes (ensures unknown API endpoints always return JSON 404, never index.html)
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

// Conditionally serve built React frontend if client/dist exists in production (GoDaddy / Monolithic deployment)
const distPath = path.join(__dirname, '../client/dist');
const shouldServeFrontend = process.env.NODE_ENV === 'production' && !process.env.VERCEL && fs.existsSync(distPath);

if (shouldServeFrontend) {
  // Serve static assets with Cache-Control
  app.use(express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Don't cache index.html so frontend code releases take effect immediately
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));

  // Non-API catch-all route: return index.html for client-side React Router navigation
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Middleware
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌲 JungleE Wildlife Expeditions Backend Server listening on http://localhost:${PORT}`);
    console.log(`📡 Terminal API logging active: watching all endpoints and status codes...`);
  });
}

module.exports = app;
