import React, { useState, useEffect } from 'react';
import { getTours } from '../services/api';
import { Search } from 'lucide-react';
import SafariCard from '../components/tours/SafariCard';

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
      setTours(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['All', 'Tanzania', 'India', 'South Africa'];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-pine-gradient min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-sage-400">Masterclass Expeditions</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-ivory-100">Wildlife Photography Safaris</h1>
        <p className="text-sm sm:text-base text-sage-200 max-w-2xl mx-auto font-light">
          Explore our upcoming small-group departures. Click "LEARN MORE" for full-screen scroll storytelling or "BOOK NOW" to select your departure date.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-12 border border-pine-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-sage-300" />
          <input
            type="text"
            placeholder="Search safaris or species..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pine-850 border border-pine-700/80 rounded-xl py-2 pl-10 pr-4 text-sm text-ivory-100 placeholder-sage-300/50 focus:outline-none focus:border-sage-400"
          />
        </div>

        {/* Location Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase text-sage-300 mr-2 hidden sm:inline">Region:</span>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedLocation === loc
                  ? 'bg-sage-400 text-pine-950 font-bold shadow-md'
                  : 'bg-pine-850 text-sage-200 hover:bg-pine-800'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Safari Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-sage-200 font-mono">Loading safaris catalog...</div>
      ) : tours.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3 max-w-md mx-auto my-12 border border-pine-700">
          <p className="text-lg font-bold text-ivory-100">No safaris match your criteria.</p>
          <p className="text-xs text-sage-200">Try adjusting your search filters.</p>
          <button
            onClick={() => { setSearch(''); setSelectedLocation('All'); }}
            className="px-4 py-2 bg-sage-400 text-pine-950 rounded-full text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, idx) => (
            <SafariCard key={tour.id} tour={tour} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
