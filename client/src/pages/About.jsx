import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, Camera, HeartHandshake, ShieldCheck, MapPin, 
  Users, Sparkles, ArrowRight, Eye, Leaf, CheckCircle2, 
  TreePine, Feather, Building2, Quote
} from 'lucide-react';

export default function About() {
  const whatWeDo = [
    {
      title: 'Wildlife Expeditions',
      desc: 'Multi-day journeys across some of India\'s most exciting wildlife destinations and selected international reserves.',
      icon: Compass
    },
    {
      title: 'Photography Expeditions',
      desc: 'Specially designed trips for photographers who want better field opportunities, thoughtful positioning and enough time to create meaningful images.',
      icon: Camera
    },
    {
      title: 'Guided Jungle Experiences',
      desc: 'For travellers who want to understand the forest — its animals, behaviour, ecology and stories — rather than simply see it.',
      icon: TreePine
    },
    {
      title: 'Custom Wildlife Journeys',
      desc: 'Private itineraries designed around your interests, preferred destinations, travel style and pace.',
      icon: Sparkles
    },
    {
      title: 'Family & First-Time Safaris',
      desc: 'Comfortable, well-planned wildlife experiences for travellers who may be experiencing the jungle for the first time.',
      icon: Users
    },
    {
      title: 'Conservation-Focused Travel',
      desc: 'Experiences built around responsible wildlife tourism and respect for local communities, habitats and conservation efforts.',
      icon: Leaf
    }
  ];

  const differencePillars = [
    {
      title: 'Small Groups. Better Experiences.',
      desc: 'We intentionally keep many of our departures small. Fewer people means greater flexibility, less disruption and more meaningful time in the field.'
    },
    {
      title: 'Expert-Led Experiences',
      desc: 'Our expeditions are planned with local knowledge at their core — from choosing safari zones and timing drives to understanding animal behaviour and reading the landscape.'
    },
    {
      title: 'Photography Without the Pressure',
      desc: 'Photographers can expect thoughtfully planned field time, suitable vehicles and an environment where patience matters more than ticking off sightings.'
    },
    {
      title: 'Ethical Wildlife Encounters',
      desc: 'We believe wildlife should be observed on its terms. We do not promote baiting, harassment or irresponsible wildlife interactions.'
    },
    {
      title: 'Handpicked Stays & Logistics',
      desc: 'From accommodation to safari arrangements and transfers, we focus on the details that make an expedition comfortable, seamless and memorable.'
    },
    {
      title: 'The Journey Matters',
      desc: 'We don\'t promise guaranteed sightings. We promise to put you in the right place, at the right time, with the right people — and let the wilderness do the rest.'
    }
  ];

  const destinations = [
    { name: 'Gir', region: 'Gujarat', desc: 'Asiatic lions and the dry deciduous forests of Saurashtra' },
    { name: 'Jawai', region: 'Rajasthan', desc: 'Leopards, granite kopjes and peaceful pastoral Rabari co-existence' },
    { name: 'Tadoba', region: 'Maharashtra', desc: 'One of India\'s most thrilling and tiger-dense central landscapes' },
    { name: 'Kanha', region: 'Madhya Pradesh', desc: 'Sal forests, open meadows and iconic central Indian biodiversity' },
    { name: 'Kaziranga', region: 'Assam', desc: 'Greater one-horned rhinos, wild elephants and vast Brahmaputra floodplains' },
    { name: 'Kuno', region: 'Madhya Pradesh', desc: 'A rapidly evolving grassland ecosystem and India\'s historic cheetah reintroduction' },
    { name: 'Sanjay-Dubri', region: 'Madhya Pradesh', desc: 'Wild, raw and relatively unexplored central Indian Sal woodlands' },
    { name: 'Chitwan', region: 'Nepal', desc: 'Nepal\'s iconic Terai wilderness with rhinos, tigers and elephant grass' },
    { name: 'Maasai Mara', region: 'Kenya, Africa', desc: 'Endless open savannah, apex predators and the Great Migration ecosystem' }
  ];

  const audiences = [
    'Wildlife Enthusiasts', 'Photographers', 'Families', 
    'First-Time Safari Travellers', 'Nature Lovers', 'Birdwatchers', 
    'Adventure Travellers', 'Conservation Advocates'
  ];

  const responsibleRules = [
    'No baiting or intentional disturbance',
    'No chasing or harassing animals for photographs',
    'Respect for forest regulations and park authorities',
    'Respectful behaviour around native local communities',
    'Responsible photography practices & ethical field etiquette',
    'Minimal-impact, leave-no-trace travel wherever possible',
    'Supporting local native guides, naturalists and small businesses'
  ];

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-24">
      
      {/* 1. Header / Ethos */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-pine-800 font-bold">
            About Us · Our Ethos & Story
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-charcoal-950 uppercase tracking-tight leading-tight">
            Wildlife Experiences, Curated With Purpose
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-4 text-base sm:text-lg text-charcoal-800 leading-relaxed font-normal"
        >
          <p>
            <strong className="text-charcoal-950 font-bold">JungleE Wildlife Expeditions</strong> was created for people who want more than a standard safari.
          </p>
          <p className="text-sm sm:text-base text-charcoal-700">
            We believe the best wildlife experiences are built around time, patience, expert knowledge and respect for the wild. From the forests of India to the grasslands of Africa, we create carefully curated expeditions that bring travellers closer to nature without compromising the experience or the environment.
          </p>
          <p className="text-sm sm:text-base text-charcoal-700">
            Whether you're searching for your first tiger, following a leopard through the forest, photographing wildlife at golden hour, or simply looking to disconnect from the noise of everyday life — we design the journey around the experience you want to have.
          </p>
        </motion.div>
      </section>

      {/* 2. Our Story */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 sm:p-12 rounded-3xl border border-sand-700/90 shadow-xl space-y-6 relative overflow-hidden"
      >
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Our Story</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-950">Born From a Love for the Wild</h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-charcoal-800 leading-relaxed">
          <p className="font-semibold text-charcoal-900">
            JungleE started with a simple idea: <span className="text-pine-800">Wildlife travel should feel like an expedition, not a checklist.</span>
          </p>
          <p className="text-charcoal-700">
            Too many safari experiences are built around rushing from one sighting to another, crowded vehicles, fixed itineraries and little understanding of the landscape.
          </p>
          <p className="text-charcoal-700">
            We wanted to do it differently. JungleE brings together wildlife enthusiasts, photographers, naturalists, local experts and passionate travellers to create immersive journeys where the destination itself becomes the experience.
          </p>
          <p className="text-charcoal-700">
            Our trips are designed around the rhythm of the wild — early mornings, long drives, unexpected sightings, quiet forests, dramatic landscapes and the moments that cannot be planned.
          </p>
          <div className="p-4 sm:p-6 rounded-2xl bg-sand-900/80 border border-sand-700 font-serif italic text-charcoal-900 text-base sm:text-lg">
            “Because sometimes, the most memorable part of a safari isn't the animal you came to see. It's everything that happens while you're looking for it.”
          </div>
        </div>
      </motion.section>

      {/* 3. What We Do */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">What We Do</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950">More Than Just Safari Bookings</h2>
          <p className="text-sm text-charcoal-700">
            We curate complete wildlife journeys rather than simply arranging a safari permit or hotel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeDo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-sand-700 space-y-3 hover:border-pine-800/40 transition-all hover:shadow-lg"
              >
                <div className="w-11 h-11 rounded-xl bg-pine-800 text-sand-950 flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-charcoal-950">{item.title}</h3>
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. The JungleE Difference */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">The JungleE Difference</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950">Wildlife, Done Differently</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differencePillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-sand-700 space-y-2.5 hover:border-pine-800/40 transition-all"
            >
              <div className="text-xs font-mono font-bold text-pine-800 uppercase tracking-widest">
                0{idx + 1}
              </div>
              <h3 className="text-lg font-bold text-charcoal-950">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-normal">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Our Philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 sm:p-12 rounded-3xl border border-sand-700/90 shadow-xl space-y-6"
      >
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Our Philosophy</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-950">
            We Don't Chase Wildlife. We Learn to Read It.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm sm:text-base text-charcoal-800 leading-relaxed">
            <p className="font-semibold text-charcoal-950">A forest is constantly communicating.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-charcoal-800 bg-sand-900/80 p-4 rounded-xl border border-sand-700">
              <div className="flex items-center gap-2"><span>🐾</span><span>Fresh pugmarks on a trail</span></div>
              <div className="flex items-center gap-2"><span>🦌</span><span>A sudden alarm call</span></div>
              <div className="flex items-center gap-2"><span>🌿</span><span>A movement in the grass</span></div>
              <div className="flex items-center gap-2"><span>🐦</span><span>Birds becoming unusually quiet</span></div>
              <div className="flex items-center gap-2"><span>🦚</span><span>A herd changing direction</span></div>
              <div className="flex items-center gap-2"><span>🌲</span><span>Wind shifts across the canopy</span></div>
            </div>
            <p className="text-charcoal-700">
              These small details can turn an ordinary drive into an extraordinary encounter. That's why our approach isn't simply about finding animals. It's about understanding the landscape.
            </p>
            <p className="text-charcoal-700 font-medium">
              We encourage our guests to slow down, observe and appreciate the entire ecosystem — from the smallest bird to the largest predator.
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-sand-700/90 space-y-3">
              <h4 className="text-base font-bold text-charcoal-950 flex items-center gap-2">
                <Camera className="w-4 h-4 text-pine-800" />
                <span>For Photographers</span>
              </h4>
              <h5 className="text-xs font-mono text-pine-800 font-bold uppercase">When the Experience Matters as Much as the Photograph</h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Wildlife photography is an important part of JungleE, but we don't believe a successful expedition is measured only by the number of photographs you bring home. We create conditions where photographers can work patiently and responsibly — with appropriate field time, thoughtful positioning and guides who understand that sometimes the best decision is simply to wait.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-sand-700/90 space-y-3">
              <h4 className="text-base font-bold text-charcoal-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-pine-800" />
                <span>For Everyone</span>
              </h4>
              <h5 className="text-xs font-mono text-pine-800 font-bold uppercase">You Don't Have to Be a Photographer to Belong Here</h5>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                You don't need a ₹5 lakh camera. You don't need to know the difference between a leopard and a langur. You don't even need to have been on safari before. If you're curious about wildlife and fascinated by nature, JungleE is for you.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {audiences.map((aud, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sand-900 border border-sand-700 text-charcoal-800">
                    {aud}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Responsible Wildlife Tourism */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 sm:p-12 rounded-3xl border border-pine-800/30 shadow-xl space-y-6 bg-gradient-to-br from-sand-900/90 to-sand-850/90"
      >
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pine-800" />
            <span>Responsible Wildlife Tourism</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-950">
            Leave With Memories. Leave the Forest Undisturbed.
          </h2>
        </div>

        <p className="text-sm sm:text-base text-charcoal-700 max-w-3xl">
          Wildlife tourism comes with responsibility. Our goal is to create experiences that allow people to appreciate wildlife while respecting the ecosystems and communities that make these places possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {responsibleRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-sand-950/70 border border-sand-700/80 text-xs sm:text-sm text-charcoal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-sand-700/80 text-center sm:text-left font-mono font-bold text-xs uppercase tracking-widest text-pine-800">
          🌲 The forest comes first. Always.
        </div>
      </motion.section>

      {/* 7. Destinations */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Destinations</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-950">
            From India's Jungles to Africa's Great Wilderness
          </h2>
          <p className="text-sm text-charcoal-700">
            We don't believe in selling the same safari experience everywhere. Every destination has its own personality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-sand-700 space-y-2 hover:border-pine-800/40 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-charcoal-950">{dest.name}</h3>
                <span className="text-[10px] font-mono text-pine-800 font-bold uppercase bg-sand-900 px-2 py-0.5 rounded border border-sand-700">
                  {dest.region}
                </span>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                {dest.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center font-mono text-xs text-charcoal-600 font-bold">
          ✨ And we're constantly exploring the next wilderness worth experiencing.
        </div>
      </section>

      {/* 8. The People Behind JungleE (Expedition Directors - No Photos of People) */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">
            The People Behind JungleE · Expedition Masters
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-950">
            Meet the Minds Behind JungleE
          </h2>
          <p className="text-base font-semibold text-pine-800">
            Two Architects. One Obsession With the Wild.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            JungleE Wildlife Expeditions was founded by <strong className="text-charcoal-950">Ar. Vatsal Dangi</strong> and <strong className="text-charcoal-950">Ar. Harsh Barad</strong> — two architects brought together by a shared fascination for wildlife, wilderness and the stories hidden within natural landscapes. Their professional lives are rooted in design, observation and understanding how people experience space. That same mindset naturally found its way into the jungle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ar. Vatsal Dangi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-3xl border border-sand-700 space-y-5 flex flex-col justify-between shadow-lg hover:border-pine-800/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-sand-700/80 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-charcoal-950 tracking-tight">Ar. Vatsal Dangi</h3>
                  <p className="text-xs font-mono text-pine-800 font-bold uppercase tracking-wider pt-0.5">
                    Co-Founder · Expedition Director
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sand-900 border border-sand-700 flex items-center justify-center text-pine-800 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                <p>
                  An architect by profession and wildlife enthusiast by passion, Vatsal brings a designer's eye to the wilderness.
                </p>
                <p>
                  His interest in wildlife began with photography and gradually grew into a deeper fascination with animal behaviour, habitats and the constantly changing relationship between wildlife and its environment.
                </p>
                <p>
                  At JungleE, Vatsal focuses on expedition planning, guest experience, destination research and photography-led journeys. He believes that a great wildlife experience isn't about rushing towards the next sighting — it's about being in the right place, understanding what is happening around you and having the patience to let the moment unfold.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-900/90 border border-sand-700/80 flex items-start gap-3">
              <Quote className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
              <p className="text-xs font-serif italic text-charcoal-950">
                “The best encounters are the ones you didn't try to force.”
              </p>
            </div>
          </motion.div>

          {/* Ar. Harsh Barad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-3xl border border-sand-700 space-y-5 flex flex-col justify-between shadow-lg hover:border-pine-800/40 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-sand-700/80 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-charcoal-950 tracking-tight">Ar. Harsh Barad</h3>
                  <p className="text-xs font-mono text-pine-800 font-bold uppercase tracking-wider pt-0.5">
                    Co-Founder · Expedition Director
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sand-900 border border-sand-700 flex items-center justify-center text-pine-800 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                <p>
                  An architect with a deep-rooted passion for the outdoors, Harsh brings a strong sense of planning, exploration and attention to detail to JungleE.
                </p>
                <p>
                  His fascination with wildlife extends beyond individual species to the larger ecosystem — understanding landscapes, habitats and the subtle signs that make every wilderness experience different.
                </p>
                <p>
                  At JungleE, Harsh works closely on destination planning, expedition logistics, field experiences and guest journeys, ensuring that every trip feels considered from the first conversation to the final safari.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-900/90 border border-sand-700/80 flex items-start gap-3">
              <Quote className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
              <p className="text-xs font-serif italic text-charcoal-950">
                “You can plan the journey. The wilderness writes the story.”
              </p>
            </div>
          </motion.div>
        </div>

        {/* More Than Guides Philosophy Block */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 space-y-4">
          <h4 className="text-xl font-bold text-charcoal-950">More Than Guides</h4>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            Vatsal and Harsh don't position themselves as traditional safari guides. Their role is to design and curate the entire experience — bringing together the right destination, season, accommodation, safari planning, local expertise and people. They work alongside experienced local guides, naturalists, drivers and destination partners because genuine wildlife knowledge is deeply local.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            That approach also aligns with responsible wildlife tourism: good safari experiences depend on trained guides, respect for regulations, low-impact behaviour and meaningful engagement with local communities.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-pine-800 font-bold pt-1">
            The result? Not a packaged holiday. An expedition built around the wild.
          </p>
        </div>
      </section>

      {/* 9. Our Promise */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-8 sm:p-12 rounded-3xl border border-sand-700 text-center space-y-6 max-w-4xl mx-auto shadow-xl"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Our Promise</span>
        <h2 className="text-2xl sm:text-4xl font-black text-charcoal-950 uppercase tracking-tight">
          We Can't Promise What You'll See. <br />
          <span className="text-pine-800">We Can Promise How We'll Take You There.</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-charcoal-700 max-w-2xl mx-auto leading-relaxed">
          <p>
            Wildlife is unpredictable. There are no guaranteed tiger sightings. No guaranteed leopard encounters. No perfectly timed photographs. And that's exactly what makes it wild.
          </p>
          <p>
            What we can promise is thoughtful planning, honest guidance, passionate people, responsible practices and an experience designed around you.
          </p>
          <p className="font-semibold text-charcoal-950 text-sm sm:text-base pt-2">
            Because the greatest wildlife memories aren't manufactured. They're discovered.
          </p>
        </div>
      </motion.section>

      {/* 10. Final CTA */}
      <section className="glass-panel p-10 sm:p-16 rounded-3xl border border-sand-700 shadow-2xl text-center space-y-6 bg-gradient-to-b from-sand-900/90 to-sand-850/90">
        <h2 className="text-3xl sm:text-5xl font-black text-charcoal-950 uppercase tracking-tight">
          Your Next Wild Story Starts Here.
        </h2>
        <p className="text-xs sm:text-base text-charcoal-700 max-w-xl mx-auto leading-relaxed">
          Whether you're planning your first safari or your tenth expedition, we'll help you find the right destination, the right season and the right way to experience it.
        </p>
        <div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105"
          >
            <span>Explore Our Expeditions</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
