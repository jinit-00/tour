import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, ArrowRight, Users, ShieldCheck } from 'lucide-react';
import heroBgImg from '../assets/hero-bg.jpg';

export default function Home() {
  // Hero Parallax setup using Framer Motion useScroll and useTransform
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0.3]);

  return (
    <div className="overflow-hidden bg-sand-gradient">
      {/* 1. Full-Bleed Parallax Hero Section */}
      <section className="relative h-screen min-h-[700px] sm:min-h-[800px] flex items-end justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroBgImg}
            alt="JungleE Wildlife Expeditions"
            className="w-full h-full object-cover scale-105 object-center"
          />
          {/* Subtle Contrast & Vignette Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/20 via-transparent to-sand-900/70" />
        </motion.div>

        {/* Hero CTA Actions */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pb-12 sm:pb-16 flex flex-col items-center justify-end w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/tours"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-base shadow-2xl transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
            >
              <span>Explore Expeditions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/gallery"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border border-pine-800/40 text-charcoal-900 font-bold text-base transition-all text-center shadow-md hover:bg-sand-900 backdrop-blur-md"
            >
              View Field Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. Why Choose JungleE Section */}
      <section className="py-24 relative bg-sand-900/80 border-y border-sand-700 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="text-center space-y-3 mb-16"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">The JungleE Difference</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900">Wildlife, Done Differently</h2>
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
              <h3 className="text-xl font-bold text-charcoal-900">Small Groups. Better Experiences.</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                We keep departures intentionally small, giving you more space, flexibility and meaningful time in the wild.
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
              <h3 className="text-xl font-bold text-charcoal-900">Curated From Start to Finish</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                Handpicked stays, expert guides, thoughtful safari planning and seamless logistics — every detail is built around the experience.
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
              <h3 className="text-xl font-bold text-charcoal-900">Wildlife With Purpose</h3>
              <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
                Ethical, responsible and conservation-led. No baiting, no intrusion — just genuine encounters with wildlife in its natural habitat.
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
