import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LightboxModal from '../components/ui/LightboxModal';

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const photos = [
    { id: '1', image: '/gallery/gallery-01.jpg' },
    { id: '2', image: '/gallery/gallery-02.jpg' },
    { id: '3', image: '/gallery/gallery-03.jpg' },
    { id: '4', image: '/gallery/gallery-04.jpg' },
    { id: '5', image: '/gallery/gallery-05.jpg' },
    { id: '6', image: '/gallery/gallery-06.jpg' },
    { id: '7', image: '/gallery/gallery-07.jpg' },
    { id: '8', image: '/gallery/gallery-08.jpg' },
    { id: '9', image: '/gallery/gallery-09.jpg' },
    { id: '10', image: '/gallery/gallery-10.jpg' },
    { id: '11', image: '/gallery/gallery-11.jpg' },
    { id: '12', image: '/gallery/gallery-12.jpg' },
    { id: '13', image: '/gallery/gallery-13.jpg' },
    { id: '14', image: '/gallery/gallery-14.jpg' },
    { id: '15', image: '/gallery/gallery-15.jpg' },
    { id: '16', image: '/gallery/gallery-16.jpg' },
    { id: '17', image: '/gallery/gallery-17.jpg' },
    { id: '18', image: '/gallery/gallery-18.jpg' },
    { id: '19', image: '/gallery/gallery-19.jpg' },
    { id: '20', image: '/gallery/gallery-20.jpg' },
    { id: '21', image: '/gallery/gallery-21.jpg' },
    { id: '22', image: '/gallery/gallery-22.jpg' },
    { id: '23', image: '/gallery/gallery-23.jpg' },
    { id: '24', image: '/gallery/gallery-24.jpg' },
    { id: '25', image: '/gallery/gallery-25.jpg' },
    { id: '26', image: '/gallery/gallery-26.jpg' },
    { id: '27', image: '/gallery/gallery-27.jpg' },
    { id: '28', image: '/gallery/gallery-28.jpg' },
    { id: '29', image: '/gallery/gallery-29.jpg' },
    { id: '30', image: '/gallery/gallery-30.jpg' },
    { id: '31', image: '/gallery/gallery-31.jpg' },
    { id: '32', image: '/gallery/gallery-32.jpg' },
    { id: '33', image: '/gallery/gallery-33.jpg' },
    { id: '34', image: '/gallery/gallery-34.jpg' },
    { id: '35', image: '/gallery/gallery-35.jpg' },
    { id: '36', image: '/gallery/gallery-36.jpg' },
    { id: '37', image: '/gallery/gallery-37.jpg' },
    { id: '38', image: '/gallery/gallery-38.jpg' },
    { id: '39', image: '/gallery/gallery-39.jpg' },
    { id: '40', image: '/gallery/gallery-40.jpg' },
    { id: '41', image: '/gallery/gallery-41.jpg' },
  ];

  const handleOpenLightbox = (index) => {
    setCurrentImgIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Masterpieces</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Expedition Gallery</h1>
        <p className="text-sm sm:text-base text-charcoal-700 max-w-2xl mx-auto font-normal">
          Explore captured moments by guests and lead masterclass photographers across premier wildlife sanctuaries.
        </p>
      </div>

      {/* Photos Masonry / Adaptive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
            key={photo.id}
            onClick={() => handleOpenLightbox(index)}
            className="group relative rounded-2xl overflow-hidden glass-panel border border-sand-700/80 aspect-[4/3] shadow-lg cursor-pointer hover:border-pine-800/60 transition-all bg-sand-950"
          >
            <img
              src={photo.image}
              alt={`Safari Photo ${photo.id}`}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Eye zoom overlay on hover */}
            <div className="absolute inset-0 bg-charcoal-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-charcoal-950/80 backdrop-blur-md border border-sand-700 flex items-center justify-center text-sand-950 shadow-md">
                <Eye className="w-5 h-5 text-sand-800" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={photos.map(p => ({ src: p.image }))}
        currentIndex={currentImgIndex}
        onNavigate={(idx) => setCurrentImgIndex(idx)}
      />

    </div>
  );
}
