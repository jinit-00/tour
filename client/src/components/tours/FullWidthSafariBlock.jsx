import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';

export default function FullWidthSafariBlock({ tour, index = 0 }) {
  const imageUrl = tour.images && tour.images[0] 
    ? tour.images[0] 
    : 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d';

  return (
    <section 
      className="w-full min-h-[80vh] md:min-h-[90vh] rounded-3xl bg-block-sand-gradient border border-sand-700/80 hover:border-pine-800/40 transition-all duration-500 shadow-xl overflow-hidden mb-20 p-6 sm:p-10 md:p-14 relative flex flex-col justify-between group"
    >
      {/* Ambient Sand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sand-900/40 via-sand-800/30 to-sand-700/40 pointer-events-none" />

      {/* TOP HEADER ROW: Metadata & Location (NO PRICES) */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-pine-800 text-sand-950 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase shadow-md">
              {tour.duration}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-mono">
              <MapPin className="w-4 h-4 text-pine-800 shrink-0" />
              <span>{tour.location}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal-500 font-bold">
            Expedition 0{index + 1}
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-charcoal-900 tracking-tight uppercase leading-tight group-hover:text-pine-800 transition-colors">
          {tour.title}
        </h2>

        <p className="text-sm sm:text-base text-charcoal-700 max-w-3xl font-normal leading-relaxed">
          {tour.description}
        </p>
      </div>

      {/* CENTER: HIGH-QUALITY ANIMAL PHOTOGRAPHY ON SAND CONTAINER */}
      <div className="relative z-10 my-8 h-[45vh] sm:h-[55vh] md:h-[62vh] w-full bg-sand-900/90 rounded-2xl overflow-hidden flex items-center justify-center border border-sand-700/80 shadow-lg">
        <img
          src={imageUrl}
          alt={tour.title}
          loading="lazy"
          className="max-h-full max-w-full w-auto h-auto object-contain filter contrast-105 drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* BOTTOM FOOTER & FULL-WIDTH DUAL ACTION BAR (NO PRICES) */}
      <div className="relative z-10 pt-4 border-t border-sand-700/80 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-charcoal-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pine-800" />
            <span className="font-semibold">{tour.duration} · {tour.location}</span>
          </div>
          <p className="text-xs text-charcoal-600 font-mono hidden sm:block">
            🛡️ Small group departure • Max 6 photographers
          </p>
        </div>

        {/* Full-Width Dual Action Bar Across Container Bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LEARN MORE - Secondary Button */}
          <Link
            to={`/tours/${tour.slug}/story`}
            className="w-full py-4 rounded-xl bg-sand-900 hover:bg-sand-850 border border-pine-800 text-charcoal-900 font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 group/btn shadow-md"
          >
            <span>LEARN MORE</span>
            <ArrowRight className="w-4 h-4 text-pine-800 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          {/* BOOK NOW - Primary Dark Pine CTA Button */}
          <Link
            to={`/tours/${tour.slug}`}
            className="w-full py-4 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-black text-sm tracking-wider uppercase shadow-2xl transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>BOOK NOW</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
