import axios from 'axios';
import initialDestinations from '../data/destinations.json';
import initialTours from '../data/tours.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token & log outgoing API call
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('junglee_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 [API CALL] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log returned HTTP Status Code
API.interceptors.response.use(
  (response) => {
    console.log(`✅ [API RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url} ➜ Status Code: ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : 'NETWORK ERROR';
    console.error(`❌ [API RESPONSE] ${error.config?.method?.toUpperCase()} ${error.config?.url} ➜ Status Code: ${status}`, error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const signupUser = (data) => API.post('/auth/signup', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resendOtp = (data) => API.post('/auth/resend-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');

// -------------------------------------------------------------
// LIVE DESTINATION HOTELS REGISTRY (Populated from Database)
// -------------------------------------------------------------
export const ALL_DESTINATION_HOTELS = [...initialDestinations];
export const FALLBACK_TOURS = [...initialTours];

// Exported arrays maintained for seamless backward compatibility
export const GIR_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'gir')?.hotels || [];
export const JAWAI_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'jawai')?.hotels || [];
export const SANJAY_DUBRI_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'sanjay-dubri')?.hotels || [];
export const RANTHAMBORE_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'ranthambore')?.hotels || [];
export const VELAVADAR_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'velavadar')?.hotels || [];
export const PANNA_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'panna')?.hotels || [];
export const PENCH_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'pench')?.hotels || [];
export const KANHA_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'kanha')?.hotels || [];
export const BANDHAVGARH_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'bandhavgarh')?.hotels || [];
export const TADOBA_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'tadoba')?.hotels || [];
export const CORBETT_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'corbett')?.hotels || [];
export const CHITWAN_HOTELS = ALL_DESTINATION_HOTELS.find((d) => d.id === 'chitwan')?.hotels || [];

// Fetch live destination hotels directly from Database
export const refreshHotelsFromDatabase = async () => {
  try {
    const res = await API.get('/hotels/destinations?includeHidden=true');
    if (Array.isArray(res.data) && res.data.length > 0) {
      ALL_DESTINATION_HOTELS.length = 0;
      ALL_DESTINATION_HOTELS.push(...res.data);

      const updateArr = (arr, id) => {
        const found = res.data.find((d) => d.id === id);
        if (found && Array.isArray(found.hotels)) {
          arr.length = 0;
          arr.push(...found.hotels);
        }
      };

      updateArr(GIR_HOTELS, 'gir');
      updateArr(JAWAI_HOTELS, 'jawai');
      updateArr(SANJAY_DUBRI_HOTELS, 'sanjay-dubri');
      updateArr(RANTHAMBORE_HOTELS, 'ranthambore');
      updateArr(VELAVADAR_HOTELS, 'velavadar');
      updateArr(PANNA_HOTELS, 'panna');
      updateArr(PENCH_HOTELS, 'pench');
      updateArr(KANHA_HOTELS, 'kanha');
      updateArr(BANDHAVGARH_HOTELS, 'bandhavgarh');
      updateArr(TADOBA_HOTELS, 'tadoba');
      updateArr(CORBETT_HOTELS, 'corbett');
      updateArr(CHITWAN_HOTELS, 'chitwan');

      window.dispatchEvent(new CustomEvent('destinationHotelsUpdated', { detail: res.data }));
      return res.data;
    }
  } catch (err) {
    console.warn('Database hotels sync notice:', err.message);
  }
  return ALL_DESTINATION_HOTELS;
};

// Auto-fetch from database on startup
if (typeof window !== 'undefined') {
  setTimeout(() => {
    refreshHotelsFromDatabase();
  }, 100);
}

// -------------------------------------------------------------
// STORAGE KEYS & DATABASE SYNC
// -------------------------------------------------------------
const HIDDEN_TOURS_STORAGE_KEY = 'junglee_hidden_tours';
export const SAFARI_PRICING_STORAGE_KEY = 'junglee_safari_pricing';
export const HIDDEN_HOTELS_STORAGE_KEY = 'junglee_hidden_hotels';
export const HOTEL_PRICING_STORAGE_KEY = 'junglee_hotel_pricing';

// Fetch synchronization state directly from Backend Database
export const fetchCloudData = async () => {
  try {
    const res = await API.get('/pricing/sync-state', { timeout: 4000 });
    if (res.data && typeof res.data === 'object') {
      return res.data;
    }
  } catch (err) {
    try {
      const fallbackRes = await API.get('/sync', { timeout: 3500 });
      if (fallbackRes.data && typeof fallbackRes.data === 'object') {
        return fallbackRes.data;
      }
    } catch (_) {}
  }
  return null;
};

// Unified Database Push Helper
export const pushAllToCloud = async (overrides = {}) => {
  const payload = {
    hidden: overrides.hidden !== undefined ? overrides.hidden : getHiddenTourSlugs(),
    safariPricing: overrides.safariPricing !== undefined ? overrides.safariPricing : getSafariPricing(),
    hiddenHotels: overrides.hiddenHotels !== undefined ? overrides.hiddenHotels : getHiddenHotelIds(),
    hotelPricing: overrides.hotelPricing !== undefined ? overrides.hotelPricing : getAllHotelCustomPricing(),
    updatedAt: Date.now(),
  };

  try {
    const res = await API.post('/sync', payload, { timeout: 4000 });
    if (res.data) return res.data;
  } catch (err) {
    console.warn('Database sync push notice:', err.message);
  }
};

// -------------------------------------------------------------
// SAFARI VEHICLE PRICING (Weekday & Weekend from Database)
// -------------------------------------------------------------
export const DEFAULT_SAFARI_PRICING = {
  weekday: 6000,
  weekend: 8000,
  bySlug: {},
  updatedAt: 0,
};

export const getSafariPricing = (slug = null) => {
  try {
    const raw = localStorage.getItem(SAFARI_PRICING_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : DEFAULT_SAFARI_PRICING;
    const weekday = Number(parsed.weekday) || DEFAULT_SAFARI_PRICING.weekday;
    const weekend = Number(parsed.weekend) || DEFAULT_SAFARI_PRICING.weekend;
    const updatedAt = Number(parsed.updatedAt) || 0;
    if (slug && parsed.bySlug && parsed.bySlug[slug]) {
      return {
        weekday: Number(parsed.bySlug[slug].weekday) || weekday,
        weekend: Number(parsed.bySlug[slug].weekend) || weekend,
        updatedAt,
      };
    }
    return { weekday, weekend, bySlug: parsed.bySlug || {}, updatedAt };
  } catch (e) {
    return { ...DEFAULT_SAFARI_PRICING };
  }
};

export const setSafariPricing = async (newPricing) => {
  try {
    const raw = localStorage.getItem(SAFARI_PRICING_STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : { ...DEFAULT_SAFARI_PRICING };

    const weekday = Number(newPricing.weekday !== undefined ? newPricing.weekday : current.weekday) || DEFAULT_SAFARI_PRICING.weekday;
    const weekend = Number(newPricing.weekend !== undefined ? newPricing.weekend : current.weekend) || DEFAULT_SAFARI_PRICING.weekend;

    let updatedBySlug = { ...(current.bySlug || {}) };
    if (newPricing.resetBySlug) {
      updatedBySlug = {};
    } else if (newPricing.bySlug) {
      updatedBySlug = { ...updatedBySlug, ...newPricing.bySlug };
    }

    const updated = {
      weekday,
      weekend,
      bySlug: updatedBySlug,
      updatedAt: Date.now(),
    };

    localStorage.setItem(SAFARI_PRICING_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safariPricingChanged', { detail: updated }));

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('junglee_safari_pricing_sync');
        bc.postMessage({ type: 'PRICING_UPDATED', pricing: updated });
        bc.close();
      } catch (e) {}
    }

    // Persist directly to PostgreSQL database via API
    try {
      await API.put('/pricing/safari', updated);
    } catch (_) {
      await pushAllToCloud({ safariPricing: updated });
    }

    return updated;
  } catch (err) {
    console.error('Failed to set safari pricing:', err);
    return newPricing;
  }
};

export const syncSafariPricingFromCloud = async () => {
  await syncHiddenToursFromCloud();
  return getSafariPricing();
};

// -------------------------------------------------------------
// TOUR SECTION VISIBILITY (Show / Hide in Database)
// -------------------------------------------------------------
let lastTourVisibilityUpdateTime = 0;

export const getHiddenTourSlugs = () => {
  try {
    const raw = localStorage.getItem(HIDDEN_TOURS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const setHiddenTourSlugs = (slugs) => {
  try {
    lastTourVisibilityUpdateTime = Date.now();
    localStorage.setItem(HIDDEN_TOURS_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent('tourVisibilityChanged', { detail: slugs }));
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('junglee_tour_visibility_sync');
        bc.postMessage({ type: 'TOUR_VISIBILITY_UPDATED', slugs });
        bc.close();
      } catch (e) {}
    }
  } catch (e) {
    console.error('Failed to save hidden tours in localStorage:', e);
  }
};

export const syncHiddenToursFromCloud = async () => {
  try {
    const data = await fetchCloudData();
    if (data) {
      if (Array.isArray(data.hidden)) {
        if (Date.now() - lastTourVisibilityUpdateTime > 4000) {
          const cloudHidden = data.hidden;
          const localHidden = getHiddenTourSlugs();
          if (JSON.stringify(cloudHidden) !== JSON.stringify(localHidden)) {
            localStorage.setItem(HIDDEN_TOURS_STORAGE_KEY, JSON.stringify(cloudHidden));
            window.dispatchEvent(new CustomEvent('tourVisibilityChanged', { detail: cloudHidden }));
          }
        }
      }
      if (data.safariPricing) {
        const cloudPricing = data.safariPricing;
        const localPricing = getSafariPricing();
        const cloudTime = Number(cloudPricing.updatedAt) || 0;
        const localTime = Number(localPricing.updatedAt) || 0;

        if (cloudTime >= localTime) {
          localStorage.setItem(SAFARI_PRICING_STORAGE_KEY, JSON.stringify(cloudPricing));
          window.dispatchEvent(new CustomEvent('safariPricingChanged', { detail: cloudPricing }));
          if (typeof BroadcastChannel !== 'undefined') {
            try {
              const bc = new BroadcastChannel('junglee_safari_pricing_sync');
              bc.postMessage({ type: 'PRICING_UPDATED', pricing: cloudPricing });
              bc.close();
            } catch (e) {}
          }
        }
      }
      if (Array.isArray(data.hiddenHotels)) {
        localStorage.setItem(HIDDEN_HOTELS_STORAGE_KEY, JSON.stringify(data.hiddenHotels));
        window.dispatchEvent(new CustomEvent('hotelVisibilityChanged', { detail: data.hiddenHotels }));
      }
      if (data.hotelPricing && typeof data.hotelPricing === 'object') {
        localStorage.setItem(HOTEL_PRICING_STORAGE_KEY, JSON.stringify(data.hotelPricing));
        window.dispatchEvent(new CustomEvent('hotelPricingChanged', { detail: { all: data.hotelPricing } }));
      }
      return data.hidden || [];
    }
  } catch (err) {
    console.warn('syncHiddenToursFromCloud notice:', err.message);
  }
  return getHiddenTourSlugs();
};

export const isTourHidden = (tour) => {
  if (!tour) return false;
  if (tour.isHidden === true) return true;
  const hiddenList = getHiddenTourSlugs();
  const slug = tour.slug ? String(tour.slug).toLowerCase().trim() : '';
  const id = tour.id ? String(tour.id).toLowerCase().trim() : '';
  return hiddenList.some((item) => {
    const clean = String(item).toLowerCase().trim();
    return (slug && clean === slug) || (id && clean === id);
  });
};

export const toggleTourVisibility = async (tourOrId, explicitHiddenState) => {
  let id = typeof tourOrId === 'object' ? tourOrId.id : tourOrId;
  let slug = typeof tourOrId === 'object' ? tourOrId.slug : null;

  if (!slug && id) {
    const found = FALLBACK_TOURS.find((t) => String(t.id) === String(id));
    if (found) slug = found.slug;
  }
  if (!id && slug) {
    const found = FALLBACK_TOURS.find((t) => String(t.slug) === String(slug));
    if (found) id = found.id;
  }

  const cleanSlug = slug ? String(slug).toLowerCase().trim() : '';
  const cleanId = id ? String(id).toLowerCase().trim() : '';

  const hiddenList = getHiddenTourSlugs();
  const currentlyHidden = isTourHidden(typeof tourOrId === 'object' ? tourOrId : { id, slug });
  const nextHidden = explicitHiddenState !== undefined ? Boolean(explicitHiddenState) : !currentlyHidden;

  let updatedList;
  if (nextHidden) {
    updatedList = Array.from(new Set([
      ...hiddenList,
      ...(cleanSlug ? [cleanSlug] : []),
      ...(cleanId ? [cleanId] : []),
    ]));
  } else {
    updatedList = hiddenList.filter((item) => {
      const cleanItem = String(item).toLowerCase().trim();
      return cleanItem !== cleanSlug && cleanItem !== cleanId;
    });
  }
  setHiddenTourSlugs(updatedList);

  // Persist directly to PostgreSQL database via API
  try {
    if (id) {
      await API.patch(`/admin/tours/${id}/visibility`, { isHidden: nextHidden });
    }
  } catch (_) {}

  await pushAllToCloud({ hidden: updatedList });
  return { isHidden: nextHidden, slugs: updatedList };
};

// -------------------------------------------------------------
// HOTEL VISIBILITY & CUSTOM PRICING (APAI / MAPAI / CPAI in DB)
// -------------------------------------------------------------
export const getDefaultRoomPricing = (roomCat) => {
  const rawPrice = Number(roomCat?.price) || 0;
  const offset = rawPrice > 100 ? rawPrice : rawPrice * 80;
  const apai = 6000 + offset;
  const mapai = Math.max(2000, apai - 1000);
  const cpai = Math.max(1500, apai - 2000);
  return { apai, mapai, cpai };
};

export const getHiddenHotelIds = () => {
  try {
    const raw = localStorage.getItem(HIDDEN_HOTELS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const setHiddenHotelIds = async (ids) => {
  try {
    localStorage.setItem(HIDDEN_HOTELS_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('hotelVisibilityChanged', { detail: ids }));
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('junglee_hotel_visibility_sync');
        bc.postMessage({ type: 'HOTEL_VISIBILITY_UPDATED', ids });
        bc.close();
      } catch (e) {}
    }
    await pushAllToCloud({ hiddenHotels: ids });
  } catch (e) {
    console.error('Failed to set hidden hotel ids:', e);
  }
};

export const isHotelHidden = (hotelOrId) => {
  if (!hotelOrId) return false;
  const id = typeof hotelOrId === 'string' ? hotelOrId : hotelOrId.id;
  const hidden = getHiddenHotelIds();
  return hidden.includes(id);
};

export const toggleHotelVisibility = async (hotelId, forceHidden = null) => {
  const hidden = getHiddenHotelIds();
  const isCurrentlyHidden = hidden.includes(hotelId);
  const nextHidden = forceHidden !== null ? Boolean(forceHidden) : !isCurrentlyHidden;
  let updated;
  if (nextHidden) {
    updated = Array.from(new Set([...hidden, hotelId]));
  } else {
    updated = hidden.filter((id) => id !== hotelId);
  }
  await setHiddenHotelIds(updated);

  // Persist directly to PostgreSQL database
  try {
    await API.patch(`/hotels/${hotelId}/visibility`, { isHidden: nextHidden });
  } catch (_) {}

  return { isHidden: nextHidden, ids: updated };
};

export const getAllHotelCustomPricing = () => {
  try {
    const raw = localStorage.getItem(HOTEL_PRICING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
};

export const getHotelPricing = (hotelId, roomId = null, defaultRoom = null) => {
  const all = getAllHotelCustomPricing();
  const hotelEntry = (hotelId && all[hotelId]) ? all[hotelId] : null;
  const hotelPrice = Number(hotelEntry?.price) || 0;

  let roomPricing = null;
  if (roomId && hotelEntry?.roomCategories && hotelEntry.roomCategories[roomId]) {
    const r = hotelEntry.roomCategories[roomId];
    roomPricing = {
      apai: Number(r.apai) || 6000,
      mapai: Number(r.mapai) || 5000,
      cpai: Number(r.cpai) || 4000,
    };
  } else if (defaultRoom) {
    roomPricing = getDefaultRoomPricing(defaultRoom);
  } else {
    roomPricing = { apai: 6000, mapai: 5000, cpai: 4000 };
  }

  return {
    price: hotelPrice,
    roomCategories: hotelEntry?.roomCategories || {},
    room: roomPricing,
    updatedAt: Number(hotelEntry?.updatedAt) || 0,
  };
};

export const setHotelCustomPricing = async (hotelId, pricingData) => {
  try {
    const all = getAllHotelCustomPricing();
    const existingHotel = all[hotelId] || { price: 0, roomCategories: {} };

    const updatedHotel = {
      price: pricingData.price !== undefined ? Number(pricingData.price) : (existingHotel.price || 0),
      roomCategories: {
        ...(existingHotel.roomCategories || {}),
        ...(pricingData.roomCategories || {}),
      },
      updatedAt: Date.now(),
    };

    const updatedAll = {
      ...all,
      [hotelId]: updatedHotel,
    };

    localStorage.setItem(HOTEL_PRICING_STORAGE_KEY, JSON.stringify(updatedAll));
    window.dispatchEvent(new CustomEvent('hotelPricingChanged', { detail: { hotelId, all: updatedAll, updatedHotel } }));

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('junglee_hotel_pricing_sync');
        bc.postMessage({ type: 'HOTEL_PRICING_UPDATED', hotelId, all: updatedAll });
        bc.close();
      } catch (e) {}
    }

    // Persist directly to PostgreSQL database via API
    try {
      await API.put(`/hotels/${hotelId}/pricing`, pricingData);
    } catch (_) {
      await pushAllToCloud({ hotelPricing: updatedAll });
    }

    return updatedHotel;
  } catch (err) {
    console.error('Failed to set hotel custom pricing:', err);
    return pricingData;
  }
};

export const syncHotelDataFromCloud = async () => {
  await syncHiddenToursFromCloud();
  return {
    hiddenHotels: getHiddenHotelIds(),
    hotelPricing: getAllHotelCustomPricing(),
  };
};

// -------------------------------------------------------------
// TOURS & HOTELS API (Directly from PostgreSQL Database)
// -------------------------------------------------------------
export const getTours = async (params) => {
  try {
    const res = await API.get('/tours', { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      const visible = res.data.filter((t) => !isTourHidden(t));
      return { data: visible };
    }
    const filteredFallback = filterFallbackTours(params).filter((t) => !isTourHidden(t));
    return { data: filteredFallback };
  } catch (err) {
    const filteredFallback = filterFallbackTours(params).filter((t) => !isTourHidden(t));
    return { data: filteredFallback };
  }
};

function filterFallbackTours(params) {
  let filtered = FALLBACK_TOURS;
  if (params?.location && params.location !== 'All') {
    const locQuery = params.location.toLowerCase();
    filtered = filtered.filter((t) =>
      t.location.toLowerCase().includes(locQuery) ||
      (t.region && t.region.toLowerCase().includes(locQuery))
    );
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export const getTourDetail = async (slugOrId) => {
  try {
    const res = await API.get(`/tours/${slugOrId}`);
    if (res.data) return res;
    throw new Error('Tour not found in API response');
  } catch (err) {
    console.warn('API unavailable, returning fallback tour detail:', err.message);
    const tour = FALLBACK_TOURS.find((t) => t.slug === slugOrId || t.id === slugOrId) || FALLBACK_TOURS[0];
    return { data: tour };
  }
};

// Direct Hotels API
export const getHotels = (params) => API.get('/hotels', { params });
export const getDestinationHotels = () => API.get('/hotels/destinations');
export const getHotelDetail = (id) => API.get(`/hotels/${id}`);

// Bookings API
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

// Gallery & Blog API
export const getGalleryItems = (category) => API.get('/gallery', { params: { category } });
export const getBlogPosts = () => API.get('/blog');
export const getBlogPostDetail = (slug) => API.get(`/blog/${slug}`);

// Contact API
export const sendContactMessage = (data) => API.post('/contact', data);

// Admin API
export const getAdminAnalytics = () => API.get('/admin/analytics');
export const getAdminTours = async () => {
  try {
    await syncHiddenToursFromCloud();
  } catch (_) {}
  try {
    const res = await API.get('/admin/tours');
    if (Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map((t) => ({
        ...t,
        isHidden: isTourHidden(t),
      }));
      return { data: mapped };
    }
  } catch (err) {
    console.warn('Admin tours API unavailable, returning fallback tours inventory:', err.message);
  }
  const toursWithVisibility = FALLBACK_TOURS.map((t) => ({
    ...t,
    isHidden: isTourHidden(t),
  }));
  return { data: toursWithVisibility };
};

export const createAdminTour = (data) => API.post('/admin/tours', data);
export const updateAdminTour = async (id, data) => {
  if (data && data.isHidden !== undefined) {
    await toggleTourVisibility({ id, slug: data.slug }, data.isHidden);
  }
  return API.put(`/admin/tours/${id}`, data);
};
export const deleteAdminTour = (id) => API.delete(`/admin/tours/${id}`);
export const toggleAdminTourVisibility = toggleTourVisibility;

export const getAdminBookings = () => API.get('/admin/bookings');
export const updateAdminBookingStatus = (id, status) => API.patch(`/admin/bookings/${id}/status`, { status });
export const deleteAdminBooking = (id) => API.delete(`/admin/bookings/${id}`);

export const getAdminUsers = () => API.get('/admin/users');
export const updateAdminUserRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });
export const updateAdminUserVerify = (id, isVerified) => API.patch(`/admin/users/${id}/verify`, { isVerified });

export const createAdminGalleryItem = (data) => API.post('/admin/gallery', data);
export const deleteAdminGalleryItem = (id) => API.delete(`/admin/gallery/${id}`);

export const createAdminBlogPost = (data) => API.post('/admin/blog', data);
export const deleteAdminBlogPost = (id) => API.delete(`/admin/blog/${id}`);

export const getAdminMessages = () => API.get('/admin/messages');
export const markMessageRead = (id) => API.patch(`/admin/messages/${id}/read`);

export default API;
