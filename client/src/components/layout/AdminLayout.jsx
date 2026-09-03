import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Users,
  Image,
  MessageSquare,
  LogOut,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout, openAuthModal } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Admin Access Restricted</h2>
          <p className="text-slate-300 text-sm">
            You must be logged in with administrator privileges to access this control panel.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              Sign In as Admin
            </button>
            <Link
              to="/"
              className="w-full py-2 text-slate-400 hover:text-white text-sm"
            >
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
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

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-emerald-600 font-mono">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user.name ? user.name[0] : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Component */}
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
