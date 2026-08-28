import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminTours, createAdminTour, updateAdminTour, deleteAdminTour } from '../../services/api';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [packages, setPackages] = useState([{ name: 'Standard Expedition', price: 0, description: '' }]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await getAdminTours();
      setTours(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tour = null) => {
    if (tour) {
      setEditingTour(tour);
      setTitle(tour.title);
      setDescription(tour.description);
      setLocation(tour.location);
      setBasePrice(tour.basePrice);
      setDuration(tour.duration);
      setIsFeatured(tour.isFeatured);
      setImageUrl(tour.images && tour.images[0] ? tour.images[0] : '');
      setPackages(tour.packages && tour.packages.length > 0 ? tour.packages : [{ name: '', price: 0, description: '' }]);
    } else {
      setEditingTour(null);
      setTitle('');
      setDescription('');
      setLocation('');
      setBasePrice('');
      setDuration('');
      setIsFeatured(false);
      setImageUrl('');
      setPackages([{ name: 'Standard Expedition', price: 0, description: 'Basic small group package' }]);
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save tour.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour and its packages?')) return;
    try {
      await deleteAdminTour(id);
      fetchTours();
    } catch (err) {
      alert('Failed to delete tour.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manage Expeditions & Tours</h2>
            <p className="text-xs text-slate-500">Add, edit, or set pricing packages for wildlife photography safaris</p>
          </div>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Tour</span>
          </button>
        </div>

        {/* Tours Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Tour Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Packages</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400 font-mono">Loading tours inventory...</td></tr>
              ) : tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img src={tour.images && tour.images[0] ? tour.images[0] : ''} alt={tour.title} className="w-10 h-10 rounded-lg object-cover border" />
                    <div>
                      <span>{tour.title}</span>
                      {tour.isFeatured && (
                        <span className="ml-2 px-1.5 py-0.5 text-[9px] uppercase font-bold bg-amber-100 text-amber-800 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-600">{tour.location}</td>
                  <td className="p-4 text-xs font-mono text-slate-600">{tour.duration}</td>
                  <td className="p-4 font-bold text-emerald-700">${tour.basePrice.toLocaleString()}</td>
                  <td className="p-4 text-xs font-mono text-slate-500">{tour.packages ? tour.packages.length : 0} Add-ons</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openModal(tour)}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{editingTour ? 'Edit Tour Expedition' : 'Create New Expedition'}</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tour Title</label>
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
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location</label>
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
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Duration</label>
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
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Base Price ($ USD)</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Cover Image URL</label>
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
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tour Description</label>
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
                    <label className="block text-xs font-bold text-slate-900 uppercase">Tour Add-on Packages</label>
                    <button
                      type="button"
                      onClick={addPackageRow}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      + Add Package
                    </button>
                  </div>

                  {packages.map((pkg, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
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
                          placeholder="Price ($)"
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
