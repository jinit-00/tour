import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LightboxModal({ isOpen, onClose, images, currentIndex, onNavigate }) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/90 backdrop-blur-xl p-4 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-sand-900 hover:text-sand-950 p-2.5 rounded-full bg-charcoal-800 border border-charcoal-700 hover:bg-pine-800 transition-all z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Left */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-6 text-sand-900 hover:text-sand-950 p-3 rounded-full bg-charcoal-800 border border-charcoal-700 hover:bg-pine-800 transition-all z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
        >
          <img
            src={typeof currentImg === 'string' ? currentImg : currentImg.src}
            alt={typeof currentImg === 'string' ? 'Safari Photo' : currentImg.title || 'Safari Photo'}
            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-sand-700/60"
          />

          {typeof currentImg !== 'string' && (currentImg.title || currentImg.location) && (
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-sand-900">{currentImg.title}</h4>
              <p className="text-xs font-mono text-sand-700">{currentImg.location} • {currentImg.category}</p>
            </div>
          )}

          <div className="text-xs font-mono text-sand-700/80">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>

        {/* Navigation Right */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-6 text-sand-900 hover:text-sand-950 p-3 rounded-full bg-charcoal-800 border border-charcoal-700 hover:bg-pine-800 transition-all z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

      </div>
    </AnimatePresence>
  );
}
