import React from 'react';
import { Link } from '../context/RouterContext';
import { Layers, ShieldCheck, Cpu, Lock, Heart } from 'lucide-react';
import { TOOLS } from '../utils/seoData';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                FreeImage<span className="text-blue-600 dark:text-blue-400">Tools</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Free, private, high-speed image utilities running directly in your browser. Compress, resize, convert, and crop images with zero server uploads.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Zero Server Uploads — Processed locally in memory</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Cpu className="h-4 w-4 shrink-0 text-blue-500" />
                <span>Powered by HTML5 Canvas & WebAssembly APIs</span>
              </div>
            </div>
          </div>

          {/* Tools Col 1 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Popular Tools
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {TOOLS.slice(0, 4).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.path}
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Col 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Converters & More
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {TOOLS.slice(4).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.path}
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/image-tools"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  All Image Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Information
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} FreeImageTools. All rights reserved. Made for speed and privacy.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-emerald-500" />
              100% Client-Side Privacy
            </span>
            <span>·</span>
            <span>No Account Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
