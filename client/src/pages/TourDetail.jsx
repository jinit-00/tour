import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourDetail, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ShieldCheck, Camera, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TourDetail() {
  const { slug } = useParams();
  const { user, openAuthModal } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState('2026-10-15');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getTourDetail(slug)
      .then((res) => {
        setTour(res.data);
        if (res.data.packages && res.data.packages.length > 0) {
          setSelectedPackage(res.data.packages[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        tourId: tour.id,
        packageId: selectedPackage?.id,
        startDate,
        guests: Number(guests),
      };
      await createBooking(bookingData);
      setBookingSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to complete booking reservation.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="pt-40 text-center py-20 font-mono text-charcoal-700">Loading expedition details...</div>;
  }

  if (!tour) {
    return (
      <div className="pt-40 max-w-md mx-auto text-center space-y-4 py-20 px-4">
        <h2 className="text-2xl font-bold text-charcoal-900">Expedition Not Found</h2>
        <p className="text-sm text-charcoal-700">The requested safari departure could not be found.</p>
        <Link to="/tours" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 rounded-full text-xs font-bold">
          Return to Safari Catalog
        </Link>
      </div>
    );
  }

  const basePrice = tour.basePrice || 0;
  const packagePrice = selectedPackage?.price || 0;
  const totalPrice = (basePrice + packagePrice) * guests;

  const images = tour.images && tour.images.length > 0 
    ? tour.images 
    : ['https://images.unsplash.com/photo-1516426122078-c23e76319801'];

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Top Storytelling Banner */}
      <div className="mb-8 p-4 rounded-2xl glass-panel border border-sand-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-pine-800 shrink-0" />
          <span className="text-xs sm:text-sm text-charcoal-800 font-medium">
            Looking for full-screen scroll storytelling? Explore the interactive field journey.
          </span>
        </div>
        <Link
          to={`/tours/${tour.slug}/story`}
          className="px-4 py-2 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 text-xs font-bold shrink-0 transition-all shadow-md flex items-center gap-1"
        >
          <span>View Field Story</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Gallery & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Hero Gallery Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-96 sm:h-[480px] bg-sand-900 relative">
            <img
              src={images[0]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-pine-800 text-sand-950 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md">
              {tour.duration}
            </div>
          </div>

          {/* Expedition Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-pine-800 uppercase tracking-widest font-bold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{tour.location}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 leading-tight">
              {tour.title}
            </h1>

            <p className="text-base text-charcoal-700 leading-relaxed font-normal">
              {tour.description}
            </p>
          </div>

          {/* Masterclass Highlights */}
          <div className="glass-panel p-8 rounded-3xl space-y-6 border border-sand-700">
            <h3 className="text-xl font-bold text-charcoal-900">Included Masterclass Perks</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-charcoal-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
                <span>Dedicated 4x4 row & 360° lens mount per photographer</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
                <span>1-on-1 daily Lightroom & histogram critique</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
                <span>All national park entry & conservation permits</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
                <span>Luxury eco-lodge & tented camp accommodations</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Reservation Engine */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 glass-panel p-8 rounded-3xl border border-sand-700 shadow-2xl space-y-6">
            
            <div>
              <span className="text-xs font-mono uppercase text-pine-800 font-bold block">Reserve Your Seat</span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl font-black text-charcoal-900">${basePrice.toLocaleString()}</span>
                <span className="text-xs font-mono text-charcoal-600">/ guest base</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-pine-800 mx-auto" />
                <h4 className="text-xl font-bold text-charcoal-900">Reservation Confirmed!</h4>
                <p className="text-xs text-charcoal-700">
                  Your seat has been reserved. Check your email for expedition preparation details.
                </p>
                <Link to="/dashboard" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 rounded-full text-xs font-bold mt-2">
                  View My Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                
                {errorMsg && (
                  <div className="p-3 bg-rose-100/80 border border-rose-300 text-rose-800 rounded-xl text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Package Options */}
                {tour.packages && tour.packages.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">Select Accommodation Tier</label>
                    <div className="space-y-2">
                      {tour.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-pine-800 bg-sand-900/90 shadow-sm'
                              : 'border-sand-700 hover:bg-sand-900/50'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-charcoal-900">
                            <span>{pkg.name}</span>
                            <span>{pkg.price > 0 ? `+$${pkg.price}` : 'Included'}</span>
                          </div>
                          <p className="text-[11px] text-charcoal-700 pt-1 font-normal">{pkg.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Departure Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">Departure Date</label>
                  <select
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800"
                  >
                    <option value="2026-10-15">October 15, 2026 (Peak Season)</option>
                    <option value="2026-11-20">November 20, 2026</option>
                    <option value="2027-01-10">January 10, 2027</option>
                  </select>
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800"
                  >
                    <option value="1">1 Photographer</option>
                    <option value="2">2 Photographers</option>
                    <option value="3">3 Photographers (Small Group)</option>
                  </select>
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-3 border-t border-sand-700 space-y-1.5 text-xs text-charcoal-700">
                  <div className="flex justify-between">
                    <span>Base (${basePrice} × {guests})</span>
                    <span>${basePrice * guests}</span>
                  </div>
                  {packagePrice > 0 && (
                    <div className="flex justify-between">
                      <span>{selectedPackage.name}</span>
                      <span>+${packagePrice * guests}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-charcoal-900 text-sm pt-2 border-t border-sand-700">
                    <span>Total Cost</span>
                    <span className="text-pine-800">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{bookingLoading ? 'Processing...' : user ? 'Book Expedition Now' : 'Sign In to Reserve'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
