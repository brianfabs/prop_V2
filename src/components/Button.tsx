import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
}

const base = 'text-base font-normal transition-colors duration-200 ease-in-out focus:outline-none border-none';
const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark rounded px-4 py-2',
  outline: 'border border-primary text-primary bg-white hover:bg-primary/10 hover:border-primary-dark rounded px-4 py-2',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 rounded-md px-4 py-2',
};
const disabled = 'opacity-50 cursor-not-allowed';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  disabled: isDisabled,
  ...props
}) => {
  // Remove default px-4/py-2 if custom px- or py- classes are present
  const hasCustomPadding = /p[xytrbl]?-[0-9]/.test(className);
  const variantClass = hasCustomPadding
    ? variants[variant].replace(/px-4|py-2/g, '').replace(/  +/g, ' ')
    : variants[variant];
  return (
    <button
      type={props.type || 'button'}
      className={[
        base,
        variantClass,
        isDisabled ? disabled : '',
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}; 