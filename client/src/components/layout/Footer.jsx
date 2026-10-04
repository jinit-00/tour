import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import TermsModal from '../ui/TermsModal';
import logoImg from '../../assets/logo.png';

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  return (
    <footer className="bg-sand-900 text-charcoal-800 border-t border-sand-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sand-700">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img src={logoImg} alt="JungleE Wildlife Expeditions Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black tracking-wider text-lg text-charcoal-900 uppercase">
                  JungleE
                </span>
                <span className="text-[10px] tracking-widest uppercase text-pine-800 font-mono font-bold">
                  WILDLIFE EXPEDITIONS
                </span>
              </div>
            </Link>
            <p className="text-sm text-charcoal-700 leading-relaxed max-w-sm">
              Crafting immersive, small-group wildlife photography safaris to Earth's most breathtaking untamed frontiers. Guided by world-renowned naturalists and wildlife photographers at JungleE Wildlife Expeditions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/Jungleewildlifeexpeditions"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/junglee.wildlife.expeditions"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@JungleEWildlifeExpeditions"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-9 h-9 rounded-full bg-sand-800 border border-sand-700 hover:bg-pine-800 hover:text-sand-950 transition-colors flex items-center justify-center text-charcoal-800"
              >
                <Youtube className="w-4 h-4" />
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

          {/* Featured Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono text-pine-800 font-bold tracking-widest">Destinations</h4>
            <ul className="space-y-2 text-sm text-charcoal-700">
              <li>Gir Asiatic Lion Sanctuary</li>
              <li>Jawai Granite Hills</li>
              <li>Bandhavgarh & Kanha</li>
              <li>Pench & Tadoba</li>
              <li>Jim Corbett National Park</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono text-pine-800 font-bold tracking-widest">Basecamp Contact</h4>
            <ul className="space-y-3 text-sm text-charcoal-700">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pine-800 shrink-0 mt-1" />
                <span className="leading-snug">A-803, Money Plant High Street, Gota, Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-pine-800 shrink-0 mt-1" />
                <div className="flex flex-col gap-1 text-xs">
                  <div>
                    <span className="font-bold text-charcoal-900">Vatsal Dangi: </span>
                    <a href="tel:+919665129435" className="hover:text-pine-800 font-mono">+91-9665129435</a>
                  </div>
                  <div>
                    <span className="font-bold text-charcoal-900">Harsh Barad: </span>
                    <a href="tel:+917096392919" className="hover:text-pine-800 font-mono">+91-7096392919</a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pine-800 shrink-0" />
                <a href="mailto:safari@jungleewildlife.co.in" className="hover:text-pine-800 text-xs font-mono font-bold">safari@jungleewildlife.co.in</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-charcoal-600 gap-4">
          <p>© {new Date().getFullYear()} JungleE Wildlife Expeditions. All rights reserved.</p>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-charcoal-900 transition-colors font-medium cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </footer>
  );
}
