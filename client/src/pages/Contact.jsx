import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', tourInterest: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-16">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Get in Touch</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Contact Expedition Basecamp</h1>
        <p className="text-sm sm:text-base text-charcoal-700 font-normal">
          Have questions about trip dates, lens recommendations, or custom private departures? Reach out to our expedition naturalists directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl border border-sand-700 space-y-8 shadow-xl">
          <h3 className="text-2xl font-bold text-charcoal-900">Basecamp HQ</h3>
          
          <ul className="space-y-6 text-sm text-charcoal-700">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono text-charcoal-500 block uppercase font-bold">Address</span>
                <span>104 Wildwood Ridge, Aspen, CO 81611</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono text-charcoal-500 block uppercase font-bold">Phone</span>
                <span>+1 (800) 555-SILVAN</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono text-charcoal-500 block uppercase font-bold">Email</span>
                <span>expeditions@silvantours.com</span>
              </div>
            </li>
          </ul>

          <div className="pt-4 border-t border-sand-700 text-xs text-charcoal-600 font-mono">
            ⏱️ Office hours: Monday – Friday, 8:00 AM – 6:00 PM MST
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 shadow-xl">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-pine-800 mx-auto" />
              <h3 className="text-2xl font-bold text-charcoal-900">Message Received!</h3>
              <p className="text-sm text-charcoal-700 max-w-md mx-auto">
                Thank you for reaching out. One of our lead naturalists will get back to you within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Elena Vance"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-3 px-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="photographer@domain.com"
                    className="w-full bg-sand-950 border border-sand-700 rounded-xl py-3 px-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Expedition Interest</label>
                <select
                  value={form.tourInterest}
                  onChange={(e) => setForm({ ...form, tourInterest: e.target.value })}
                  className="w-full bg-sand-950 border border-sand-700 rounded-xl py-3 px-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Royal Ranthambore Bengal Tiger Safari">Royal Ranthambore Bengal Tiger Safari</option>
                  <option value="Greater Kruger Rhino Conservation & Big 5 Safari">Greater Kruger Rhino Conservation & Big 5 Safari</option>
                  <option value="Serengeti Lion & Great Migration Masterclass">Serengeti Lion & Great Migration Masterclass</option>
                  <option value="Custom Private Charter">Custom Private Charter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-700 uppercase mb-1 font-bold">Message / Gear Inquiries</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your photography experience, gear setup, or requested trip dates..."
                  className="w-full bg-sand-950 border border-sand-700 rounded-xl py-3 px-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Send Message to Naturalist Team</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
