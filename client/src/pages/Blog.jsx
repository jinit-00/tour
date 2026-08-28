import React from 'react';
import { Camera, Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Mastering Super-Telephoto Panning in Ranthambore Bamboo Thickets',
      excerpt: 'How to stabilize 600mm primes at 1/60s shutter speed while tracking Bengal Tigers moving through dappled light.',
      author: 'Elena Rostova',
      date: 'Aug 14, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Ethical Proximity: How Far is Too Close During Lion River Crossings?',
      excerpt: 'Our code of conduct on vehicle positioning during the Mara River Great Migration to prevent disrupting pride dynamics.',
      author: 'Dr. Marcus Vance',
      date: 'Jul 28, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Thermal Imaging & Anti-Poaching Night Tracking in Greater Kruger',
      excerpt: 'Field report riding along with K9 satellite units protecting Black Rhinos along the Sabie River reserve borders.',
      author: 'Kip Cheruiyot',
      date: 'Jun 19, 2026',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand-gradient min-h-screen space-y-16">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-pine-800 font-bold">Field Dispatch</span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-charcoal-900">Naturalist Notes & Field Journal</h1>
        <p className="text-sm sm:text-base text-charcoal-700 font-normal">
          Field techniques, camera gear reviews, predator tracking insights, and conservation updates from our master guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="glass-panel rounded-2xl overflow-hidden border border-sand-700 flex flex-col justify-between group shadow-xl">
            <div>
              <div className="h-52 overflow-hidden bg-sand-900">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-charcoal-600">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-pine-800" /> {post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal-900 group-hover:text-pine-800 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs text-charcoal-700 line-clamp-3 leading-relaxed font-normal">
                  {post.excerpt}
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button className="inline-flex items-center gap-2 text-xs font-mono text-pine-800 font-bold hover:underline">
                <span>READ FULL DISPATCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
