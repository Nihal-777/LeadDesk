import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
