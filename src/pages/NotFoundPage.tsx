import React, { useEffect } from 'react';
import { Link } from '../context/RouterContext';
import { Home, Layers, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found – FreeImageTools';
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-extrabold text-3xl mb-6 shadow-xs">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Page Not Found
      </h1>

      <p className="mt-4 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        The tool or page you requested could not be found or has moved. Browse our complete suite of free image utilities or return to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Homepage
        </Link>

        <Link
          href="/image-tools"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
        >
          <Layers className="h-4 w-4 text-blue-500" />
          All Image Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
