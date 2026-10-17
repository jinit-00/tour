import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Users,
  Image,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Tours', path: '/admin/tours', icon: Compass },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Content & Gallery', path: '/admin/content', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex">
      {/* Light Theme Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-extrabold tracking-tight text-lg text-slate-900 block">
                JUNGLEE ADMIN
              </span>
              <span className="text-xs text-emerald-600 font-medium">Control Center v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back to Main Website</span>
          </Link>

          {user && (
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">JungleE Wildlife Expeditions Admin Panel</h1>
            <p className="text-xs text-slate-500">Live operational & inventory control</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Active</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user?.name ? user.name[0] : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Component */}
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
