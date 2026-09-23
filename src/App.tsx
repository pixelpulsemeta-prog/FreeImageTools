/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { SEOHead } from './components/SEOHead';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ImageToolsCatalogPage } from './pages/ImageToolsCatalogPage';
import { CompressorPage } from './pages/CompressorPage';
import { ResizerPage } from './pages/ResizerPage';
import { JpgToPngPage } from './pages/JpgToPngPage';
import { PngToJpgPage } from './pages/PngToJpgPage';
import { WebpToJpgPage } from './pages/WebpToJpgPage';
import { CropperPage } from './pages/CropperPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/image-tools':
        return <ImageToolsCatalogPage />;
      case '/image-compressor':
        return <CompressorPage />;
      case '/image-resizer':
        return <ResizerPage />;
      case '/jpg-to-png':
        return <JpgToPngPage />;
      case '/png-to-jpg':
        return <PngToJpgPage />;
      case '/webp-to-jpg':
        return <WebpToJpgPage />;
      case '/image-cropper':
        return <CropperPage />;
      case '/about':
        return <AboutPage />;
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-blue-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-150">
      <SEOHead path={currentPath} />
      <Header />
      <main className="flex-1 w-full" id="main-content">
        {renderRoute()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}
