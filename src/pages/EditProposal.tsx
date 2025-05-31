import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { db } from '../firebase/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../components/NavBar';
import { useRoofingOptions } from '../context/RoofingOptionsContext';
import { Button } from '../components/Button';

interface EditProposalModalProps {
  open: boolean;
  proposalId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProposalModal: React.FC<EditProposalModalProps> = ({ open, proposalId, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [squares, setSquares] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !proposalId) return;
    async function fetchProposal() {
      setLoading(true);
      setError(null);
      try {
        const proposalDoc = await getDoc(doc(db, 'proposals', proposalId));
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
  }, [open, proposalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerName || !address || !squares) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'proposals', proposalId!), {
        customerName,
        address,
        squares: Number(squares),
      });
      setSaving(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError('Failed to update proposal.');
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
      <div className="rounded p-4 bg-white w-full max-w-[550px] relative flex flex-col max-h-[90vh] overflow-y-auto focus:outline-none">
        <div className="flex items-center relative w-full min-h-[40px] overflow-x-auto">
          <h3 className="text-2xl font-normal text-primary-dark absolute left-1/2 -translate-x-1/2 whitespace-nowrap">Edit Proposal</h3>
          <Button
            variant="outline"
            type="button"
            className="ml-auto !p-1 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[23px] h-[23px]">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full mt-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter customer's full name"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Property Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter complete property address"
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Number of Squares</label>
                <input
                  type="number"
                  min="1"
                  value={squares}
                  onChange={e => setSquares(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter number of roofing squares"
                  required
                />
                <div className="text-sm text-gray-500 mt-1">Enter the total number of roofing squares for this project</div>
              </div>
            </div>
          )}
          {error && <div className="text-red-500 text-sm text-center font-normal">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2 mb-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProposalModal; 