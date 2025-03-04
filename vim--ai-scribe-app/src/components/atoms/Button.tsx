import { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  children,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-colors font-medium rounded-lg px-4 py-2';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
    ghost: 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
}