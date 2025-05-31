import React from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  ariaLabel,
  className = '',
  children,
}) => (
  <label
    htmlFor={id}
    className={`flex items-center gap-2 cursor-pointer ${className}`}
  >
    <span className="relative flex items-center justify-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
        aria-label={ariaLabel}
        className="peer absolute opacity-0 w-3 h-3 cursor-pointer accent-primary"
      />
      <span
        className={
          `w-3 h-3 rounded border transition-colors duration-200 ease-in-out
          border-gray-300 text-gray-500/30 bg-white
          peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white
          flex items-center justify-center
          hover:border-[#7896CA]
          `
        }
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </span>
    {children && (
      <span className="text-sm font-normal text-gray-700">{children}</span>
    )}
  </label>
); 