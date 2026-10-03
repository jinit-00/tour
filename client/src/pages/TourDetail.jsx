import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourDetail, createBooking, GIR_HOTELS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ShieldCheck, Camera, CheckCircle2, ArrowRight, BookOpen, Star, Hotel, Eye } from 'lucide-react';
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
  const [modalHotel, setModalHotel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedAmberRoomCategory, setSelectedAmberRoomCategory] = useState(null);

  const isGir = slug === 'gir-lion-safari' || slug?.includes('gir');
  const availableHotels = isGir ? GIR_HOTELS : (tour?.hotels || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTourDetail(slug)
      .then((res) => {
        setTour(res.data);
        const hotels = (slug === 'gir-lion-safari' || slug?.includes('gir')) 
          ? GIR_HOTELS 
          : (res.data.hotels || []);
        
        if (hotels.length > 0) {
          const firstHotel = hotels[0];
          setSelectedHotel(firstHotel);
          setModalHotel(firstHotel);

          if (firstHotel.id === 'amber-resort' && firstHotel.roomCategories?.length > 0) {
            const defaultRoom = firstHotel.roomCategories[0];
            setSelectedAmberRoomCategory(defaultRoom);
            setSelectedPackage({
              id: `amber-resort-${defaultRoom.id}`,
              name: `Amber Resort - ${defaultRoom.name}`,
              price: defaultRoom.price || 0,
              description: `${defaultRoom.bedType} · ${defaultRoom.view}`
            });
          } else if (res.data.packages && res.data.packages.length > 0) {
            setSelectedPackage(res.data.packages[0]);
          } else {
            setSelectedPackage({
              id: firstHotel.id,
              name: `${firstHotel.name} (${firstHotel.price === 0 ? 'Standard' : `+$${firstHotel.price}`})`,
              price: firstHotel.price || 0,
              description: firstHotel.tagline
            });
          }
        } else if (res.data.packages && res.data.packages.length > 0) {
          setSelectedPackage(res.data.packages[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    if (hotel.id === 'amber-resort' && hotel.roomCategories?.length > 0) {
      const activeRoom = selectedAmberRoomCategory || hotel.roomCategories[0];
      setSelectedAmberRoomCategory(activeRoom);
      setSelectedPackage({
        id: `amber-resort-${activeRoom.id}`,
        name: `Amber Resort - ${activeRoom.name}`,
        price: activeRoom.price || 0,
        description: `${activeRoom.bedType} · ${activeRoom.view}`
      });
    } else {
      setSelectedPackage({
        id: hotel.id,
        name: `${hotel.name} (${hotel.price === 0 ? 'Standard Package' : `+$${hotel.price}`})`,
        price: hotel.price || 0,
        description: hotel.tagline
      });
    }
  };

  const handleSelectAmberRoom = (roomCat) => {
    setSelectedAmberRoomCategory(roomCat);
    setSelectedPackage({
      id: `amber-resort-${roomCat.id}`,
      name: `Amber Resort - ${roomCat.name}`,
      price: roomCat.price || 0,
      description: `${roomCat.bedType} · ${roomCat.view}`
    });
  };

  const handleOpenRoomGallery = (roomCat) => {
    setModalHotel({
      name: `Amber Resort - ${roomCat.name}`,
      tagline: `${roomCat.bedType} · ${roomCat.view} (${roomCat.roomSize})`,
      address: 'Sasan Mendarda Road, Near Bhalchhel Helipad, Sasan Gir, Gujarat',
      rating: 'MakeMyTrip Verified Room Category',
      description: roomCat.description,
      images: roomCat.images,
      amenities: [
        roomCat.bedType,
        roomCat.roomSize,
        roomCat.view,
        'Attached Modern Bathroom',
        'Private Balcony / Veranda',
        'Garden / Orchard View'
      ]
    });
    setHotelModalOpen(true);
  };

  const handleOpenHotelDetails = (hotel) => {
    setModalHotel(hotel);
    setHotelModalOpen(true);
  };

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
        roomCategory: selectedHotel?.id === 'amber-resort' ? selectedAmberRoomCategory?.name : undefined,
        bookingDate: startDate,
        startDate,
        numPeople: Number(guests),
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
    : ['https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80'];

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
        
        {/* Left Column: Gallery, Itinerary & Partner Hotels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Gallery Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-[460px] bg-sand-900 relative group">
            <img
              src={images[0]}
              alt={tour.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover object-center"
            />
            {/* Small gradient overlay at bottom of photo */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 bg-pine-800 text-sand-950 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-md">
              {tour.duration}
            </div>
          </div>

          {/* Small subtle gradient divider between photo and white/sand details space */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-sand-700/50 to-transparent rounded-full" />

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

          {/* 10 MakeMyTrip Partner Safari Resorts Section for Gir */}
          {availableHotels.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-pine-800 font-bold tracking-widest flex items-center gap-1.5">
                    <Hotel className="w-4 h-4 text-pine-800" />
                    Available Safari Accommodations ({availableHotels.length} Partner Resorts)
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-charcoal-950 uppercase tracking-tight">
                    Choose Your Gir Safari Stay
                  </h3>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-pine-800/10 text-pine-800 border border-pine-800/20 text-xs font-mono font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-pine-800 text-pine-800" />
                  MakeMyTrip Verified Resorts
                </span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-700">
                Select your preferred wildlife resort for this expedition. Click any photo or "Details" to view the full photo gallery, amenities, and resort details.
              </p>

              {/* Grid of 10 Hotel Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {availableHotels.map((hotel) => {
                  const isSelected = selectedHotel?.id === hotel.id || selectedPackage?.id === hotel.id;
                  return (
                    <div
                      key={hotel.id}
                      className={`glass-panel rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                        isSelected 
                          ? 'border-pine-800 ring-2 ring-pine-800/30 bg-sand-900/90 shadow-xl' 
                          : 'border-sand-700/80 hover:border-sand-600 bg-sand-900/50 hover:shadow-lg'
                      }`}
                    >
                      <div>
                        {/* Thumbnail photo with click to open full gallery */}
                        <div 
                          onClick={() => handleOpenHotelDetails(hotel)}
                          className="h-48 w-full bg-sand-950 overflow-hidden relative cursor-pointer group"
                        >
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-charcoal-950/25 group-hover:bg-charcoal-950/10 transition-colors flex items-center justify-center">
                            <span className="bg-charcoal-950/80 text-sand-950 text-[11px] font-mono font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-sand-700 flex items-center gap-1.5 shadow-lg">
                              <Eye className="w-3.5 h-3.5 text-pine-800" />
                              View Photos ({hotel.images.length})
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 bg-charcoal-950/85 backdrop-blur-md text-sand-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-sand-700 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {hotel.rating.split(' ')[0]}
                          </div>
                        </div>

                        {/* Card Info Content */}
                        <div className="p-5 space-y-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-pine-800 font-bold tracking-wider block">
                              {hotel.rating}
                            </span>
                            <h4 className="text-base sm:text-lg font-bold text-charcoal-950 leading-snug pt-0.5">
                              {hotel.name}
                            </h4>
                            <p className="text-xs text-pine-800 font-medium font-mono pt-0.5">
                              {hotel.tagline}
                            </p>
                          </div>

                          <div className="flex items-start gap-1.5 text-[11px] text-charcoal-600 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-pine-800 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hotel.address}</span>
                          </div>

                          <p className="text-xs text-charcoal-700 font-normal leading-relaxed line-clamp-2">
                            {hotel.description}
                          </p>

                          {/* Amenity tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {hotel.amenities.slice(0, 3).map((amenity, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sand-950 border border-sand-700 text-charcoal-800">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="p-5 pt-0 flex items-center justify-between gap-2.5 border-t border-sand-700/60 mt-3 pt-3">
                        <button
                          type="button"
                          onClick={() => handleOpenHotelDetails(hotel)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-charcoal-900 hover:text-pine-800 hover:bg-sand-800 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectHotel(hotel)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-pine-800 text-sand-950 ring-2 ring-pine-800/50'
                              : 'bg-sand-950 hover:bg-pine-800 hover:text-sand-950 text-charcoal-900 border border-sand-700'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Select ({hotel.price === 0 ? 'Included' : `+$${hotel.price}`})</span>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Reservation Engine with dynamic Hotel Accommodation selection */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 shadow-2xl space-y-5">
            
            <div>
              <span className="text-xs font-mono uppercase text-pine-800 font-bold block">Reserve Your Seat</span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-charcoal-900">${(basePrice + packagePrice).toLocaleString()}</span>
                <span className="text-xs font-mono text-charcoal-600">/ guest</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-pine-800 mx-auto" />
                <h4 className="text-xl font-bold text-charcoal-900">Reservation Confirmed!</h4>
                <p className="text-xs text-charcoal-700">
                  Your seat and selected hotel accommodation have been reserved. Check your email for preparation details.
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

                {/* Hotel / Package Selector */}
                {availableHotels.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">
                        Selected Resort Stay
                      </label>
                      {selectedHotel && (
                        <button
                          type="button"
                          onClick={() => handleOpenHotelDetails(selectedHotel)}
                          className="text-[11px] font-mono text-pine-800 hover:underline font-bold"
                        >
                          View Photos →
                        </button>
                      )}
                    </div>
                    <select
                      value={selectedHotel?.id || ''}
                      onChange={(e) => {
                        const h = availableHotels.find(item => item.id === e.target.value);
                        if (h) handleSelectHotel(h);
                      }}
                      className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2.5 px-3 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-medium"
                    >
                      {availableHotels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.price === 0 ? 'Standard Package' : `+$${h.price} / guest`})
                        </option>
                      ))}
                    </select>

                    {selectedHotel && (
                      <div 
                        onClick={() => handleOpenHotelDetails(selectedHotel)}
                        className="p-2.5 rounded-xl bg-sand-900 border border-sand-700 flex items-center gap-3 cursor-pointer hover:border-pine-800/50 transition-colors"
                      >
                        <img 
                          src={selectedHotel.images[0]} 
                          alt={selectedHotel.name} 
                          className="w-12 h-12 rounded-lg object-cover shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-charcoal-900 truncate">{selectedHotel.name}</p>
                          <p className="text-[10px] text-pine-800 font-mono truncate">{selectedHotel.rating} · Click to view details</p>
                        </div>
                      </div>
                    )}

                    {/* MakeMyTrip Room Categories for Amber Resort ONLY */}
                    {selectedHotel?.id === 'amber-resort' && selectedHotel.roomCategories && (
                      <div className="space-y-2 pt-2 border-t border-sand-700/80">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono uppercase text-pine-800 font-bold tracking-wider">
                            Amber Resort Room Category
                          </label>
                          <span className="text-[10px] font-mono text-charcoal-600 font-bold">
                            MakeMyTrip Verified
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
                          {selectedHotel.roomCategories.map((cat) => {
                            const isCatSelected = selectedAmberRoomCategory?.id === cat.id;
                            return (
                              <div
                                key={cat.id}
                                onClick={() => handleSelectAmberRoom(cat)}
                                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                                  isCatSelected
                                    ? 'border-pine-800 bg-sand-900 ring-2 ring-pine-800/30 shadow-md'
                                    : 'border-sand-700/80 bg-sand-950/60 hover:border-sand-600 hover:bg-sand-900/40'
                                }`}
                              >
                                {/* MakeMyTrip Room Photo Thumbnail with click to view gallery */}
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenRoomGallery(cat);
                                  }}
                                  className="w-16 h-16 rounded-xl overflow-hidden bg-sand-900 relative shrink-0 group"
                                  title="Click to view all MakeMyTrip room photos"
                                >
                                  <img
                                    src={cat.images[0]}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-charcoal-950/30 group-hover:bg-charcoal-950/10 transition-colors flex items-center justify-center">
                                    <span className="bg-charcoal-950/80 text-sand-950 text-[9px] font-mono px-1 py-0.5 rounded font-bold">
                                      {cat.images.length} 📷
                                    </span>
                                  </div>
                                </div>

                                {/* Room Category Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1">
                                    <h5 className="text-xs font-bold text-charcoal-950 leading-tight truncate">
                                      {cat.name}
                                    </h5>
                                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                                      cat.price === 0 ? 'text-pine-800' : 'text-amber-600'
                                    }`}>
                                      {cat.price === 0 ? 'Included' : `+$${cat.price}`}
                                    </span>
                                  </div>

                                  <p className="text-[10px] text-charcoal-600 font-mono truncate pt-0.5">
                                    {cat.bedType} · {cat.view}
                                  </p>

                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[9px] font-mono text-pine-800 bg-pine-800/10 px-1.5 py-0.5 rounded border border-pine-800/20 font-bold">
                                      {cat.roomSize}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenRoomGallery(cat);
                                      }}
                                      className="text-pine-800 hover:underline font-mono text-[10px] font-bold flex items-center gap-0.5"
                                    >
                                      <Eye className="w-2.5 h-2.5" />
                                      View Photos ({cat.images.length})
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : tour.packages && tour.packages.length > 0 ? (
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
                ) : null}

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

      {/* Hotel Details Modal (Dynamically displays full photos & info for any selected hotel) */}
      <HotelDetailModal
        hotel={modalHotel || selectedHotel}
        isOpen={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
      />

    </div>
  );
}
