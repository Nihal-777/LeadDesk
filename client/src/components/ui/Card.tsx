import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  className = '',
  ...props
}) => {
  const cardStyle = glass ? 'glass-card' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800';
  return (
    <div
      className={`rounded-2xl shadow-sm transition-all duration-300 ${cardStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 pb-4 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 pt-0 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
};
