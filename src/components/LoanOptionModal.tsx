import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';

interface LoanOption {
  id?: string;
  name: string;
  term: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  description?: string;
}

interface LoanOptionModalProps {
  open: boolean;
  mode: 'add' | 'edit';
  option: LoanOption | null;
  onClose: () => void;
  onSave: (option: LoanOption) => void;
  className?: string;
}

export const LoanOptionModal: React.FC<LoanOptionModalProps> = ({ open, mode, option, onClose, onSave, className = '' }) => {
  const [form, setForm] = useState<LoanOption>({
    name: '',
    term: 0,
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    description: '',
  });
  const [error, setError] = useState('');
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
      setForm(option || { name: '', term: 0, interestRate: 0, minAmount: 0, maxAmount: 0, description: '' });
      setError('');
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open, option]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'term' || name === 'minAmount' || name === 'maxAmount' || name === 'interestRate' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.term || !form.interestRate || !form.minAmount || !form.maxAmount) {
      setError('All fields except description are required.');
      return;
    }
    setError('');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
      <div
        ref={modalRef}
        className={`rounded p-4 bg-white w-full max-w-[550px] relative flex flex-col max-h-[90vh] overflow-y-auto focus:outline-none ${className}`}
        tabIndex={-1}
      >
        <div className="flex items-center relative w-full min-h-[40px] overflow-x-auto">
          <h3 className="text-2xl font-normal text-primary-dark absolute left-1/2 -translate-x-1/2 whitespace-nowrap">{mode === 'add' ? 'Add New Loan Option' : 'Edit Loan Option'}</h3>
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
          <div className="w-full">
            <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Name</label>
            <input
              ref={firstInputRef}
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="col-span-1">
              <label htmlFor="term" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Term (months)</label>
              <input
                id="term"
                name="term"
                type="number"
                value={form.term}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="interestRate" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                id="interestRate"
                name="interestRate"
                type="number"
                value={form.interestRate}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="minAmount" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Minimum Amount ($)</label>
              <input
                id="minAmount"
                name="minAmount"
                type="number"
                value={form.minAmount}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maxAmount" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Maximum Amount ($)</label>
              <input
                id="maxAmount"
                name="maxAmount"
                type="number"
                value={form.maxAmount}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="description" className="block text-xs font-medium uppercase tracking-wide text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base font-normal text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center font-normal">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2 mb-1">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              {mode === 'add' ? 'Add Loan Option' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 