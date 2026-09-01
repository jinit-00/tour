import axios from 'axios';

// 11 Exact Signature Safaris Dataset for Client-Side & Vercel Fallback
const FALLBACK_TOURS = [
  {
    id: '1',
    title: 'Gir Asiatic Lion Sanctuary Masterclass',
    slug: 'gir-lion-safari',
    description: 'Track and photograph the world’s last remaining wild Asiatic Lions in the dry deciduous forests of Gir.',
    location: 'Gir, India',
    region: 'India',
    basePrice: 3100,
    duration: '6 Days / 5 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p1', name: 'Gir Jungle Lodge', price: 0, description: 'Eco-lodge stay & all safari permits.' }
    ]
  },
  {
    id: '2',
    title: 'Sanjay Dubri Tiger Reserve Expedition',
    slug: 'sanjay-dubri-tiger-safari',
    description: 'Explore the pristine, untamed tiger corridors of Sanjay Dubri National Park in Central India.',
    location: 'Sanjay Dubri, India',
    region: 'India',
    basePrice: 2900,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p2', name: 'Forest Villa Suite', price: 0, description: 'Luxury cottage near park entry gates.' }
    ]
  },
  {
    id: '3',
    title: 'Jawai Granite Hills Leopard Tracking',
    slug: 'jawai-leopard-safari',
    description: 'Photograph the legendary leopards of Jawai living in harmony among ancient granite rock formations.',
    location: 'Jawai, India',
    region: 'India',
    basePrice: 3400,
    duration: '5 Days / 4 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p3', name: 'Granite Rock Camp', price: 0, description: 'Private luxury tented suite with open 4x4.' }
    ]
  },
  {
    id: '4',
    title: 'Royal Ranthambore Bengal Tiger Portrait',
    slug: 'ranthambore-tiger-safari',
    description: 'Capture intimate, low-angle facial portraits of royal Bengal Tigers among ancient fort ruins.',
    location: 'Ranthambore, India',
    region: 'India',
    basePrice: 2950,
    duration: '6 Days / 5 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p4', name: 'Heritage Jungle Lodge', price: 0, description: 'Royal suite & open Gypsy 4x4 safaris.' }
    ]
  },
  {
    id: '5',
    title: 'Velavadar Blackbuck & Deer Grasslands',
    slug: 'velavadar-deer-safari',
    description: 'Immerse in golden savannas to photograph leaping blackbuck antelopes, deer, and wolves.',
    location: 'Velavadar, India',
    region: 'India',
    basePrice: 2700,
    duration: '5 Days / 4 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p5', name: 'Savanna Eco Resort', price: 0, description: 'Grassland cottage near sanctuary boundary.' }
    ]
  },
  {
    id: '6',
    title: 'Masai Mara Lion Pride & Predator Masterclass',
    slug: 'masai-mara-safari',
    description: 'Witness intense predator action and lion prides feeding in Kenya’s Mara ecosystem.',
    location: 'Masai Mara, Kenya',
    region: 'Kenya',
    basePrice: 4800,
    duration: '8 Days / 7 Nights',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p6', name: 'Riverfront Luxury Camp', price: 0, description: 'Canvas suite along the Mara River.' }
    ]
  },
  {
    id: '7',
    title: 'Uganda Savanna Elephant & Primate Expedition',
    slug: 'uganda-elephant-safari',
    description: 'Photograph massive savanna elephant herds along the Kazinga Channel and Murchison Falls.',
    location: 'Uganda',
    region: 'Uganda',
    basePrice: 4300,
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p7', name: 'River Cruise & Safari Pack', price: 0, description: 'Boat safaris & crater lake lodge.' }
    ]
  },
  {
    id: '8',
    title: 'Greater Kruger Rhino Conservation Expedition',
    slug: 'kruger-rhino-safari',
    description: 'Photograph wild White and Black Rhinos alongside anti-poaching units in private reserves.',
    location: 'Kruger, South Africa',
    region: 'South Africa',
    basePrice: 3750,
    duration: '7 Days / 6 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p8', name: 'Sabie River Lodge', price: 0, description: 'Private villa & bush walking safaris.' }
    ]
  },
  {
    id: '9',
    title: 'Kaziranga Wild Buffalo & Wetland Safari',
    slug: 'kaziranga-buffalo-safari',
    description: 'Track massive wild water buffalo herds roaming the lush tall elephant grasslands of Kaziranga.',
    location: 'Kaziranga, India',
    region: 'India',
    basePrice: 3000,
    duration: '6 Days / 5 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p9', name: 'Tea Garden Resort', price: 0, description: 'Boutique estate stay & 4x4 safaris.' }
    ]
  },
  {
    id: '10',
    title: 'Camargue Wild Horse & Wetland Expedition',
    slug: 'camargue-horse-safari',
    description: 'Capture iconic galloping white horses charging through shallow coastal salt marshes.',
    location: 'Camargue, France',
    region: 'France',
    basePrice: 3600,
    duration: '5 Days / 4 Nights',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80',
    ],
    packages: [
      { id: 'p10', name: 'Provençal Mas Stay', price: 0, description: 'Traditional estate stay & equestrian photo guide.' }
    ]
  },
  {
    id: '11',
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
      { id: 'p11', name: 'Kilimanjaro View Suite', price: 0, description: 'Direct mountain view luxury tent.' }
    ]
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('junglee_token') || localStorage.getItem('silvan_token');
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

// Tours API with Guaranteed 11 Safaris Output
export const getTours = async (params) => {
  try {
    const res = await API.get('/tours', { params });
    if (Array.isArray(res.data) && res.data.length >= 11) {
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
