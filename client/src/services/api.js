import axios from 'axios';

// 11 Unique Signature Safaris Dataset for Client-Side & Vercel Fallback
const FALLBACK_TOURS = [
  {
    id: '1',
    title: 'Serengeti Lion & Great Migration Masterclass',
    slug: 'serengeti-lion-safari',
    description: 'Experience Africa’s iconic lion prides during the dramatic Mara River crossings in Serengeti.',
    location: 'Serengeti, Tanzania',
    region: 'Tanzania',
    basePrice: 4850,
    duration: '8 Days / 7 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p1', name: 'Standard Expedition', price: 0, description: 'Luxury safari tented camp & permits included.' },
      { id: 'p2', name: 'Pro Lens Kit Rental', price: 450, description: '600mm f/4 prime lens rental for the trip.' }
    ]
  },
  {
    id: '2',
    title: 'Ngorongoro Crater Big Game Expedition',
    slug: 'ngorongoro-safari',
    description: 'Photograph massive bull elephants and black rhinos inside the pristine caldera of Ngorongoro.',
    location: 'Ngorongoro, Tanzania',
    region: 'Tanzania',
    basePrice: 4200,
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p3', name: 'Crater Rim Lodge Package', price: 0, description: 'Panoramic rim luxury suite stay.' }
    ]
  },
  {
    id: '3',
    title: 'Tarangire Ancient Baobab & Wildlife Safari',
    slug: 'tarangire-safari',
    description: 'Track massive elephant herds roaming beneath thousand-year-old baobab trees.',
    location: 'Tarangire, Tanzania',
    region: 'Tanzania',
    basePrice: 3500,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p4', name: 'Treehouse Lodge Stay', price: 0, description: 'Elevated treehouse suite overlooking the riverbed.' }
    ]
  },
  {
    id: '4',
    title: 'Royal Ranthambore Bengal Tiger Safari',
    slug: 'ranthambore-tiger-safari',
    description: 'Journey into ancient banyan ruins and bamboo forests to photograph wild Bengal Tigers.',
    location: 'Ranthambore, India',
    region: 'India',
    basePrice: 2950,
    duration: '6 Days / 5 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p5', name: 'Jungle Explorer Pack', price: 0, description: 'Heritage jungle lodge stay & all permits.' },
      { id: 'p6', name: 'Private Low-Seat Gypsy', price: 500, description: 'Exclusive 4x4 open Gypsy for low-angle shots.' }
    ]
  },
  {
    id: '5',
    title: 'Bandhavgarh High-Density Tiger Tracking',
    slug: 'bandhavgarh-safari',
    description: 'Explore the highest tiger density forests in Central India with legendary native spotters.',
    location: 'Bandhavgarh, India',
    region: 'India',
    basePrice: 3200,
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p7', name: 'Fortress View Pack', price: 0, description: 'Luxury eco-villa near the park gates.' }
    ]
  },
  {
    id: '6',
    title: 'Kanha Jungle & Barasingha Sanctuary',
    slug: 'kanha-safari',
    description: 'Immerse in the sal forests that inspired Kipling’s Jungle Book to capture barasingha deer and tigers.',
    location: 'Kanha, India',
    region: 'India',
    basePrice: 2800,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p8', name: 'Sal Forest Lodge', price: 0, description: 'Private cottage near Kanha meadow zone.' }
    ]
  },
  {
    id: '7',
    title: 'Masai Mara Predator Migration Expedition',
    slug: 'masai-mara-safari',
    description: 'Track cheetah sprints and large lion prides across Kenya’s endless savanna grasslands.',
    location: 'Masai Mara, Kenya',
    region: 'Kenya',
    basePrice: 4600,
    duration: '8 Days / 7 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p9', name: 'Riverfront Tented Camp', price: 0, description: 'Luxury canvas tent along the Mara River.' }
    ]
  },
  {
    id: '8',
    title: 'Greater Kruger Rhino Conservation & Big 5 Safari',
    slug: 'kruger-rhino-safari',
    description: 'Photograph wild White & Black Rhinos alongside anti-poaching rangers in private reserves.',
    location: 'Kruger, South Africa',
    region: 'South Africa',
    basePrice: 3750,
    duration: '7 Days / 6 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p10', name: 'Conservation Explorer', price: 0, description: 'Sabie river eco-lodge & bush walks.' },
      { id: 'p11', name: 'Thermal Night Patrol', price: 400, description: 'Night thermal imaging tracking access.' }
    ]
  },
  {
    id: '9',
    title: 'Sabi Sands Private Leopard Tracking',
    slug: 'sabi-sands-safari',
    description: 'World renowned for intimate, off-road leopard encounters in private game reserves.',
    location: 'Sabi Sands, South Africa',
    region: 'South Africa',
    basePrice: 5100,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p12', name: 'Ultra Luxury Suite', price: 0, description: 'Private plunge pool villa with personal tracker.' }
    ]
  },
  {
    id: '10',
    title: 'Amboseli Kilimanjaro Elephant Gathering',
    slug: 'amboseli-safari',
    description: 'Photograph giant tusker elephants wading through swamps with snow-capped Mt. Kilimanjaro in the backdrop.',
    location: 'Amboseli, Kenya',
    region: 'Kenya',
    basePrice: 3900,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p13', name: 'Kilimanjaro View Suite', price: 0, description: 'Direct mountain view luxury tent.' }
    ]
  },
  {
    id: '11',
    title: 'South Luangwa Walking & Leopard Safari',
    slug: 'south-luangwa-safari',
    description: 'Experience Africa’s premier walking safaris along the Luangwa River, famous for leopards and hippo pods.',
    location: 'South Luangwa, Zambia',
    region: 'Zambia',
    basePrice: 4100,
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p14', name: 'Riverbank Camp Package', price: 0, description: 'Rustic luxury river camp with private guide.' }
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

// Tours API with 11 Safaris Fallback Guarantees
export const getTours = async (params) => {
  try {
    const res = await API.get('/tours', { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
    return { data: filterFallbackTours(params) };
  } catch (err) {
    console.warn('API unavailable, returning 11 fallback safaris:', err.message);
    return { data: filterFallbackTours(params) };
  }
};

function filterFallbackTours(params) {
  let filtered = FALLBACK_TOURS;
  if (params?.location && params.location !== 'All') {
    const locQuery = params.location.toLowerCase();
    filtered = filtered.filter(t => 
      t.location.toLowerCase().includes(locQuery) || 
      (t.region && t.region.toLowerCase().includes(locQuery))
    );
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(t => 
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
