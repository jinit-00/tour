import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import { sendContactMessage } from '../services/api';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverMsg, setServerMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', tourInterest: 'General Inquiry', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await sendContactMessage(form);
      setServerMsg(res.data?.message || 'Thank you for reaching out! Our team will respond within 24 hours.');
      setSubmitted(true);
      setForm({ name: '', email: '', tourInterest: 'General Inquiry', message: '' });
    } catch (err) {
      console.error('Failed to submit contact query:', err);
      setError(err.response?.data?.error || 'Unable to send message at this moment. Please try again or reach out directly via email/phone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-16">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-sans uppercase tracking-widest text-pine-800 font-bold">Get in Touch</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Contact Expedition Basecamp</h1>
        <p className="text-sm sm:text-base text-charcoal-700 font-normal">
          Have questions about trip dates, lens recommendations, or custom private departures? Reach out to our expedition team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Info */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl border border-sand-700 space-y-8 shadow-xl">
          <h3 className="text-2xl font-bold text-charcoal-900">Connect with us</h3>
          
          <ul className="space-y-6 text-sm text-charcoal-700">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-sans text-charcoal-500 block uppercase font-bold">Address</span>
                <span className="leading-snug block pt-0.5">A-803, Money Plant High Street, Gota, Ahmedabad, Gujarat, India</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-sans text-charcoal-500 block uppercase font-bold">Expedition Directors</span>
                <div className="pt-1 space-y-1 text-sm font-sans">
                  <div>
                    <span className="font-sans font-bold text-charcoal-900">Vatsal Dangi: </span>
                    <a href="tel:+919665129435" className="hover:text-pine-800 font-bold">+91-9665129435</a>
                  </div>
                  <div>
                    <span className="font-sans font-bold text-charcoal-900">Harsh Barad: </span>
                    <a href="tel:+917096392919" className="hover:text-pine-800 font-bold">+91-7096392919</a>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-pine-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-sans text-charcoal-500 block uppercase font-bold">Email</span>
                <a href="mailto:safari@jungleewildlife.co.in" className="hover:text-pine-800 text-sm font-sans font-bold pt-0.5 block">
                  safari@jungleewildlife.co.in
                </a>
              </div>
            </li>
          </ul>

          {/* WhatsApp Connect Button */}
          <div className="pt-2">
            <a
              href="https://wa.me/919664665873?text=Hello%20JungleE%20Wildlife%20Expeditions%2C%20I%20would%20like%20to%20inquire%20about%20safari%20tours."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group active:scale-[0.98]"
              title="Chat with us on WhatsApp"
            >
              <svg
                className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.09 8.03 12.25C8.16 12.42 9.77 14.9 12.23 15.96C12.82 16.21 13.27 16.36 13.63 16.48C14.22 16.66 14.76 16.64 15.18 16.58C15.66 16.5 16.65 15.97 16.85 15.39C17.06 14.81 17.06 14.32 17 14.22C16.94 14.12 16.79 14.06 16.56 13.95C16.33 13.84 15.2 13.28 14.99 13.2C14.78 13.12 14.63 13.08 14.47 13.33C14.32 13.57 13.89 14.06 13.76 14.22C13.63 14.38 13.5 14.4 13.27 14.28C13.04 14.17 12.3 13.93 11.42 13.14C10.74 12.53 10.28 11.78 10.15 11.55C10.02 11.32 10.14 11.2 10.25 11.08C10.36 10.97 10.49 10.8 10.6 10.67C10.72 10.54 10.76 10.44 10.84 10.28C10.92 10.11 10.88 9.97 10.82 9.85C10.76 9.73 10.31 8.62 10.12 8.16C9.94 7.72 9.75 7.78 9.61 7.77C9.48 7.76 9.32 7.76 9.17 7.76C9.01 7.76 8.76 7.82 8.53 8.07L8.53 7.33Z" />
              </svg>
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 border-t border-sand-700 flex items-center gap-2 text-xs text-charcoal-700 font-sans font-medium">
            <Clock className="w-4 h-4 text-pine-800 shrink-0" />
            <span>Office hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl border border-sand-700 shadow-xl">
          {submitted ? (
            <div className="text-center py-16 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold font-sans uppercase tracking-wider">
                ✓ Message Sent Successfully
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">Message Received!</h3>
              <p className="text-sm text-charcoal-700 max-w-md mx-auto leading-relaxed">
                {serverMsg || 'Thank you for reaching out. Vatsal Dangi & Harsh Barad will get back to you within 24 business hours.'}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-sand-800 hover:bg-sand-700 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-sans text-charcoal-700 uppercase mb-1 font-bold">Your Name</label>
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
                  <label className="block text-xs font-sans text-charcoal-700 uppercase mb-1 font-bold">Email Address</label>
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
                <label className="block text-xs font-sans text-charcoal-700 uppercase mb-1 font-bold">Expedition Interest</label>
                <select
                  value={form.tourInterest}
                  onChange={(e) => setForm({ ...form, tourInterest: e.target.value })}
                  className="w-full bg-sand-950 border border-sand-700 rounded-xl py-3 px-4 text-sm text-charcoal-900 focus:outline-none focus:border-pine-800"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Gir Asiatic Lion Sanctuary Masterclass">Gir Asiatic Lion Sanctuary Masterclass</option>
                  <option value="Sanjay Dubri Tiger Reserve Expedition">Sanjay Dubri Tiger Reserve Expedition</option>
                  <option value="Jawai Granite Hills Leopard Tracking">Jawai Granite Hills Leopard Tracking</option>
                  <option value="Royal Ranthambore Bengal Tiger Portrait">Royal Ranthambore Bengal Tiger Portrait</option>
                  <option value="Velavadar Blackbuck & Deer Grasslands">Velavadar Blackbuck & Deer Grasslands</option>
                  <option value="Panna Tiger Reserve & Ken River Expedition">Panna Tiger Reserve & Ken River Expedition</option>
                  <option value="Custom Private Charter">Custom Private Charter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans text-charcoal-700 uppercase mb-1 font-bold">Message / Gear Inquiries</label>
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
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-pine-800 hover:bg-pine-700 text-sand-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending to JungleE Basecamp...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message to JungleE Team</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
