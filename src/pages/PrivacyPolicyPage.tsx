import React from 'react';
import { Link } from '../context/RouterContext';
import { PAGES_SEO } from '../utils/seoData';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const seo = PAGES_SEO['/privacy-policy'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-900 dark:text-white">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Effective Date: September 2026 · Version 1.0
      </p>

      {/* Summary Highlight */}
      <div className="my-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-base mb-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          The Short & Honest Summary
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
          Your photos are processed entirely inside your browser. We do not upload your images, we do not store your media on servers, we do not require user accounts, and we do not collect personal identifiers.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ServerOff className="h-5 w-5 text-blue-600" />
            1. Client-Side Image Processing
          </h2>
          <p>
            When you select or drop an image into FreeImageTools (such as with our Image Compressor, Resizer, Format Converters, or Cropper), the processing occurs locally within your web browser using HTML5 Canvas and native JavaScript APIs.
          </p>
          <p className="mt-2">
            Because image computations take place in your device's memory, <strong>no image files are uploaded or transmitted to our web servers or any third-party cloud infrastructure</strong>. Once you close or reload the browser tab, the temporary in-memory objects are discarded.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-purple-600" />
            2. No User Accounts or Personal Data Collection
          </h2>
          <p>
            FreeImageTools does not have a user registration system or login requirement. We do not ask for your name, email address, physical location, phone number, or payment details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-amber-600" />
            3. Local Storage Usage
          </h2>
          <p>
            We use your browser's standard <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-300">localStorage</code> exclusively to preserve your preferred theme setting (Dark Mode or Light Mode). No analytics, trackers, or profile records are stored.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            4. Web Server Logs & Basic Infrastructure
          </h2>
          <p>
            Like virtually all internet websites, the web server hosting our static HTML and JavaScript assets records standard HTTP request access logs (such as your IP address, browser user-agent, and requested page URL) for general network diagnostics, DDoS prevention, and security monitoring. These logs do not contain user images or file contents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            5. Changes to This Policy
          </h2>
          <p>
            Should we introduce new tools or functionality, this privacy policy will be updated accordingly with a revised revision date. We remain steadfast in our commitment to browser-based, privacy-first image tooling.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            6. Contact Regarding Privacy
          </h2>
          <p>
            If you have questions or feedback concerning our privacy architecture, feel free to visit our <Link href="/contact" className="text-blue-600 dark:text-blue-400 underline">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
