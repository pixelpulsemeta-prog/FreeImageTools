import React from 'react';
import { Link } from '../context/RouterContext';
import { PAGES_SEO } from '../utils/seoData';
import { ShieldCheck, Cpu, Zap, Lock, Globe, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const seo = PAGES_SEO['/about'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-900 dark:text-white">About</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        About FreeImageTools
      </h1>

      <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        FreeImageTools is built with a singular mission: to provide high-speed, professional, and privacy-respecting image manipulation utilities directly inside your browser—completely free of charge and without any server uploads.
      </p>

      {/* Technical Architecture */}
      <div className="my-10 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          The Client-Side Architecture
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Traditional online image tools force users to upload their private photos across the internet to remote cloud servers. This approach introduces bandwidth delays, privacy concerns, and recurring infrastructure costs passed on to users.
        </p>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          FreeImageTools operates differently. By harnessing the full power of modern web standards—including <strong>HTML5 Canvas</strong>, <strong>TypedArrays</strong>, <strong>Blob API</strong>, and hardware-accelerated 2D graphics—every pixel operation runs on your local machine CPU and GPU.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Zero Uploads</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Your media files never leave your device memory.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Zero Latency</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">No queuing behind remote servers. Execution starts instantly.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-bold text-slate-900 dark:text-white text-sm block mb-1">Zero Cost</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">No expensive server clusters allows us to keep the site 100% free.</span>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Our Guiding Principles
        </h2>

        <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">Privacy First:</strong> We do not track you, we do not require account registration, and we never collect, store, or sell user images.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">Lightweight & Fast:</strong> The application is carefully optimized with zero bloated dependencies, providing lightning-quick page loads on mobile networks.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-900 dark:text-white">Universal Accessibility:</strong> Designed to work smoothly on modern web browsers across Android, iOS, Windows, macOS, and Linux without installing extensions.
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-12 rounded-2xl bg-blue-600 p-8 text-center text-white shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold">Ready to process an image?</h2>
        <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
          Start compressing, resizing, converting, or cropping your images with complete privacy.
        </p>
        <Link
          href="/image-tools"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Explore All Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
