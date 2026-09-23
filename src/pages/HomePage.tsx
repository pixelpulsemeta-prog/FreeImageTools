import React from 'react';
import { Link } from '../context/RouterContext';
import { TOOLS, PAGES_SEO } from '../utils/seoData';
import { FAQSection } from '../components/FAQSection';
import { 
  Minimize2, 
  Maximize2, 
  FileCode2, 
  FileImage, 
  RefreshCw, 
  Crop, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Smartphone, 
  Sliders, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Minimize2,
  Maximize2,
  FileCode2,
  FileImage,
  RefreshCw,
  Crop,
};

export const HomePage: React.FC = () => {
  const seo = PAGES_SEO['/'];

  const benefits = [
    {
      title: 'Free to Use',
      description: 'Zero fees, no hidden credit card prompts, and no paywalls. All tools are completely free for personal and commercial workflows.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'No Registration Required',
      description: 'Start editing immediately without creating an account, giving your email address, or waiting for verification links.',
      icon: CheckCircle2,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Browser-Based Processing',
      description: 'Your device hardware handles the computation using HTML5 Canvas. No bandwidth wasted uploading large files across the web.',
      icon: Zap,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      title: 'No Image Storage',
      description: 'Photos stay in your browser memory and vanish the moment you close or refresh the tab. Nothing is stored on our servers.',
      icon: Lock,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Fast Processing Speed',
      description: 'With no network queues or server upload bottlenecks, image transformations and conversions finish in fractions of a second.',
      icon: Sliders,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      title: 'Mobile Friendly',
      description: 'Designed for touchscreens and desktop screens alike. Compress and edit photos on your phone, tablet, or laptop seamlessly.',
      icon: Smartphone,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Anti-slop clean metadata badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-xs mb-6">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>100% In-Browser Image Manipulation</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>Zero Server Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Free Online Image Tools
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Compress, resize, convert and edit your images quickly and securely in your browser.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/image-tools"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
          >
            Explore Image Tools
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/image-compressor"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Minimize2 className="h-4 w-4 text-blue-500" />
            Compress an Image
          </Link>
        </div>
      </section>

      {/* 2. Tools Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Available Image Tools
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select any tool below to start processing images immediately.
            </p>
          </div>
          <Link
            href="/image-tools"
            className="mt-3 sm:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 inline-flex items-center gap-1"
          >
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const IconComp = iconMap[tool.icon] || FileImage;
            return (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComp className="h-6 w-6" />
                    </div>
                    {tool.badge && (
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={tool.path}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-white transition-all"
                  >
                    Open Tool
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Why Use FreeImageTools Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 sm:p-12 lg:p-16 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Use FreeImageTools?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Most image utilities force you to upload private files to mystery servers or pay monthly subscriptions. FreeImageTools runs directly in your web browser.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${b.color} mb-4`}>
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FAQSection faqs={seo.faqs || []} title="Frequently Asked Questions" />
      </section>
    </div>
  );
};
