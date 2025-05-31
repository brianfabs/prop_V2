import React from 'react';

const icons = {
  success: (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
  ),
};

const baseStyles = 'rounded px-4 py-3 text-sm shadow-sm flex items-center';
const typeStyles = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
};

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, children, icon, className = '' }) => (
  <div className={`${baseStyles} ${typeStyles[type]} ${className}`}>
    <span className="mr-2">{icon || icons[type]}</span>
    <span>{children}</span>
  </div>
); 