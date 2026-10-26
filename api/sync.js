const https = require('https');

// Primary remote cloud storage endpoint
const REMOTE_URL = 'https://extendsclass.com/api/json-storage/bin/aefeadc';
const BACKUP_URL = 'https://extendsclass.com/api/json-storage/bin/affadea';

// In-memory cache for ultra-fast same-instance reads
let globalCache = null;

function requestRemote(url, method, payload = null) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const postData = payload ? JSON.stringify(payload) : null;

      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'JungleeSafari-Sync/1.0',
        },
      };

      if (postData) {
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(body);
              resolve(parsed);
            } catch (err) {
              resolve(body);
            }
          } else {
            reject(new Error(`Remote status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.setTimeout(4500, () => {
        req.destroy();
        reject(new Error('Remote request timed out'));
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
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

  // WRITE (POST or PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
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

      // Persist to remote storage via Node.js HTTPS (zero CORS preflight)
      try {
        await requestRemote(REMOTE_URL, 'PUT', syncPayload);
      } catch (err) {
        console.warn('Primary remote write failed, attempting backup:', err.message);
        try {
          await requestRemote(BACKUP_URL, 'PUT', syncPayload);
        } catch (backupErr) {
          console.warn('Backup remote write also failed:', backupErr.message);
        }
      }

      return res.status(200).json({ success: true, data: syncPayload });
    } catch (err) {
      console.error('Sync POST error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // READ (GET)
  try {
    // Attempt fresh read from remote
    const remoteData = await requestRemote(REMOTE_URL, 'GET').catch(async () => {
      return await requestRemote(BACKUP_URL, 'GET').catch(() => null);
    });

    if (remoteData && typeof remoteData === 'object') {
      const formatted = {
        hidden: Array.isArray(remoteData.hidden) ? remoteData.hidden : [],
        safariPricing: remoteData.safariPricing || { weekday: 6000, weekend: 8000, bySlug: {} },
        hiddenHotels: Array.isArray(remoteData.hiddenHotels) ? remoteData.hiddenHotels : [],
        hotelPricing: remoteData.hotelPricing || {},
        updatedAt: Number(remoteData.updatedAt) || Date.now(),
      };
      globalCache = formatted;
      return res.status(200).json(formatted);
    }
  } catch (err) {
    console.warn('Sync GET remote failed, falling back to cache:', err.message);
  }

  // Fallback to in-memory cache if available
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
