import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: 'What camera gear do I need to bring?',
      a: 'We recommend at least one camera body with a 100-400mm or 200-600mm telephoto lens. Carbon fiber tripods with gimbal heads are strongly encouraged. If you don’t own heavy super-telephotos, you can rent pro gear directly from our basecamp rental desk.',
    },
    {
      q: 'How many photographers are in each vehicle?',
      a: 'Strictly 4 to 6 guests maximum per open 4x4 vehicle. Everyone gets a dedicated row, window seat, and 360-degree swivel lens mount.',
    },
    {
      q: 'Are these safaris suitable for non-photographer partners?',
      a: 'Absolutely. Non-photographer companions enjoy the same luxury lodgings, ranger bush walks, thermal night tracking, and private game drives.',
    },
    {
      q: 'What is included in the base expedition cost?',
      a: 'All internal 4x4 transport, luxury lodge/tented camp accommodations, all meals, national park entry permits, ranger fees, and daily Lightroom workshops are 100% included.',
    },
    {
      q: 'What is the deposit and cancellation policy?',
      a: 'A 25% deposit secures your seat. Full refund is available up to 90 days before departure, or transferable to a future expedition date within 24 months.',
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Clear Answers</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Frequently Asked Questions</h1>
        <p className="text-sm text-charcoal-700 font-normal">
          Everything you need to know about preparing for a JungleE wildlife photography expedition.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border border-sand-700 shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-lg font-bold text-charcoal-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-pine-800 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm text-charcoal-700 leading-relaxed font-normal border-t border-sand-700/80 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
