import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Star, Wifi, Coffee, Utensils, Tv, 
  CheckCircle2, ShieldCheck, Clock, Award, Building, Sparkles 
} from 'lucide-react';

export default function HotelDetailModal({ hotel, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !hotel) return null;

  const images = Array.isArray(hotel.images) && hotel.images.length > 0 ? hotel.images : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-sand-950 border border-sand-700 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 border-b border-sand-700/80 bg-sand-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <span className="bg-pine-800 text-sand-950 text-xs font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                Official Safari Stay
              </span>
              <span className="text-xs text-amber-600 font-bold flex items-center gap-1 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {hotel.rating || '4.5 ★'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-sand-800 hover:bg-sand-700 text-charcoal-900 flex items-center justify-center transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-charcoal-900">
            
            {/* Title & Header */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-charcoal-950">
                {hotel.name}
              </h2>
              {hotel.tagline && (
                <p className="text-sm font-semibold text-pine-800 font-mono">
                  {hotel.tagline}
                </p>
              )}
            </div>

            {/* Photo Gallery Viewer */}
            <div className="space-y-3">
              <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-sand-900 relative shadow-xl border border-sand-700">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={`${hotel.name} Photo ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute bottom-3 right-3 bg-charcoal-950/80 backdrop-blur-md text-sand-950 text-xs font-mono font-bold px-3 py-1 rounded-full border border-sand-700">
                  {activeImageIndex + 1} / {images.length} Photos
                </div>
              </div>

              {/* Thumbnail Bar */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-pine-800 scale-105 shadow-md'
                        : 'border-sand-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description & Overview */}
            <div className="glass-panel p-6 rounded-2xl border border-sand-700/80 space-y-3">
              <h3 className="text-lg font-bold text-charcoal-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-pine-800" />
                <span>Resort Description & Wilderness Setting</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-charcoal-700 font-normal">
                {hotel.description || 'Set in the tranquil greenery near the entry gate of Gir Asiatic Lion Sanctuary. Designed specifically to cater to wildlife photographers, safari explorers, and families seeking luxury in the Gir jungle.'}
              </p>
            </div>

            {/* Premium Amenities Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-charcoal-950">Resort Amenities & Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs font-medium text-charcoal-800">
                {(hotel.amenities || [
                  'Outdoor Swimming Pool',
                  'Fine Dining Restaurant',
                  'Free High-Speed Wi-Fi',
                  'Private Cottages & Suites',
                  '24/7 Power Backup',
                  'Free Private Parking'
                ]).map((amenity, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-sand-900 border border-sand-700 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-pine-800 shrink-0" />
                    <span className="font-semibold">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in & Policy Info */}
            <div className="p-4 rounded-xl bg-sand-900 border border-sand-700 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-charcoal-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pine-800" />
                <span>Check-in: <strong>12:00 PM</strong> | Check-out: <strong>10:00 AM</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pine-800" />
                <span>Govt Photo ID Mandatory for Check-in</span>
              </div>
            </div>

          </div>

          {/* Modal Footer Bar */}
          <div className="p-6 border-t border-sand-700/80 bg-sand-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pine-800" />
              <span className="text-xs font-bold text-charcoal-900">Official Partner Resort for JungleE Wildlife Expeditions</span>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-xl transition-all"
            >
              Close Details
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
