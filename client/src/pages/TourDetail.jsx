import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTourDetail, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Check, ShieldCheck, Camera, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import LightboxModal from '../components/ui/LightboxModal';

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    fetchTourDetail();
  }, [slug]);

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      const res = await getTourDetail(slug);
      setTour(res.data);
      if (res.data.packages && res.data.packages.length > 0) {
        setSelectedPackageId(res.data.packages[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Tour not found.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="pt-32 text-center py-20 font-mono text-charcoal-700">Loading expedition details...</div>;
  }

  if (error || !tour) {
    return (
      <div className="pt-32 max-w-md mx-auto text-center space-y-4 py-20 px-4">
        <div className="p-4 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-sm">
          {error || 'Tour not found.'}
        </div>
        <Link to="/tours" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 font-bold rounded-full text-xs">
          Back to Safaris Catalog
        </Link>
      </div>
    );
  }

  // Calculate pricing breakdown (BOOKING PAGE ONLY SOURCE OF TRUTH FOR PRICING)
  const selectedPackage = tour.packages?.find((p) => p.id === selectedPackageId);
  const packagePrice = selectedPackage ? selectedPackage.price : 0;
  const basePricePerPerson = tour.basePrice || 0;
  const totalPrice = (basePricePerPerson + packagePrice) * guestsCount;

  const images = tour.images && tour.images.length > 0 ? tour.images : ['https://images.unsplash.com/photo-1516426122078-c23e76319801'];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!bookingDate) {
      alert('Please select a departure date.');
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        tourId: tour.id,
        packageId: selectedPackageId || null,
        guestsCount: Number(guestsCount),
        bookingDate,
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to complete booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen">
      
      {/* Back Button & Story Mode Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/tours" className="inline-flex items-center gap-2 text-xs font-mono text-charcoal-700 hover:text-pine-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Safaris</span>
        </Link>

        <Link
          to={`/tours/${tour.slug}/story`}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-900 border border-pine-800/30 text-pine-800 font-bold text-xs font-mono hover:bg-sand-850 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Full-Screen Scroll Story</span>
        </Link>
      </div>

      {/* Main Grid: Info Left (2 cols) | Booking Engine Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT SECTION: Tour Header, Gallery, Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-pine-800 text-sand-950 px-3 py-1 rounded-full text-xs font-mono">
                {tour.duration}
              </span>
              <div className="flex items-center gap-1 text-xs text-charcoal-700 font-mono">
                <MapPin className="w-4 h-4 text-pine-800" />
                <span>{tour.location}</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900">{tour.title}</h1>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveImgIdx(idx);
                  setLightboxOpen(true);
                }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer border border-sand-700 group ${
                  idx === 0 ? 'sm:col-span-2 h-72 sm:h-96' : 'h-72 sm:h-96'
                }`}
              >
                <img
                  src={img}
                  alt={`${tour.title} ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-charcoal-900/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-3 right-3 glass-panel p-2 rounded-full text-pine-800">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
            <h3 className="text-xl font-bold text-charcoal-900">Expedition Description</h3>
            <p className="text-sm text-charcoal-700 leading-relaxed font-normal">{tour.description}</p>
          </div>

          {/* Add-on Packages Specification */}
          {tour.packages && tour.packages.length > 0 && (
            <div className="glass-panel p-8 rounded-2xl border border-sand-700 space-y-4">
              <h3 className="text-xl font-bold text-charcoal-900">Available Tiered Packages</h3>
              <div className="space-y-3">
                {tour.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPackageId === pkg.id
                        ? 'bg-sand-900 border-pine-800 shadow-md'
                        : 'bg-sand-950 border-sand-700 hover:border-sand-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900">{pkg.name}</span>
                      <span className="text-sm font-mono text-pine-800 font-bold">
                        {pkg.price === 0 ? 'Included (+$0)' : `+$${pkg.price.toLocaleString()}`}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-700 mt-1">{pkg.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SECTION: Sticky Booking Panel (SOLE SOURCE OF TRUTH FOR PRICING) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 glass-panel p-6 sm:p-8 rounded-3xl border-2 border-pine-800/40 shadow-2xl space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-mono text-charcoal-600 uppercase font-bold">Total Expedition Investment</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-pine-800">${totalPrice.toLocaleString()}</span>
                <span className="text-xs text-charcoal-700 font-mono">USD</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl space-y-3 text-center">
                <Check className="w-8 h-8 text-emerald-700 mx-auto" />
                <h4 className="font-bold text-lg text-charcoal-900">Expedition Reserved!</h4>
                <p className="text-xs text-emerald-800">
                  Your seat has been reserved. You can view your departure details in your account dashboard.
                </p>
                <Link to="/dashboard" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 font-bold text-xs rounded-full">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Number of Photographers</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Package Select */}
                <div>
                  <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Package Tier</label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                  >
                    {tour.packages?.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.price === 0 ? 'Free' : `+$${pkg.price}`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Breakdown Box */}
                <div className="p-4 bg-sand-900 rounded-xl border border-sand-700 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-charcoal-700">
                    <span>Base (${basePricePerPerson} x {guestsCount})</span>
                    <span>${(basePricePerPerson * guestsCount).toLocaleString()}</span>
                  </div>
                  {packagePrice > 0 && (
                    <div className="flex justify-between text-charcoal-700">
                      <span>Package (${packagePrice} x {guestsCount})</span>
                      <span>+${(packagePrice * guestsCount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-pine-800 pt-2 border-t border-sand-700 text-sm">
                    <span>Total Due</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-black text-sm tracking-wider uppercase shadow-2xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Reserving Seat...' : 'BOOK THIS SAFARI NOW'}
                </button>

                {!user && (
                  <p className="text-[11px] text-center text-charcoal-600 font-mono">
                    * You will be prompted to sign in or register before booking.
                  </p>
                )}

              </form>
            )}

          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={activeImgIdx}
        onNavigate={(idx) => setActiveImgIdx(idx)}
      />

    </div>
  );
}
