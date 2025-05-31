import React from 'react';
import { Button } from './Button';

interface LoanOption {
  id: string;
  name: string;
  term: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  description?: string;
}

interface LoanOptionsTableProps {
  loanOptions: LoanOption[];
  onEdit: (option: LoanOption) => void;
  onDelete: (option: LoanOption) => void;
  className?: string;
}

export const LoanOptionsTable: React.FC<LoanOptionsTableProps> = ({ loanOptions, onEdit, onDelete, className = '' }) => (
  <div className={`bg-white rounded-xl border border-primary/24 p-4 w-full overflow-auto ${className}`}>
    <table className="w-full table-auto text-left border-collapse bg-white">
      <thead>
        <tr>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Name</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Term (months)</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Interest Rate (%)</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Minimum Amount ($)</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Maximum Amount ($)</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Description</th>
          <th className="text-xs font-medium uppercase tracking-wide text-primary px-4 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loanOptions.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-500">No loan options found.</td>
          </tr>
        ) : loanOptions.map(option => (
          <tr key={option.id} className="bg-white border-b border-primary border-opacity-10 last:border-b-0">
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-left">{option.name}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-left">{option.term}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-left">{option.interestRate}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-right">{option.minAmount}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-right">{option.maxAmount}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-left">{option.description || '-'}</td>
            <td className="text-sm text-gray-700 px-4 py-3 whitespace-normal text-right flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onEdit(option)} className="px-4 py-2">Edit</Button>
              <Button variant="outline" onClick={() => onDelete(option)} className="px-4 py-2">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
); 