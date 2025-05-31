import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel: string;
  className?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, onClick, ariaLabel, className = '' }, ref) => {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={`border-0 bg-transparent focus:outline-none transition-colors ${className}`}
        ref={ref}
        style={{ padding: 0, width: 'auto', height: 'auto' }}
      >
        <span className="flex items-center justify-center">{icon}</span>
      </button>
    );
  }
);

export default IconButton; 