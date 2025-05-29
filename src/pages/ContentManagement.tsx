import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc as firestoreDoc, getDoc as firestoreGetDoc } from 'firebase/firestore';

const sidebarLinks = [
  { label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
    ), route: '/admin' },
  { label: 'Content Management', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
    ), route: '/admin/content-management' },
  { label: 'User Management', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" /></svg>
    ), route: '/admin/user-management' },
  { label: 'Loan Options', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
    ), route: '/admin/loan-options' },
];

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { options, setOptions } = useRoofingOptions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (idx: number, field: string, value: string | number) => {
    setOptions((prev: any[]) => prev.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveMsg('Content saved! (in-memory only)');
      setTimeout(() => setSaveMsg(''), 2000);
    }, 900);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUserName('');
        setUserEmail('');
        return;
      }
      try {
        const userDoc = await firestoreGetDoc(firestoreDoc(db, 'users', user.uid));
        let fullName = '';
        if (userDoc.exists && userDoc.exists()) {
          const data = userDoc.data();
          fullName = data.fullName || '';
        }
        setUserName(fullName);
        setUserEmail(user.email || '');
      } catch {
        setUserName('');
        setUserEmail(user.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <HeaderNav userName={userName} userEmail={userEmail} onLogout={() => navigate('/login')} />
      <div className="flex flex-1 min-h-0 pt-24">
        {/* Collapsible Sidebar */}
        <aside
          className={`z-20 transition-all duration-300 bg-gray-50 border-r shadow-sm flex flex-col py-6 px-6 h-screen sticky top-0 left-0 ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}
          aria-label="Sidebar"
        >
          <button
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="mb-4 flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(v => !v)}
            tabIndex={0}
          >
            <svg className={`w-6 h-6 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" /></svg>
          </button>
          <nav className="flex flex-col gap-2">
            {sidebarLinks.map(link => {
              const active = location.pathname === link.route;
              return (
                <button
                  key={link.label}
                  type="button"
                  aria-label={link.label}
                  className={`group flex items-center gap-2 px-2 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100 text-blue-900 font-semibold shadow-inner' : ''}`}
                  onClick={() => navigate(link.route)}
                >
                  <span className="flex items-center justify-center">{link.icon}</span>
                  <span className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-4 py-4 flex flex-col md:flex-row gap-4 min-h-0">
            {/* Form Section */}
            <section className="flex-1 min-w-0">
              <div className="mb-4">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-1 tracking-tight leading-tight">Content Management</h1>
                <p className="text-base text-gray-600 leading-snug mb-2">Edit your Good/Better/Best roofing options. Changes are reflected instantly in proposals and are the source of truth for your customer pricing.</p>
                <hr className="border-t border-gray-200 mt-2" />
              </div>
              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                {options.map((opt: any, idx: number) => (
                  <div key={opt.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
                    {/* Edit Fields */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-bold text-blue-800">{opt.label}</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          idx === 0 ? 'bg-gray-50 text-blue-800 border border-blue-200' :
                          idx === 1 ? 'bg-gray-50 text-green-800 border border-green-200' :
                          'bg-gray-50 text-purple-800 border border-purple-200'
                        }`}>
                          {idx === 0 ? 'Good' : idx === 1 ? 'Better' : 'Best'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          className="input-field w-full py-2 px-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                          value={opt.title}
                          onChange={e => handleChange(idx, 'title', e.target.value)}
                          placeholder="Enter option title"
                          aria-label="Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                        <input
                          className="input-field w-full py-2 px-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                          value={opt.warranty}
                          onChange={e => handleChange(idx, 'warranty', e.target.value)}
                          placeholder="Enter warranty details"
                          aria-label="Warranty"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          className="input-field w-full py-2 px-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                          value={opt.imageUrl}
                          onChange={e => handleChange(idx, 'imageUrl', e.target.value)}
                          placeholder="Enter image URL"
                          aria-label="Image URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          className="input-field w-full min-h-[80px] py-2 px-2 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                          value={opt.description}
                          onChange={e => handleChange(idx, 'description', e.target.value)}
                          placeholder="Enter detailed description"
                          aria-label="Description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Square</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              className="input-field w-full py-2 px-2 pl-6 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                              value={opt.pricePerSquare}
                              onChange={e => handleChange(idx, 'pricePerSquare', Number(e.target.value))}
                              placeholder="0.00"
                              aria-label="Price per Square"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Under 16)</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              className="input-field w-full py-2 px-2 pl-6 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                              value={opt.pricePerSquareUnder16}
                              onChange={e => handleChange(idx, 'pricePerSquareUnder16', Number(e.target.value))}
                              placeholder="0.00"
                              aria-label="Price (Under 16)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Live Preview for this option */}
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-col bg-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        {/* Header with gradient background */}
                        <div className={`rounded-t-xl px-4 py-3 font-bold text-white text-xl text-center ${
                          idx === 0 ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 
                          idx === 1 ? 'bg-gradient-to-r from-blue-800 to-blue-700' : 
                          'bg-gradient-to-r from-blue-700 to-blue-600'
                        }`}>
                          {opt.title || 'Option'}
                        </div>
                        
                        {/* Price Section */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <div className="text-3xl font-bold text-blue-900 text-center mb-1">
                            ${((20 >= 16 ? opt.pricePerSquare : opt.pricePerSquareUnder16) * 20).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 text-center">
                            ${20 >= 16 ? opt.pricePerSquare : opt.pricePerSquareUnder16} per square
                          </div>
                        </div>

                        {/* Image Section */}
                        <div className="relative w-full h-36 bg-gray-50 overflow-hidden">
                          {opt.imageUrl ? (
                            <img 
                              src={opt.imageUrl} 
                              alt={opt.title} 
                              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 px-4 py-3">
                          <div className="text-gray-700 text-sm mb-3">{opt.description || 'No description available.'}</div>
                          
                          {/* Warranty Section */}
                          <div className="bg-gray-50 rounded-lg p-2 mb-3 border border-gray-200">
                            <div className="font-semibold text-blue-900 mb-1">Warranty</div>
                            <div className="text-sm text-gray-700">{opt.warranty || 'No warranty info.'}</div>
                          </div>

                          {/* Features Section */}
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-700">
                                <span className="text-blue-600">✓</span> Licensed & Insured
                              </span>
                              <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-700">
                                <span className="text-blue-600">✓</span> A+ BBB Rating
                              </span>
                              <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-xs text-gray-700">
                                <span className="text-blue-600">✓</span> 25+ Years Experience
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </form>
            </section>
          </div>

          {/* Floating Save Button (desktop), full-width on mobile */}
          <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2 md:gap-0 md:items-center md:static md:mt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-800 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 w-full md:w-auto"
              aria-label="Save Content"
            >
              {saving ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
              {saving ? 'Saving...' : 'Save Content'}
            </button>
            {saveMsg && <span className="text-green-700 font-medium mt-2 animate-fadeIn" aria-live="polite">{saveMsg}</span>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentManagement; 