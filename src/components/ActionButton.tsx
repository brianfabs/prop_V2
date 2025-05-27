import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  href?: string;
  variant: 'view' | 'edit' | 'delete';
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, tooltip, onClick, href, variant }) => {
  const baseClasses = "p-3 transition-colors relative group flex items-center justify-center";
  const variantClasses = {
    view: "text-blue-900 hover:bg-blue-50",
    edit: "text-blue-900 hover:bg-blue-50",
    delete: "text-red-600 hover:bg-red-50"
  };

  // Inline style to force any svg child to fill the 16x16 box and set border radius
  const iconWrapperStyle: React.CSSProperties = {
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: 10,
  };

  const buttonContent = (
    <>
      <span style={iconWrapperStyle}>
        {icon}
      </span>
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${variantClasses[variant]}`} style={buttonStyle}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={buttonStyle}
    >
      {buttonContent}
    </button>
  );
};

export default ActionButton; 