import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-brand-550 hover:from-brand-700 hover:to-brand-600 text-white shadow-md shadow-brand-500/20 focus:ring-brand-500',
    secondary: 'bg-slate-200 hover:bg-slate-350 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-500',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-100/50 text-slate-700 dark:border-slate-750 dark:hover:bg-slate-900/50 dark:text-slate-300 focus:ring-brand-500',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 focus:ring-red-500',
    glass: 'glass-panel hover:bg-white/20 text-slate-800 dark:text-white focus:ring-brand-500 border-white/30 dark:border-slate-850',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
