import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTours } from '../services/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import FullWidthSafariBlock from '../components/tours/FullWidthSafariBlock';

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero Parallax setup using Framer Motion useScroll and useTransform
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0.3]);

  useEffect(() => {
    getTours()
      .then((res) => {
        // Sort safaris in exact requested order: Tiger -> Rhino -> Lion
        const sorted = [...res.data].sort((a, b) => {
          const order = { 'ranthambore-tiger-safari': 1, 'kruger-rhino-safari': 2, 'serengeti-lion-safari': 3 };
          return (order[a.slug] || 99) - (order[b.slug] || 99);
        });
        setTours(sorted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden bg-sand-gradient">
      {/* 1. Full-Bleed Parallax Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=90"
            alt="Wilderness Savannah"
            className="w-full h-full object-cover scale-110"
          />
          {/* Subtle Sand Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-sand-900/80 via-sand-800/60 to-sand-800/95" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pine-800 text-sand-950 text-xs font-mono tracking-widest uppercase shadow-xl"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>World-Class Wildlife Photography Expeditions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal-900 tracking-tight leading-[1.1]"
          >
            Untamed Frontiers. <br />
            <span className="text-pine-800">
              Unrivaled Masterclasses.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-charcoal-800 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Step beyond conventional tourism into Earth’s most sacred wilderness habitats. Guided by award-winning wildlife photographers in exclusive small groups.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/tours"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-base shadow-2xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Expeditions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/gallery"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border border-pine-800/40 text-charcoal-900 font-bold text-base transition-all text-center shadow-md hover:bg-sand-900"
            >
              View Field Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED EXPEDITIONS: 3 LARGE FULL-PAGE-WIDTH HORIZONTAL BLOCKS */}
      <section className="py-24 relative bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 mb-20"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Curated Signature Safaris</p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-900 uppercase tracking-tight">
              Featured Expeditions
            </h2>
            <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto font-normal">
              Immersive small-group photography safaris led by world-class naturalists. Choose your expedition to begin.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-charcoal-700 font-mono">Loading full-width safaris...</div>
          ) : (
            <div className="space-y-16">
              {tours.map((tour, idx) => (
                <FullWidthSafariBlock key={tour.id} tour={tour} index={idx} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 3. Why Choose Silvan Section */}
      <section className="py-24 relative bg-sand-900/80 border-y border-sand-700 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="text-center space-y-3 mb-16"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">The Silvan Difference</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900">Designed for Serious Photographers</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 rounded-2xl space-y-4 border border-sand-700"
            >
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">Small Group Priority</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                Strict limits of 4 to 6 guests per departure. Everyone gets a window seat and dedicated swivel lens mounts in open-top 4x4s.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl space-y-4 border border-sand-700"
            >
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">Pro Lens & Gear Support</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                Don't fly with heavy 600mm primes? Rent top-tier super-telephoto lenses, carbon fiber tripods, and gimbal heads directly at basecamp.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-8 rounded-2xl space-y-4 border border-sand-700"
            >
              <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900">100% Ethical Wildlife Focus</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                Zero baiting or territorial intrusion. We work alongside native park rangers to support local anti-poaching and habitat conservation.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="py-20 relative overflow-hidden bg-transparent">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10 glass-panel p-12 rounded-3xl border border-sand-700 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900">
            Ready to Capture Your Lifetime Wildlife Shot?
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto font-normal">
            Our 2026/2027 expedition slots fill quickly due to small group size constraints. Secure your seat today.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-base shadow-2xl transition-all"
          >
            <span>Browse All Safaris</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
