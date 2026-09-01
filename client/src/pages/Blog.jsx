import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const posts = [
    {
      id: '1',
      title: '5 Telephoto Techniques for Big Cat Motion Blur in Low Light',
      slug: 'telephoto-techniques-big-cats',
      excerpt: 'Mastering shutter priority, panning speed, and ISO auto-limits during dawn and dusk predator hunts.',
      author: 'Elena Rostova',
      date: 'May 14, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Ethical Wildlife Photography: Avoiding Intrusion in Safari Vehicles',
      slug: 'ethical-wildlife-photography-safari',
      excerpt: 'How quiet electric drives, respectful distance limits, and positioning elevate both your portfolio and animal safety.',
      author: 'Dr. Marcus Vance',
      date: 'April 28, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Predicting the Great Migration River Crossings in Serengeti',
      slug: 'predicting-serengeti-river-crossings',
      excerpt: 'A comprehensive field guide to reading herd behavior, dust plumes, and crocodile movements along the Mara River.',
      author: 'Kiprotich Cheruiyot',
      date: 'April 10, 2026',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Notes & Insights</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Wilderness Journal</h1>
        <p className="text-sm sm:text-base text-charcoal-700 font-normal">
          Technical photography guides, camera settings breakdowns, and conservation stories straight from our expedition leaders.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <article key={idx} className="glass-panel rounded-2xl overflow-hidden border border-sand-700 shadow-xl flex flex-col justify-between">
            <div>
              <div className="h-56 overflow-hidden bg-sand-900">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-4 text-xs font-mono text-charcoal-600">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-pine-800" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-pine-800" /> {post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-charcoal-900 hover:text-pine-800 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-charcoal-700 leading-relaxed font-normal">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-800 hover:text-pine-700 transition-colors"
              >
                <span>Read Field Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
