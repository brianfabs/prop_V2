import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc as firestoreDoc, getDoc as firestoreGetDoc, updateDoc } from 'firebase/firestore';

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { options, setOptions } = useRoofingOptions();
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const PreviewCard = ({ option, idx }: { option: any, idx: number }) => (
    <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200 flex flex-col">
      <div className={`px-4 py-3 ${
        idx === 0 ? 'bg-gradient-to-r from-primary to-primary-dark' : 
        idx === 1 ? 'bg-gradient-to-r from-primary-dark to-primary' : 
        'bg-gradient-to-r from-primary to-primary'
      } text-white font-semibold`}>
        {option.title || 'Option'}
      </div>
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="text-3xl font-bold text-primary-dark text-center mb-1">
          ${option.pricePerSquare.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 text-center">
          ${option.pricePerSquare.toLocaleString()} per square
        </div>
      </div>
      <div className="relative w-full h-36 bg-white overflow-hidden">
        {option.imageUrl ? (
          <img 
            src={option.imageUrl} 
            alt={option.title} 
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
      <div className="flex-1 px-4 py-3 flex flex-col">
        <div className="text-gray-700 text-sm mb-3">{option.description || 'No description available.'}</div>
        <div className="bg-white rounded p-2 mb-3 border border-gray-200">
          <div className="font-semibold text-blue-900 mb-1">Warranty</div>
          <div className="text-sm text-gray-700">{option.warranty || 'No warranty info.'}</div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-200 rounded">
        <div className="flex flex-wrap gap-1.5 justify-center">
          <span className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700">
            <span className="text-blue-600">✓</span> Licensed & Insured
          </span>
          <span className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700">
            <span className="text-blue-600">✓</span> A+ BBB Rating
          </span>
          <span className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700">
            <span className="text-blue-600">✓</span> 25+ Years Experience
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1000px] mx-auto space-y-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Content Management</h1>
      <div className="text-gray-600 text-base mb-6">Manage roofing options and content</div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {options && options.length > 0 ? (
          options.map((option: any, idx: number) => (
            <div key={idx} className="mb-6 border rounded p-3">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">Option {idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={option.title || ''}
                        onChange={(e) => handleChange(idx, 'title', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Square</label>
                        <input
                          type="number"
                          value={option.pricePerSquare || 0}
                          onChange={(e) => handleChange(idx, 'pricePerSquare', parseFloat(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Square (Under 16)</label>
                        <input
                          type="number"
                          value={option.pricePerSquareUnder16 || 0}
                          onChange={(e) => handleChange(idx, 'pricePerSquareUnder16', parseFloat(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={option.description || ''}
                        onChange={(e) => handleChange(idx, 'description', e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                      <textarea
                        value={option.warranty || ''}
                        onChange={(e) => handleChange(idx, 'warranty', e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={option.imageUrl || ''}
                        onChange={(e) => handleChange(idx, 'imageUrl', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-96">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <PreviewCard option={option} idx={idx} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No options available. Please add some options.</div>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMsg && (
            <span className="text-green-600 font-medium">{saveMsg}</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentManagement; 