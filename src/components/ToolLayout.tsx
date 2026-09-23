import React from 'react';
import { Link } from '../context/RouterContext';
import { FAQSection } from './FAQSection';
import { RelatedTools } from './RelatedTools';
import { ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { FAQItem } from '../types';

interface ToolLayoutProps {
  toolId: string;
  title: string;
  description: string;
  breadcrumbs: Array<{ name: string; path: string }>;
  children: React.ReactNode;
  howToSteps?: Array<{ step: string; text: string }>;
  supportedFormats?: Array<{ format: string; desc: string }>;
  howItWorks?: string;
  faqs?: FAQItem[];
  relatedToolIds?: string[];
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  toolId,
  title,
  description,
  breadcrumbs,
  children,
  howToSteps,
  supportedFormats,
  howItWorks,
  faqs,
  relatedToolIds,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((b, idx) => (
            <li key={b.path} className="flex items-center space-x-1.5">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                  {b.name}
                </span>
              ) : (
                <Link
                  href={b.path}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {b.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Hero Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {description}
        </p>

        {/* Feature Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% In-Browser & Private
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            <Zap className="h-3.5 w-3.5" />
            Zero-Wait Processing
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Free & Unlimited
          </div>
        </div>
      </div>

      {/* Main Tool Interactive Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors mb-12">
        {children}
      </div>

      {/* SEO Guides & Content Section */}
      <div className="space-y-10 border-t border-slate-200 pt-10 dark:border-slate-800">
        {/* Step-by-Step Instructions */}
        {howToSteps && howToSteps.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              How to Use {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {howToSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-sm text-white mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    {step.step}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Supported Formats */}
        {supportedFormats && supportedFormats.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Supported Image Formats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {supportedFormats.map((fmt) => (
                <div
                  key={fmt.format}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {fmt.format}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fmt.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical How it works */}
        {howItWorks && (
          <section className="rounded-xl border border-blue-100 bg-blue-50/40 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              How Local Browser Processing Works
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {howItWorks}
            </p>
          </section>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}

        {/* Internal Linking: Related Tools */}
        {relatedToolIds && relatedToolIds.length > 0 && (
          <RelatedTools relatedIds={relatedToolIds} currentId={toolId} />
        )}
      </div>
    </div>
  );
};
