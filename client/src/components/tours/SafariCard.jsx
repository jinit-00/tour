import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafariCard({ tour, index = 0 }) {
  const imageUrl = tour.images && tour.images[0] 
    ? tour.images[0] 
    : 'https://images.unsplash.com/photo-1516426122078-c23e76319801';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass-panel rounded-2xl overflow-hidden border border-sand-700 hover:border-pine-800/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative h-64 overflow-hidden bg-sand-900">
          <img
            src={imageUrl}
            alt={tour.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sand-900/90 via-transparent to-transparent" />
          
          {/* Duration Pill */}
          <div className="absolute top-4 left-4 bg-pine-800 text-sand-950 px-3 py-1 rounded-full text-xs font-mono font-semibold shadow-md">
            {tour.duration}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-mono">
            <MapPin className="w-3.5 h-3.5 text-pine-800 shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>

          <h3 className="text-xl font-extrabold text-charcoal-900 group-hover:text-pine-800 transition-colors line-clamp-2">
            {tour.title}
          </h3>

          <p className="text-xs text-charcoal-700 line-clamp-2 leading-relaxed font-normal">
            {tour.description}
          </p>

          <div className="pt-2 flex items-center gap-2 border-t border-sand-700/80 text-xs font-mono text-charcoal-700">
            <Calendar className="w-3.5 h-3.5 text-pine-800 shrink-0" />
            <span>{tour.duration} · Small Group Departure</span>
          </div>
        </div>
      </div>

      {/* Card Action Bar across bottom (NO PRICES) */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link
          to={`/tours/${tour.slug}/story`}
          className="w-full py-2.5 rounded-xl bg-sand-900 hover:bg-sand-850 border border-pine-800 text-charcoal-900 font-bold text-xs transition-all text-center flex items-center justify-center gap-1 shadow-sm"
        >
          <span>LEARN MORE</span>
          <ArrowRight className="w-3.5 h-3.5 text-pine-800" />
        </Link>
        <Link
          to={`/tours/${tour.slug}`}
          className="w-full py-2.5 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-md transition-all text-center flex items-center justify-center gap-1"
        >
          <span>BOOK NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
