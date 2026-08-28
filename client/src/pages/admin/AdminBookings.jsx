import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminBookings, updateAdminBookingStatus, deleteAdminBooking } from '../../services/api';
import { CalendarCheck, Trash2, Filter } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAdminBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAdminBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await deleteAdminBooking(id);
      fetchBookings();
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  const filteredBookings = statusFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Expedition Bookings Manager</h2>
            <p className="text-xs text-slate-500">Review pending client requests, confirm spots, or cancel bookings</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase">Status:</span>
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Expedition Tour</th>
                <th className="p-4">Date & Guests</th>
                <th className="p-4">Package Add-on</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-mono">Loading bookings queue...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400 font-mono">No bookings found for this filter.</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{b.user?.name || 'Explorer'}</p>
                      <p className="text-xs font-mono text-slate-500">{b.user?.email}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{b.tour?.title}</p>
                      <p className="text-xs text-slate-500">{b.tour?.location}</p>
                    </td>

                    <td className="p-4 text-xs font-mono text-slate-600">
                      <p>{new Date(b.bookingDate).toLocaleDateString()}</p>
                      <p className="text-slate-400">{b.numPeople} {b.numPeople === 1 ? 'Guest' : 'Guests'}</p>
                    </td>

                    <td className="p-4 text-xs font-mono text-slate-600">
                      {b.tourPackage ? `${b.tourPackage.name} (+$${b.tourPackage.price})` : 'Standard'}
                    </td>

                    <td className="p-4 font-bold text-emerald-700">${b.totalAmount.toLocaleString()}</td>

                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`text-xs font-bold font-mono py-1 px-2 rounded border focus:outline-none ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : b.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
