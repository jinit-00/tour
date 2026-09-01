import React, { useState } from 'react';
import { Camera, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [selectedCat, setSelectedCat] = useState('All');

  const photos = [
    { id: '1', title: 'Bengal Tiger Stalking', category: 'Tigers', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', location: 'Ranthambore, India' },
    { id: '2', title: 'Serengeti Lioness Portrait', category: 'Big Cats', image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80', location: 'Serengeti, Tanzania' },
    { id: '3', title: 'Greater Kruger White Rhino', category: 'Rhinos', image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80', location: 'Kruger, South Africa' },
    { id: '4', title: 'Royal Tiger in Banyan Ruins', category: 'Tigers', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', location: 'Ranthambore, India' },
    { id: '5', title: 'Mara River Crossing', category: 'Big Cats', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', location: 'Masai Mara, Kenya' },
    { id: '6', title: 'Leopard Tree Perch', category: 'Big Cats', image: 'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1200&q=80', location: 'Sabi Sands, South Africa' },
    { id: '7', title: 'Ngorongoro Bull Elephant', category: 'Elephants', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80', location: 'Ngorongoro, Tanzania' },
    { id: '8', title: 'Amboseli Tuskers & Kilimanjaro', category: 'Elephants', image: 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?auto=format&fit=crop&w=1200&q=80', location: 'Amboseli, Kenya' },
  ];

  const categories = ['All', 'Tigers', 'Big Cats', 'Rhinos', 'Elephants'];

  const filteredPhotos = selectedCat === 'All' ? photos : photos.filter(p => p.category === selectedCat);

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Masterpieces</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Expedition Gallery</h1>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-xl mx-auto font-normal">
          Captured by guests and lead photographers during our small-group wildlife photography masterclasses.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all ${
              selectedCat === cat
                ? 'bg-pine-800 text-sand-950 shadow-md'
                : 'glass-panel text-charcoal-800 hover:bg-sand-900 border border-sand-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Masonry Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPhotos.map((photo) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-sand-700 aspect-[4/3] shadow-lg cursor-pointer"
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-sand-900 uppercase font-bold">{photo.location}</span>
                <h3 className="text-lg font-bold text-sand-950">{photo.title}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
