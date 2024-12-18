import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  icon: Icon,
  loading,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {loading ? 'Loading...' : children}
    </button>
  );
}