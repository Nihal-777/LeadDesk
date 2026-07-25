import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
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
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`w-full appearance-none px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all duration-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2500/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs font-medium text-red-500 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
