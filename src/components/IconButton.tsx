import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, onClick, ariaLabel, className = '', style }, ref) => {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={`flex items-center justify-center transition-colors focus:outline-none ${className}`}
        style={{ width: 40, height: 40, padding: 12, borderRadius: 10, ...style }}
        ref={ref}
      >
        <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </span>
      </button>
    );
  }
);

export default IconButton; 