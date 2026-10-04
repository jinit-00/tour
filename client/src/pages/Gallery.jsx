import React, { useState } from 'react';
import { Camera, Filter, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LightboxModal from '../components/ui/LightboxModal';

export default function Gallery() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const photos = [
    { id: '1', title: 'Royal Bengal Tiger in Stride', category: 'Tigers', image: '/gallery/gallery-01.jpg', location: 'Bandhavgarh National Park' },
    { id: '2', title: 'Asiatic Lion in Savannah Grass', category: 'Big Cats', image: '/gallery/gallery-02.jpg', location: 'Gir National Park' },
    { id: '3', title: 'Leopard on Granite Boulders', category: 'Leopards', image: '/gallery/gallery-03.jpg', location: 'Jawai Hills, Rajasthan' },
    { id: '4', title: 'Bengal Tiger Facial Portrait', category: 'Tigers', image: '/gallery/gallery-04.jpg', location: 'Ranthambore Tiger Reserve' },
    { id: '5', title: 'Wild Elephant Herd at River', category: 'Herbivores', image: '/gallery/gallery-05.jpg', location: 'Jim Corbett National Park' },
    { id: '6', title: 'Asiatic Lion Pride resting in Shade', category: 'Big Cats', image: '/gallery/gallery-06.jpg', location: 'Gir Sanctuary' },
    { id: '7', title: 'Spotted Deer in Morning Mist', category: 'Herbivores', image: '/gallery/gallery-07.jpg', location: 'Kanha National Park' },
    { id: '8', title: 'Leopard Resting on Ancient Branch', category: 'Leopards', image: '/gallery/gallery-08.jpg', location: 'Pench Tiger Reserve' },
    { id: '9', title: 'Leaping Blackbuck Antelope', category: 'Herbivores', image: '/gallery/gallery-09.jpg', location: 'Velavadar Blackbuck National Park' },
    { id: '10', title: 'One-Horned Rhinoceros in Grasslands', category: 'Herbivores', image: '/gallery/gallery-10.jpg', location: 'Chitwan National Park' },
    { id: '11', title: 'Tiger Stalking Through Teak Forest', category: 'Tigers', image: '/gallery/gallery-11.jpg', location: 'Tadoba Andhari Reserve' },
    { id: '12', title: 'Wild Leopard Gazing into Golden Light', category: 'Leopards', image: '/gallery/gallery-12.jpg', location: 'Jawai Bandh, Rajasthan' },
    { id: '13', title: 'Indian Peafowl in Teak Canopy', category: 'Birds & Action', image: '/gallery/gallery-13.jpg', location: 'Panna Tiger Reserve' },
    { id: '14', title: 'Majestic Asiatic Lion Roaring', category: 'Big Cats', image: '/gallery/gallery-14.jpg', location: 'Gir National Park' },
    { id: '15', title: 'Hardground Barasingha Deer', category: 'Herbivores', image: '/gallery/gallery-15.jpg', location: 'Kanha Sal Meadows' },
    { id: '16', title: 'Bengal Tigress with Cubs at Waterhole', category: 'Tigers', image: '/gallery/gallery-16.jpg', location: 'Bandhavgarh Tala Zone' },
    { id: '17', title: 'Indian Roller Bird in Flight', category: 'Birds & Action', image: '/gallery/gallery-17.jpg', location: 'Sanjay Dubri National Park' },
    { id: '18', title: 'Asiatic Lioness Stalking Prey', category: 'Big Cats', image: '/gallery/gallery-18.jpg', location: 'Gir Deciduous Forest' },
    { id: '19', title: 'Wild Leopard on Kopje Rock', category: 'Leopards', image: '/gallery/gallery-19.jpg', location: 'Jawai Leopard Corridor' },
    { id: '20', title: 'Royal Bengal Tiger Drinking at Creek', category: 'Tigers', image: '/gallery/gallery-20.jpg', location: 'Ranthambore Lakes' },
    { id: '21', title: 'Sambar Deer Alarm Call', category: 'Herbivores', image: '/gallery/gallery-21.jpg', location: 'Pench National Park' },
    { id: '22', title: 'Wild Elephant Crossing Riverbed', category: 'Herbivores', image: '/gallery/gallery-22.jpg', location: 'Jim Corbett Ramganga' },
    { id: '23', title: 'Asiatic Lion Resting in Golden Meadow', category: 'Big Cats', image: '/gallery/gallery-23.jpg', location: 'Sasan Gir Sanctuary' },
    { id: '24', title: 'Kingfisher Diving for Catch', category: 'Birds & Action', image: '/gallery/gallery-24.jpg', location: 'Chitwan Wetlands' },
    { id: '25', title: 'Bengal Tiger Eye-Level Portrait', category: 'Tigers', image: '/gallery/gallery-25.jpg', location: 'Kanha Tiger Reserve' },
    { id: '26', title: 'Leopard Cubs in Rocky Cave Shelter', category: 'Leopards', image: '/gallery/gallery-26.jpg', location: 'Jawai Granite Hills' },
    { id: '27', title: 'Indian Wolf Patrolling Grasslands', category: 'Big Cats', image: '/gallery/gallery-27.jpg', location: 'Velavadar Savanna' },
    { id: '28', title: 'Bengal Tiger Among Banyan Roots', category: 'Tigers', image: '/gallery/gallery-28.jpg', location: 'Bandhavgarh Fort Base' },
    { id: '29', title: 'Striped Hyena at Sunset', category: 'Birds & Action', image: '/gallery/gallery-29.jpg', location: 'Velavadar Grasslands' },
    { id: '30', title: 'Asiatic Lioness Scanning Horizon', category: 'Big Cats', image: '/gallery/gallery-30.jpg', location: 'Gir Sanctuary Ridge' },
    { id: '31', title: 'One-Horned Rhino with Calf', category: 'Herbivores', image: '/gallery/gallery-31.jpg', location: 'Chitwan Sal Forest' },
    { id: '32', title: 'Tiger Patrol on Jungle Trail', category: 'Tigers', image: '/gallery/gallery-32.jpg', location: 'Tadoba Moharli Zone' },
    { id: '33', title: 'Leopard Stealthily Descending Boulder', category: 'Leopards', image: '/gallery/gallery-33.jpg', location: 'Jawai Leopard Safari' },
    { id: '34', title: 'Crested Serpent Eagle on Perch', category: 'Birds & Action', image: '/gallery/gallery-34.jpg', location: 'Jim Corbett Foothills' },
    { id: '35', title: 'Bengal Tiger in Early Morning Light', category: 'Tigers', image: '/gallery/gallery-35.jpg', location: 'Panna Tiger Reserve' },
    { id: '36', title: 'Asiatic Lion Coalition', category: 'Big Cats', image: '/gallery/gallery-36.jpg', location: 'Gir National Park' },
    { id: '37', title: 'Nilgai Antelope Standing Alert', category: 'Herbivores', image: '/gallery/gallery-37.jpg', location: 'Sanjay Dubri Forest' },
    { id: '38', title: 'Bengal Tigress Marking Territory', category: 'Tigers', image: '/gallery/gallery-38.jpg', location: 'Ranthambore Zone 3' },
    { id: '39', title: 'Leopard Backlit by Afternoon Sun', category: 'Leopards', image: '/gallery/gallery-39.jpg', location: 'Jawai Hills Sanctuary' },
    { id: '40', title: 'Gaur Herd in Sal Glade', category: 'Herbivores', image: '/gallery/gallery-40.jpg', location: 'Kanha National Park' },
    { id: '41', title: 'Sunset Silhouette over Safari Wilderness', category: 'Birds & Action', image: '/gallery/gallery-41.jpg', location: 'Central India Reserve' },
  ];

  const categories = ['All', 'Tigers', 'Big Cats', 'Leopards', 'Herbivores', 'Birds & Action'];

  const filteredPhotos = selectedCat === 'All' ? photos : photos.filter(p => p.category === selectedCat);

  const handleOpenLightbox = (photo) => {
    const idx = photos.findIndex(p => p.id === photo.id);
    if (idx !== -1) {
      setCurrentImgIndex(idx);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Masterpieces</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Expedition Gallery</h1>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-2xl mx-auto font-normal">
          Explore {photos.length} captured moments by guests and lead masterclass photographers across India & Nepal’s premier wildlife sanctuaries.
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
                ? 'bg-pine-800 text-sand-950 shadow-md scale-105'
                : 'glass-panel text-charcoal-800 hover:bg-sand-900 border border-sand-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Masonry / Adaptive Grid */}
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
              onClick={() => handleOpenLightbox(photo)}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-sand-700/80 aspect-[4/3] shadow-lg cursor-pointer hover:border-pine-800/60 transition-all bg-sand-950"
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Eye zoom overlay on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-8 h-8 rounded-full bg-charcoal-950/80 backdrop-blur-md border border-sand-700 flex items-center justify-center text-sand-950 shadow-md">
                  <Eye className="w-4 h-4 text-pine-800" />
                </span>
              </div>

              {/* Title & Location Footer Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                <span className="text-[11px] font-mono text-sand-800 uppercase font-bold tracking-wider">{photo.location}</span>
                <h3 className="text-base font-bold text-sand-950 leading-snug">{photo.title}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={photos.map(p => ({
          src: p.image,
          title: p.title,
          location: p.location,
          category: p.category
        }))}
        currentIndex={currentImgIndex}
        onNavigate={(idx) => setCurrentImgIndex(idx)}
      />

    </div>
  );
}
