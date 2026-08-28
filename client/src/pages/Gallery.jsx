import React, { useState } from 'react';
import LightboxModal from '../components/ui/LightboxModal';
import { Camera, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const galleryItems = [
    {
      src: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      title: 'Serengeti Lioness Stare',
      location: 'Serengeti, Tanzania',
      category: 'Lions',
    },
    {
      src: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
      title: 'Ranthambore Royal Tiger Prowl',
      location: 'Ranthambore, India',
      category: 'Tigers',
    },
    {
      src: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      title: 'Kruger White Rhino Mother & Calf',
      location: 'Kruger National Park',
      category: 'Rhinos',
    },
    {
      src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      title: 'Golden Hour Savanna Silhouettes',
      location: 'Masai Mara, Kenya',
      category: 'Landscapes',
    },
    {
      src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      title: 'Bengal Tiger Waterhole Glance',
      location: 'Ranthambore, India',
      category: 'Tigers',
    },
    {
      src: 'https://images.unsplash.com/photo-1540573133985-778788170485?auto=format&fit=crop&w=1200&q=80',
      title: 'Black Rhino Brush Tracking',
      location: 'Greater Kruger',
      category: 'Rhinos',
    },
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['All', 'Lions', 'Tigers', 'Rhinos', 'Landscapes'];

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Captured in the Field</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Expedition Field Gallery</h1>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-2xl mx-auto font-normal">
          A showcase of raw, un-staged wildlife photographs captured by our guests and master guides across Earth’s sacred habitats.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-pine-800 text-sand-950 font-bold shadow-md'
                : 'bg-sand-900 text-charcoal-800 hover:bg-sand-850 border border-sand-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-Style Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setLightboxOpen(true);
            }}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-sand-700 shadow-xl bg-sand-900"
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-sand-950">
              <div>
                <p className="text-xs font-mono text-sand-900">{item.location}</p>
                <h3 className="text-base font-bold text-sand-950">{item.title}</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-pine-800 text-sand-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredItems}
        currentIndex={currentIndex}
        onNavigate={(idx) => setCurrentIndex(idx)}
      />

    </div>
  );
}
