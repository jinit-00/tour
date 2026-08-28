import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  getGalleryItems,
  createAdminGalleryItem,
  deleteAdminGalleryItem,
  getBlogPosts,
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminMessages,
  markMessageRead,
} from '../../services/api';
import { Image, BookOpen, MessageSquare, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'blog' | 'messages'

  // Data states
  const [gallery, setGallery] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Form State
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState('Big Cats');
  const [galImage, setGalImage] = useState('');

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Field Technique');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const [gRes, bRes, mRes] = await Promise.all([
        getGalleryItems('All'),
        getBlogPosts(),
        getAdminMessages(),
      ]);
      setGallery(gRes.data);
      setBlogs(bRes.data);
      setMessages(mRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    try {
      await createAdminGalleryItem({
        title: galTitle,
        category: galCategory,
        imageUrl: galImage,
      });
      setGalTitle('');
      setGalImage('');
      loadAllContent();
    } catch (err) {
      alert('Failed to add gallery photo.');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete photo?')) return;
    try {
      await deleteAdminGalleryItem(id);
      loadAllContent();
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      await createAdminBlogPost({
        title: blogTitle,
        category: blogCategory,
        summary: blogSummary,
        content: blogContent,
        coverImage: blogImage,
      });
      setBlogTitle('');
      setBlogSummary('');
      setBlogContent('');
      setBlogImage('');
      loadAllContent();
    } catch (err) {
      alert('Failed to publish blog post.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await deleteAdminBlogPost(id);
      loadAllContent();
    } catch (err) {
      alert('Failed to delete article.');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      loadAllContent();
    } catch (err) {
      alert('Failed to update message status.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Content & Communications Manager</h2>
            <p className="text-xs text-slate-500">Manage field gallery photos, publish blog articles, and respond to client inquiries</p>
          </div>

          <div className="flex bg-slate-200/70 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                activeTab === 'gallery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Gallery ({gallery.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                activeTab === 'blog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Articles ({blogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                activeTab === 'messages' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inbox ({messages.filter(m => !m.isRead).length} Unread)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Gallery Manager */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Add Field Photo to Gallery</h3>
              <form onSubmit={handleAddGallery} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Photo Title</label>
                  <input
                    type="text"
                    required
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    placeholder="Solitary Monarch of the Savanna"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="Big Cats">Big Cats</option>
                    <option value="Aurora & Night">Aurora & Night</option>
                    <option value="High Altitude">High Altitude</option>
                    <option value="Wetlands">Wetlands</option>
                    <option value="Migration">Migration</option>
                    <option value="Arctic Wildlife">Arctic Wildlife</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={galImage}
                    onChange={(e) => setGalImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Upload to Gallery
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">{item.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Blog Manager */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Publish New Field Guide / Blog</h3>
              <form onSubmit={handleAddBlog} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Mastering Low-Light Telephoto Techniques"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    placeholder="Field Technique"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Summary Teaser</label>
                  <textarea
                    rows={2}
                    required
                    value={blogSummary}
                    onChange={(e) => setBlogSummary(e.target.value)}
                    placeholder="Brief 1-2 sentence teaser summary..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Article Body</label>
                  <textarea
                    rows={5}
                    required
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Full blog post content..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Publish Article
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={b.coverImage} alt={b.title} className="w-16 h-16 rounded-lg object-cover border" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">{b.category}</span>
                      <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{b.summary}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Contact Messages Inbox */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                  <th className="p-4">Sender</th>
                  <th className="p-4">Message Inquiry</th>
                  <th className="p-4">Received</th>
                  <th className="p-4 text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {messages.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-mono">No contact messages received yet.</td></tr>
                ) : (
                  messages.map((m) => (
                    <tr key={m.id} className={`hover:bg-slate-50 transition-colors ${!m.isRead ? 'bg-amber-50/40 font-medium' : ''}`}>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-xs font-mono text-slate-500">{m.email}</p>
                      </td>
                      <td className="p-4 text-xs text-slate-700 max-w-md">{m.message}</td>
                      <td className="p-4 text-xs font-mono text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        {!m.isRead ? (
                          <button
                            onClick={() => handleMarkRead(m.id)}
                            className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-md"
                          >
                            Mark Read
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Read
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
