import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/ui/AuthModal';

// Auto scroll to top helper on every page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Critical landing pages loaded eagerly for immediate First Contentful Paint
import Home from './pages/Home';
import About from './pages/About';
import Tours from './pages/Tours';

// Code-split route-level pages (loaded on-demand with Suspense)
const TourDetail = lazy(() => import('./pages/TourDetail'));
const SafariStory = lazy(() => import('./pages/SafariStory'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Heavy Admin Pages (Recharts, tables, management tools)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminTours = lazy(() => import('./pages/admin/AdminTours'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-sand-gradient text-charcoal-900 selection:bg-pine-800 selection:text-sand-900">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={null}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:slug" element={<TourDetail />} />
            <Route path="/tours/:slug/story" element={<SafariStory />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tours" element={<AdminTours />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
      <AuthModal />
    </div>
  );
}
