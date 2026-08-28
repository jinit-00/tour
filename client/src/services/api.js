import axios from 'axios';

// Static Fallback Safaris Data for Client-Side Deployments (Vercel / Static Hosting)
const FALLBACK_TOURS = [
  {
    id: '1',
    title: 'Royal Ranthambore Bengal Tiger Safari',
    slug: 'ranthambore-tiger-safari',
    description: 'Journey into ancient banyan ruins and bamboo forests of Rajasthan to photograph wild Bengal Tigers. Low-seat open Gypsies, lake-side tracking, and expert naturalist guidance.',
    location: 'Ranthambore National Park, India',
    basePrice: 2950,
    duration: '6 Days / 5 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80'
    ],
    packages: [
      { id: 'p1', name: 'Jungle Explorer Pack', price: 0, description: 'Heritage jungle lodge stay, all park safari permits, expert local spotter escort.' },
      { id: 'p2', name: 'Private Low-Seat Gypsy Access', price: 500, description: 'Exclusive 4-seater open Gypsy for unobstructed water-level tiger photography.' }
    ]
  },
  {
    id: '2',
    title: 'Greater Kruger Rhino Conservation & Big 5 Safari',
    slug: 'kruger-rhino-safari',
    description: 'An exclusive tracking expedition into Greater Kruger. Photograph wild White & Black Rhinos alongside anti-poaching rangers, Sabie river luxury lodges, and bush walking encounters.',
    location: 'Kruger National Park, South Africa',
    basePrice: 3750,
    duration: '7 Days / 6 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=1600&q=80'
    ],
    packages: [
      { id: 'p3', name: 'Conservation Explorer', price: 0, description: 'Luxury Sabie river eco-lodge stay, open 4x4 game drives, ranger bush walks.' },
      { id: 'p4', name: 'Thermal Night Patrol & Anti-Poaching Ride-Along', price: 400, description: 'Special night tracking access using thermal scopes alongside K9 anti-poaching units.' }
    ]
  },
  {
    id: '3',
    title: 'Serengeti Lion & Great Migration Masterclass',
    slug: 'serengeti-lion-safari',
    description: 'Experience Africa’s iconic lion prides during the dramatic Mara River crossings. Custom open 4x4 vehicles with swivel lens mounts, private tented bush camps, and daily post-processing critiques under the stars.',
    location: 'Serengeti National Park, Tanzania',
    basePrice: 4850,
    duration: '8 Days / 7 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1600&q=80'
    ],
    packages: [
      { id: 'p5', name: 'Standard Expedition', price: 0, description: 'Shared 4x4 vehicle (max 3 photographers per vehicle), luxury safari tented camp, all park permits & meals included.' },
      { id: 'p6', name: 'Pro Telephoto Lens Kit Rental', price: 450, description: 'Includes 600mm f/4 prime lens + carbon fiber tripod with Gimbal head for the entire duration.' },
      { id: 'p7', name: 'Private SUV & Dedicated Photo Guide', price: 1200, description: 'Exclusive vehicle for ultimate framing flexibility, custom tracking of lion packs, and 1-on-1 Lightroom coaching.' }
    ]
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('silvan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: Validate JSON response to prevent HTML rewrite parsing crashes
API.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) {
      return Promise.reject(new Error('API returned HTML page instead of JSON'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const signupUser = (data) => API.post('/auth/signup', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resendOtp = (data) => API.post('/auth/resend-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');

// Tours API with Fallback Guarantees for Vercel
export const getTours = async (params) => {
  try {
    const res = await API.get('/tours', { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
    return { data: FALLBACK_TOURS };
  } catch (err) {
    console.warn('API unavailable, returning fallback safaris:', err.message);
    let filtered = FALLBACK_TOURS;
    if (params?.location && params.location !== 'All') {
      filtered = filtered.filter(t => t.location.toLowerCase().includes(params.location.toLowerCase()));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return { data: filtered };
  }
};

export const getTourDetail = async (slugOrId) => {
  try {
    const res = await API.get(`/tours/${slugOrId}`);
    if (res.data) return res;
    throw new Error('Tour not found in API response');
  } catch (err) {
    console.warn('API unavailable, returning fallback tour detail:', err.message);
    const tour = FALLBACK_TOURS.find(t => t.slug === slugOrId || t.id === slugOrId) || FALLBACK_TOURS[0];
    return { data: tour };
  }
};

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
export const getAdminTours = () => API.get('/admin/tours');
export const createAdminTour = (data) => API.post('/admin/tours', data);
export const updateAdminTour = (id, data) => API.put(`/admin/tours/${id}`, data);
export const deleteAdminTour = (id) => API.delete(`/admin/tours/${id}`);

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
