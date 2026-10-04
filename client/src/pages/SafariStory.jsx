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
    window.scrollTo(0, 0);
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
        Initializing safari story...
      </div>
    );
  }

  const isGir = slug?.includes('gir');
  const isJawai = slug?.includes('jawai');
  const isPench = slug?.includes('pench');
  const isKanha = slug?.includes('kanha');
  const isBandhavgarh = slug?.includes('bandhavgarh');
  const isTadoba = slug?.includes('tadoba');
  const isDeer = slug?.includes('deer') || slug?.includes('velavadar');
  const isCorbett = slug?.includes('corbett');
  const isChitwan = slug?.includes('chitwan') || slug?.includes('rhino');
  const isTiger = slug?.includes('tiger') || slug?.includes('ranthambore') || slug?.includes('panna') || slug?.includes('sanjay');

  const storyData = isGir
    ? {
        animalName: 'Asiatic Lion',
        tagline: 'The Last Monarchs of Gir Sanctuary',
        photo: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=2400&q=85',
        highlights: [
          'Track wild Asiatic Lion prides in Gir’s dry deciduous teak forests',
          'Photograph leopards, spotted deer, chinkara antelopes & 300+ bird species',
          'Exclusive open-top 4x4 safari access with expert native trackers'
        ],
        bestSeason: 'November – April (Optimal Daylight & High Wildlife Movement)'
      }
    : isJawai
    ? {
        animalName: 'Jawai Leopard',
        tagline: 'The Granite Hill Predators of Rajasthan',
        photo: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=2400&q=85',
        highlights: [
          'Track wild leopards roaming ancient granite rock formations and cave shelters',
          'Photograph crocodiles, flamingos, migratory birds & wildlife around Jawai Dam',
          'Exclusive open 4x4 gypsies with experienced local trackers and naturalist guides'
        ],
        bestSeason: 'October – April (Pleasant Weather & Excellent Leopard Sightings)'
      }
    : isPench
    ? {
        animalName: 'Pench Leopard & Royal Bengal Tiger',
        tagline: 'The Legendary Mowgli Wilderness of Pench',
        photo: '/pench-safari.jpg',
        highlights: [
          'Photograph tree-dwelling leopards and Bengal tigers in teak forest canopies',
          'Track wild dholes (Asiatic wild dogs), sloth bears, and gaur herds',
          'Experience open 4x4 safari drives across Turia and Touriya buffer zones'
        ],
        bestSeason: 'October – May (Optimal Teak Forest Lighting & Waterhole Activity)'
      }
    : isKanha
    ? {
        animalName: 'Royal Bengal Tiger & Hardground Barasingha',
        tagline: 'The Sal Meadows & Bamboo Forest Wilderness of Kanha',
        photo: '/kanha-safari.png',
        highlights: [
          'Track dominant Bengal Tigers across open sal meadows and bamboo groves',
          'Photograph rare southern hardground Barasingha swamp deer and Indian Gaurs',
          'Exclusive morning & evening 4x4 safaris in Mukki and Kanha central zones'
        ],
        bestSeason: 'October – May (Optimal Daylight & High Meadow Activity)'
      }
    : isBandhavgarh
    ? {
        animalName: 'Royal Bengal Tiger',
        tagline: 'The Ancient Fort & High-Density Tiger Realm of Bandhavgarh',
        photo: '/bandhavgarh-safari.png',
        highlights: [
          'Track dominant territorial tigers across Tala, Magdhi, and Khitauli zones',
          'Photograph tigers resting against ancient sandstone cliffs and fort ruins',
          'Expert native trackers trained in alarm call triangulation and behavioral anticipation'
        ],
        bestSeason: 'October – June (Peak Tiger Movements & Crisp Morning Light)'
      }
    : isTadoba
    ? {
        animalName: 'Royal Bengal Tiger & Sloth Bear',
        tagline: 'The Teak, Bamboo & Waterhole Wilderness of Tadoba',
        photo: '/tadoba-safari.jpg',
        highlights: [
          'Photograph tigers and sloth bears patrolling natural waterholes and lakes',
          'Track wildlife across dense teak forests and bamboo groves in Moharli & Kolara',
          'Prime positions for predator interactions and golden hour reflection photography'
        ],
        bestSeason: 'October – June (Peak Waterhole Activity & Dry Season Clarity)'
      }
    : isDeer
    ? {
        animalName: 'Blackbuck Antelope & Indian Wolf',
        tagline: 'The Golden Savanna Dwellers of Velavadar',
        photo: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=2400&q=85',
        highlights: [
          'Photograph high-speed sprinting and leaping blackbuck antelopes in open grasslands',
          'Track elusive Indian grey wolves, striped hyenas, and jungle cats',
          'Capture one of the world’s largest harrier roosts during golden hour'
        ],
        bestSeason: 'November – March (Pleasant Grassland Climate & High Harrier Roost Activity)'
      }
    : isCorbett
    ? {
        animalName: 'Spotted Deer & Royal Bengal Tiger',
        tagline: 'The Himalayan Foothills & Sal Forest Wilderness of Jim Corbett',
        photo: '/corbett-safari.png',
        highlights: [
          'Photograph wild Asiatic elephant herds and tigers along the Ramganga river',
          'Explore the iconic Dhikala and Bijrani grasslands framed by Himalayan foothills',
          'Observe rare gharials, otters, and over 600 species of Himalayan birds'
        ],
        bestSeason: 'November – June (Dhikala Zone Open & Peak Riverbed Wildlife Movements)'
      }
    : isChitwan
    ? {
        animalName: 'Greater One-Horned Rhinoceros',
        tagline: 'The Prehistoric Grassland Giants of Chitwan',
        photo: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=2400&q=85',
        highlights: [
          'Track greater one-horned rhinoceroses across tall elephant grass and wetlands',
          'Float along Rapti River to photograph mugger crocodiles, gharials & kingfishers',
          'Jeep safaris and guided jungle tracking through dense sub-tropical sal forests'
        ],
        bestSeason: 'October – March (Clear Himalayan Views & Ideal Wetland Wildlife Activity)'
      }
    : {
        animalName: 'Royal Bengal Tiger',
        tagline: 'The Apex Monarch of Indian Forests',
        photo: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=2400&q=85',
        highlights: [
          'High-Density Territorial Tiger Tracking with Veteran Native Trackers',
          'Sambar & Spotted Deer Alarm Call Triangulation in Deep Forest Trails',
          'Golden Hour Waterhole & Forest River Crossing Encounters'
        ],
        bestSeason: 'October – May (Crisp Morning Light & High Waterhole Activity)'
      };

  return (
    <div className="bg-sand-gradient text-charcoal-900 min-h-screen selection:bg-pine-800 selection:text-sand-950 overflow-x-hidden">
      
      {/* 1. FULL-SCREEN 100VW x 100VH CINEMATIC PHOTO HERO */}
      <div ref={storyTrackRef} className="relative h-screen bg-black">
        
        {/* FULLSCREEN VIEWPORT */}
        <div className="relative h-screen w-screen overflow-hidden bg-black z-10">
          
          {/* 100vw x 100vh Full-Screen Background Photo */}
          <motion.div
            style={{ scale: bgScale, opacity: bgOpacity }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <img
              src={storyData.photo}
              alt={storyData.animalName}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=2400&q=85';
              }}
              className="w-full h-full object-cover object-center filter contrast-105"
            />
          </motion.div>

          {/* Cinematic Dark Gradient Overlay (Preserves full animal visibility, zero white wash) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/75 z-0 pointer-events-none" />

          {/* Floating Overlaid Hero Title */}
          <motion.div
            style={{ opacity: heroTitleOpacity, y: heroTitleY }}
            className="relative z-10 max-w-5xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center space-y-5 pointer-events-none pt-8"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-sand-950 tracking-tight uppercase leading-none drop-shadow-2xl">
              {tour?.title || storyData.animalName}
            </h1>

            <p className="text-lg sm:text-xl text-sand-900 font-mono tracking-wide drop-shadow-lg">
              {storyData.tagline}
            </p>

            <div className="pt-6 flex flex-col items-center gap-2 text-xs font-mono text-sand-900">
              <ChevronDown className="w-5 h-5 text-sand-950 animate-bounce" />
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

          {/* Gir National Park Narrative */}
          {isGir && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-sand-700/80 space-y-4 max-w-4xl mx-auto shadow-xl bg-sand-900/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">
                <Sparkles className="w-4 h-4 text-pine-800" />
                <span>The Sanctuary Narrative</span>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-charcoal-800 leading-relaxed font-normal">
                <p>
                  Gir National Park, located in Gujarat, is the <strong className="text-charcoal-950 font-bold">last natural home of the Asiatic Lion</strong> and one of India’s most iconic wildlife destinations. Its dry deciduous forests, grasslands, rocky hills, and seasonal rivers create a unique habitat for a remarkable variety of wildlife.
                </p>
                <p>
                  Along with Asiatic lions, Gir is home to <strong className="text-charcoal-950 font-bold">leopards, chital, sambar, nilgai, wild boar, striped hyenas, crocodiles, and numerous bird species</strong>. The changing landscapes and rich biodiversity make every safari different.
                </p>
                <p>
                  Gir is famous not only for its lions but for the experience of exploring a thriving wild ecosystem. For wildlife enthusiasts and photographers, it offers a rare opportunity to witness <strong className="text-charcoal-950 font-bold">Asiatic lions in their natural habitat</strong> and capture the character of Gujarat’s wilderness.
                </p>
              </div>
            </div>
          )}

          {/* Jawai Granite Hills Narrative */}
          {isJawai && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-sand-700/80 space-y-4 max-w-4xl mx-auto shadow-xl bg-sand-900/40">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">
                <Sparkles className="w-4 h-4 text-pine-800" />
                <span>The Sanctuary Narrative</span>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-charcoal-800 leading-relaxed font-normal">
                <p>
                  Jawai, located in Rajasthan, is a unique wildlife destination known for its leopards living among dramatic granite hills and rocky landscapes. Unlike dense forests, Jawai’s open terrain makes it possible to observe wildlife against a striking natural backdrop.
                </p>
                <p>
                  The region is home to <strong className="text-charcoal-950 font-bold">leopards, crocodiles, hyenas, jackals, flamingos, migratory birds, and other wildlife</strong>. Its rocky caves and hills provide natural shelter for leopards, while the surrounding grasslands and Jawai Dam support a diverse ecosystem.
                </p>
                <p>
                  Jawai is especially famous for its leopard sightings and distinctive landscape, offering photographers an experience very different from traditional forest safaris. The combination of wildlife, open terrain, local villages, and massive granite formations makes Jawai a remarkable destination for wildlife photography.
                </p>
              </div>
            </div>
          )}

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

          {/* Season Info */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sand-700 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md mx-auto">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-charcoal-900">Best Time to Visit</h3>
              <p className="text-sm font-mono text-pine-800 font-bold">{storyData.bestSeason}</p>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                Optimized for maximum daylight, clear tracking conditions, and predictable animal behavior around key water sources.
              </p>
            </div>
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
