import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your expedition bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking.');
    }
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-10">
      
      {/* Dashboard Header */}
      <div className="glass-panel p-8 rounded-3xl border border-sand-700 space-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-mono uppercase text-pine-800 font-bold">Photographer Portal</span>
          <h1 className="text-3xl font-extrabold text-charcoal-900">Welcome, {user.name}</h1>
          <p className="text-xs text-charcoal-700 font-mono mt-0.5">{user.email}</p>
        </div>

        <Link
          to="/tours"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <span>Explore More Expeditions</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-charcoal-900">My Reserved Safaris</h2>

        {loading ? (
          <div className="text-center py-16 font-mono text-charcoal-700">Loading expedition records...</div>
        ) : error ? (
          <div className="p-4 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl text-sm">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-sand-700 max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-pine-800 mx-auto" />
            <h3 className="text-lg font-bold text-charcoal-900">No Reserved Expeditions</h3>
            <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
              You haven't reserved any wildlife safaris yet. Browse our curated masterclass departures to get started.
            </p>
            <Link to="/tours" className="inline-block px-6 py-2.5 bg-pine-800 text-sand-950 font-bold rounded-full text-xs shadow-md">
              Browse Expeditions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusColors = {
                CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
                CANCELLED: 'bg-rose-100 text-rose-800 border-rose-300',
              };

              return (
                <div
                  key={booking.id}
                  className="glass-panel p-6 rounded-2xl border border-sand-700 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${statusColors[booking.status] || statusColors.PENDING}`}>
                        {booking.status}
                      </span>
                      <span className="text-xs font-mono text-charcoal-500">
                        Ref: {booking.id.slice(0, 8)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal-900">{booking.tourTitle}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-charcoal-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pine-800" />
                        <span>{booking.tourLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pine-800" />
                        <span>Departure: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span>Photographers: {booking.guestsCount}</span>
                      </div>
                    </div>

                    {booking.packageName && (
                      <p className="text-xs text-pine-800 font-mono font-bold">
                        Tier Package: {booking.packageName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 border-t md:border-t-0 border-sand-700 pt-4 md:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-charcoal-500 uppercase block">Total Price</span>
                      <span className="text-xl font-extrabold text-pine-800">${booking.totalPrice?.toLocaleString()}</span>
                    </div>

                    {booking.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-4 py-2 rounded-xl bg-sand-900 border border-rose-400 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
                      >
                        Cancel Seat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
