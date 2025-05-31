import React from 'react';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, description, className = '' }) => (
  <div className={`rounded-xl bg-white p-4 border border-primary/24 flex flex-col items-start space-y-4 w-full ${className}`}>
    {icon && <div className="mb-2">{icon}</div>}
    <div className="text-lg font-medium text-primary">{label}</div>
    <div className="text-3xl font-bold text-primary">{value}</div>
    {description && <div className="text-base text-gray-700">{description}</div>}
  </div>
);