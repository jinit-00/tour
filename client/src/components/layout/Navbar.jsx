import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';

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
          ? 'glass-nav py-2.5 sm:py-3 shadow-md'
          : 'bg-gradient-to-b from-sand-900/95 via-sand-800/70 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-sand-700/80 shadow-2xl group-hover:scale-105 transition-all shrink-0 bg-sand-950 p-1 flex items-center justify-center">
            <img src={logoImg} alt="JungleE Wildlife Expeditions Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col shrink-0">
            <span className="font-sans font-black tracking-wider text-lg sm:text-2xl text-charcoal-950 uppercase group-hover:text-pine-800 transition-colors leading-none">
              JungleE
            </span>
            <span className="text-[9px] sm:text-xs tracking-[0.18em] uppercase text-pine-800 font-mono font-bold pt-1">
              WILDLIFE EXPEDITIONS
            </span>
          </div>
        </Link>

        {/* Large Single-Line Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 shrink-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap text-sm xl:text-base font-extrabold tracking-wide transition-colors hover:text-pine-800 ${
                  isActive
                    ? 'text-pine-800 font-black border-b-2 border-pine-800 pb-0.5'
                    : 'text-charcoal-950 hover:text-pine-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-900 border border-sand-700 hover:border-pine-800/50 transition-all text-xs font-bold text-charcoal-950 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-pine-800 text-sand-950 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span className="max-w-[90px] xl:max-w-[120px] truncate text-charcoal-950 font-bold">{user.name}</span>
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
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-800 hover:bg-sand-900 hover:text-pine-800 transition-colors font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 hover:bg-sand-900 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-700 hover:bg-rose-100/50 transition-colors border-t border-sand-700 mt-1 font-medium"
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
              className="text-sm xl:text-base font-extrabold text-charcoal-950 hover:text-pine-800 transition-colors px-2.5 py-1.5 whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          <Link
            to="/tours"
            className="px-5 xl:px-6 py-2 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-extrabold text-xs xl:text-sm transition-all duration-200 shadow-md flex items-center gap-1.5 whitespace-nowrap shrink-0 group"
          >
            <span>Book a Tour</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 text-charcoal-950 hover:text-pine-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-b border-sand-700 px-5 pt-4 pb-6 shadow-2xl"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-extrabold text-charcoal-950 hover:text-pine-800 py-2 border-b border-sand-700/60"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 py-2 text-pine-800 font-bold text-base"
                    >
                      <User className="w-5 h-5" />
                      <span>My Dashboard ({user.name})</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 py-2 text-amber-700 font-bold text-base"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 py-2 text-rose-700 text-base font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full text-center py-3 rounded-xl border border-sand-700 text-charcoal-950 font-bold text-base hover:bg-sand-900"
                  >
                    Sign In / Register
                  </button>
                )}

                <Link
                  to="/tours"
                  className="w-full text-center py-3.5 rounded-xl bg-pine-800 text-sand-950 font-extrabold text-base shadow-md"
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
