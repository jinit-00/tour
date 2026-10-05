import React, { useState, useEffect } from 'react';
import { getTours } from '../services/api';
import { Search } from 'lucide-react';
import SafariCard from '../components/tours/SafariCard';
import girToursCardImg from '../assets/gir-tours-card.jpg';

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    fetchTours();
  }, [search, selectedLocation]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedLocation !== 'All') params.location = selectedLocation;
      const res = await getTours(params);
      const mapped = (res.data || []).map((t) => {
        if (t.slug === 'gir-lion-safari') {
          return { ...t, images: [girToursCardImg, ...(t.images || []).slice(1)] };
        }
        return t;
      });
      setTours(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['All', 'Madhya Pradesh', 'Gujarat', 'Rajasthan', 'Maharashtra', 'Uttarakhand', 'Nepal'];

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      {/* Editorial Header */}
      <div className="text-center space-y-3 mb-8">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-pine-800 font-bold">
          Masterclass Expeditions
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight uppercase">
          Wildlife Photography Safaris
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 max-w-2xl mx-auto font-normal">
          Explore our signature small-group departures featuring Gir, Sanjay Dubri, Jawai, Ranthambore, Velavadar, Panna, Pench, Kanha, Bandhavgarh, Tadoba, Jim Corbett, and Chitwan. Select any safari card to explore each destination.
        </p>
      </div>

      {/* Apple-Style Minimal Filter & Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl mb-8 border border-sand-700/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Search destination or animal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2 pl-10 pr-4 text-sm text-charcoal-900 placeholder-charcoal-500/50 focus:outline-none focus:border-pine-800"
          />
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase text-charcoal-600 mr-2 hidden sm:inline font-bold">Region:</span>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedLocation === loc
                  ? 'bg-pine-800 text-sand-950 font-bold shadow-md'
                  : 'bg-sand-900 text-charcoal-800 hover:bg-sand-850 border border-sand-700'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Large 2-Column Editorial Grid */}
      {loading ? (
        <div className="text-center py-20 text-charcoal-700 font-mono">Loading 11 signature safaris...</div>
      ) : tours.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 max-w-md mx-auto my-12 border border-sand-700">
          <p className="text-lg font-bold text-charcoal-900">No safaris match your criteria.</p>
          <p className="text-xs text-charcoal-700">Try searching for Lion, Leopard, Tiger, Blackbuck, or Elephant.</p>
          <button
            onClick={() => { setSearch(''); setSelectedLocation('All'); }}
            className="px-5 py-2 bg-pine-800 text-sand-950 rounded-full text-xs font-bold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {tours.map((tour, idx) => (
            <SafariCard key={tour.id || idx} tour={tour} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
