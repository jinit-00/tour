import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourDetail, createBooking, GIR_HOTELS, JAWAI_HOTELS, SANJAY_DUBRI_HOTELS, VELAVADAR_HOTELS, CORBETT_HOTELS, PANNA_HOTELS, PENCH_HOTELS, CHITWAN_HOTELS, BANDHAVGARH_HOTELS, KANHA_HOTELS, RANTHAMBORE_HOTELS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ShieldCheck, Camera, CheckCircle2, ArrowRight, BookOpen, Hotel, Eye, Plus, Minus, ChevronDown, Clock } from 'lucide-react';
import HotelDetailModal from '../components/tours/HotelDetailModal';

export default function TourDetail() {
  const { slug } = useParams();
  const { user, openAuthModal } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [passengerMenuOpen, setPassengerMenuOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [modalHotel, setModalHotel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState(null);

  const isGir = slug === 'gir-lion-safari' || slug?.includes('gir');
  const isJawai = slug === 'jawai-leopard-safari' || slug?.includes('jawai');
  const isSanjay = slug === 'sanjay-dubri-tiger-safari' || slug?.includes('sanjay');
  const isVelavadar = slug === 'velavadar-deer-safari' || slug?.includes('velavadar');
  const isCorbett = slug === 'jim-corbett-safari' || slug?.includes('corbett');
  const isPanna = slug === 'panna-tiger-safari' || slug?.includes('panna');
  const isPench = slug === 'pench-tiger-safari' || slug?.includes('pench');
  const isChitwan = slug === 'chitwan-rhino-safari' || slug?.includes('chitwan') || slug?.includes('rhino');
  const isBandhavgarh = slug === 'bandhavgarh-tiger-safari' || slug?.includes('bandhavgarh');
  const isKanha = slug === 'kanha-tiger-safari' || slug?.includes('kanha');
  const isRanthambore = slug === 'ranthambore-tiger-safari' || slug?.includes('ranthambore');
  const availableHotels = isGir ? GIR_HOTELS : isJawai ? JAWAI_HOTELS : isSanjay ? SANJAY_DUBRI_HOTELS : isVelavadar ? VELAVADAR_HOTELS : isCorbett ? CORBETT_HOTELS : isPanna ? PANNA_HOTELS : isPench ? PENCH_HOTELS : isChitwan ? CHITWAN_HOTELS : isBandhavgarh ? BANDHAVGARH_HOTELS : isKanha ? KANHA_HOTELS : isRanthambore ? RANTHAMBORE_HOTELS : (tour?.hotels || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTourDetail(slug)
      .then((res) => {
        setTour(res.data);
        const hotels = (slug === 'gir-lion-safari' || slug?.includes('gir')) 
          ? GIR_HOTELS 
          : (slug === 'jawai-leopard-safari' || slug?.includes('jawai'))
          ? JAWAI_HOTELS
          : (slug === 'sanjay-dubri-tiger-safari' || slug?.includes('sanjay'))
          ? SANJAY_DUBRI_HOTELS
          : (slug === 'velavadar-deer-safari' || slug?.includes('velavadar'))
          ? VELAVADAR_HOTELS
          : (slug === 'jim-corbett-safari' || slug?.includes('corbett'))
          ? CORBETT_HOTELS
          : (slug === 'panna-tiger-safari' || slug?.includes('panna'))
          ? PANNA_HOTELS
          : (slug === 'pench-tiger-safari' || slug?.includes('pench'))
          ? PENCH_HOTELS
          : (slug === 'chitwan-rhino-safari' || slug?.includes('chitwan') || slug?.includes('rhino'))
          ? CHITWAN_HOTELS
          : (slug === 'bandhavgarh-tiger-safari' || slug?.includes('bandhavgarh'))
          ? BANDHAVGARH_HOTELS
          : (slug === 'kanha-tiger-safari' || slug?.includes('kanha'))
          ? KANHA_HOTELS
          : (slug === 'ranthambore-tiger-safari' || slug?.includes('ranthambore'))
          ? RANTHAMBORE_HOTELS
          : (res.data.hotels || []);
        
        if (hotels.length > 0) {
          const firstHotel = hotels[0];
          setSelectedHotel(firstHotel);
          setModalHotel(firstHotel);

          if (firstHotel.roomCategories && firstHotel.roomCategories.length > 0) {
            const defaultRoom = firstHotel.roomCategories[0];
            setSelectedRoomCategory(defaultRoom);
            setSelectedPackage({
              id: `${firstHotel.id}-${defaultRoom.id}`,
              name: `${firstHotel.name} - ${defaultRoom.name}`,
              price: (firstHotel.price || 0) + (defaultRoom.price || 0),
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
    if (hotel.roomCategories && hotel.roomCategories.length > 0) {
      const activeRoom = hotel.roomCategories[0];
      setSelectedRoomCategory(activeRoom);
      setSelectedPackage({
        id: `${hotel.id}-${activeRoom.id}`,
        name: `${hotel.name} - ${activeRoom.name}`,
        price: (hotel.price || 0) + (activeRoom.price || 0),
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

  const handleSelectRoomCategory = (roomCat, hotel = selectedHotel) => {
    setSelectedRoomCategory(roomCat);
    setSelectedPackage({
      id: `${hotel.id}-${roomCat.id}`,
      name: `${hotel.name} - ${roomCat.name}`,
      price: (hotel.price || 0) + (roomCat.price || 0),
      description: `${roomCat.bedType} · ${roomCat.view}`
    });
  };

  const handleOpenRoomGallery = (roomCat, hotel = selectedHotel) => {
    setModalHotel({
      name: `${hotel.name} - ${roomCat.name}`,
      tagline: `${roomCat.bedType} · ${roomCat.view} (${roomCat.roomSize})`,
      description: roomCat.description,
      images: roomCat.images && roomCat.images.length > 0 ? roomCat.images : hotel.images,
      amenities: [
        roomCat.bedType,
        roomCat.roomSize,
        roomCat.view,
        'Attached Modern Bathroom',
        'Air Conditioning & Heating',
        'Private Balcony / Veranda'
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
      const totalGuests = adults + kids;
      const bookingData = {
        tourId: tour.id,
        packageId: selectedPackage?.id,
        roomCategory: selectedRoomCategory ? `${selectedHotel?.name} - ${selectedRoomCategory.name}` : undefined,
        bookingDate: checkInDate,
        startDate: checkInDate,
        checkInDate,
        checkOutDate,
        adults,
        kids,
        numPeople: totalGuests,
        guests: totalGuests,
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
  const totalGuests = adults + kids;
  const totalPrice = (basePrice + packagePrice) * totalGuests;

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
            Explore the wildlife story and masterclass journey for this expedition.
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

            <p className="text-sm text-charcoal-700 leading-relaxed font-normal whitespace-pre-line">
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

          {/* Partner Safari Resorts Section for Gir */}
          {availableHotels.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-charcoal-950 uppercase tracking-tight">
                    {isGir ? 'Choose Your Gir Stay' : isJawai ? 'Choose Your Jawai Stay' : isSanjay ? 'Choose Your Sanjay Dubri Stay' : isVelavadar ? 'Choose Your Velavadar Stay' : isCorbett ? 'Choose Your Jim Corbett Stay' : isPanna ? 'Choose Your Panna Stay' : isPench ? 'Choose Your Pench Stay' : isChitwan ? 'Choose Your Chitwan Stay' : isBandhavgarh ? 'Choose Your Bandhavgarh Stay' : isKanha ? 'Choose Your Kanha Stay' : isRanthambore ? 'Choose Your Ranthambore Stay' : 'Choose Your Stay'}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-700">
                Select your preferred wildlife resort for this expedition. Click any photo or "Details" to view the full photo gallery, amenities, and resort details.
              </p>

              {/* Grid of Hotel Cards */}
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
                        </div>

                        {/* Card Info Content */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-charcoal-950 leading-snug">
                              {hotel.name}
                            </h4>
                            <p className="text-xs text-pine-800 font-medium font-mono pt-0.5">
                              {hotel.tagline}
                            </p>
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
                          <p className="text-[10px] text-pine-800 font-mono truncate">Click to view details</p>
                        </div>
                      </div>
                    )}

                    {/* Room Categories for Selected Resort */}
                    {selectedHotel?.roomCategories && selectedHotel.roomCategories.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-sand-700/80">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono uppercase text-pine-800 font-bold tracking-wider">
                            {selectedHotel.name} Room Category
                          </label>
                          <span className="text-[10px] font-mono text-charcoal-600 font-bold">
                            Available ({selectedHotel.roomCategories.length})
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
                          {selectedHotel.roomCategories.map((cat) => {
                            const isCatSelected = selectedRoomCategory?.id === cat.id;
                            return (
                              <div
                                key={cat.id}
                                onClick={() => handleSelectRoomCategory(cat)}
                                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center ${
                                  isCatSelected
                                    ? 'border-pine-800 bg-sand-900 ring-2 ring-pine-800/30 shadow-md'
                                    : 'border-sand-700/80 bg-sand-950/60 hover:border-sand-600 hover:bg-sand-900/40'
                                }`}
                              >
                                {/* Room Photo Thumbnail with click to view gallery */}
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenRoomGallery(cat);
                                  }}
                                  className="w-16 h-16 rounded-xl overflow-hidden bg-sand-900 relative shrink-0 group"
                                  title="Click to view room photos"
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

                {/* Calendar Date Selection: Check-in & Check-out */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase text-charcoal-700 font-bold">
                          Check-in Date
                        </label>
                        <span className="text-[9px] font-mono text-pine-800 font-bold">12:00 PM</span>
                      </div>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => {
                            setCheckInDate(e.target.value);
                            if (e.target.value >= checkOutDate) {
                              const nextDate = new Date(e.target.value);
                              nextDate.setDate(nextDate.getDate() + 1);
                              setCheckOutDate(nextDate.toISOString().split('T')[0]);
                            }
                          }}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-mono font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-mono uppercase text-charcoal-700 font-bold">
                          Check-out Date
                        </label>
                        <span className="text-[9px] font-mono text-charcoal-500 font-bold">10:00 AM</span>
                      </div>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          type="date"
                          min={checkInDate}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-mono font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Number of Passengers Menu (Adults min 1, Kids min 0) */}
                <div className="space-y-1 relative">
                  <label className="block text-xs font-mono uppercase text-charcoal-700 font-bold">
                    Number of Passengers
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPassengerMenuOpen(!passengerMenuOpen)}
                      className="w-full bg-sand-950 border border-sand-700 rounded-xl py-2 px-3 text-xs text-charcoal-900 flex items-center justify-between hover:border-pine-800/60 transition-colors focus:outline-none focus:border-pine-800"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pine-800 shrink-0" />
                        <span className="font-semibold text-charcoal-950">
                          {adults} {adults === 1 ? 'Adult' : 'Adults'}
                          {kids > 0 ? `, ${kids} ${kids === 1 ? 'Kid' : 'Kids'}` : ''}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-charcoal-500 transition-transform duration-200 ${passengerMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {passengerMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setPassengerMenuOpen(false)}
                        />
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 p-4 rounded-2xl bg-sand-950 border border-sand-700 shadow-2xl space-y-3.5">
                          {/* Adults Row (min 1) */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-charcoal-950">Adults</p>
                              <p className="text-[10px] text-charcoal-500 font-mono">Age 12+ years</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={adults <= 1}
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center font-mono font-bold text-xs text-charcoal-950">
                                {adults}
                              </span>
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Kids Row (min 0) */}
                          <div className="flex items-center justify-between pt-2 border-t border-sand-700/60">
                            <div>
                              <p className="text-xs font-bold text-charcoal-950">Kids</p>
                              <p className="text-[10px] text-charcoal-500 font-mono">Age 0 - 11 years</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={kids <= 0}
                                onClick={() => setKids(Math.max(0, kids - 1))}
                                className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center font-mono font-bold text-xs text-charcoal-950">
                                {kids}
                              </span>
                              <button
                                type="button"
                                onClick={() => setKids(kids + 1)}
                                className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Done button */}
                          <button
                            type="button"
                            onClick={() => setPassengerMenuOpen(false)}
                            className="w-full py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-[11px] font-mono tracking-wider uppercase transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-2.5 border-t border-sand-700 space-y-1 text-xs text-charcoal-700">
                  <div className="flex justify-between">
                    <span>Base (${basePrice} × {adults + kids} {adults + kids === 1 ? 'Guest' : 'Guests'})</span>
                    <span>${basePrice * (adults + kids)}</span>
                  </div>
                  {packagePrice > 0 && (
                    <div className="flex justify-between">
                      <span>{selectedPackage.name}</span>
                      <span>+${packagePrice * (adults + kids)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-charcoal-900 text-sm pt-1.5 border-t border-sand-700">
                    <span>Total Cost</span>
                    <span className="text-pine-800">${((basePrice + packagePrice) * (adults + kids)).toLocaleString()}</span>
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
