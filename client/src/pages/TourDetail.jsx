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

function HotelCardImageCarousel({ images, name, onClick }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const imageList = Array.isArray(images) && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1546182990-dffeafbe841d'];
  const total = imageList.length;

  useEffect(() => {
    if (Array.isArray(images)) {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      onClick={onClick}
      className="h-52 sm:h-56 w-full bg-sand-950 overflow-hidden relative cursor-pointer group select-none"
    >
      {/* Sliding Track for instant, buttery-smooth hardware-accelerated transition */}
      <div 
        className="w-full h-full flex transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {imageList.map((imgSrc, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative overflow-hidden">
            <img
              src={imgSrc}
              alt={`${name} - Photo ${idx + 1}`}
              loading={idx === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
      
      {/* Subtle overlay gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Left and Right Navigation Buttons on Hover */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl backdrop-blur-sm border border-sand-700/50 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal-950/80 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl backdrop-blur-sm border border-sand-700/50 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Photo Dots on hover */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            {imageList.slice(0, Math.min(total, 6)).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIdx ? 'w-4 bg-pine-800' : 'w-1.5 bg-sand-950/70'
                }`}
              />
            ))}
          </div>

          {/* Counter badge on top right */}
          <div className="absolute top-2.5 right-2.5 bg-charcoal-950/75 text-sand-950 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-sand-700/40 pointer-events-none">
            {currentIdx + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}

function RoomCardImageCarousel({ images, name, onClick }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const imageList = Array.isArray(images) && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1546182990-dffeafbe841d'];
  const total = imageList.length;

  useEffect(() => {
    if (Array.isArray(images)) {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      onClick={onClick}
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-sand-900 relative shrink-0 group select-none cursor-pointer"
      title={`${name} - Click to view`}
    >
      <div 
        className="w-full h-full flex transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {imageList.map((imgSrc, idx) => (
          <div key={idx} className="w-full h-full shrink-0 relative overflow-hidden">
            <img
              src={imgSrc}
              alt={name}
              loading={idx === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-charcoal-950/85 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-90 z-10"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-charcoal-950/85 hover:bg-pine-800 text-sand-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-90 z-10"
          >
            <ChevronRight className="w-3 h-3" />
          </button>

          <div className="absolute bottom-0.5 right-0.5 bg-charcoal-950/85 text-sand-950 text-[8px] font-semibold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {currentIdx + 1}/{total}
          </div>
        </>
      )}
    </div>
  );
}

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
  const [rooms, setRooms] = useState(1);
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
          safaris: dailySafaris[idx] || 1,
          isWeekend: d.isWeekend,
          rate: d.isWeekend ? weekendRate : weekdayRate,
        })),
        totalSafaris: totalSafarisCount,
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

  // Dynamic day calculation based on check-in and check-out dates
  const calculateStayBreakdown = () => {
    if (!checkInDate) return { numDays: 1, weekdayDays: 1, weekendDays: 0, daysList: [] };
    
    const start = new Date(checkInDate + 'T00:00:00');
    const end = checkOutDate ? new Date(checkOutDate + 'T00:00:00') : new Date(start);
    const diffMs = end.getTime() - start.getTime();
    // Inclusive date calculation (includes both selected start and end dates)
    const daysCount = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);

    let weekdayDays = 0;
    let weekendDays = 0;
    const daysList = [];

    for (let i = 0; i < daysCount; i++) {
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

    return { numDays: daysCount, weekdayDays, weekendDays, daysList };
  };

  const { numDays, weekdayDays, weekendDays, daysList } = calculateStayBreakdown();

  const weekdayRate = Number(safariPricing?.weekday) || 6000;
  const weekendRate = Number(safariPricing?.weekend) || 8000;

  // Rate per vehicle across all selected days based on custom daily safaris (1, 2, or 3)
  let perVehicleSafariRate = 0;
  let totalSafarisCount = 0;
  let totalWeekdaySafaris = 0;
  let totalWeekendSafaris = 0;

  daysList.forEach((dayItem, idx) => {
    const safarisOnDay = dailySafaris[idx] || 1;
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

  // Accommodation pricing based directly on selected hotel, room category, and meal plan (APAI / MAPAI / CPAI)
  const activeHotelPricing = getHotelPricing(selectedHotel?.id, selectedRoomCategory?.id, selectedRoomCategory);
  const hotelBaseRate = hasAccommodation ? (activeHotelPricing.price || 0) : 0;
  const roomMealRates = activeHotelPricing.room || { apai: 6000, mapai: 5000, cpai: 4000 };

  const activeRoomRate = hasAccommodation
    ? (mealPlan === 'APAI'
      ? roomMealRates.apai
      : mealPlan === 'MAPAI'
      ? roomMealRates.mapai
      : roomMealRates.cpai)
    : 0;

  const perDayStayRate = hasAccommodation ? (hotelBaseRate + activeRoomRate) : 0;
  const accommodationCost = perDayStayRate * rooms * numDays;

  const totalGuests = adults + kids;
  const safariVehicles = Math.max(1, Math.ceil(safariPeople / 6));
  const safariPrice = safariVehicles * perVehicleSafariRate;

  // Total Reservation Cost (Base price is completely removed as requested!)
  const totalPrice = accommodationCost + safariPrice;



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
              <span className="text-xs uppercase text-pine-800 font-bold block tracking-wider">Reserve Your Seat</span>
              <div className="flex items-baseline gap-2 pt-1">
                {hasAccommodation ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-charcoal-900">
                      ₹{perDayStayRate.toLocaleString()}
                    </span>
                    <span className="text-xs text-charcoal-600 font-medium">/ room / day</span>
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-black text-charcoal-800">
                    Expedition Reservation
                  </span>
                )}
              </div>
              <p className="text-[11px] text-pine-800 font-bold pt-0.5">
                {hasAccommodation
                  ? `${selectedRoomCategory.name} · ${selectedHotel.name} · ${mealPlan} Plan`
                  : `Select resort & room on the left · ${mealPlan} Plan`}
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
                <div className="p-3.5 rounded-2xl bg-sand-950 border border-sand-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-charcoal-700 font-bold flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-pine-800 shrink-0" />
                      <span>Resort & Room Stay</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRightPanelChange}
                      aria-label="Change resort or room category"
                      className="text-[11px] font-bold text-pine-800 hover:text-pine-700 hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{hasAccommodation ? 'Change' : 'Choose'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {hasAccommodation ? (
                    <div className="flex items-center gap-3 pt-0.5">
                      <img
                        src={
                          selectedRoomCategory.images?.[0] ||
                          selectedHotel.images?.[0] ||
                          'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200'
                        }
                        alt={selectedHotel.name}
                        className="w-12 h-12 rounded-xl object-cover border border-sand-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-charcoal-950 truncate">
                          {selectedHotel.name}
                        </p>
                        <p className="text-[11px] text-pine-800 font-bold truncate">
                          {selectedRoomCategory.name}
                        </p>
                        <p className="text-[10px] text-charcoal-500 truncate">
                          {selectedRoomCategory.bedType || 'Comfort Bed'} · {selectedRoomCategory.view || 'Scenic View'}
                        </p>
                      </div>
                    </div>
                  ) : selectedHotel ? (
                    <div className="p-2.5 rounded-xl bg-sand-900/60 border border-sand-700/60 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-charcoal-900 truncate">{selectedHotel.name}</p>
                        <p className="text-[10px] text-amber-800 font-medium">Room category pending selection</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleScrollToResortSection}
                        className="px-2.5 py-1 rounded-lg bg-pine-800 text-sand-950 text-[10px] font-bold shrink-0 hover:bg-pine-700 transition-colors"
                      >
                        Pick Room
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-sand-900/60 border border-sand-700/60 flex items-center justify-between gap-2">
                      <p className="text-[11px] text-charcoal-600 font-medium">No resort selected</p>
                      <button
                        type="button"
                        onClick={handleScrollToResortSection}
                        className="px-3 py-1 rounded-lg bg-pine-800 text-sand-950 text-[10px] font-bold shrink-0 hover:bg-pine-700 transition-colors"
                      >
                        Choose Stay
                      </button>
                    </div>
                  )}
                </div>

                {/* Calendar Date Selection: Check-in & Check-out */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] uppercase text-charcoal-700 font-bold tracking-wider">
                          Check-in Date
                        </label>
                        <span className="text-[9px] text-pine-800 font-bold">12:00 PM</span>
                      </div>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => {
                            setCheckInDate(e.target.value);
                            if (e.target.value > checkOutDate) {
                              setCheckOutDate(e.target.value);
                            }
                          }}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] uppercase text-charcoal-700 font-bold tracking-wider">
                          Check-out Date
                        </label>
                        <span className="text-[9px] text-charcoal-500 font-bold">10:00 AM</span>
                      </div>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-pine-800 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          type="date"
                          min={checkInDate}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full bg-sand-950 border border-sand-700 rounded-xl pl-8 pr-2 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-pine-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Duration and Day Types Pill */}
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-sand-950/80 border border-sand-700/80 text-[11px]">
                    <span className="text-charcoal-600 font-medium">Expedition Duration:</span>
                    <span className="text-pine-800 font-bold">
                      {numDays} {numDays === 1 ? 'Day' : 'Days'} ({weekdayDays > 0 ? `${weekdayDays} Weekday${weekdayDays > 1 ? 's' : ''}` : ''}{weekdayDays > 0 && weekendDays > 0 ? ' · ' : ''}{weekendDays > 0 ? `${weekendDays} Weekend${weekendDays > 1 ? 's' : ''}` : ''})
                    </span>
                  </div>
                </div>

                {/* Interactive Number of Passengers Menu (Adults min 1, Kids min 0) */}
                <div className="space-y-1 relative">
                  <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
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
                              <p className="text-[10px] text-charcoal-500 font-medium">Age 12+ years</p>
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
                              <span className="w-5 text-center font-bold text-xs text-charcoal-950">
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
                              <p className="text-[10px] text-charcoal-500 font-medium">Age 0 - 11 years</p>
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
                              <span className="w-5 text-center font-bold text-xs text-charcoal-950">
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
                            className="w-full py-1.5 rounded-lg bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-[11px] tracking-wider uppercase transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Number of Rooms */}
                <div className="space-y-1">
                  <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                    Number of Rooms
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sand-950 border border-sand-700">
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
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                        {rooms}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRooms(rooms + 1)}
                        className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Safari Selection */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                      Safari Selection
                    </label>
                    <span className="text-[10px] text-pine-800 font-bold">
                      ₹{safariPrice.toLocaleString()} ({safariVehicles} {safariVehicles === 1 ? 'Vehicle' : 'Vehicles'})
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sand-950 border border-sand-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-pine-800 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold text-charcoal-950 block">
                            {safariPeople} {safariPeople === 1 ? 'Person' : 'People'}
                          </span>
                          <span className="text-[10px] text-charcoal-500 block">
                            {safariVehicles} {safariVehicles === 1 ? 'Safari Vehicle' : 'Safari Vehicles'} (Max 6 guests / vehicle)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={safariPeople <= 1}
                          onClick={handleDecrementSafariPeople}
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                          aria-label="Decrease safari people"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-charcoal-950">
                          {safariPeople}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrementSafariPeople}
                          className="w-7 h-7 rounded-lg bg-sand-900 border border-sand-700 hover:bg-sand-800 text-charcoal-950 flex items-center justify-center font-bold text-sm transition-colors"
                          aria-label="Increase safari people"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Live Admin Safari Rates Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
                      <div className="bg-sand-900/70 p-2 rounded-lg border border-sand-800/70 text-center">
                        <span className="text-[9px] text-charcoal-600 uppercase block font-bold tracking-wider">Weekday Rate</span>
                        <span className="text-xs font-bold text-pine-800">₹{weekdayRate.toLocaleString()}</span>
                        <span className="text-[9px] text-charcoal-500 block">/ vehicle / day</span>
                      </div>
                      <div className="bg-sand-900/70 p-2 rounded-lg border border-sand-800/70 text-center">
                        <span className="text-[9px] text-charcoal-600 uppercase block font-bold tracking-wider">Weekend Rate</span>
                        <span className="text-xs font-bold text-pine-800">₹{weekendRate.toLocaleString()}</span>
                        <span className="text-[9px] text-charcoal-500 block">/ vehicle / day</span>
                      </div>
                    </div>

                    {/* Daily Safari Schedule: Select number of safaris per day */}
                    <div className="pt-2 border-t border-sand-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase text-charcoal-700 font-bold tracking-wider">
                          Safaris Per Day ({daysList.length} {daysList.length === 1 ? 'Day' : 'Days'})
                        </label>
                        <span className="text-[10px] text-pine-800 font-bold">
                          {totalSafarisCount} {totalSafarisCount === 1 ? 'Safari' : 'Safaris'} Total
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {daysList.map((dayItem, idx) => {
                          const safariCount = dailySafaris[idx] || 1;
                          const dayRate = dayItem.isWeekend ? weekendRate : weekdayRate;
                          const dayVehicleCost = safariCount * dayRate;
                          const dayTotalCost = dayVehicleCost * safariVehicles;

                          return (
                            <div
                              key={`${dayItem.dateStr}-${idx}`}
                              className="p-2.5 rounded-xl bg-sand-900/80 border border-sand-800/80 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-charcoal-950 text-xs">
                                    Day {dayItem.dayIndex}:
                                  </span>
                                  <span className="text-charcoal-800 font-semibold text-xs">
                                    {dayItem.formattedDate}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                    dayItem.isWeekend
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300/70'
                                  }`}>
                                    {dayItem.isWeekend ? 'Weekend' : 'Weekday'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-charcoal-500 pt-0.5">
                                  ₹{dayRate.toLocaleString()} / safari · Total: ₹{dayTotalCost.toLocaleString()} ({safariCount} {safariCount === 1 ? 'safari' : 'safaris'} × {safariVehicles} {safariVehicles === 1 ? 'veh' : 'vehs'})
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <select
                                  value={safariCount}
                                  onChange={(e) => handleDaySafariChange(idx, e.target.value)}
                                  className="bg-sand-950 border border-sand-700 text-charcoal-950 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-pine-800 cursor-pointer shadow-xs"
                                  aria-label={`Select number of safaris for Day ${dayItem.dayIndex}`}
                                >
                                  <option value={1}>1 Safari</option>
                                  <option value={2}>2 Safaris</option>
                                  <option value={3}>3 Safaris</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-sand-800/60 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-600 font-medium">Vehicle Allocation:</span>
                        <span className="text-charcoal-900 font-bold">
                          {safariVehicles} × Safari {safariVehicles === 1 ? 'Vehicle' : 'Vehicles'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-600 font-medium">Total Safaris Selected:</span>
                        <span className="text-charcoal-900 font-bold">
                          {totalSafarisCount} {totalSafarisCount === 1 ? 'Safari' : 'Safaris'} across {numDays} {numDays === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-600 font-medium">Date-based Safari Rate:</span>
                        <span className="text-pine-800 font-bold">
                          ₹{safariPrice.toLocaleString()} ({safariVehicles} × ₹{perVehicleSafariRate.toLocaleString()}/veh)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select Meal Option */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase text-charcoal-700 font-bold tracking-wider">
                      Select Meal Option
                    </label>
                    <span className="text-[10px] text-pine-800 font-bold">
                      {mealPlan} Plan
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* APAI */}
                    <div
                      onClick={() => setMealPlan('APAI')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        mealPlan === 'APAI'
                          ? 'border-pine-800 bg-sand-900 ring-2 ring-pine-800/30 shadow-sm'
                          : 'border-sand-700/80 bg-sand-950/60 hover:border-sand-600 hover:bg-sand-900/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        mealPlan === 'APAI' ? 'border-pine-800 bg-pine-800' : 'border-charcoal-400'
                      }`}>
                        {mealPlan === 'APAI' && <div className="w-1.5 h-1.5 rounded-full bg-sand-950" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-charcoal-950">APAI (All Meals Included)</p>
                          <span className="text-[11px] text-pine-800 font-bold">
                            ₹{roomMealRates.apai.toLocaleString()} / day
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-700 leading-tight pt-0.5 font-normal">
                          Lunch, High Tea, Dinner and Breakfast
                        </p>
                      </div>
                    </div>

                    {/* MAPAI */}
                    <div
                      onClick={() => setMealPlan('MAPAI')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        mealPlan === 'MAPAI'
                          ? 'border-pine-800 bg-sand-900 ring-2 ring-pine-800/30 shadow-sm'
                          : 'border-sand-700/80 bg-sand-950/60 hover:border-sand-600 hover:bg-sand-900/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        mealPlan === 'MAPAI' ? 'border-pine-800 bg-pine-800' : 'border-charcoal-400'
                      }`}>
                        {mealPlan === 'MAPAI' && <div className="w-1.5 h-1.5 rounded-full bg-sand-950" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-charcoal-950">MAPAI</p>
                          <span className="text-[11px] text-pine-800 font-bold">
                            ₹{roomMealRates.mapai.toLocaleString()} / day
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-700 leading-tight pt-0.5 font-normal">
                          Breakfast and Lunch or Dinner
                        </p>
                      </div>
                    </div>

                    {/* CPAI */}
                    <div
                      onClick={() => setMealPlan('CPAI')}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        mealPlan === 'CPAI'
                          ? 'border-pine-800 bg-sand-900 ring-2 ring-pine-800/30 shadow-sm'
                          : 'border-sand-700/80 bg-sand-950/60 hover:border-sand-600 hover:bg-sand-900/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        mealPlan === 'CPAI' ? 'border-pine-800 bg-pine-800' : 'border-charcoal-400'
                      }`}>
                        {mealPlan === 'CPAI' && <div className="w-1.5 h-1.5 rounded-full bg-sand-950" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-charcoal-950">CPAI</p>
                          <span className="text-[11px] text-pine-800 font-bold">
                            ₹{roomMealRates.cpai.toLocaleString()} / day
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-700 leading-tight pt-0.5 font-normal">
                          Breakfast only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="pt-2.5 border-t border-sand-700 space-y-2 text-xs text-charcoal-700">
                  {hasAccommodation ? (
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-charcoal-900">
                          Stay ({selectedRoomCategory ? selectedRoomCategory.name : selectedHotel?.name || 'Resort Stay'})
                        </span>
                        <span className="block text-[10px] text-charcoal-500 font-normal">
                          ₹{perDayStayRate.toLocaleString()} × {rooms} {rooms === 1 ? 'room' : 'rooms'} × {numDays} {numDays === 1 ? 'day' : 'days'} ({mealPlan} Plan)
                        </span>
                      </div>
                      <span className="font-bold text-charcoal-900">₹{accommodationCost.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-charcoal-800 text-[11px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="font-bold text-amber-900 block">Resort & Room Pending</span>
                        <span>Select a resort and room category on the left to calculate stay and total cost.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-charcoal-900">Safari ({safariVehicles} {safariVehicles === 1 ? 'Vehicle' : 'Vehicles'} · {totalSafarisCount} {totalSafarisCount === 1 ? 'Safari' : 'Safaris'})</span>
                      <span className="block text-[10px] text-charcoal-500 font-normal">
                        {totalWeekdaySafaris > 0 && `${totalWeekdaySafaris} weekday safari${totalWeekdaySafaris > 1 ? 's' : ''} @ ₹${weekdayRate.toLocaleString()}`}
                        {totalWeekdaySafaris > 0 && totalWeekendSafaris > 0 && ' · '}
                        {totalWeekendSafaris > 0 && `${totalWeekendSafaris} weekend safari${totalWeekendSafaris > 1 ? 's' : ''} @ ₹${weekendRate.toLocaleString()}`}
                      </span>
                    </div>
                    <span className="font-bold text-charcoal-900">+₹{safariPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between font-bold text-charcoal-900 text-sm pt-2 border-t border-sand-700 items-baseline">
                    <span>Total Reservation Cost</span>
                    {hasAccommodation ? (
                      <span className="text-pine-800 text-base">₹{totalPrice.toLocaleString()}</span>
                    ) : (
                      <span className="text-charcoal-500 text-xs font-semibold">Stay Pending</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    {bookingLoading
                      ? 'Processing...'
                      : !hasAccommodation
                      ? 'Select Resort & Room to Reserve'
                      : user
                      ? 'Book Your Safari Now'
                      : 'Sign In to Reserve'}
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
            {hasAccommodation ? (
              <>
                <p className="text-xs font-black text-charcoal-950 truncate">
                  ₹{totalPrice.toLocaleString()} <span className="text-[10px] font-normal text-charcoal-600">Total ({numDays} {numDays === 1 ? 'day' : 'days'})</span>
                </p>
                <p className="text-[10px] text-pine-800 font-bold truncate">
                  {selectedHotel.name} · {selectedRoomCategory.name}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-black text-charcoal-950 truncate">
                  Expedition Reservation
                </p>
                <p className="text-[10px] text-amber-800 font-medium truncate">
                  Resort & room pending selection
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
