import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getTourDetail, 
  createBooking, 
  getSafariPricing,
  syncSafariPricingFromCloud,
  GIR_HOTELS, 
  JAWAI_HOTELS, 
  SANJAY_DUBRI_HOTELS, 
  VELAVADAR_HOTELS, 
  CORBETT_HOTELS, 
  PANNA_HOTELS, 
  PENCH_HOTELS, 
  CHITWAN_HOTELS, 
  BANDHAVGARH_HOTELS, 
  KANHA_HOTELS, 
  RANTHAMBORE_HOTELS,
  TADOBA_HOTELS,
  getHiddenHotelIds,
  isHotelHidden,
  getAllHotelCustomPricing,
  getHotelPricing,
  syncHotelDataFromCloud,
  getDefaultRoomPricing,
  isTourHidden,
  syncHiddenToursFromCloud
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Users, ShieldCheck, Camera, CheckCircle2, ArrowRight, BookOpen, Hotel, Eye, Plus, Minus, ChevronDown, Clock, ChevronLeft, ChevronRight, Compass, RotateCcw, AlertCircle } from 'lucide-react';
import HotelDetailModal from '../components/tours/HotelDetailModal';
import ResortRoomSelector from '../components/tours/ResortRoomSelector';

export default function TourDetail() {
  const { slug } = useParams();
  const { user, openAuthModal } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [modalHotel, setModalHotel] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [roomsManual, setRoomsManual] = useState(false);
  const [mealPlan, setMealPlan] = useState('APAI');
  const [safariPeople, setSafariPeople] = useState(1);
  const [safariPeopleManual, setSafariPeopleManual] = useState(false);
  const [safariPricing, setSafariPricing] = useState(() => getSafariPricing(slug));
  const [dailySafaris, setDailySafaris] = useState({});

  // Hotel Visibility & Live Custom Pricing State
  const [hiddenHotels, setHiddenHotels] = useState(() => getHiddenHotelIds());
  const [hotelPricingMap, setHotelPricingMap] = useState(() => getAllHotelCustomPricing());

  const handleDaySafariChange = (dayIndex, count) => {
    setDailySafaris((prev) => ({
      ...prev,
      [dayIndex]: Number(count),
    }));
  };

  // Live Cloud and Local sync for safari prices set in the Admin Panel
  useEffect(() => {
    const handlePricingChange = () => {
      setSafariPricing(getSafariPricing(slug));
    };

    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('junglee_safari_pricing_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'PRICING_UPDATED') {
            setSafariPricing(getSafariPricing(slug));
          }
        };
      } catch (e) {}
    }

    syncSafariPricingFromCloud().then((p) => {
      if (p) setSafariPricing(getSafariPricing(slug));
    }).catch(() => {});

    window.addEventListener('safariPricingChanged', handlePricingChange);
    window.addEventListener('storage', handlePricingChange);
    window.addEventListener('focus', handlePricingChange);

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      window.removeEventListener('safariPricingChanged', handlePricingChange);
      window.removeEventListener('storage', handlePricingChange);
      window.removeEventListener('focus', handlePricingChange);
    };
  }, [slug]);

  // Live Cloud and Local sync for Hotel Visibility and Hotel APAI / MAPAI / CPAI Pricing
  useEffect(() => {
    const handleHotelVisibility = (e) => {
      setHiddenHotels(e.detail || getHiddenHotelIds());
    };
    const handleHotelPricing = () => {
      setHotelPricingMap(getAllHotelCustomPricing());
    };

    let bcVis = null;
    let bcPrice = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bcVis = new BroadcastChannel('junglee_hotel_visibility_sync');
        bcVis.onmessage = (evt) => {
          if (evt.data?.ids) setHiddenHotels(evt.data.ids);
        };
        bcPrice = new BroadcastChannel('junglee_hotel_pricing_sync');
        bcPrice.onmessage = () => {
          setHotelPricingMap(getAllHotelCustomPricing());
        };
      } catch (e) {}
    }

    syncHotelDataFromCloud().then((data) => {
      if (data?.hiddenHotels) setHiddenHotels(data.hiddenHotels);
      if (data?.hotelPricing) setHotelPricingMap(data.hotelPricing);
    }).catch(() => {});

    window.addEventListener('hotelVisibilityChanged', handleHotelVisibility);
    window.addEventListener('hotelPricingChanged', handleHotelPricing);

    return () => {
      if (bcVis) { try { bcVis.close(); } catch (e) {} }
      if (bcPrice) { try { bcPrice.close(); } catch (e) {} }
      window.removeEventListener('hotelVisibilityChanged', handleHotelVisibility);
      window.removeEventListener('hotelPricingChanged', handleHotelPricing);
    };
  }, []);

  const handleAdultsChange = (delta) => {
    const nextVal = Math.max(1, adults + delta);
    setAdults(nextVal);
    setRooms(Math.ceil(nextVal / 2));
    setRoomsManual(false);
    if (!safariPeopleManual) {
      setSafariPeople(Math.max(1, nextVal + kids));
    }
  };

  const handleKidsChange = (delta) => {
    const nextVal = Math.max(0, kids + delta);
    setKids(nextVal);
    if (!safariPeopleManual) {
      setSafariPeople(Math.max(1, adults + nextVal));
    }
  };

  const handleRoomsChange = (delta) => {
    setRoomsManual(true);
    setRooms((prev) => Math.max(1, prev + delta));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const getNextDay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleCheckInChange = (newVal) => {
    setCheckInDate(newVal);
    if (!checkOutDate || newVal >= checkOutDate) {
      setCheckOutDate(getNextDay(newVal));
    }
  };

  const handleCheckOutChange = (newVal) => {
    if (!newVal || newVal <= checkInDate) {
      setCheckOutDate(getNextDay(checkInDate));
    } else {
      setCheckOutDate(newVal);
    }
  };

  // Synchronize safariPeople with total passengers unless manually adjusted by the user
  useEffect(() => {
    if (!safariPeopleManual) {
      setSafariPeople(Math.max(1, adults + kids));
    }
  }, [adults, kids, safariPeopleManual]);

  const handleDecrementSafariPeople = () => {
    setSafariPeopleManual(true);
    setSafariPeople((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementSafariPeople = () => {
    setSafariPeopleManual(true);
    setSafariPeople((prev) => prev + 1);
  };


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
  const isTadoba = slug === 'tadoba-tiger-safari' || slug?.includes('tadoba');

  const rawHotels = (tour?.hotels && tour.hotels.length > 0)
    ? tour.hotels
    : isGir ? GIR_HOTELS 
    : isJawai ? JAWAI_HOTELS 
    : isSanjay ? SANJAY_DUBRI_HOTELS 
    : isVelavadar ? VELAVADAR_HOTELS 
    : isCorbett ? CORBETT_HOTELS 
    : isPanna ? PANNA_HOTELS 
    : isPench ? PENCH_HOTELS 
    : isChitwan ? CHITWAN_HOTELS 
    : isBandhavgarh ? BANDHAVGARH_HOTELS 
    : isKanha ? KANHA_HOTELS 
    : isRanthambore ? RANTHAMBORE_HOTELS 
    : isTadoba ? TADOBA_HOTELS 
    : [];

  const availableHotels = rawHotels.filter((h) => !hiddenHotels.includes(h.id) && !h.isHidden && !isHotelHidden(h));

  // If currently selected hotel becomes hidden, immediately clear selection
  useEffect(() => {
    if (selectedHotel && availableHotels.length > 0) {
      const isSelectedVisible = availableHotels.some((h) => h.id === selectedHotel?.id);
      if (!isSelectedVisible) {
        setSelectedHotel(null);
        setSelectedRoomCategory(null);
        setSelectedPackage(null);
      }
    }
  }, [availableHotels, selectedHotel]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTourDetail(slug)
      .then((res) => {
        setTour(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  // Handlers for Resort & Room Category Selection (Driven strictly by state contract)
  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setSelectedRoomCategory(null);
    setSelectedPackage(null);
  };

  const handleSelectRoomCategory = (roomCat, hotel = selectedHotel) => {
    const parentHotel = hotel || selectedHotel;
    setSelectedRoomCategory(roomCat);
    if (parentHotel) {
      setSelectedPackage({
        id: `${parentHotel.id}-${roomCat.id}`,
        name: `${parentHotel.name} - ${roomCat.name}`,
        price: (parentHotel.price || 0) + (roomCat.price || 0),
        description: `${roomCat.bedType || ''} · ${roomCat.view || ''}`.trim(),
      });
    }
  };

  const handleGoBackToResorts = () => {
    setSelectedHotel(null);
    setSelectedRoomCategory(null);
    setSelectedPackage(null);
  };

  const handleChangeRoom = () => {
    setSelectedRoomCategory(null);
    setSelectedPackage(null);
  };

  const handleScrollToResortSection = () => {
    const el = document.getElementById('resort-selection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.focus();
    }
  };

  const handleRightPanelChange = () => {
    handleGoBackToResorts();
    handleScrollToResortSection();
  };

  const handleOpenRoomGallery = (roomCat, hotel = selectedHotel) => {
    const parentHotel = hotel || selectedHotel;
    setModalHotel({
      name: parentHotel ? `${parentHotel.name} - ${roomCat.name}` : roomCat.name,
      tagline: `${roomCat.bedType || 'Comfort Bed'} · ${roomCat.view || 'Scenic View'} ${roomCat.roomSize ? `(${roomCat.roomSize})` : ''}`,
      description: roomCat.description,
      images: roomCat.images && roomCat.images.length > 0 ? roomCat.images : (parentHotel?.images || []),
      amenities: [
        roomCat.bedType || 'Comfort Bed',
        roomCat.roomSize || 'Standard Size',
        roomCat.view || 'Scenic Nature View',
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

    if (!hasAccommodation) {
      setErrorMsg('Please select a resort and room category on the left to proceed with your booking.');
      handleScrollToResortSection();
      return;
    }

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
        numDays,
        weekdayDays,
        weekendDays,
        adults,
        kids,
        numPeople: totalGuests,
        guests: totalGuests,
        rooms,
        numRooms: rooms,
        mealPlan,
        safariPeople,
        safariVehicles,
        safariPrice,
        perVehicleSafariRate,
        safariWeekdayRate: weekdayRate,
        safariWeekendRate: weekendRate,
        dailySafarisSchedule: daysList.map((d, idx) => ({
          day: d.dayIndex,
          date: d.dateStr,
          safaris: dailySafaris[idx] !== undefined ? Number(dailySafaris[idx]) : 0,
          isWeekend: d.isWeekend,
          rate: d.isWeekend ? weekendRate : weekdayRate,
        })),
        totalSafaris: totalSafarisCount,
        totalPrice,
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
    return <div className="pt-28 text-center py-20 text-charcoal-700 font-medium">Loading expedition details...</div>;
  }

  if (!tour || isTourHidden(tour) || tour.isHidden) {
    return (
      <div className="pt-32 max-w-md mx-auto text-center space-y-4 py-20 px-4">
        <h2 className="text-2xl font-bold text-charcoal-900">Expedition Unavailable</h2>
        <p className="text-sm text-charcoal-700">This wildlife expedition has been removed or hidden by the management.</p>
        <Link to="/tours" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 rounded-full text-xs font-bold">
          Return to Safari Catalog
        </Link>
      </div>
    );
  }

  // Dynamic stay and days calculation based on check-in and check-out dates
  const calculateStayBreakdown = () => {
    if (!checkInDate || !checkOutDate) {
      return { numDays: 0, numNights: 0, weekdayDays: 0, weekendDays: 0, daysList: [] };
    }
    
    const start = new Date(checkInDate + 'T00:00:00');
    const end = new Date(checkOutDate + 'T00:00:00');
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      return { numDays: 0, numNights: 0, weekdayDays: 0, weekendDays: 0, daysList: [] };
    }
    const numNights = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const numDays = numNights + 1;

    let weekdayDays = 0;
    let weekendDays = 0;
    const daysList = [];

    for (let i = 0; i < numDays; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      const day = cur.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = (day === 0 || day === 6);
      if (isWeekend) {
        weekendDays++;
      } else {
        weekdayDays++;
      }
      daysList.push({
        dayIndex: i + 1,
        dateObj: cur,
        dateStr: cur.toISOString().split('T')[0],
        formattedDate: cur.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        dayName: cur.toLocaleDateString('en-IN', { weekday: 'short' }),
        isWeekend,
      });
    }

    return { numDays, numNights, weekdayDays, weekendDays, daysList };
  };

  const { numDays, numNights, weekdayDays, weekendDays, daysList } = calculateStayBreakdown();

  const weekdayRate = Number(safariPricing?.weekday) || 6000;
  const weekendRate = Number(safariPricing?.weekend) || 8000;

  // Rate per vehicle across all selected days based on custom daily safaris (0, 1, 2, or 3 - defaults to 0)
  let perVehicleSafariRate = 0;
  let totalSafarisCount = 0;
  let totalWeekdaySafaris = 0;
  let totalWeekendSafaris = 0;

  daysList.forEach((dayItem, idx) => {
    const safarisOnDay = dailySafaris[idx] !== undefined ? Number(dailySafaris[idx]) : 0;
    totalSafarisCount += safarisOnDay;
    if (dayItem.isWeekend) {
      totalWeekendSafaris += safarisOnDay;
      perVehicleSafariRate += (safarisOnDay * weekendRate);
    } else {
      totalWeekdaySafaris += safarisOnDay;
      perVehicleSafariRate += (safarisOnDay * weekdayRate);
    }
  });

  const hasAccommodation = Boolean(selectedHotel && selectedRoomCategory);

  // Accommodation pricing based directly on selected room category rate (meal plan rate removed silently)
  const activeHotelPricing = getHotelPricing(selectedHotel?.id, selectedRoomCategory?.id, selectedRoomCategory);
  const roomCategoryRate = hasAccommodation
    ? (Number(activeHotelPricing?.price) || Number(selectedRoomCategory?.price) || Number(selectedHotel?.price) || 0)
    : 0;

  const accommodationCost = roomCategoryRate * rooms * numDays;

  const totalGuests = adults + kids;
  const safariVehicles = Math.max(1, Math.ceil(safariPeople / 6));
  const safariPrice = safariVehicles * perVehicleSafariRate;

  // Total Reservation Cost (one combined figure)
  const totalPrice = accommodationCost + safariPrice;

  // Total is shown ONLY when resort, roomCategory, both dates and adults >= 1 are set
  const isReadyForTotal = Boolean(
    hasAccommodation && checkInDate && checkOutDate && numNights > 0 && adults >= 1
  );



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
          </div>

          {/* Small subtle gradient divider between photo and white/sand details space */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-sand-700/50 to-transparent rounded-full" />

          {/* Expedition Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-pine-800 uppercase tracking-widest font-bold">
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

          {/* Reusable Resort & Room Category Selection (Left Side Showcase) */}
          {availableHotels.length > 0 && (
            <ResortRoomSelector
              hotels={availableHotels}
              selectedHotel={selectedHotel}
              selectedRoomCategory={selectedRoomCategory}
              onSelectHotel={handleSelectHotel}
              onSelectRoomCategory={handleSelectRoomCategory}
              onGoBackToResorts={handleGoBackToResorts}
              onChangeRoom={handleChangeRoom}
              onOpenHotelDetails={handleOpenHotelDetails}
              onOpenRoomGallery={handleOpenRoomGallery}
              tourLocation={tour.location}
            />
          )}

        </div>

        {/* Right Column: Reservation Engine with dynamic Hotel Accommodation selection */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 glass-panel p-6 sm:p-8 rounded-3xl border border-sand-700 shadow-2xl space-y-5">
            
            <div>
              <span className="text-xs uppercase text-pine-800 font-bold block tracking-wider">Reserve Your Expedition</span>
              <h4 className="text-xl sm:text-2xl font-black text-charcoal-900 pt-1">
                Expedition Reservation
              </h4>
              <p className="text-[11px] text-charcoal-600 font-medium pt-0.5">
                {hasAccommodation
                  ? `${selectedHotel.name} · ${selectedRoomCategory.name}`
                  : 'Select resort & room on the left to proceed'}
              </p>
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

                {/* Read-Only Selected Accommodation Summary Row */}
                <div className="p-3.5 rounded-2xl bg-sand-950 border border-sand-700 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-bold block">
                      Resort & Room
                    </span>
                    {selectedHotel && selectedRoomCategory ? (
                      <div className="pt-0.5">
                        <p className="text-xs font-bold text-charcoal-950 truncate">
                          {selectedHotel.name}
                        </p>
                        <p className="text-[11px] text-pine-800 font-semibold truncate">
                          {selectedRoomCategory.name}
                        </p>
                      </div>
                    ) : selectedHotel ? (
                      <div className="pt-0.5">
                        <p className="text-xs font-bold text-charcoal-950 truncate">
                          {selectedHotel.name}
                        </p>
                        <p className="text-[11px] text-amber-800 font-medium">
                          No room category selected
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-charcoal-600 pt-0.5">
                        No resort selected
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleRightPanelChange}
                    aria-label="Change resort or room category"
                    className="px-3 py-1.5 rounded-xl border border-sand-700 bg-sand-900 hover:bg-pine-800 hover:text-sand-950 text-charcoal-800 text-xs font-bold shrink-0 transition-colors shadow-xs"
                  >
                    Change
                  </button>
                </div>

                {/* 1. Dates */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label htmlFor="booking-checkin-date" className="block text-[11px] uppercase text-charcoal-700 font-bold tracking-wider">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          id="booking-checkin-date"
                          type="date"
                          min={todayStr}
                          value={checkInDate}
                          onChange={(e) => handleCheckInChange(e.target.value)}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="booking-checkout-date" className="block text-[11px] uppercase text-charcoal-700 font-bold tracking-wider">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          id="booking-checkout-date"
                          type="date"
                          min={getNextDay(checkInDate) || todayStr}
                          value={checkOutDate}
                          onChange={(e) => handleCheckOutChange(e.target.value)}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration Badge Only (No rates) */}
                  <div className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-sand-950/80 border border-sand-700/80 text-[11px] font-bold text-pine-800">
                    {numDays > 0 ? `${numDays} ${numDays === 1 ? 'Day' : 'Days'} / ${numNights} ${numNights === 1 ? 'Night' : 'Nights'}` : 'Select Dates'}
                  </div>
                </div>

                {/* 2. Passengers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                      Passengers
                    </label>
                    <span className="text-[11px] text-pine-800 font-bold">
                      {adults + kids} {adults + kids === 1 ? 'Guest' : 'Guests'} Total
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-sand-950 border border-sand-700 space-y-2.5">
                    {/* Adults Row (12+ yrs, min 1) */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-charcoal-950 block">Adults</span>
                        <span className="text-[10px] text-charcoal-500 font-medium block">Age 12+ years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => handleAdultsChange(-1)}
                          aria-label="Decrease adults"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdultsChange(1)}
                          aria-label="Increase adults"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Kids Row (0-11 yrs, min 0) */}
                    <div className="flex items-center justify-between pt-2 border-t border-sand-700/60">
                      <div>
                        <span className="text-xs font-bold text-charcoal-950 block">Kids</span>
                        <span className="text-[10px] text-charcoal-500 font-medium block">Age 0 - 11 years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={kids <= 0}
                          onClick={() => handleKidsChange(-1)}
                          aria-label="Decrease kids"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                          {kids}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleKidsChange(1)}
                          aria-label="Increase kids"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Safari */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                    Safari
                  </label>

                  <div className="p-3 rounded-2xl bg-sand-950 border border-sand-700 space-y-3">
                    {/* Safari People Counter */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-pine-800 shrink-0" />
                        <span className="text-xs font-bold text-charcoal-950">Safari People</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={safariPeople <= 1}
                          onClick={handleDecrementSafariPeople}
                          aria-label="Decrease safari people"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                          {safariPeople}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrementSafariPeople}
                          aria-label="Increase safari people"
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Vehicles line (No cost text) */}
                    <div className="text-[11px] text-charcoal-700 font-medium px-2.5 py-1.5 rounded-xl bg-sand-900/60 border border-sand-800/60">
                      {safariVehicles} {safariVehicles === 1 ? 'Safari Vehicle' : 'Safari Vehicles'} (max 6 guests / vehicle)
                    </div>

                    {/* Daily Safari Schedule */}
                    <div className="pt-2 border-t border-sand-800/60 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block">
                        Daily Schedule
                      </span>

                      {(!checkInDate || !checkOutDate || daysList.length === 0) ? (
                        <p className="text-xs text-charcoal-600 font-medium py-2 px-3 bg-sand-900/50 rounded-xl border border-sand-800/50 text-center">
                          Select dates to choose safaris
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {daysList.map((dayItem, idx) => {
                            const safarisOnDay = dailySafaris[idx] !== undefined ? Number(dailySafaris[idx]) : 0;
                            return (
                              <div
                                key={`${dayItem.dateStr}-${idx}`}
                                className="p-2.5 rounded-xl bg-sand-900/80 border border-sand-800/80 flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-charcoal-950 text-xs">
                                    Day {dayItem.dayIndex} · {dayItem.formattedDate}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                    dayItem.isWeekend
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300/70'
                                  }`}>
                                    {dayItem.isWeekend ? 'Weekend' : 'Weekday'}
                                  </span>
                                </div>

                                <div className="shrink-0">
                                  <select
                                    value={safarisOnDay}
                                    onChange={(e) => handleDaySafariChange(idx, e.target.value)}
                                    className="bg-sand-950 border border-sand-700 text-charcoal-950 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-pine-800 cursor-pointer shadow-xs"
                                    aria-label={`Select number of safaris for Day ${dayItem.dayIndex}`}
                                  >
                                    <option value={0}>No safari</option>
                                    <option value={1}>1 Safari</option>
                                    <option value={2}>2 Safaris</option>
                                    <option value={3}>3 Safaris</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Rooms */}
                <div className="space-y-1">
                  <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                    Rooms
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-sand-950 border border-sand-700">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-pine-800 shrink-0" />
                      <span className="text-xs font-semibold text-charcoal-950">
                        {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={rooms <= 1}
                        onClick={() => handleRoomsChange(-1)}
                        aria-label="Decrease rooms"
                        className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                        {rooms}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRoomsChange(1)}
                        aria-label="Increase rooms"
                        className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Total Reservation Cost */}
                <div className="pt-2">
                  {isReadyForTotal ? (
                    <div
                      className="p-4 rounded-2xl bg-pine-900/10 border border-pine-800/30 text-center space-y-1"
                      aria-live="polite"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-pine-800 block">
                        Total Reservation Cost
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-charcoal-900">
                        ₹{totalPrice.toLocaleString()} <span className="text-xs font-normal text-charcoal-600">(room + safari combined)</span>
                      </p>
                    </div>
                  ) : (
                    <div
                      className="p-3.5 rounded-2xl bg-sand-900/50 border border-sand-700 text-center text-xs font-medium text-charcoal-600"
                      aria-live="polite"
                    >
                      Select details to see your total
                    </div>
                  )}
                </div>

                {/* 6. Book Button */}
                <button
                  type="submit"
                  disabled={!isReadyForTotal || bookingLoading}
                  className="w-full py-3.5 rounded-xl bg-pine-800 hover:bg-pine-700 disabled:bg-sand-800 disabled:text-charcoal-500 disabled:cursor-not-allowed text-sand-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>
                    {bookingLoading
                      ? 'Processing...'
                      : !user
                      ? 'Sign In to Reserve'
                      : 'BOOK YOUR SAFARI NOW'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Summary Bar */}
      <div className="block lg:hidden fixed inset-x-0 bottom-0 z-40 bg-sand-950/95 backdrop-blur-md border-t border-sand-700 p-3 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="min-w-0 flex-1">
            {isReadyForTotal ? (
              <>
                <p className="text-xs font-black text-charcoal-950 truncate" aria-live="polite">
                  ₹{totalPrice.toLocaleString()} <span className="text-[10px] font-normal text-charcoal-600">(room + safari combined)</span>
                </p>
                <p className="text-[10px] text-pine-800 font-bold truncate">
                  {selectedHotel.name} · {selectedRoomCategory.name}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-charcoal-700 truncate" aria-live="polite">
                  Select details to see your total
                </p>
                <p className="text-[10px] text-charcoal-500 font-medium truncate">
                  {hasAccommodation ? `${selectedHotel.name} · ${selectedRoomCategory.name}` : 'Resort & room pending selection'}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasAccommodation ? (
              <button
                type="button"
                onClick={handleRightPanelChange}
                className="px-2.5 py-1.5 rounded-xl border border-sand-700 bg-sand-900 text-charcoal-800 text-[11px] font-bold"
              >
                Change
              </button>
            ) : (
              <button
                type="button"
                onClick={handleScrollToResortSection}
                className="px-3 py-1.5 rounded-xl bg-pine-800 text-sand-950 text-xs font-bold shadow-md"
              >
                Choose Stay
              </button>
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
