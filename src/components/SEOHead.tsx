import React, { useEffect } from 'react';
import { PAGES_SEO } from '../utils/seoData';

interface SEOHeadProps {
  path: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ path }) => {
  const seo = PAGES_SEO[path] || PAGES_SEO['/'];

  useEffect(() => {
    // 1. Title
    document.title = seo.title;

    // 2. Canonical URL
    const canonicalUrl = `https://freeimagetools.org${seo.canonicalPath}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonicalUrl;

    // Helper to set or create meta tag
    const setMeta = (nameAttr: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${key}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard Meta
    setMeta('name', 'description', seo.description);

    // OpenGraph
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'FreeImageTools');
    const ogImageUrl = 'https://freeimagetools.org/og-image.png';
    setMeta('property', 'og:image', ogImageUrl);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', `${seo.h1} - FreeImageTools`);

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', ogImageUrl);
    setMeta('name', 'twitter:image:alt', `${seo.h1} - FreeImageTools`);

    // Schema.org Structured Data (JSON-LD)
    const jsonLdData: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'FreeImageTools',
        url: 'https://freeimagetools.org/',
        description: 'Free online image tools to compress, resize, convert, and crop images directly in your browser.',
      },
    ];

    if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: seo.breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `https://freeimagetools.org${b.path}`,
        })),
      });
    }

    if (seo.applicationCategory) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: seo.h1,
        applicationCategory: seo.applicationCategory,
        operatingSystem: 'All modern web browsers',
        browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas support.',
        description: seo.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }

    if (seo.faqs && seo.faqs.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    let scriptTag = document.getElementById('route-schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'route-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);
  }, [seo]);

  return null;
};
