import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourDetail } from '../services/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Camera, ShieldCheck, Sun, ArrowRight, ChevronDown, 
  MapPin, CheckCircle2, Sparkles 
} from 'lucide-react';

export default function SafariStory() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTourDetail(slug)
      .then((res) => setTour(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Framer Motion Scroll Progress for Fullscreen Story Track
  const storyTrackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: storyTrackRef,
    offset: ['start start', 'end start']
  });

  // Phase 1: Full-Screen Background Zoom & Opacity Fade
  const bgScale = useTransform(scrollYProgress, [0, 0.45], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1, 0.85]);
  
  // Floating Title Parallax
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  // Story Unlocked Indicator overlay
  const completionOverlayOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const completionOverlayY = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-gradient flex items-center justify-center text-charcoal-700 font-mono">
        Initializing full-screen cinematic safari...
      </div>
    );
  }

  const isGir = slug.includes('gir');
  const isTiger = slug.includes('tiger') || slug.includes('ranthambore');
  const isRhino = slug.includes('rhino') || slug.includes('kruger');

  const storyData = isGir
    ? {
        animalName: 'Asiatic Lion',
        tagline: 'The Last Monarchs of Gir Sanctuary',
        photo: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=2400&q=90',
        highlights: [
          'Track wild Asiatic Lion prides in Gir’s dry deciduous teak forests',
          'Photograph leopards, spotted deer, chinkara antelopes & 300+ bird species',
          'Exclusive open-top 4x4 safari access with expert native trackers'
        ],
        bestSeason: 'November – April (Optimal Daylight & High Wildlife Movement)'
      }
    : isTiger
    ? {
        animalName: 'Royal Bengal Tiger',
        tagline: 'The Shadow Prowler of Ranthambore',
        photo: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2400&q=90',
        highlights: [
          'High-Density Territorial Tigress Tracking Near Banyan Ruins',
          'Sambar & Axis Deer Alarm Call Tracking in Bamboo Thickets',
          'Lake-Side Golden Hour Water Sightings'
        ],
        bestSeason: 'October – April (Crisp Morning Light & Waterhole Sightings)',
        accommodation: 'Heritage Jungle Lodge with Private Plunge Pools & Naturalist Library'
      }
    : isRhino
    ? {
        animalName: 'White & Black Rhino',
        tagline: 'The Prehistoric Giants of Greater Kruger',
        photo: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=2400&q=90',
        highlights: [
          'White & Black Rhino Tracking in Private Conservation Reserves',
          'K9 Anti-Poaching Unit Field Ride-Alongs & Satellite Collar Monitoring',
          'Sabie River Big 5 Waterhole Crossings'
        ],
        bestSeason: 'May – September (Dry Winter Season with Optimal Vegetation Clarity)',
        accommodation: 'Sabie River Eco-Lodge with Timber Decks Overlooking Riverbeds'
      }
    : {
        animalName: 'African Lion',
        tagline: 'The Apex Monarch of the Savanna',
        photo: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=2400&q=90',
        highlights: [
          'Mara River Wildebeest Crossings & Lion Ambush Dynamics',
          'Cheetah Sprint Tracking in Open Grasslands',
          'Tree-Climbing Leopard Spotting in Seronera Valley'
        ],
        bestSeason: 'July – October (Great Migration & Dry Season)',
        accommodation: 'Luxury Canvas Tented Camp with Private Decks & Solar Power'
      };

  return (
    <div className="bg-sand-gradient text-charcoal-900 min-h-screen selection:bg-pine-800 selection:text-sand-950 overflow-x-hidden">
      
      {/* 1. FULL-SCREEN 100VW x 100VH CINEMATIC PHOTO HERO & SCROLL TRACK */}
      <div ref={storyTrackRef} className="relative h-[115vh] bg-sand-900">
        
        {/* STICKY FULLSCREEN VIEWPORT (100vw x 100vh) */}
        <div className="sticky top-0 h-screen w-screen overflow-hidden bg-sand-900 z-10">
          
          {/* 100vw x 100vh Full-Screen Background Photo - Dragged Down to avoid cutting from above */}
          <motion.div
            style={{ scale: bgScale, opacity: bgOpacity }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <img
              src={storyData.photo}
              alt={storyData.animalName}
              className="w-full h-full object-cover object-[center_10%] sm:object-[center_top] filter contrast-105"
            />
          </motion.div>

          {/* Sand/Charcoal Overlay Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/80 via-charcoal-900/30 to-sand-800 z-0 pointer-events-none" />

          {/* Floating Overlaid Hero Title */}
          <motion.div
            style={{ opacity: heroTitleOpacity, y: heroTitleY }}
            className="relative z-10 max-w-5xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center space-y-5 pointer-events-none pt-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pine-800 text-sand-950 text-xs font-mono tracking-widest uppercase shadow-2xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinematic Full-Screen Photography</span>
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-sand-950 tracking-tight uppercase leading-none drop-shadow-2xl">
              {tour?.title || storyData.animalName}
            </h1>

            <p className="text-lg sm:text-xl text-sand-900 font-mono tracking-wide drop-shadow-lg">
              {storyData.tagline}
            </p>

            <div className="pt-6 flex flex-col items-center gap-2 text-xs font-mono text-sand-900">
              <span>SCROLL DOWN — PHOTO TRANSFORMS INTO STORY</span>
              <ChevronDown className="w-5 h-5 text-sand-950 animate-bounce" />
            </div>
          </motion.div>

          {/* Phase 1 Completion Overlay (Fades in as scale completes) */}
          <motion.div
            style={{ opacity: completionOverlayOpacity, y: completionOverlayY }}
            className="absolute bottom-6 left-4 right-4 sm:left-12 sm:right-12 z-20 glass-panel p-4 sm:p-5 rounded-2xl border border-pine-800/40 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto pointer-events-none"
          >
            <div className="flex items-center justify-between text-xs font-mono text-pine-800 font-bold">
              <span className="uppercase tracking-wider">{storyData.animalName} Expedition</span>
              <div className="flex items-center gap-1 text-charcoal-900 font-bold">
                <span>Scroll to explore safari experience</span>
                <ChevronDown className="w-4 h-4 text-pine-800 animate-bounce" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 2. PHASE 2: DEEP FIELD EXPEDITION DETAILS & ITINERARY (NO PRICES DISPLAYED) */}
      <section className="relative z-30 py-12 bg-sand-gradient border-t border-sand-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Dossier</span>
            <h2 className="text-3xl sm:text-4xl font-black text-charcoal-900 uppercase tracking-tight">
              Expedition Overview & Masterclass Highlights
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 font-normal">
              Designed for wildlife photographers seeking prime positioning, ethical tracking, and high-end field instruction.
            </p>
          </div>

          {/* Masterclass Key Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyData.highlights.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 sm:p-8 rounded-2xl border border-sand-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center font-mono font-bold text-sm shadow-md">
                  0{idx + 1}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-charcoal-900">{item}</h3>
              </div>
            ))}
          </div>

          {/* Season & Lodging Info */}
          <div className={`grid grid-cols-1 ${!isGir && storyData.accommodation ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-6`}>
            
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sand-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal-900">Best Time to Visit</h3>
              <p className="text-sm font-mono text-pine-800 font-bold">{storyData.bestSeason}</p>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                Optimized for maximum daylight, clear tracking conditions, and predictable animal behavior around key water sources.
              </p>
            </div>

            {!isGir && storyData.accommodation && (
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sand-700 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-charcoal-900">Luxury Safari Stay</h3>
                <p className="text-xs text-charcoal-700 leading-relaxed font-normal">{storyData.accommodation}</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. FINAL PROMINENT BOOK NOW CTA (NO PRICES DISPLAYED) */}
      <section className="py-16 bg-sand-gradient relative border-t border-sand-700 z-30">
        <div className="max-w-4xl mx-auto px-4 text-center glass-panel p-10 sm:p-14 rounded-3xl border-2 border-pine-800/40 shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Secure Your Departure</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900">
              Ready to Join the {storyData.animalName} Expedition?
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 max-w-lg mx-auto font-normal">
              Limited to 6 photographers per departure for maximum vehicle access and personalized photo instruction.
            </p>
          </div>

          <div className="inline-flex items-center justify-center gap-6 bg-sand-900 px-6 py-3 rounded-2xl border border-sand-700">
            <div className="text-center">
              <span className="text-[10px] font-mono text-charcoal-600 uppercase block">Expedition Length</span>
              <span className="text-sm sm:text-base font-bold text-charcoal-900">{tour?.duration} · {tour?.location}</span>
            </div>
          </div>

          <div>
            <Link
              to={`/tours/${tour?.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-black text-base shadow-2xl transition-all hover:scale-105"
            >
              <span>BOOK THIS SAFARI NOW</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
