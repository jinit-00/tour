import React, { useState } from 'react';
import { Camera, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [selectedCat, setSelectedCat] = useState('All');

  const photos = [
    { id: '1', title: 'Bengal Tiger Stalking', category: 'Tigers', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', location: 'Bandhavgarh, India' },
    { id: '2', title: 'Asiatic Lioness Portrait', category: 'Big Cats', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', location: 'Gir National Park, India' },
    { id: '3', title: 'Jawai Granite Hills Leopard', category: 'Big Cats', image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80', location: 'Jawai, India' },
    { id: '4', title: 'Royal Tiger in Banyan Ruins', category: 'Tigers', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', location: 'Ranthambore, India' },
    { id: '5', title: 'Ken River Bengal Tiger', category: 'Tigers', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', location: 'Panna, India' },
    { id: '6', title: 'Kanha Sal Forest Tiger', category: 'Tigers', image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80', location: 'Kanha, India' },
    { id: '7', title: 'Corbett Riverbank Wild Elephant', category: 'Elephants', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80', location: 'Jim Corbett, India' },
    { id: '8', title: 'Velavadar Blackbuck in Grasslands', category: 'Herbivores', image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80', location: 'Velavadar, India' },
  ];

  const categories = ['All', 'Tigers', 'Big Cats', 'Elephants', 'Herbivores'];

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
