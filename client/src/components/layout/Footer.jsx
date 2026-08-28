import React from 'react';
import { Link } from 'react-router-dom';
import { Compass as TreeIcon, Instagram, Facebook, Youtube, Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sand-900 text-charcoal-800 border-t border-sand-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sand-700">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-sand-950">
                <TreeIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold tracking-widest text-lg text-charcoal-900 uppercase">
                  SILVAN TOURS
                </span>
                <span className="text-[10px] tracking-widest uppercase text-charcoal-600 font-mono">
                  WILDLIFE EXPEDITIONS
                </span>
              </div>
            </Link>
            <p className="text-sm text-charcoal-700 leading-relaxed max-w-sm">
              Crafting immersive, small-group wildlife photography safaris to Earth's most breathtaking untamed frontiers. Guided by world-renowned naturalists and wildlife photographers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800">
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono text-pine-800 font-bold tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tours" className="hover:text-pine-800 transition-colors">Expedition Tours</Link></li>
              <li><Link to="/about" className="hover:text-pine-800 transition-colors">About Our Guides</Link></li>
              <li><Link to="/gallery" className="hover:text-pine-800 transition-colors">Photo Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-pine-800 transition-colors">Field Notes & Blog</Link></li>
              <li><Link to="/faq" className="hover:text-pine-800 transition-colors">Expedition FAQ</Link></li>
            </ul>
          </div>

          {/* Featured Regions */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono text-pine-800 font-bold tracking-widest">Destinations</h4>
            <ul className="space-y-2 text-sm text-charcoal-700">
              <li>Ranthambore, India</li>
              <li>Greater Kruger, South Africa</li>
              <li>Serengeti, Tanzania</li>
              <li>Pantanal, Brazil</li>
              <li>Tromsø & Senja, Norway</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono text-pine-800 font-bold tracking-widest">Basecamp Contact</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-700">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
                <span>104 Wildwood Ridge, Aspen, CO 81611</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pine-800 shrink-0" />
                <span>+1 (800) 555-SILVAN</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pine-800 shrink-0" />
                <span>expeditions@silvantours.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-charcoal-600 gap-4">
          <p>© {new Date().getFullYear()} Silvan Tours LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-charcoal-900">Privacy Policy</a>
            <a href="#" className="hover:text-charcoal-900">Terms of Service</a>
            <a href="#" className="hover:text-charcoal-900">Wildlife Ethics Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
