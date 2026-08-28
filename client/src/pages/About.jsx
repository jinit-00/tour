import React from 'react';
import { Camera, ShieldCheck, Award, HeartHandshake, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const team = [
    {
      name: 'Dr. Marcus Vance',
      role: 'Lead Expedition Leader & Senior Naturalist',
      bio: '20+ years guiding wildlife photography expeditions across East Africa and India. National Geographic featured contributor.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Principal Photography Instructor',
      bio: 'Specialist in big-cat motion blur and telephoto low-light framing. Awarded Wildlife Photographer of the Year finalist.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kiprotich "Kip" Cheruiyot',
      role: 'Head Serengeti & Mara Master Tracker',
      bio: 'Born along the border of Maasai Mara. Decades of native experience predicting predator movement and river crossings.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Our Ethos & Story</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Guiding Serious Wildlife Photographers</h1>
        <p className="text-base text-charcoal-700 leading-relaxed font-normal">
          Silvan Tours was founded to eliminate tourist compromises. We design expeditions specifically tailored for telephoto lens positioning, patience in the field, and ethical conservation focus.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">Uncompromised Framing</h3>
          <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
            Every guest gets their own window seat and dedicated 360-degree swivel lens mount. No crowded 12-passenger vans.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">Ethical Wildlife Standard</h3>
          <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
            We operate strict zero-baiting and zero-intrusion rules. We support local anti-poaching units directly from trip proceeds.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-charcoal-900">1-on-1 Portfolio Coaching</h3>
          <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
            Daily midday Lightroom, Photoshop, and histogram critique sessions at basecamp to elevate your field technique.
          </p>
        </div>
      </div>

      {/* Team Showcase */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase text-pine-800 font-bold">Expedition Masters</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900">Meet Your Expedition Leaders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden border border-sand-700 p-6 space-y-4 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-pine-800 shadow-lg"
              />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-charcoal-900">{member.name}</h3>
                <p className="text-xs font-mono text-pine-800 font-bold">{member.role}</p>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
