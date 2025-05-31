import React from 'react';
import TableActionsMenu from './TableActionsMenu';

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
  <table className={`w-full table-auto text-left border-collapse bg-white min-w-[600px] ${className}`}>
    <thead>
      <tr>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-left whitespace-nowrap">Name</th>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Term</th>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Rate (%)</th>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Min ($)</th>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Max ($)</th>
        <th className="text-xs font-medium uppercase tracking-wide text-primary px-3 py-2 border-b border-primary border-opacity-20 text-right whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
      {loanOptions.length === 0 ? (
        <tr>
          <td colSpan={7} className="text-center py-8 text-gray-500">No loan options found.</td>
        </tr>
      ) : loanOptions.map(option => (
        <tr key={option.id} className="bg-white border-b border-primary border-opacity-10 last:border-b-0">
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-left">{option.name}</td>
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right">{option.term}</td>
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right">{option.interestRate}</td>
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right">{option.minAmount}</td>
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right">{option.maxAmount}</td>
          <td className="text-sm text-gray-700 px-3 py-2 whitespace-normal text-right flex gap-2 items-center justify-end">
            <TableActionsMenu
              proposalId={option.id}
              onEdit={() => onEdit(option)}
              onDelete={() => onDelete(option)}
              hideView={true}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
); 