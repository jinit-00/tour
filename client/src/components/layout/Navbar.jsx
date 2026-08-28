import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, Menu, X, Compass as TreeIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { user, logout, openAuthModal } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tours', path: '/tours' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'glass-nav py-3.5 shadow-md'
          : 'bg-gradient-to-b from-sand-900/90 via-sand-800/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-sand-950 group-hover:scale-105 transition-all shadow-md">
            <TreeIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold tracking-widest text-lg text-charcoal-900 uppercase group-hover:text-pine-800 transition-colors">
              SILVAN TOURS
            </span>
            <span className="text-[10px] tracking-widest uppercase text-charcoal-700 font-mono">
              WILDLIFE EXPEDITIONS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-pine-800 ${
                  isActive ? 'text-pine-800 font-semibold border-b-2 border-pine-800 pb-0.5' : 'text-charcoal-700'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-900 border border-sand-700 hover:border-pine-800/50 transition-all text-sm font-medium text-charcoal-900"
              >
                <div className="w-6 h-6 rounded-full bg-pine-800 text-sand-950 flex items-center justify-center text-xs font-bold uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span className="max-w-[100px] truncate text-charcoal-900 font-semibold">{user.name}</span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl py-2 z-50 border border-sand-700"
                  >
                    <div className="px-4 py-2 border-b border-sand-700">
                      <p className="text-xs text-charcoal-500 font-mono">Logged in as</p>
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold bg-pine-800/10 text-pine-800 border border-pine-800/20 rounded">
                          Admin Privileges
                        </span>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-800 hover:bg-sand-900 hover:text-pine-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 hover:bg-sand-900 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-100/50 transition-colors border-t border-sand-700 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="text-sm font-medium text-charcoal-800 hover:text-pine-800 transition-colors px-3 py-1.5"
            >
              Sign In
            </button>
          )}

          <Link
            to="/tours"
            className="px-5 py-2 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-sm transition-all duration-200 shadow-md flex items-center gap-1.5 group"
          >
            <span>Book a Tour</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-charcoal-900 hover:text-pine-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-sand-700 px-4 pt-3 pb-6"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-base font-medium text-charcoal-800 hover:text-pine-800 py-1.5 border-b border-sand-700/60"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 py-2 text-pine-800 font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>My Dashboard ({user.name})</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 py-2 text-amber-700 font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 py-2 text-rose-700 text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full text-center py-2.5 rounded-lg border border-sand-700 text-charcoal-900 font-medium hover:bg-sand-900"
                  >
                    Sign In / Register
                  </button>
                )}

                <Link
                  to="/tours"
                  className="w-full text-center py-3 rounded-lg bg-pine-800 text-sand-950 font-bold text-sm shadow-md"
                >
                  Book a Tour Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
