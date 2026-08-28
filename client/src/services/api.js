import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('silvan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const signupUser = (data) => API.post('/auth/signup', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resendOtp = (data) => API.post('/auth/resend-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');

// Tours API
export const getTours = (params) => API.get('/tours', { params });
export const getTourDetail = (slugOrId) => API.get(`/tours/${slugOrId}`);

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
