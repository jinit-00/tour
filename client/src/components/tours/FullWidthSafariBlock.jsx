import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function FullWidthSafariBlock({ tour, index = 0 }) {
  const imageUrl = tour.images && tour.images[0] 
    ? tour.images[0] 
    : 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d';

  return (
    <section 
      className="w-full h-[620px] sm:h-[660px] md:h-[700px] rounded-3xl bg-block-sand-gradient border border-sand-700/80 hover:border-pine-800/40 transition-all duration-500 shadow-xl overflow-hidden mb-12 p-6 sm:p-8 md:p-10 relative flex flex-col justify-between group"
    >
      {/* Ambient Sand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sand-900/40 via-sand-800/30 to-sand-700/40 pointer-events-none" />

      {/* TOP HEADER ROW: Fixed Height Header for 100% Equal Alignment */}
      <div className="relative z-10 h-32 sm:h-36 md:h-40 flex flex-col justify-start space-y-2 shrink-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-700 font-mono bg-sand-900/80 px-3.5 py-1.5 rounded-full border border-sand-700/80">
            <MapPin className="w-4 h-4 text-pine-800 shrink-0" />
            <span>{tour.location}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal-500 font-bold">
            Expedition 0{index + 1}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-charcoal-900 tracking-tight uppercase leading-tight line-clamp-1 group-hover:text-pine-800 transition-colors">
          {tour.title}
        </h2>

        <p className="text-xs sm:text-sm text-charcoal-700 max-w-3xl font-normal leading-relaxed line-clamp-2">
          {tour.description}
        </p>
      </div>

      {/* CENTER: FLEXIBLE IMAGE CONTAINER OCCUPYING EXACT EQUAL HEIGHT */}
      <div className="relative z-10 my-4 flex-1 w-full bg-sand-900/90 rounded-2xl overflow-hidden flex items-center justify-center border border-sand-700/80 shadow-lg min-h-0">
        <img
          src={imageUrl}
          alt={tour.title}
          loading="lazy"
          className="w-full h-full object-cover filter contrast-105 drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* BOTTOM FOOTER & FULL-WIDTH DUAL ACTION BAR */}
      <div className="relative z-10 pt-3 border-t border-sand-700/80 space-y-4 shrink-0">
        
        <div className="flex items-center justify-between gap-4 text-xs font-mono text-charcoal-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pine-800" />
            <span className="font-semibold">{tour.location}</span>
          </div>
        </div>

        {/* Full-Width Dual Action Bar Across Container Bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LEARN MORE - Secondary Button */}
          <Link
            to={`/tours/${tour.slug}/story`}
            className="w-full py-3.5 rounded-xl bg-sand-900 hover:bg-sand-850 border border-pine-800 text-charcoal-900 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 group/btn shadow-md"
          >
            <span>LEARN MORE</span>
            <ArrowRight className="w-4 h-4 text-pine-800 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          {/* BOOK NOW - Primary Dark Pine CTA Button */}
          <Link
            to={`/tours/${tour.slug}`}
            className="w-full py-3.5 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-black text-xs tracking-wider uppercase shadow-2xl transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>BOOK NOW</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
