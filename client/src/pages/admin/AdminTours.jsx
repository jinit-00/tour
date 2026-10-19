import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  getAdminTours, 
  createAdminTour, 
  updateAdminTour, 
  deleteAdminTour, 
  toggleAdminTourVisibility,
  getSafariPricing,
  setSafariPricing,
  syncSafariPricingFromCloud
} from '../../services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Check, 
  Search, 
  ExternalLink,
  Sparkles,
  IndianRupee,
  Save,
  Calendar
} from 'lucide-react';

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  // Filters & Search
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'visible' | 'hidden'
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTourVisible, setIsTourVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [packages, setPackages] = useState([{ name: 'Standard Expedition', price: 0, description: '' }]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Safari Pricing Manager (Weekday & Weekend rates)
  const initialPricing = getSafariPricing();
  const [weekdaySafariPrice, setWeekdaySafariPrice] = useState(initialPricing.weekday || 6000);
  const [weekendSafariPrice, setWeekendSafariPrice] = useState(initialPricing.weekend || 8000);
  const [selectedPricingTour, setSelectedPricingTour] = useState('all');
  const [savingPricing, setSavingPricing] = useState(false);

  useEffect(() => {
    fetchTours();
    syncSafariPricingFromCloud().then((p) => {
      if (p) {
        setWeekdaySafariPrice(p.weekday || 6000);
        setWeekendSafariPrice(p.weekend || 8000);
      }
    }).catch(() => {});
  }, []);

  // When changing destination in pricing selector, load that specific tour's custom pricing if set
  const handleSelectPricingTour = (slug) => {
    setSelectedPricingTour(slug);
    const p = getSafariPricing(slug === 'all' ? null : slug);
    setWeekdaySafariPrice(p.weekday);
    setWeekendSafariPrice(p.weekend);
  };

  const handleSaveSafariPricing = async () => {
    const wDay = parseFloat(weekdaySafariPrice);
    const wEnd = parseFloat(weekendSafariPrice);
    if (isNaN(wDay) || wDay < 0 || isNaN(wEnd) || wEnd < 0) {
      alert('Please enter valid positive numbers for both Weekday and Weekend prices.');
      return;
    }
    setSavingPricing(true);
    try {
      if (selectedPricingTour === 'all') {
        await setSafariPricing({ weekday: wDay, weekend: wEnd });
      } else {
        const current = getSafariPricing();
        const updatedBySlug = {
          ...(current.bySlug || {}),
          [selectedPricingTour]: { weekday: wDay, weekend: wEnd }
        };
        await setSafariPricing({ bySlug: updatedBySlug });
      }
      setToast({
        type: 'visible',
        message: `Safari pricing updated: Weekday ₹${wDay.toLocaleString()} / Weekend ₹${wEnd.toLocaleString()}. Live website updated!`,
      });
    } catch (err) {
      alert('Failed to save safari pricing.');
    } finally {
      setSavingPricing(false);
    }
  };

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await getAdminTours();
      setTours(res.data || []);
    } catch (err) {
      console.error('Failed to load admin tours:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle safari card visibility (Hide / Show in tour section)
  const handleToggleVisibility = async (tour) => {
    const nextHiddenState = !tour.isHidden;

    // Optimistically update UI
    setTours((prev) =>
      prev.map((t) =>
        t.id === tour.id || t.slug === tour.slug
          ? { ...t, isHidden: nextHiddenState }
          : t
      )
    );

    // Persist via service (local storage + backend API)
    await toggleAdminTourVisibility(tour, nextHiddenState);

    // Show toast message
    setToast({
      type: nextHiddenState ? 'hidden' : 'visible',
      message: nextHiddenState
        ? `"${tour.title}" has been hidden from the tour section.`
        : `"${tour.title}" is now visible in the tour section.`,
      slug: tour.slug,
    });
  };

  const openModal = (tour = null) => {
    if (tour) {
      setEditingTour(tour);
      setTitle(tour.title || '');
      setDescription(tour.description || '');
      setLocation(tour.location || '');
      setBasePrice(tour.basePrice || '');
      setDuration(tour.duration || '');
      setIsFeatured(Boolean(tour.isFeatured));
      setIsTourVisible(!tour.isHidden);
      setImageUrl(tour.images && tour.images[0] ? tour.images[0] : '');
      setPackages(
        tour.packages && tour.packages.length > 0
          ? tour.packages
          : [{ name: '', price: 0, description: '' }]
      );
    } else {
      setEditingTour(null);
      setTitle('');
      setDescription('');
      setLocation('');
      setBasePrice('');
      setDuration('');
      setIsFeatured(false);
      setIsTourVisible(true);
      setImageUrl('');
      setPackages([
        { name: 'Standard Expedition', price: 0, description: 'Basic small group package' }
      ]);
    }
    setError('');
    setModalOpen(true);
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...packages];
    updated[index][field] = value;
    setPackages(updated);
  };

  const addPackageRow = () => {
    setPackages([...packages, { name: '', price: 0, description: '' }]);
  };

  const removePackageRow = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title,
      description,
      location,
      basePrice: parseFloat(basePrice),
      duration,
      isFeatured,
      isHidden: !isTourVisible,
      images: [imageUrl],
      packages,
    };

    try {
      if (editingTour) {
        await updateAdminTour(editingTour.id, payload);
      } else {
        await createAdminTour(payload);
      }
      setModalOpen(false);
      fetchTours();
      setToast({
        type: 'visible',
        message: editingTour
          ? `"${title}" updated successfully.`
          : `"${title}" created successfully.`,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour and its packages? To hide it instead, use the toggle button.')) return;
    try {
      await deleteAdminTour(id);
      fetchTours();
    } catch (err) {
      alert('Failed to delete tour.');
    }
  };

  // Filtered tours for table display
  const filteredTours = tours.filter((tour) => {
    const matchesFilter =
      filterTab === 'all'
        ? true
        : filterTab === 'visible'
        ? !tour.isHidden
        : Boolean(tour.isHidden);

    const matchesSearch = searchQuery
      ? tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.slug && tour.slug.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesFilter && matchesSearch;
  });

  const visibleCount = tours.filter((t) => !t.isHidden).length;
  const hiddenCount = tours.filter((t) => Boolean(t.isHidden)).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manage Expeditions & Tours</h2>
            <p className="text-xs text-slate-500">
              Control safari visibility with the toggle switch, add new expeditions, or customize pricing packages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/tours"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Tour Section</span>
            </Link>

            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Tour</span>
            </button>
          </div>
        </div>

        {/* Real-time Toast Feedback Banner */}
        {toast && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm shadow-sm transition-all animate-fadeIn ${
              toast.type === 'hidden'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'hidden' ? (
                <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="font-medium">{toast.message}</span>
              <Link
                to="/tours"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline ml-1 hover:opacity-80 inline-flex items-center gap-1"
              >
                <span>Check Tour Section</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Safari Vehicle Pricing Manager - 2 Sections: Weekday & Weekend Rates */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 rounded-2xl border border-emerald-800/40 shadow-xl space-y-5 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Safari Pricing Manager
                  </h3>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-300 pt-0.5">
                  Write and adjust safari vehicle rates. When updated, the new rates instantly reflect on the main website booking card.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Optional Tour Specific Selector */}
              <select
                value={selectedPricingTour}
                onChange={(e) => handleSelectPricingTour(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
              >
                <option value="all">All Safaris (Global Standard)</option>
                {tours.map((t) => (
                  <option key={t.slug || t.id} value={t.slug || t.id}>
                    {t.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSaveSafariPricing}
                disabled={savingPricing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingPricing ? 'Syncing...' : 'Save Safari Prices'}</span>
              </button>
            </div>
          </div>

          {/* 2 Distinct Sections: Weekday Price & Weekend Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* SECTION 1: Weekday Safari Price */}
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <label className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                    Section 1: Weekday Price (Monday – Friday)
                  </label>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Per Vehicle (Max 6)
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-emerald-400 pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={weekdaySafariPrice}
                  onChange={(e) => setWeekdaySafariPrice(e.target.value)}
                  placeholder="6000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                Standard vehicle booking charge applied when visitors select dates falling on a weekday (Monday to Friday).
              </p>
            </div>

            {/* SECTION 2: Weekend Safari Price */}
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <label className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                    Section 2: Weekend Price (Saturday – Sunday)
                  </label>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                  Per Vehicle (Max 6)
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-amber-400 pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={weekendSafariPrice}
                  onChange={(e) => setWeekendSafariPrice(e.target.value)}
                  placeholder="8000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                Peak weekend rate charged per vehicle when visitors choose Saturday or Sunday safari departures.
              </p>
            </div>

          </div>
        </div>


        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase mr-1">Filter:</span>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({tours.length})
            </button>
            <button
              onClick={() => setFilterTab('visible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterTab === 'visible'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visible ({visibleCount})</span>
            </button>
            <button
              onClick={() => setFilterTab('hidden')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterTab === 'hidden'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hidden ({hiddenCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or park..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Tours Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Safari Tour</th>
                <th className="p-4">Location</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Base Price</th>
                <th className="p-4 text-center">Tour Section Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-mono">
                    Loading tours inventory...
                  </td>
                </tr>
              ) : filteredTours.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No tours found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => {
                  const isHidden = Boolean(tour.isHidden);
                  return (
                    <tr
                      key={tour.id || tour.slug}
                      className={`transition-colors ${
                        isHidden
                          ? 'bg-slate-50/70 hover:bg-slate-100/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Tour Title & Thumbnail */}
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={tour.images && tour.images[0] ? tour.images[0] : ''}
                          alt={tour.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={isHidden ? 'text-slate-600' : 'text-slate-900'}>
                              {tour.title}
                            </span>
                            {tour.isFeatured && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-amber-100 text-amber-800 rounded">
                                Featured
                              </span>
                            )}
                            {isHidden && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold bg-slate-200 text-slate-600 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-slate-400 block pt-0.5">
                            {tour.slug}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 text-xs font-mono text-slate-600">{tour.location}</td>

                      {/* Duration */}
                      <td className="p-4 text-xs font-mono text-slate-600">{tour.duration}</td>

                      {/* Base Price */}
                      <td className="p-4 font-bold text-emerald-700">
                        ₹{(tour.basePrice || 0).toLocaleString()}
                      </td>

                      {/* Visibility Toggle Button */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          {/* Tactile Toggle Switch */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!isHidden}
                            onClick={() => handleToggleVisibility(tour)}
                            title={
                              isHidden
                                ? 'Click to show this safari card back in the tour section'
                                : 'Click to hide this safari card from the tour section'
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                              !isHidden ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                !isHidden ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${
                              !isHidden
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {!isHidden ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                <span>Hidden</span>
                              </>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Edit & Delete Actions */}
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openModal(tour)}
                          title="Edit Tour"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          title="Delete Tour"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingTour ? 'Edit Tour Expedition' : 'Create New Expedition'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tour Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Serengeti Great Migration & Big Cats Masterclass"
                    className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Serengeti National Park, Tanzania"
                      className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="8 Days / 7 Nights"
                      className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Base Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="4850"
                      className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Feature on Home Page</span>
                    </label>
                  </div>
                </div>

                {/* Tour Section Visibility Toggle in Modal */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 uppercase">
                      Tour Section Visibility
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {isTourVisible
                        ? 'This safari is currently visible in the public tour section'
                        : 'This safari is temporarily hidden from travellers in the tour section'}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTourVisible}
                    onClick={() => setIsTourVisible(!isTourVisible)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      isTourVisible ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isTourVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tour Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed expedition overview..."
                    className="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Add-on Packages Builder */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-900 uppercase">
                      Tour Add-on Packages
                    </label>
                    <button
                      type="button"
                      onClick={addPackageRow}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      + Add Package
                    </button>
                  </div>

                  {packages.map((pkg, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative"
                    >
                      {packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackageRow(i)}
                          className="absolute top-2 right-2 text-rose-500 hover:text-rose-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Package Name"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(i, 'name', e.target.value)}
                          className="border border-slate-300 rounded p-1.5 text-xs col-span-2"
                        />
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(i, 'price', e.target.value)}
                          className="border border-slate-300 rounded p-1.5 text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Package Description"
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(i, 'description', e.target.value)}
                        className="w-full border border-slate-300 rounded p-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Save Tour Expedition'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
