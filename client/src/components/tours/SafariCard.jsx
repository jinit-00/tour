import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafariCard({ tour, index = 0 }) {
  const navigate = useNavigate();

  const imageUrl = tour.images && tour.images[0] 
    ? tour.images[0] 
    : 'https://images.unsplash.com/photo-1516426122078-c23e76319801';

  // Extract primary destination name (e.g. "Serengeti", "Ranthambore", "Kruger")
  const primaryTitle = tour.location ? tour.location.split(',')[0].trim() : tour.title.split(' ')[0];
  const regionLabel = tour.region || (tour.location ? tour.location.split(',')[1]?.trim() : 'WILDLIFE EXPEDITION');

  const handleCardClick = () => {
    navigate(`/tours/${tour.slug}/story`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handleCardClick}
      className="group relative min-h-[640px] rounded-[32px] overflow-hidden bg-[#141414] shadow-2xl cursor-pointer flex flex-col justify-between p-8 sm:p-10 select-none border-0"
    >
      {/* 1. Full-Card Background Wildlife Image */}
      <motion.img
        src={imageUrl}
        alt={tour.title}
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80';
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105 pointer-events-none"
      />

      {/* 2. Apple-Style Subtle Dark Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />

      {/* 3. Top-Left Headline Typography */}
      <div className="relative z-10 space-y-2 max-w-md">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-sand-900/80 font-bold block">
          {regionLabel}
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-sand-950 uppercase tracking-tight leading-[1.05] drop-shadow-lg">
          {primaryTitle}
        </h2>
        <p className="text-xs font-mono text-sand-900/70 tracking-wide font-normal pt-1">
          {tour.title}
        </p>
      </div>

      {/* 4. Bottom Row: Right 56px Circular '+' Button */}
      <div className="relative z-10 flex items-center justify-end pt-12">
        {/* Bottom-Right 56px Circular '+' Button */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-14 h-14 rounded-full bg-sand-950 text-charcoal-950 flex items-center justify-center shadow-2xl shrink-0 group-hover:bg-sand-900"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
