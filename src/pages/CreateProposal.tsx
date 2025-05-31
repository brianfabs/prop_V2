import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase/firebase-config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import HeaderNav from '../components/HeaderNav';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import { onAuthStateChanged } from 'firebase/auth';
import { doc as firestoreDoc, getDoc as firestoreGetDoc } from 'firebase/firestore';
import { Button } from '../components/Button';

const CreateProposal: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [squares, setSquares] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = auth.currentUser;
    if (!customerName || !address || !squares) {
      setError('All fields are required.');
      return;
    }
    if (!user || !user.email) {
      setError('You must be logged in to create a proposal.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'proposals'), {
        customerName,
        address,
        squares: Number(squares),
        createdAt: Timestamp.now(),
        createdBy: user.email,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to create proposal.');
    }
    setLoading(false);
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
    <main className="w-screen min-h-screen flex flex-col bg-white">
      <HeaderNav userName={userName} userEmail={userEmail} onLogout={() => navigate('/login')} />
      {/* Main Content */}
      <section className="flex flex-1 flex-col items-center w-full px-2 sm:px-4 py-8 bg-white pt-24">
        <div className="bg-white w-full max-w-xl rounded shadow-lg px-8 py-10 flex flex-col gap-5 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Proposal</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter customer's full name"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Property Address:</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter complete property address"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-900/70 font-medium mb-1">Number of Squares:</label>
              <input
                type="number"
                min="1"
                value={squares}
                onChange={e => setSquares(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter number of roofing squares"
                required
              />
              <div className="text-sm text-gray-500 mt-1">Enter the total number of roofing squares for this project</div>
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            <div className="flex gap-4 mt-4">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={loading}>
                {loading ? 'Creating...' : 'Create Proposal'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreateProposal; 