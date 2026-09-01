import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../services/api';
import { Calendar, MapPin, Users, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this safari reservation?')) return;
    try {
      await cancelBooking(id);
      setActionMsg('Reservation cancelled successfully.');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-sand-700 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-pine-800 font-bold">Explorer Portal</span>
          <h1 className="text-3xl font-extrabold text-charcoal-900">Welcome, {user?.name || 'Photographer'}</h1>
          <p className="text-xs text-charcoal-700 font-normal">{user?.email}</p>
        </div>
        <Link
          to="/tours"
          className="px-6 py-3 bg-pine-800 hover:bg-pine-700 text-sand-950 rounded-full text-xs font-bold shadow-md transition-all"
        >
          Book New Safari
        </Link>
      </div>

      {actionMsg && (
        <div className="p-4 bg-sand-900 border border-sand-700 text-pine-800 rounded-2xl text-xs font-mono">
          ✅ {actionMsg}
        </div>
      )}

      {/* Bookings Showcase */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-charcoal-900">My Safari Expeditions</h2>

        {loading ? (
          <div className="text-center py-16 font-mono text-charcoal-700">Loading your reservations...</div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-sand-700">
            <Calendar className="w-10 h-10 text-pine-800 mx-auto" />
            <h3 className="text-lg font-bold text-charcoal-900">No Reservations Found</h3>
            <p className="text-xs text-charcoal-700 font-normal">
              You haven't booked any upcoming wildlife photography masterclasses yet.
            </p>
            <Link to="/tours" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 rounded-full text-xs font-bold">
              Browse Expeditions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-panel p-6 rounded-2xl border border-sand-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-pine-800/10 text-pine-800 border border-pine-800/20'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-mono text-charcoal-500">Ref: #{b.id.slice(0, 8)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal-900">{b.tour?.title || 'Wildlife Expedition'}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-charcoal-700">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pine-800" /> {b.tour?.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-pine-800" /> {new Date(b.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-pine-800" /> {b.guests} Guests</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 border-sand-700 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-charcoal-500 uppercase block">Total Cost</span>
                    <span className="text-xl font-extrabold text-charcoal-900">${b.totalPrice?.toLocaleString()}</span>
                  </div>

                  {b.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="p-2 text-rose-700 hover:bg-rose-100/50 rounded-xl transition-colors text-xs font-bold"
                      title="Cancel Booking"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
