import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminAnalytics } from '../../services/api';
import { DollarSign, CalendarCheck, Compass, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { month: 'May', revenue: 14200, bookings: 4 },
    { month: 'Jun', revenue: 19800, bookings: 5 },
    { month: 'Jul', revenue: 24500, bookings: 7 },
    { month: 'Aug', revenue: 31200, bookings: 8 },
    { month: 'Sep', revenue: 28400, bookings: 6 },
    { month: 'Oct', revenue: 38900, bookings: 10 },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-12 text-center text-slate-500 font-mono">Loading analytics telemetry...</div>
      </AdminLayout>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">${(metrics.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +18.4% from last month
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Total Bookings</span>
              <CalendarCheck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.totalBookings || 0}</p>
            <p className="text-[11px] text-slate-400 font-medium">Confirmed & Pending</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Active Tours</span>
              <Compass className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.totalTours || 0}</p>
            <p className="text-[11px] text-slate-400 font-medium">Live In Inventory</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.totalUsers || 0}</p>
            <p className="text-[11px] text-slate-400 font-medium">Verified Accounts</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Unread Messages</span>
              <MessageSquare className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{metrics.unreadMessages || 0}</p>
            <p className="text-[11px] text-rose-600 font-medium">Inquiry Inbox</p>
          </div>

        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Revenue Growth Trend ($)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Monthly Expeditions Booked</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Tours Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Top Performing Expeditions</h3>
          </div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Tour Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Total Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data?.topTours?.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{tour.title}</td>
                  <td className="p-4 text-xs font-mono text-slate-500">{tour.location}</td>
                  <td className="p-4 font-semibold text-emerald-700">${tour.price.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                      {tour.bookingCount} bookings
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
