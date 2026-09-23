import React, { useState } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Layers, 
  Minimize2, 
  Maximize2, 
  RefreshCw, 
  Crop,
  ShieldCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Image Tools', path: '/image-tools' },
    { name: 'About', path: '/about' },
  ];

  const quickTools = [
    { name: 'Compress', path: '/image-compressor', icon: Minimize2 },
    { name: 'Resize', path: '/image-resizer', icon: Maximize2 },
    { name: 'JPG → PNG', path: '/jpg-to-png', icon: RefreshCw },
    { name: 'Crop', path: '/image-cropper', icon: Crop },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              FreeImage<span className="text-blue-600 dark:text-blue-400">Tools</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Quick Tools Dropdown / Dark Mode / Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Tools Pills on larger screens */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-200 pr-3 mr-1 dark:border-slate-800">
            {quickTools.map((t) => (
              <Link
                key={t.path}
                href={t.path}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <t.icon className="h-3.5 w-3.5 text-blue-500" />
                {t.name}
              </Link>
            ))}
          </div>

          {/* Privacy Indicator Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Local Browser Processing</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 dark:border-slate-800 dark:bg-slate-900 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-medium ${
                  currentPath === link.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Popular Tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/image-compressor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Minimize2 className="h-4 w-4 text-blue-500" />
                <span>Compress</span>
              </Link>
              <Link
                href="/image-resizer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Maximize2 className="h-4 w-4 text-emerald-500" />
                <span>Resize</span>
              </Link>
              <Link
                href="/jpg-to-png"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4 text-purple-500" />
                <span>JPG to PNG</span>
              </Link>
              <Link
                href="/image-cropper"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Crop className="h-4 w-4 text-amber-500" />
                <span>Crop</span>
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Images never leave your browser. 100% private.</span>
          </div>
        </div>
      )}
    </header>
  );
};
