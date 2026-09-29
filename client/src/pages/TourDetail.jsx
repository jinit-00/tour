import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourDetail, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ShieldCheck, Camera, CheckCircle2, ArrowRight, BookOpen, Star, Hotel } from 'lucide-react';
import HotelDetailModal from '../components/tours/HotelDetailModal';

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
  const [hotelModalOpen, setHotelModalOpen] = useState(false);

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
    return <div className="pt-28 text-center py-20 font-mono text-charcoal-700">Loading expedition details...</div>;
  }

  if (!tour) {
    return (
      <div className="pt-28 max-w-md mx-auto text-center space-y-4 py-20 px-4">
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

  // Gir Safari Hotel Data (Le Casa Lion Resort, Sasan Gir)
  const hotelInfo = tour.hotelDetails || (tour.slug === 'gir-lion-safari' ? {
    name: 'Le Casa Lion Resort, Sasan Gir',
    tagline: 'A Premium Resort in Sasan Gir near Gir National Park Sanctuary',
    address: 'Plot No 2, Survey No 10/1, Borvav Gir, Borvav Dhava Road, Gir Somnath, Gujarat, India',
    rating: '4.5 ★ Premium Wildlife Resort',
    description: 'Set in the tranquil greenery of Borvav village near the entry gate of Gir Asiatic Lion Sanctuary, Le Casa Lion Resort features 54 luxury rooms, private pool villas, and forest-view cottages. Designed specifically to cater to wildlife photographers, safari explorers, and families seeking high-end luxury in the Gir jungle.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
    ]
  } : null);

  return (
    <div className="pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Top Storytelling Banner */}
      <div className="mb-5 p-3.5 rounded-2xl glass-panel border border-sand-700 flex items-center justify-between gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Gallery & Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Gallery Image - Positioned to show full animal head without top cropping */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-[460px] bg-sand-900 relative">
            <img
              src={images[0]}
              alt={tour.title}
              className="w-full h-full object-cover object-[center_12%] sm:object-[center_top]"
            />
            <div className="absolute top-4 left-4 bg-pine-800 text-sand-950 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md">
              {tour.duration}
            </div>
          </div>

          {/* Expedition Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-pine-800 uppercase tracking-widest font-bold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{tour.location}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 leading-tight">
              {tour.title}
            </h1>

            <p className="text-sm text-charcoal-700 leading-relaxed font-normal">
              {tour.description}
            </p>
          </div>

          {/* Masterclass Highlights */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-sand-700">
            <h3 className="text-lg font-bold text-charcoal-900">Included Masterclass Perks</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-charcoal-800">
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

          {/* Featured Hotel Accommodation Section for Gir Safari */}
          {hotelInfo && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700/80 shadow-xl space-y-5 bg-sand-900/60">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-pine-800 font-bold tracking-widest flex items-center gap-1.5">
                    <Hotel className="w-4 h-4 text-pine-800" />
                    Official Safari Resort Accommodation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-charcoal-950 uppercase">
                    {hotelInfo.name}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-pine-800/10 text-pine-800 border border-pine-800/20 text-xs font-mono font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-pine-800 text-pine-800" />
                  MakeMyTrip Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                <div 
                  onClick={() => setHotelModalOpen(true)}
                  className="sm:col-span-1 h-40 rounded-2xl overflow-hidden bg-sand-900 border border-sand-700 shadow-md cursor-pointer group relative"
                >
                  <img src={hotelInfo.images[0]} alt={hotelInfo.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-charcoal-950/30 group-hover:bg-charcoal-950/10 transition-colors flex items-center justify-center">
                    <span className="bg-charcoal-950/80 text-sand-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-sand-700">
                      Click to View Photos
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-2.5">
                  <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                    {hotelInfo.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-charcoal-800">
                    <span className="px-2.5 py-1 rounded-lg bg-sand-950 border border-sand-700">🏊 Swimming Pool</span>
                    <span className="px-2.5 py-1 rounded-lg bg-sand-950 border border-sand-700">🏡 Pool Villas</span>
                    <span className="px-2.5 py-1 rounded-lg bg-sand-950 border border-sand-700">🍽️ Fine Dining</span>
                    <span className="px-2.5 py-1 rounded-lg bg-sand-950 border border-sand-700">🛜 Free Wi-Fi</span>
                  </div>
                  <button
                    onClick={() => setHotelModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 text-xs font-bold shadow-md transition-all flex items-center gap-2 mt-2"
                  >
                    <span>View Hotel Details & Photos ({hotelInfo.name})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Reservation Engine */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 shadow-2xl space-y-5">
            
            <div>
              <span className="text-xs font-mono uppercase text-pine-800 font-bold block">Reserve Your Seat</span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-charcoal-900">${basePrice.toLocaleString()}</span>
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
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 bg-rose-100/80 border border-rose-300 text-rose-800 rounded-xl text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Package Options */}
                {tour.packages && tour.packages.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">Select Accommodation Tier</label>
                    <div className="space-y-2">
                      {tour.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-pine-800 bg-sand-900/90 shadow-sm'
                              : 'border-sand-700 hover:bg-sand-900/50'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-charcoal-900">
                            <span>{pkg.name}</span>
                            <span>{pkg.price > 0 ? `+$${pkg.price}` : 'Included'}</span>
                          </div>
                          <p className="text-[11px] text-charcoal-700 pt-0.5 font-normal">{pkg.description}</p>
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
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2 px-3 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800"
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
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2 px-3 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800"
                  >
                    <option value="1">1 Photographer</option>
                    <option value="2">2 Photographers</option>
                    <option value="3">3 Photographers (Small Group)</option>
                  </select>
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-2.5 border-t border-sand-700 space-y-1 text-xs text-charcoal-700">
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
                  <div className="flex justify-between font-bold text-charcoal-900 text-sm pt-1.5 border-t border-sand-700">
                    <span>Total Cost</span>
                    <span className="text-pine-800">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>{bookingLoading ? 'Processing...' : user ? 'Book Expedition Now' : 'Sign In to Reserve'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Hotel Details Modal */}
      {hotelInfo && (
        <HotelDetailModal
          hotel={hotelInfo}
          isOpen={hotelModalOpen}
          onClose={() => setHotelModalOpen(false)}
        />
      )}

    </div>
  );
}
