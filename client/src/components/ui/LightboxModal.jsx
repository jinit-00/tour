import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LightboxModal({ isOpen, onClose, images, currentIndex, onNavigate }) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95 backdrop-blur-2xl p-3 sm:p-6 lg:p-8 select-none"
      >
        {/* Top Bar: Counter & Close Button */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-50 pointer-events-auto"
        >
          <div className="flex items-center space-x-3 bg-charcoal-900/80 border border-sand-700/40 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-pine-800" />
            <span className="text-xs font-mono font-bold text-sand-800 tracking-wider">
              {currentIndex + 1} / {images.length}
            </span>
            {currentImg.category && (
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold tracking-widest text-pine-800 border-l border-sand-700/40 pl-3">
                {currentImg.category}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            title="Close (Esc)"
            className="flex items-center space-x-1 text-sand-800 hover:text-sand-950 p-2.5 sm:px-4 sm:py-2 rounded-full bg-charcoal-900/80 border border-sand-700/40 hover:bg-pine-800 hover:border-pine-800 transition-all shadow-lg group"
          >
            <span className="hidden sm:inline text-xs font-mono font-bold text-sand-800 group-hover:text-sand-950">Close</span>
            <X className="w-5 h-5 text-sand-800 group-hover:text-sand-950" />
          </button>
        </div>

        {/* Left Arrow: Previous image */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            title="Left arrow: Previous image"
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-sand-800 hover:text-sand-950 p-3 sm:p-4 rounded-full bg-charcoal-900/80 border border-sand-700/50 hover:bg-pine-800 hover:border-pine-800 hover:scale-110 active:scale-95 transition-all z-50 shadow-2xl group flex items-center gap-2"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-sand-800 group-hover:text-sand-950" />
            <span className="hidden xl:inline text-xs font-mono font-bold pr-1 text-sand-800 group-hover:text-sand-950">Prev</span>
          </button>
        )}

        {/* Center Modal Image & Details */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl w-full max-h-[86vh] flex flex-col items-center justify-center space-y-3 z-40 pointer-events-auto"
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative flex flex-col items-center max-h-[72vh] max-w-full"
          >
            <img
              src={typeof currentImg === 'string' ? currentImg : currentImg.src}
              alt={typeof currentImg === 'string' ? 'Safari Photo' : currentImg.title || 'Safari Photo'}
              className="max-h-[68vh] sm:max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-sand-700/40 bg-charcoal-950"
            />
          </motion.div>

          {/* Caption & Navigation Guidance */}
          <div className="text-center space-y-1 max-w-2xl px-4">
            {typeof currentImg !== 'string' && currentImg.title && (
              <h4 className="text-base sm:text-lg font-bold text-sand-950 tracking-tight">
                {currentImg.title}
              </h4>
            )}
            {typeof currentImg !== 'string' && currentImg.location && (
              <p className="text-xs sm:text-sm font-mono text-sand-700">
                {currentImg.location}
              </p>
            )}

            {/* Visual Shortcut Bar */}
            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] font-mono text-sand-700/70">
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-charcoal-800 border border-sand-700/40 text-[10px] text-sand-800">←</kbd>
                Left arrow: Previous image
              </span>
              <span className="text-sand-700/40">•</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-charcoal-800 border border-sand-700/40 text-[10px] text-sand-800">→</kbd>
                Right arrow: Next image
              </span>
            </div>
          </div>
        </div>

        {/* Right Arrow: Next image */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            title="Right arrow: Next image"
            aria-label="Next image"
            className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 text-sand-800 hover:text-sand-950 p-3 sm:p-4 rounded-full bg-charcoal-900/80 border border-sand-700/50 hover:bg-pine-800 hover:border-pine-800 hover:scale-110 active:scale-95 transition-all z-50 shadow-2xl group flex items-center gap-2"
          >
            <span className="hidden xl:inline text-xs font-mono font-bold pl-1 text-sand-800 group-hover:text-sand-950">Next</span>
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-sand-800 group-hover:text-sand-950" />
          </button>
        )}
      </div>
    </AnimatePresence>
  );
}
