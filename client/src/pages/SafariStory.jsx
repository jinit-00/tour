import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Camera, ShieldCheck, Sun, Compass, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { getTourDetail } from '../services/api';

export default function SafariStory() {
  const { slug } = useParams();
  const shouldReduceMotion = useReducedMotion();
  
  // Track ref for the compact 135vh scroll container
  const storyTrackRef = useRef(null);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. FORCE ABSOLUTE TOP SCROLL POSITION ON ROUTE MOUNT & PREVENT BROWSER SCROLL RESTORATION SHIFTS
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    getTourDetail(slug)
      .then((res) => setTour(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        // Force scroll top once data is ready
        setTimeout(() => window.scrollTo(0, 0), 10);
      });
  }, [slug]);

  // 2. FULL-SCREEN 100VW x 100VH CINEMATIC SCROLL ENGINE (135vh track ref)
  const { scrollYProgress } = useScroll({
    target: storyTrackRef,
    offset: ["start start", "end end"]
  });

  // Full-Screen Image Zooming/Transforming: scale 1.0 -> 1.18 over initial [0.0 -> 0.50] scroll progress
  const bgScale = useTransform(scrollYProgress, [0.0, 0.50], shouldReduceMotion ? [1, 1] : [1.0, 1.18]);
  const bgOpacity = useTransform(scrollYProgress, [0.45, 0.70], [1, 0.45]);

  // Overlaid Title text fades out as user scrolls
  const heroTitleOpacity = useTransform(scrollYProgress, [0.0, 0.22], [1, 0]);
  const heroTitleY = useTransform(scrollYProgress, [0.0, 0.22], [0, -35]);

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

  const isTiger = slug.includes('tiger') || slug.includes('ranthambore');
  const isRhino = slug.includes('rhino') || slug.includes('kruger');
  const isLion = slug.includes('lion') || slug.includes('serengeti');

  const storyData = isTiger
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
        accommodation: 'Heritage Jungle Lodge with Private Plunge Pools & Naturalist Library',
        activities: [
          'Exclusive Low-Seat Maruti Gypsy Safari Access',
          'Banyan Ruins & Fortress Overlook Landscape Shoots',
          'Macro & Bird Photography Workshops in Wetland Zones'
        ]
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
        accommodation: 'Sabie River Eco-Lodge with Timber Decks Overlooking Riverbeds',
        activities: [
          'Open 4x4 Tracking & Ranger Bush Walking Safaris',
          'Thermal Imaging Night Patrol Access alongside Anti-Poaching Rangers',
          'Wildlife Telephoto Pan & Action Framing Tutorials'
        ]
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
        accommodation: 'Luxury Canvas Tented Camp with Private Decks & Solar Power',
        activities: [
          'Sunrise & Sunset 4x4 Game Drives with Swivel Lens Mounts',
          'Midday Lightroom & Photoshop Post-Processing Workshops',
          'Evening Fireside Portfolio Critiques Under Starry Skies'
        ]
      };

  return (
    <div className="bg-sand-gradient text-charcoal-900 min-h-screen selection:bg-pine-800 selection:text-sand-950 overflow-x-hidden pt-16">
      
      {/* 1. FULL-SCREEN 100VW x 100VH CINEMATIC PHOTO HERO & SCROLL TRACK (135vh height) */}
      <div ref={storyTrackRef} className="relative h-[135vh] bg-sand-900">
        
        {/* STICKY FULLSCREEN VIEWPORT (100vw x 100vh) */}
        <div className="sticky top-0 h-screen w-screen overflow-hidden bg-sand-900 z-10">
          
          {/* 100vw x 100vh Full-Screen Background Photo scaling subtly as user scrolls */}
          <motion.div
            style={{ scale: bgScale, opacity: bgOpacity }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <img
              src={storyData.photo}
              alt={storyData.animalName}
              className="w-full h-full object-cover filter contrast-105"
            />
          </motion.div>

          {/* Sand/Charcoal Overlay Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/80 via-charcoal-900/30 to-sand-800 z-0 pointer-events-none" />

          {/* Floating Overlaid Hero Title */}
          <motion.div
            style={{ opacity: heroTitleOpacity, y: heroTitleY }}
            className="relative z-10 max-w-5xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center space-y-5 pointer-events-none pt-12"
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

            <div className="pt-8 flex flex-col items-center gap-2 text-xs font-mono text-sand-900">
              <span>SCROLL DOWN — PHOTO TRANSFORMS INTO STORY</span>
              <ChevronDown className="w-5 h-5 text-sand-950 animate-bounce" />
            </div>
          </motion.div>

          {/* Phase 1 Completion Overlay (Fades in as scale completes) */}
          <motion.div
            style={{ opacity: completionOverlayOpacity, y: completionOverlayY }}
            className="absolute bottom-8 left-4 right-4 sm:left-12 sm:right-12 z-20 glass-panel p-5 sm:p-6 rounded-2xl border border-pine-800/40 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto pointer-events-none"
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

      {/* 2. REVEALED SAFARI SPECIFICATIONS (NO PRICES DISPLAYED) */}
      <section className="relative py-20 bg-sand-gradient border-t border-sand-700 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Specifications</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900">
              Expedition Overview
            </h2>
            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal">
              {tour?.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-sand-700 max-w-lg mx-auto">
              <div className="glass-panel p-4 rounded-xl border border-sand-700 text-center">
                <MapPin className="w-4 h-4 text-pine-800 mx-auto mb-1" />
                <span className="text-[10px] font-mono text-charcoal-600 uppercase block">Location</span>
                <p className="text-xs font-bold text-charcoal-900">{tour?.location}</p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-sand-700 text-center">
                <Calendar className="w-4 h-4 text-pine-800 mx-auto mb-1" />
                <span className="text-[10px] font-mono text-charcoal-600 uppercase block">Duration</span>
                <p className="text-xs font-bold text-charcoal-900">{tour?.duration}</p>
              </div>
            </div>
          </div>

          {/* SAFARI HIGHLIGHTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">Wildlife Highlights</h3>
              <ul className="space-y-2 text-xs text-charcoal-700 leading-relaxed font-normal">
                {storyData.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">Best Time to Visit</h3>
              <p className="text-sm font-mono text-pine-800 font-bold">{storyData.bestSeason}</p>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                Optimized for maximum daylight, clear tracking conditions, and predictable animal behavior around key water sources.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">Luxury Lodging</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">{storyData.accommodation}</p>
              <p className="text-[11px] text-charcoal-600 font-mono">
                ✓ 24/7 Power Charging Stations for Camera Batteries & Laptops.
              </p>
            </div>
          </div>

          {/* Daily Field Activities */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 space-y-6">
            <h3 className="text-2xl font-bold text-charcoal-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-pine-800" />
              <span>Safari Activities & Photography Workshops</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storyData.activities.map((act, idx) => (
                <div key={idx} className="p-4 bg-sand-900/80 rounded-xl border border-sand-700 space-y-2">
                  <span className="text-[10px] font-mono text-pine-800 uppercase font-bold">Activity 0{idx + 1}</span>
                  <p className="text-xs font-semibold text-charcoal-900">{act}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. FINAL PROMINENT BOOK NOW CTA (NO PRICES DISPLAYED) */}
      <section className="py-24 bg-sand-gradient relative border-t border-sand-700 z-30">
        <div className="max-w-4xl mx-auto px-4 text-center glass-panel p-12 sm:p-16 rounded-3xl border-2 border-pine-800/40 shadow-2xl space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Secure Your Departure</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900">
              Ready to Join the {storyData.animalName} Expedition?
            </h2>
            <p className="text-sm text-charcoal-700 max-w-lg mx-auto font-normal">
              Limited to 6 photographers per departure for maximum vehicle access and personalized photo instruction.
            </p>
          </div>

          <div className="inline-flex items-center justify-center gap-6 bg-sand-900 px-8 py-4 rounded-2xl border border-sand-700">
            <div className="text-center">
              <span className="text-[10px] font-mono text-charcoal-600 uppercase block">Expedition Length</span>
              <span className="text-base font-bold text-charcoal-900">{tour?.duration} · {tour?.location}</span>
            </div>
          </div>

          <div>
            <Link
              to={`/tours/${tour?.slug}`}
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-black text-lg shadow-2xl transition-all hover:scale-105"
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
