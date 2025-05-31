import React from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  href?: string;
  variant: 'view' | 'edit' | 'delete';
  'aria-label'?: string;
  proposalId: string;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}

const variantClasses = {
  view: 'text-primary hover:text-primary hover:bg-primary/10',
  edit: 'text-primary hover:text-primary hover:bg-primary/10',
  delete: 'text-red-600 hover:text-primary hover:bg-red-50',
};

const ActionButton: React.FC<ActionButtonProps> = ({ icon, tooltip, onClick, href, variant, 'aria-label': ariaLabel, proposalId, setOpen, onDelete }) => {
  const baseClasses = 'px-4 py-2 text-sm rounded flex items-center gap-2 transition-colors duration-200 ease-in-out relative group';

  const buttonContent = (
    <>
      <span className="flex items-center justify-center w-4 h-4">{icon}</span>
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${variantClasses[variant]}`}
        aria-label={ariaLabel || tooltip}
        tabIndex={0}
        role="button"
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <Button
      variant="ghost"
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={ariaLabel || tooltip}
      onClick={onClick}
      tabIndex={0}
      type="button"
    >
      {buttonContent}
    </Button>
  );
};

export default ActionButton; 