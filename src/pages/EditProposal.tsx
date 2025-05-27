import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProposal: React.FC = () => {
  const { id } = useParams();
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [squares, setSquares] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProposal() {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setError('No proposal ID provided.');
          setLoading(false);
          return;
        }
        const proposalDoc = await getDoc(doc(db, 'proposals', id));
        if (!proposalDoc.exists()) {
          setError('Proposal not found.');
          setLoading(false);
          return;
        }
        const data = proposalDoc.data();
        setCustomerName(data.customerName || '');
        setAddress(data.address || '');
        setSquares(data.squares ? String(data.squares) : '');
      } catch (err: any) {
        setError('Failed to load proposal.');
      }
      setLoading(false);
    }
    fetchProposal();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerName || !address || !squares) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'proposals', id!), {
        customerName,
        address,
        squares: Number(squares),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to update proposal.');
    }
    setSaving(false);
  };

  return (
    <main className="w-screen min-h-screen flex flex-col bg-gray-100">
      {/* Navbar (reuse Dashboard style) */}
      <nav className="w-full bg-white shadow flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <span className="text-xl font-bold text-blue-900 flex items-center gap-2">
            Global Roofing
          </span>
        </div>
        <div className="flex gap-4 sm:gap-8 items-center mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
          <a href="/dashboard" className="text-gray-700 hover:text-blue-900 font-medium">Dashboard</a>
          <a href="/create-proposal" className="text-gray-700 hover:text-blue-900 font-medium">Create Proposal</a>
          <a href="#" className="text-gray-700 hover:text-blue-900 font-medium">Admin</a>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          <span className="font-medium text-gray-700">Brian</span>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <section className="flex flex-1 flex-col items-center justify-center w-full px-2 sm:px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-xl rounded-xl shadow-lg px-8 py-10 flex flex-col gap-5"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Proposal</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
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
                <button
                  type="button"
                  className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/dashboard')}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-800 transition-colors"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
};

export default EditProposal; 