import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Eye,
  Bed,
  Maximize2,
  Sparkles,
  Images,
  Hotel,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  X,
  Compass,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80';

/**
 * ImageWithSkeleton
 * Shows a skeleton shimmer until the image finishes loading, then fades in smoothly.
 * If the image fails to load, gracefully falls back with a placeholder icon without breaking layout.
 */
function ImageWithSkeleton({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  aspectClassName = 'aspect-[16/10]',
  sizes,
  srcSet,
  onClick,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectClassName} overflow-hidden bg-sand-900 ${className}`}
    >
      {/* Skeleton / Shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-sand-900 via-sand-800 to-sand-900 bg-[length:200%_100%] animate-pulse"
        />
      )}

      {/* Image element */}
      {!hasError ? (
        <img
          src={src || FALLBACK_IMAGE}
          alt={alt}
          loading={loading}
          decoding={decoding}
          sizes={sizes}
          srcSet={srcSet}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Neutral fallback placeholder with icon */
        <div className="w-full h-full flex flex-col items-center justify-center bg-sand-900 text-charcoal-500 p-2 text-center select-none">
          <Hotel className="w-6 h-6 text-pine-800/60 mb-1" />
          <span className="text-[11px] font-medium text-charcoal-600 line-clamp-1">{alt || 'Photo unavailable'}</span>
        </div>
      )}
    </div>
  );
}

/**
 * FullGalleryModal / Lightbox
 * Rendered strictly into a document.body portal (z-[9999]) above all sticky headers & panels.
 * Features:
 * - Tabbed navigation across 'Hotel' and 'Your Room' photo groups (or combined linear index)
 * - Object-fit: contain (max-h-[85vh], max-w-[95vw], no cropping)
 * - Keyboard: Left / Right arrows to navigate, Escape to close, Focus trapped inside
 * - Mobile: Touch swipe left/right to navigate, tap backdrop to close
 * - Scroll locking on <body> with restoration
 * - Thumbnail strip with active highlight & auto-scroll
 * - Next/prev image preloading
 * - Touch targets >= 44px
 */
export function FullGalleryModal({
  isOpen,
  onClose,
  items = [], // array of { src, alt, group: 'Hotel' | 'Your Room' }
  initialIndex = 0,
  title = 'Photo Gallery',
  hotelName = '',
  roomName = '',
  triggerElementRef = null,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeGroupFilter, setActiveGroupFilter] = useState('ALL'); // 'ALL' | 'Hotel' | 'Your Room'
  const dialogRef = useRef(null);
  const thumbStripRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  // Sync initial index and open state
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, items.length - 1)));
      setActiveGroupFilter('ALL');
    }
  }, [isOpen, initialIndex, items.length]);

  const total = items.length;
  const currentItem = items[currentIndex] || items[0] || { src: FALLBACK_IMAGE, alt: title };

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Preload next and previous images
  useEffect(() => {
    if (!isOpen || total <= 1) return;
    const nextIdx = (currentIndex + 1) % total;
    const prevIdx = (currentIndex - 1 + total) % total;
    [nextIdx, prevIdx].forEach((idx) => {
      const src = items[idx]?.src;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [isOpen, currentIndex, items, total]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen || !thumbStripRef.current) return;
    const activeThumb = thumbStripRef.current.querySelector(`[data-thumb-idx="${currentIndex}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex, isOpen]);

  // Scroll lock on body and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    // Focus modal
    const prevActiveElement = document.activeElement;
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 20);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Trap Tab focus
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      // Return focus to opening trigger element
      if (triggerElementRef?.current) {
        triggerElementRef.current.focus();
      } else if (prevActiveElement && typeof prevActiveElement.focus === 'function') {
        prevActiveElement.focus();
      }
    };
  }, [isOpen, onClose, handlePrev, handleNext, triggerElementRef]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || !e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Only swipe if mostly horizontal and >= 40px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  if (!isOpen || total === 0) return null;

  // Check unique groups in items ('Hotel', 'Your Room')
  const availableGroups = Array.from(new Set(items.map((i) => i.group).filter(Boolean)));

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} lightbox viewer`}
      tabIndex={-1}
      ref={dialogRef}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/95 backdrop-blur-md text-sand-100 select-none outline-none animate-fadeIn"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Top Bar Header */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full p-3 sm:p-4 bg-sand-950/80 backdrop-blur-md border-b border-sand-800 flex items-center justify-between gap-3 shrink-0 z-10"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm sm:text-base font-bold text-sand-100 truncate">
              {hotelName || title}
            </h4>
            {currentItem?.group && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pine-800 text-sand-950">
                {currentItem.group}
              </span>
            )}
          </div>
          {roomName && currentItem?.group === 'Your Room' && (
            <p className="text-xs text-sand-400 truncate">{roomName}</p>
          )}
        </div>

        {/* Group Filter Tabs (if both Hotel and Your Room exist) */}
        {availableGroups.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 bg-sand-900/80 p-1 rounded-xl border border-sand-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveGroupFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeGroupFilter === 'ALL' ? 'bg-pine-800 text-sand-950' : 'text-sand-300 hover:text-white'
              }`}
            >
              All ({total})
            </button>
            {availableGroups.map((grp) => {
              const count = items.filter((i) => i.group === grp).length;
              const firstIdx = items.findIndex((i) => i.group === grp);
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => {
                    setActiveGroupFilter(grp);
                    if (firstIdx !== -1) setCurrentIndex(firstIdx);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    currentItem?.group === grp && activeGroupFilter === grp
                      ? 'bg-pine-800 text-sand-950'
                      : 'text-sand-300 hover:text-white'
                  }`}
                >
                  {grp} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Counter & Close (>= 44px touch targets) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-sand-900 border border-sand-700 text-sand-200">
            {currentIndex + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo gallery"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-sand-900 hover:bg-pine-800 text-sand-200 hover:text-sand-950 flex items-center justify-center transition-colors shadow-lg active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Photo Viewport: object-fit: contain, max-h-[85vh], max-w-[95vw] */}
      <div
        onClick={(e) => {
          // Tap on backdrop closes modal; tap on image does nothing
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden"
      >
        <img
          key={currentItem.src}
          src={currentItem.src || FALLBACK_IMAGE}
          alt={currentItem.alt || `${hotelName} photo ${currentIndex + 1}`}
          decoding="async"
          className="max-h-[85vh] max-w-[95vw] object-contain select-none drop-shadow-2xl rounded-lg animate-fadeIn"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {/* Previous Button (>= 44px touch target) */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center transition-all shadow-2xl active:scale-90 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button (>= 44px touch target) */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center transition-all shadow-2xl active:scale-90 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {total > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full p-2.5 sm:p-3 bg-sand-950/90 backdrop-blur-md border-t border-sand-800 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 shrink-0 z-10"
          ref={thumbStripRef}
        >
          {items.map((item, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                data-thumb-idx={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className={`relative w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 min-w-[44px] ${
                  isActive
                    ? 'border-pine-800 ring-2 ring-pine-800/40 opacity-100 scale-105'
                    : 'border-sand-700/60 opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={item.src || FALLBACK_IMAGE}
                  alt={`Thumbnail ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}

/**
 * Single Room Category Card
 * Displays main photo (fixed 4:3 aspect ratio, lazy loaded), 3-4 thumbnail photos opening lightbox,
 * category name, bed type, room size, view, and radio-style single selection with clear selected state.
 * ABSOLUTELY NO price, rate, "₹", "+₹", "/ day", or "per night" anywhere.
 */
function RoomCategoryCard({ category, isSelected, onSelect, onChangeRoom, hotelName }) {
  const rawImages = Array.isArray(category.images) && category.images.length > 0 ? category.images : [];
  const imageList = rawImages.length > 0 ? rawImages : [FALLBACK_IMAGE];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const triggerRef = useRef(null);

  const bedType = category.bedType || null;
  const roomSize = category.roomSize || null;
  const view = category.view || null;

  const openLightboxAt = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const galleryItems = imageList.map((src, i) => ({
    src,
    alt: `${hotelName}, ${category.name || 'Room Category'}, photo ${i + 1}`,
    group: 'Your Room',
  }));

  return (
    <>
      <div
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onClick={() => onSelect(category)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onSelect(category);
          }
        }}
        className={`glass-panel rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer select-none group relative ${
          isSelected
            ? 'border-pine-800 ring-2 ring-pine-800/40 bg-sand-900/90 shadow-xl'
            : 'border-sand-700/80 hover:border-sand-600 bg-sand-950/60 hover:bg-sand-900/40 shadow-sm'
        }`}
      >
        <div className="space-y-3">
          {/* Main Room Photo with fixed 4:3 aspect ratio, lazy loaded */}
          <div
            ref={triggerRef}
            className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-sand-900 shadow-sm cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              openLightboxAt(activePhotoIdx);
            }}
            title="Click to expand photos in lightbox"
          >
            <img
              src={imageList[activePhotoIdx] || imageList[0]}
              alt={`${category.name || 'Room Category'} at ${hotelName}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Radio indicator pill on top right */}
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all ${
                  isSelected
                    ? 'bg-pine-800 text-sand-950 ring-2 ring-sand-950/40'
                    : 'bg-sand-950/85 backdrop-blur-md text-charcoal-700 border border-sand-700'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-sand-950 bg-sand-950' : 'border-charcoal-500'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-pine-800" />}
                </span>
                <span>{isSelected ? 'Selected' : 'Select'}</span>
              </span>
            </div>

            {/* View photos indicator button */}
            {imageList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightboxAt(0);
                }}
                className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 text-[10px] font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md"
                title="Click to view all photos in lightbox"
              >
                <Images className="w-3 h-3" />
                <span>{imageList.length} Photos</span>
              </button>
            )}
          </div>

          {/* 3 to 4 Thumbnail Photos Opening Lightbox Carousel */}
          {imageList.length > 1 && (
            <div className="grid grid-cols-4 gap-1.5">
              {imageList.slice(0, 4).map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx(idx);
                    openLightboxAt(idx);
                  }}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                    activePhotoIdx === idx
                      ? 'border-pine-800 ring-2 ring-pine-800/40'
                      : 'border-sand-700/80 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`Open photo ${idx + 1} of ${category.name} in lightbox`}
                  title={`View photo ${idx + 1}`}
                >
                  <img
                    src={thumb || FALLBACK_IMAGE}
                    alt={`${category.name || 'Room'} thumbnail ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Room Category Details */}
          <div className="space-y-1.5 pt-1">
            <h5 className="text-sm sm:text-base font-bold text-charcoal-950 leading-snug">
              {category.name || 'Wilderness Room'}
            </h5>

            {category.description && (
              <p className="text-[11px] text-charcoal-700 line-clamp-2 leading-relaxed font-normal">
                {category.description}
              </p>
            )}

            {/* Feature Spec Tags: Bed, Size, View (gracefully hidden if missing) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bedType && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sand-900 border border-sand-700 text-charcoal-800 font-medium">
                  <Bed className="w-3 h-3 text-pine-800 shrink-0" />
                  <span>{bedType}</span>
                </span>
              )}
              {roomSize && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sand-900 border border-sand-700 text-charcoal-800 font-medium">
                  <Maximize2 className="w-3 h-3 text-pine-800 shrink-0" />
                  <span>{roomSize}</span>
                </span>
              )}
              {view && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sand-900 border border-sand-700 text-charcoal-800 font-medium">
                  <Sparkles className="w-3 h-3 text-pine-800 shrink-0" />
                  <span>{view}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 mt-3 border-t border-sand-700/60 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openLightboxAt(0);
            }}
            className="text-[11px] text-pine-800 hover:underline font-bold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Photos</span>
          </button>

          <div className="flex items-center gap-2">
            {isSelected && onChangeRoom && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeRoom();
                }}
                aria-label="Change room category"
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-charcoal-800 hover:text-pine-800 bg-sand-900 border border-sand-700 hover:border-pine-800/60 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3 text-pine-800" />
                <span>Change Room</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(category);
              }}
              aria-label={`Choose ${category.name}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-pine-800 text-sand-950 ring-2 ring-pine-800/40'
                  : 'bg-sand-900 hover:bg-pine-800 hover:text-sand-950 text-charcoal-900 border border-sand-700'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selected</span>
                </>
              ) : (
                <span>Select Room</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <FullGalleryModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={galleryItems}
        hotelName={hotelName}
        roomName={category.name}
        initialIndex={lightboxIndex}
        triggerElementRef={triggerRef}
      />
    </>
  );
}

/**
 * Image Carousel for Unselected Resort Cards
 */
function ResortImageCarousel({ images, name, onOpenDetails }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const imageList = Array.isArray(images) && images.length > 0 ? images : [FALLBACK_IMAGE];
  const total = imageList.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={onOpenDetails}
      className="h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-sand-900 relative group cursor-pointer select-none"
      title={`${name} - Click to view full details`}
    >
      <div
        className="w-full h-full flex transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {imageList.map((imgSrc, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative overflow-hidden">
            <img
              src={imgSrc || FALLBACK_IMAGE}
              alt={name}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Previous photo of ${name}`}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-90 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Next photo of ${name}`}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-90 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2.5 right-2.5 bg-charcoal-950/75 text-sand-950 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md border border-sand-700/40 pointer-events-none">
            {currentIdx + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Reusable Resort & Room Category Selection Component
 * One component driven dynamically by data across ALL tours and ALL hotels.
 * Strictly no rates or price markers rendered here.
 */
export default function ResortRoomSelector({
  hotels = [],
  selectedHotel,
  selectedRoomCategory,
  onSelectHotel,
  onSelectRoomCategory,
  onGoBackToResorts,
  onChangeRoom,
  onOpenHotelDetails,
  tourLocation = '',
}) {
  const [exitingHotelId, setExitingHotelId] = useState(null);
  const [photosExpanded, setPhotosExpanded] = useState(false);
  const [activePhotoGroup, setActivePhotoGroup] = useState('Hotel'); // 'Hotel' | 'Your Room'
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const selectedCardRef = useRef(null);
  const selectedHeadingRef = useRef(null);
  const firstCardRef = useRef(null);
  const photoSectionRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Focus and scroll management on hotel selection
  useEffect(() => {
    if (selectedHotel) {
      const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Smooth scroll to the top of the selected hotel card so user sees rooms immediately
      if (selectedCardRef.current) {
        selectedCardRef.current.scrollIntoView({
          behavior: isReduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }
      // Move keyboard focus to the selected hotel card heading
      selectedHeadingRef.current?.focus();
    }
  }, [selectedHotel?.id]);

  // Handle expanding photo section: smooth scroll if partially offscreen
  const handleTogglePhotos = () => {
    setPhotosExpanded((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => {
          if (photoSectionRef.current) {
            const rect = photoSectionRef.current.getBoundingClientRect();
            const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (rect.bottom > window.innerHeight || rect.top < 0) {
              photoSectionRef.current.scrollIntoView({
                behavior: isReduced ? 'auto' : 'smooth',
                block: 'nearest',
              });
            }
          }
        }, 150);
      }
      return nextState;
    });
  };

  if (!hotels || hotels.length === 0) {
    return null;
  }

  // Handle hotel selection with short exit transition for other cards
  const handleSelectHotelClick = (hotel) => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      onSelectHotel(hotel);
      return;
    }

    setExitingHotelId(hotel.id);
    setTimeout(() => {
      onSelectHotel(hotel);
      setExitingHotelId(null);
    }, 220);
  };

  // Handle going back to all resorts
  const handleBackToResorts = () => {
    setPhotosExpanded(false);
    onGoBackToResorts();
    setTimeout(() => {
      firstCardRef.current?.focus();
    }, 50);
  };

  const displayedHotels = selectedHotel
    ? hotels.filter((h) => h.id === selectedHotel.id)
    : hotels;

  // Build photo groups for the selected hotel & selected room category
  const hotelPhotos = Array.isArray(selectedHotel?.images) ? selectedHotel.images : [];
  const roomPhotos = Array.isArray(selectedRoomCategory?.images) ? selectedRoomCategory.images : [];

  const combinedGalleryItems = [
    ...hotelPhotos.map((src, i) => ({
      src,
      alt: `${selectedHotel?.name || 'Hotel'}, resort view ${i + 1}`,
      group: 'Hotel',
    })),
    ...roomPhotos.map((src, i) => ({
      src,
      alt: `${selectedHotel?.name || 'Hotel'}, ${selectedRoomCategory?.name || 'Room'}, view ${i + 1}`,
      group: 'Your Room',
    })),
  ];

  const activeGroupPhotos =
    activePhotoGroup === 'Your Room' && roomPhotos.length > 0
      ? roomPhotos
      : hotelPhotos;

  const openGalleryAt = (photoSrc) => {
    const foundIdx = combinedGalleryItems.findIndex((it) => it.src === photoSrc);
    setGalleryStartIndex(foundIdx >= 0 ? foundIdx : 0);
    setGalleryModalOpen(true);
  };

  return (
    <section
      id="resort-selection-section"
      tabIndex={-1}
      className="space-y-5 scroll-mt-28 outline-none"
    >
      {/* Accessible live region announcing hotel view updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectedHotel
          ? `Showing rooms for ${selectedHotel.name}`
          : 'Showing all resorts'}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-charcoal-950 uppercase tracking-tight">
            Choose Your Resort & Room
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-700 pt-0.5">
            {selectedHotel
              ? `Select your room category at ${selectedHotel.name} below.`
              : 'Select your preferred wilderness resort below to view its available room categories.'}
          </p>
        </div>

        {/* Global Reset / Go Back Button if a hotel is selected */}
        {selectedHotel && (
          <button
            type="button"
            onClick={handleBackToResorts}
            aria-label="Go back and choose a different resort"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sand-700 bg-sand-950/80 hover:bg-sand-900 text-charcoal-800 text-xs font-bold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-pine-800" />
            <span>← Back to resorts</span>
          </button>
        )}
      </div>

      {/* Grid of displayed hotels */}
      <div className={`grid gap-5 transition-all duration-300 ${selectedHotel ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {displayedHotels.map((hotel, index) => {
          const isSelected = selectedHotel?.id === hotel.id;
          const roomCategories = Array.isArray(hotel.roomCategories) ? hotel.roomCategories : [];
          const roomCount = roomCategories.length;

          // State A: Selected Hotel (Rendered in expanded state with its room categories)
          if (isSelected) {
            return (
              <div
                key={hotel.id}
                ref={selectedCardRef}
                aria-expanded="true"
                className="glass-panel rounded-3xl border-2 border-pine-800 bg-sand-900/95 shadow-2xl transition-all duration-300 ease-in-out"
              >
                {/* Expanded Resort Header Banner */}
                <div className="p-5 sm:p-6 border-b border-sand-700/80 bg-sand-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-3xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={handleBackToResorts}
                      aria-label="Go back to all resorts"
                      className="px-3 py-1.5 rounded-xl bg-sand-900 hover:bg-pine-800 hover:text-sand-950 border border-sand-700 text-charcoal-900 transition-colors shadow-xs flex items-center gap-1.5 text-xs font-bold shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4 text-pine-800" />
                      <span>← Back to resorts</span>
                    </button>

                    <div className="min-w-0">
                      <h4
                        ref={selectedHeadingRef}
                        tabIndex={-1}
                        className="text-lg sm:text-xl font-black text-charcoal-950 leading-tight truncate outline-none"
                      >
                        {hotel.name}
                      </h4>
                      <p className="text-xs text-pine-800 font-medium truncate">
                        {hotel.tagline || hotel.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      ref={toggleButtonRef}
                      onClick={handleTogglePhotos}
                      aria-expanded={photosExpanded}
                      aria-controls={`hotel-photos-section-${hotel.id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-charcoal-900 hover:text-pine-800 bg-sand-900 hover:bg-sand-800 border border-sand-700 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-pine-800" />
                      <span>{photosExpanded ? 'Hide Photos' : 'View Hotel Photos'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-pine-800 transition-transform duration-300 ${
                          photosExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address || tourLocation}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-charcoal-900 hover:text-pine-800 bg-sand-900 hover:bg-sand-800 border border-sand-700 transition-colors flex items-center gap-1"
                      title="Open Location on Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-pine-800" />
                      <span>Map</span>
                    </a>
                  </div>
                </div>

                {/* Collapsed Selected Accommodation Summary Bar */}
                {selectedRoomCategory && (
                  <div className="mx-5 sm:mx-6 mt-4 p-4 rounded-2xl bg-pine-800/10 border border-pine-800/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] w-16 sm:w-20 rounded-xl overflow-hidden bg-sand-950 border border-sand-700 shrink-0">
                        <img
                          src={selectedRoomCategory.images?.[0] || hotel.images?.[0] || FALLBACK_IMAGE}
                          alt={selectedRoomCategory.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-pine-800 font-bold text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Selected Accommodation</span>
                        </div>
                        <span className="text-sm sm:text-base font-black text-charcoal-950 block truncate pt-0.5">
                          {selectedRoomCategory.name}
                        </span>
                        <span className="text-xs text-charcoal-700 block truncate">
                          {selectedRoomCategory.bedType || 'Comfort Bed'} {selectedRoomCategory.view ? `· ${selectedRoomCategory.view}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-pine-800/15">
                      {/* View Hotel Photos Toggle */}
                      <button
                        type="button"
                        onClick={handleTogglePhotos}
                        aria-expanded={photosExpanded}
                        aria-controls={`hotel-photos-section-${hotel.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-pine-800 hover:text-pine-900 bg-sand-950 border border-pine-800/30 hover:border-pine-800 transition-colors flex items-center gap-1.5"
                      >
                        <Images className="w-3.5 h-3.5" />
                        <span>{photosExpanded ? 'Hide Photos' : 'View Hotel Photos'}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-pine-800 transition-transform duration-300 ${
                            photosExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={onChangeRoom}
                        aria-label="Change room category"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-charcoal-800 hover:text-pine-800 bg-sand-950 border border-sand-700 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-pine-800" />
                        <span>Change Room</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* =============================================================
                    EXPANDED HOTEL PHOTO SECTION
                    Pushes content down smoothly without clipping or layout jumps.
                    Transition: grid-rows-[0fr] -> grid-rows-[1fr]
                   ============================================================= */}
                <div
                  id={`hotel-photos-section-${hotel.id}`}
                  ref={photoSectionRef}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    photosExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-sand-700/80 bg-sand-950/40 space-y-4">
                      {/* Section Title & Tabs for 'Hotel' vs 'Your Room' */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Images className="w-4 h-4 text-pine-800" />
                          <h5 className="text-sm font-bold text-charcoal-950">
                            {hotel.name} Photo Showcase
                          </h5>
                        </div>

                        {/* Photo Group Tabs: 'Hotel' and 'Your Room' */}
                        <div className="flex items-center gap-1 bg-sand-900 border border-sand-700 rounded-xl p-1 text-xs font-bold">
                          {hotelPhotos.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActivePhotoGroup('Hotel')}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                activePhotoGroup === 'Hotel'
                                  ? 'bg-pine-800 text-sand-950 shadow-xs'
                                  : 'text-charcoal-800 hover:text-pine-800'
                              }`}
                            >
                              Hotel ({hotelPhotos.length})
                            </button>
                          )}
                          {roomPhotos.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setActivePhotoGroup('Your Room')}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                activePhotoGroup === 'Your Room'
                                  ? 'bg-pine-800 text-sand-950 shadow-xs'
                                  : 'text-charcoal-800 hover:text-pine-800'
                              }`}
                            >
                              Your Room ({roomPhotos.length})
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Photo Content */}
                      {activeGroupPhotos.length > 0 ? (
                        <div>
                          {/* Desktop Layout: Large main image on left (~60% width, 16:10) + 2-col thumbnail grid on right */}
                          <div className="hidden sm:grid sm:grid-cols-12 gap-3">
                            {/* Main large image (eagerly loaded) */}
                            <div className="sm:col-span-7">
                              <button
                                type="button"
                                onClick={() => openGalleryAt(activeGroupPhotos[0])}
                                className="w-full text-left rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-pine-800 group relative block"
                                title="Click to view full photo in gallery"
                              >
                                <ImageWithSkeleton
                                  src={activeGroupPhotos[0]}
                                  alt={`${hotel.name} showcase main view`}
                                  loading="eager"
                                  aspectClassName="aspect-[16/10]"
                                  className="rounded-2xl shadow-md group-hover:scale-102 transition-transform duration-300"
                                />
                                <div className="absolute bottom-3 left-3 bg-charcoal-950/80 backdrop-blur-md text-sand-950 text-xs font-bold px-3 py-1 rounded-full border border-sand-700/60 pointer-events-none flex items-center gap-1.5">
                                  <Eye className="w-3.5 h-3.5 text-pine-800" />
                                  <span>Click to expand gallery</span>
                                </div>
                              </button>
                            </div>

                            {/* 2-column thumbnails on the right */}
                            <div className="sm:col-span-5 grid grid-cols-2 gap-3 content-start">
                              {activeGroupPhotos.slice(1, 5).map((src, thumbIdx) => {
                                const actualIdx = thumbIdx + 1;
                                const isLastSlot = thumbIdx === 3 && activeGroupPhotos.length > 5;
                                const remainingCount = activeGroupPhotos.length - 5;

                                return (
                                  <button
                                    key={thumbIdx}
                                    type="button"
                                    onClick={() => openGalleryAt(src)}
                                    className="relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-pine-800 group text-left block"
                                    title={`View photo ${actualIdx + 1}`}
                                  >
                                    <ImageWithSkeleton
                                      src={src}
                                      alt={`${hotel.name} thumbnail ${actualIdx + 1}`}
                                      loading="lazy"
                                      aspectClassName="aspect-[16/10]"
                                      className="rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {isLastSlot && remainingCount > 0 && (
                                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-sand-100 font-black text-sm sm:text-base rounded-xl transition-all group-hover:bg-black/75">
                                        <span>+{remainingCount}</span>
                                        <span className="text-[10px] font-semibold text-sand-300">More</span>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mobile Layout: Large main image on top (16:10) + horizontally scrollable snap thumbnail strip underneath */}
                          <div className="block sm:hidden space-y-3">
                            <button
                              type="button"
                              onClick={() => openGalleryAt(activeGroupPhotos[0])}
                              className="w-full text-left rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-pine-800 group relative block"
                            >
                              <ImageWithSkeleton
                                src={activeGroupPhotos[0]}
                                alt={`${hotel.name} mobile main view`}
                                loading="eager"
                                aspectClassName="aspect-[16/10]"
                                className="rounded-2xl shadow-md"
                              />
                              <div className="absolute bottom-2.5 right-2.5 bg-charcoal-950/80 backdrop-blur-md text-sand-950 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sand-700/60 pointer-events-none">
                                Tap to view full photos
                              </div>
                            </button>

                            {/* Snap-scrolling thumbnail strip */}
                            {activeGroupPhotos.length > 1 && (
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth -mx-1 px-1">
                                {activeGroupPhotos.slice(1).map((src, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => openGalleryAt(src)}
                                    className="snap-start shrink-0 w-28 rounded-xl overflow-hidden border border-sand-700 focus:outline-none focus:ring-2 focus:ring-pine-800"
                                  >
                                    <ImageWithSkeleton
                                      src={src}
                                      alt={`${hotel.name} mobile thumb ${idx + 2}`}
                                      loading="lazy"
                                      aspectClassName="aspect-[16/10]"
                                      className="rounded-xl"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Graceful empty state placeholder */
                        <div className="p-8 rounded-2xl bg-sand-900/60 border border-sand-700 text-center space-y-2">
                          <Images className="w-8 h-8 text-pine-800/60 mx-auto" />
                          <h6 className="text-sm font-bold text-charcoal-900">Photos coming soon</h6>
                          <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
                            High-resolution gallery photos for this section are being curated by our expedition team.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Room Categories Section */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs uppercase font-bold tracking-wider text-charcoal-700">
                      Available Room Categories ({roomCount})
                    </h5>
                    <span className="text-[11px] text-pine-800 font-semibold">
                      Select one room category to reserve
                    </span>
                  </div>

                  {roomCount > 0 ? (
                    <div
                      role="radiogroup"
                      aria-label={`Room categories for ${hotel.name}`}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {roomCategories.map((cat) => (
                        <RoomCategoryCard
                          key={cat.id}
                          category={cat}
                          hotelName={hotel.name}
                          isSelected={selectedRoomCategory?.id === cat.id}
                          onSelect={(c) => onSelectRoomCategory(c, hotel)}
                          onChangeRoom={onChangeRoom}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Graceful fallback if no room categories exist for this hotel */
                    <div className="p-6 rounded-2xl bg-sand-950 border border-sand-700 text-center space-y-3">
                      <Hotel className="w-8 h-8 text-pine-800 mx-auto" />
                      <h6 className="text-sm font-bold text-charcoal-900">Standard Lodge Accommodation</h6>
                      <p className="text-xs text-charcoal-700 max-w-md mx-auto">
                        This wilderness resort includes standard luxury tent and cottage accommodation with attached bath and amenities.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectRoomCategory(
                            {
                              id: `${hotel.id}-standard`,
                              name: 'Standard Wilderness Room',
                              bedType: '1 King / Double Bed',
                              roomSize: 'Standard',
                              view: 'Wilderness View',
                              images: hotel.images,
                            },
                            hotel
                          )
                        }
                        className="px-5 py-2 rounded-xl bg-pine-800 text-sand-950 font-bold text-xs shadow-md"
                      >
                        Select Standard Accommodation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // State B: Unselected Hotel Cards (Initial state with all hotels visible, no rooms)
          const isExiting = exitingHotelId && exitingHotelId !== hotel.id;

          return (
            <div
              key={hotel.id}
              ref={index === 0 ? firstCardRef : undefined}
              aria-expanded="false"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelectHotelClick(hotel);
                }
              }}
              onClick={() => handleSelectHotelClick(hotel)}
              className={`glass-panel rounded-3xl border border-sand-700/80 hover:border-sand-600 bg-sand-900/50 hover:shadow-lg flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-pine-800/60 ${
                isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 animate-fadeIn'
              }`}
            >
              <div>
                {/* Thumbnail Carousel */}
                <ResortImageCarousel
                  images={hotel.images}
                  name={hotel.name}
                  onOpenDetails={() => onOpenHotelDetails(hotel)}
                />

                {/* Card Info Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-charcoal-950 leading-snug">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                      <p className="text-xs text-pine-800 font-medium truncate">
                        {hotel.tagline || hotel.address}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address || tourLocation}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-pine-800 hover:text-pine-700 hover:underline font-semibold"
                        title="Open Location on Google Maps"
                      >
                        <MapPin className="w-3 h-3 text-pine-800 shrink-0" />
                        <span>Location</span>
                      </a>
                    </div>
                  </div>

                  {hotel.description && (
                    <p className="text-xs text-charcoal-700 font-normal leading-relaxed line-clamp-2">
                      {hotel.description}
                    </p>
                  )}

                  {/* Top Amenities */}
                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hotel.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-sand-950 border border-sand-700 text-charcoal-800 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {roomCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-pine-800/10 border border-pine-800/20 text-pine-800 font-bold">
                          {roomCount} {roomCount === 1 ? 'Room Category' : 'Room Categories'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2.5 border-t border-sand-700/60 mt-3 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenHotelDetails(hotel);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-charcoal-900 hover:text-pine-800 hover:bg-sand-800 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Photos</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotelClick(hotel);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sand-950 hover:bg-pine-800 hover:text-sand-950 text-charcoal-900 border border-sand-700 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Select Resort</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Gallery Modal Portal */}
      {selectedHotel && (
        <FullGalleryModal
          isOpen={galleryModalOpen}
          onClose={() => setGalleryModalOpen(false)}
          items={combinedGalleryItems}
          initialIndex={galleryStartIndex}
          hotelName={selectedHotel.name}
          roomName={selectedRoomCategory?.name || ''}
          triggerElementRef={toggleButtonRef}
        />
      )}
    </section>
  );
}
