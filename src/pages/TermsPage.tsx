import React from 'react';
import { Link } from '../context/RouterContext';
import { PAGES_SEO } from '../utils/seoData';
import { FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const seo = PAGES_SEO['/terms'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-900 dark:text-white">Terms of Service</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Effective Date: September 2026
      </p>

      <div className="mt-8 space-y-8 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            1. Free Service License
          </h2>
          <p>
            FreeImageTools grants you a personal, worldwide, royalty-free, non-exclusive license to use the tools available on this website for both personal and commercial image manipulation purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            2. User Responsibility & File Backups
          </h2>
          <p>
            You retain 100% ownership and copyright of any images you process through FreeImageTools. You are solely responsible for keeping independent backup copies of all original image files before undertaking compression, resizing, cropping, or conversion.
          </p>
          <p className="mt-2">
            FreeImageTools does not store backups or file histories. We will not be liable for any accidental loss, unwanted visual alteration, or irreversible changes to your files.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The services, algorithms, and web tools are provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
          </p>
          <p className="mt-2">
            While we strive for high stability across modern web engines, we do not guarantee that our tools will successfully process every corrupted file, non-standard image specification, or run identically across all legacy hardware configurations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            4. Prohibited Uses
          </h2>
          <p>
            You agree not to use the website or its client-side processing routines for any unlawful activity, to attempt reverse-engineering of security boundaries, or to launch automated scraping attacks aimed at impairing site availability for other users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall FreeImageTools, its contributors, or maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to revise or replace these Terms of Service at any time. Continued use of the website following any changes signifies your acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
};
