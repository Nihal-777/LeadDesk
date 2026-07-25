import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button.js';

export const NotFound: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-slate-50 text-center px-4 dark:bg-slate-950 transition-colors duration-300">
      {/* Decorative Blobs */}
      <div className="glow-blob top-[25%] left-[20%] bg-blue-500/10" />
      <div className="glow-blob bottom-[25%] right-[20%] bg-indigo-500/10" />

      <h1 className="text-9xl font-extrabold tracking-widest text-brand-550 dark:text-brand-400">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-indigo-650 px-2 py-1 text-xs font-bold text-white dark:bg-indigo-500 z-10">
        Page Not Found
      </div>
      <h2 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        Looking for something?
      </h2>
      <p className="mt-4 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for doesn't exist, or has been moved to another URL. Let's get you back on track.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary" className="gap-2 rounded-xl shadow-md">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
