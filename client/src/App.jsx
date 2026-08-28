import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/ui/AuthModal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import SafariStory from './pages/SafariStory';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import UserDashboard from './pages/UserDashboard';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-sand-gradient text-charcoal-900 selection:bg-pine-800 selection:text-sand-900">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
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
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tours" element={<AdminTours />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      <AuthModal />
    </div>
  );
}
