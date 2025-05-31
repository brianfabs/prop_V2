import React, { useEffect, useRef, useState } from 'react';
import { db, auth } from '../firebase/firebase-config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Button } from './Button';

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ open, onClose, onSuccess, className = '' }) => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [squares, setSquares] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (open && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
      const handleTab = (e: KeyboardEvent) => {
        if (!modalRef.current) return;
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      window.addEventListener('keydown', handleTab);
      return () => window.removeEventListener('keydown', handleTab);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setCustomerName('');
      setAddress('');
      setSquares('');
      setError(null);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [open, onClose]);

  if (!open) return null;

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
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError('Failed to create proposal.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
      <div
        ref={modalRef}
        className={`rounded p-4 bg-white w-full max-w-[550px] relative flex flex-col max-h-[90vh] overflow-y-auto focus:outline-none ${className}`}
        tabIndex={-1}
      >
        <div className="flex items-center relative w-full min-h-[40px] overflow-x-auto">
          <h3 className="text-2xl font-normal text-primary-dark absolute left-1/2 -translate-x-1/2 whitespace-nowrap">Create New Proposal</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Customer Name</label>
              <input
                ref={firstInputRef}
                id="name"
                name="name"
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
          {error && <div className="text-red-500 text-sm text-center font-normal">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2 mb-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              {loading ? 'Creating...' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProposalModal; 