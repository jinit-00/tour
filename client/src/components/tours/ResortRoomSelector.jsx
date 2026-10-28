import React, { useState, useEffect, useCallback } from 'react';
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
  RotateCcw,
  X,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80';

/**
 * Lightbox Modal for Room Category Photos
 * Allows navigating full-resolution photos of a specific room category.
 * Accessible with Escape and Arrow keys.
 * Strictly no rates or pricing rendered.
 */
function RoomCategoryLightbox({ isOpen, onClose, images = [], categoryName = '', hotelName = '', initialIndex = 0, specs = {} }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const imageList = Array.isArray(images) && images.length > 0 ? images : [FALLBACK_IMAGE];
  const total = imageList.length;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${categoryName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-sand-950/95 border border-sand-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sand-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-sand-100 truncate">
              {categoryName}
            </h4>
            <p className="text-xs text-sand-400 truncate">
              {hotelName} {specs.bedType ? `· ${specs.bedType}` : ''} {specs.roomSize ? `· ${specs.roomSize}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sand-900 border border-sand-700 text-sand-300">
              {currentIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo gallery"
              className="p-2 rounded-xl bg-sand-900 hover:bg-sand-800 text-sand-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Viewport */}
        <div className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px]">
          <img
            src={imageList[currentIndex] || FALLBACK_IMAGE}
            alt={`${categoryName} photo ${currentIndex + 1}`}
            className="w-full h-full max-h-[60vh] object-contain transition-all duration-300"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center transition-all shadow-xl active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center transition-all shadow-xl active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails strip at bottom */}
        {total > 1 && (
          <div className="p-3 bg-sand-950/90 border-t border-sand-800 flex items-center gap-2 overflow-x-auto justify-center">
            {imageList.map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Thumbnail ${idx + 1}`}
                className={`relative w-14 h-11 rounded-lg overflow-hidden border transition-all shrink-0 ${
                  currentIndex === idx
                    ? 'border-pine-800 ring-2 ring-pine-800/40 opacity-100 scale-105'
                    : 'border-sand-700/60 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgSrc || FALLBACK_IMAGE}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Image Carousel for Resort Cards
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

  const bedType = category.bedType || null;
  const roomSize = category.roomSize || null;
  const view = category.view || null;

  const openLightboxAt = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

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
      <RoomCategoryLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={imageList}
        categoryName={category.name || 'Room Category'}
        hotelName={hotelName}
        initialIndex={lightboxIndex}
        specs={{ bedType, roomSize, view }}
      />
    </>
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
  const [expandedHotelId, setExpandedHotelId] = useState(selectedHotel?.id || null);

  // Sync expanded card with selected hotel
  useEffect(() => {
    setExpandedHotelId(selectedHotel?.id || null);
  }, [selectedHotel]);

  if (!hotels || hotels.length === 0) {
    return null;
  }

  const isBothSelected = Boolean(selectedHotel && selectedRoomCategory);

  const handleResortCardClick = (hotel) => {
    if (expandedHotelId === hotel.id) {
      // If clicking already expanded resort, keep expanded
      return;
    }
    // Selecting another resort collapses the old one, sets roomCategory = null, and expands the new one
    setExpandedHotelId(hotel.id);
    onSelectHotel(hotel);
  };

  return (
    <section
      id="resort-selection-section"
      tabIndex={-1}
      className="space-y-5 scroll-mt-28 outline-none"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-charcoal-950 uppercase tracking-tight">
            Choose Your Resort & Room
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-700 pt-0.5">
            {isBothSelected
              ? 'Your accommodation has been selected. You can change your room or choose a different resort at any time.'
              : selectedHotel || expandedHotelId
              ? `Select your room category below to reserve your stay.`
              : 'Select your preferred wilderness resort below to view its available room categories.'}
          </p>
        </div>

        {/* Global Reset / Go Back Button if in expanded or selected mode */}
        {(selectedHotel || expandedHotelId) && (
          <button
            type="button"
            onClick={onGoBackToResorts}
            aria-label="Go back and choose a different resort"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-700 bg-sand-950/80 hover:bg-sand-900 text-charcoal-800 text-xs font-bold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-pine-800" />
            <span>View All Resorts</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          STATE 1: BOTH RESORT & ROOM CATEGORY SELECTED (COLLAPSED SUMMARY)
         ========================================================================= */}
      {isBothSelected ? (
        <div className="glass-panel rounded-3xl border-2 border-pine-800 bg-sand-900/90 p-5 sm:p-6 shadow-xl transition-all duration-500 ease-in-out">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            {/* Left: Thumbnail & Info */}
            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
              <div className="relative aspect-[4/3] w-24 sm:w-32 rounded-2xl overflow-hidden bg-sand-950 border border-sand-700 shadow-md shrink-0">
                <img
                  src={
                    selectedRoomCategory.images?.[0] ||
                    selectedHotel.images?.[0] ||
                    FALLBACK_IMAGE
                  }
                  alt={selectedRoomCategory.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-pine-800 text-sand-950 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Selected</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-pine-800">
                    Selected Accommodation
                  </span>
                  {selectedHotel.address && (
                    <span className="text-[10px] text-charcoal-500 font-medium">
                      · {selectedHotel.address}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-xl font-black text-charcoal-950 leading-tight truncate">
                  {selectedHotel.name}
                </h4>

                <p className="text-xs sm:text-sm font-bold text-pine-800 leading-snug truncate">
                  {selectedRoomCategory.name}
                </p>

                {/* Specs */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[11px] text-charcoal-700">
                  {selectedRoomCategory.bedType && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Bed className="w-3 h-3 text-pine-800 shrink-0" />
                      <span>{selectedRoomCategory.bedType}</span>
                    </span>
                  )}
                  {selectedRoomCategory.roomSize && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <span>•</span>
                      <Maximize2 className="w-3 h-3 text-pine-800 shrink-0" />
                      <span>{selectedRoomCategory.roomSize}</span>
                    </span>
                  )}
                  {selectedRoomCategory.view && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <span>•</span>
                      <Sparkles className="w-3 h-3 text-pine-800 shrink-0" />
                      <span>{selectedRoomCategory.view}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions (Change Room & Back to Resorts) */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end border-t md:border-t-0 border-sand-700/60 pt-3 md:pt-0">
              <button
                type="button"
                onClick={onChangeRoom}
                aria-label="Change room category only"
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-sand-950 hover:bg-pine-800 hover:text-sand-950 text-charcoal-900 border border-sand-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pine-800" />
                <span>Change Room</span>
              </button>

              <button
                type="button"
                onClick={onGoBackToResorts}
                aria-label="Go back and choose a different resort"
                className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-sand-950 hover:bg-pine-800 hover:text-sand-950 text-charcoal-900 border border-sand-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-pine-800" />
                <span>Back to Resorts</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenHotelDetails(selectedHotel)}
                title="View full resort photos & amenities"
                className="p-2 rounded-xl text-charcoal-700 hover:text-pine-800 hover:bg-sand-800/80 transition-colors shrink-0"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================================================================
          STATE 2: RESORT SELECTION & IN-PLACE EXPANDABLE CARDS
         ========================================================================= */}
      {!isBothSelected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hotels.map((hotel) => {
            const isExpanded = expandedHotelId === hotel.id;
            const roomCategories = Array.isArray(hotel.roomCategories) ? hotel.roomCategories : [];
            const roomCount = roomCategories.length;

            if (isExpanded) {
              /* =================================================================
                 EXPANDED RESORT CARD (IN PLACE)
                 ================================================================= */
              return (
                <div
                  key={hotel.id}
                  aria-expanded="true"
                  className="col-span-1 md:col-span-2 glass-panel rounded-3xl border-2 border-pine-800 bg-sand-900/95 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out"
                >
                  {/* Expanded Resort Header Banner */}
                  <div className="p-5 sm:p-6 border-b border-sand-700/80 bg-sand-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onGoBackToResorts}
                        aria-label="Go back to all resorts"
                        className="px-3 py-1.5 rounded-xl bg-sand-900 hover:bg-pine-800 hover:text-sand-950 border border-sand-700 text-charcoal-900 transition-colors shadow-xs flex items-center gap-1.5 text-xs font-bold shrink-0"
                      >
                        <ArrowLeft className="w-4 h-4 text-pine-800 group-hover:text-sand-950" />
                        <span>← Back to resorts</span>
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-lg sm:text-xl font-black text-charcoal-950 leading-tight truncate">
                          {hotel.name}
                        </h4>
                        <p className="text-xs text-pine-800 font-medium truncate">
                          {hotel.tagline || hotel.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onOpenHotelDetails(hotel)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-charcoal-900 hover:text-pine-800 bg-sand-900 hover:bg-sand-800 border border-sand-700 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-pine-800" />
                        <span>View Photos</span>
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

            /* =================================================================
               COLLAPSED RESORT CARD
               ================================================================= */
            return (
              <div
                key={hotel.id}
                aria-expanded="false"
                onClick={() => handleResortCardClick(hotel)}
                className="col-span-1 glass-panel rounded-3xl border border-sand-700/80 hover:border-sand-600 bg-sand-900/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
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
                      handleResortCardClick(hotel);
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
      )}
    </section>
  );
}
