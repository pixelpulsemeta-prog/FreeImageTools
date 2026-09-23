import fs from 'node:fs';
import path from 'node:path';
import { PAGES_SEO, TOOLS } from '../src/utils/seoData.ts';

const distDir = path.resolve(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html does not exist. Run "vite build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

console.log('Generating static HTML pages for SEO and search engine crawlers...');

// Helper to escape HTML characters
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

for (const [routePath, seo] of Object.entries(PAGES_SEO)) {
  if (routePath === '/') continue; // Homepage already in dist/index.html

  const canonicalUrl = `https://freeimagetools.org${seo.canonicalPath}`;
  const ogImageUrl = 'https://freeimagetools.org/og-image.png';

  // Build JSON-LD
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

  // Generate Crawlable Content for this specific route
  let breadcrumbHtml = '';
  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    breadcrumbHtml = `
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">
        <ol style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
          ${seo.breadcrumbs
            .map(
              (b, idx) =>
                `<li><a href="${b.path}" style="color: #64748b; text-decoration: none;">${escapeHtml(b.name)}</a>${
                  idx < seo.breadcrumbs.length - 1 ? ' <span style="margin-left: 0.5rem;">/</span>' : ''
                }</li>`
            )
            .join('')}
        </ol>
      </nav>
    `;
  }

  let faqsHtml = '';
  if (seo.faqs && seo.faqs.length > 0) {
    faqsHtml = `
      <section style="margin-top: 3rem; border-top: 1px solid #e2e8f0; padding-top: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem;">Frequently Asked Questions</h2>
        <dl style="display: grid; gap: 1.25rem;">
          ${seo.faqs
            .map(
              (faq) => `
            <div>
              <dt style="font-weight: 700; color: #0f172a; font-size: 1.05rem; margin-bottom: 0.25rem;">${escapeHtml(faq.question)}</dt>
              <dd style="color: #475569; line-height: 1.6; margin-left: 0;">${escapeHtml(faq.answer)}</dd>
            </div>
          `
            )
            .join('')}
        </dl>
      </section>
    `;
  }

  // Related tools
  const otherTools = TOOLS.filter((t) => t.path !== routePath);
  const relatedToolsHtml = `
    <section style="margin-top: 3rem; background: #f8fafc; padding: 2rem; border-radius: 1rem;">
      <h2 style="font-size: 1.35rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">Other Free Image Tools</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
        ${otherTools
          .map(
            (t) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; background: white;">
            <a href="${t.path}" style="color: #0f172a; font-weight: 600; text-decoration: none; display: block; margin-bottom: 0.25rem;">${escapeHtml(t.name)}</a>
            <p style="color: #64748b; font-size: 0.85rem; margin: 0;">${escapeHtml(t.shortDescription)}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  `;

  const routeContent = `
    <header style="padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
      <a href="/" style="font-weight: bold; font-size: 1.25rem; text-decoration: none; color: #0f172a;">
        FreeImageTools
      </a>
      <nav>
        <a href="/" style="margin-right: 1rem; text-decoration: none; color: #475569;">Home</a>
        <a href="/image-tools" style="margin-right: 1rem; text-decoration: none; color: #475569;">Image Tools</a>
        <a href="/about" style="text-decoration: none; color: #475569;">About</a>
      </nav>
    </header>

    <main style="max-width: 1000px; margin: 0 auto; padding: 2rem 1rem;">
      ${breadcrumbHtml}
      <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
        ${escapeHtml(seo.h1)}
      </h1>
      <p style="font-size: 1.15rem; color: #475569; line-height: 1.6; margin-bottom: 2rem;">
        ${escapeHtml(seo.description)}
      </p>

      <div style="padding: 2.5rem 1.5rem; border: 2px dashed #cbd5e1; border-radius: 1rem; text-align: center; background: #f8fafc; margin-bottom: 2rem;">
        <p style="font-weight: 600; color: #334155; margin-bottom: 0.5rem;">Browser-based interactive tool ready.</p>
        <p style="color: #64748b; font-size: 0.9rem;">Requires JavaScript to process images in real time.</p>
      </div>

      ${faqsHtml}
      ${relatedToolsHtml}
    </main>

    <footer style="padding: 2rem 1rem; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.875rem; color: #64748b; margin-top: 3rem;">
      <p>&copy; 2026 FreeImageTools. All rights reserved. 100% Client-Side Privacy.</p>
      <p style="margin-top: 0.5rem;">
        <a href="/about" style="color: #64748b; margin: 0 0.5rem;">About</a> |
        <a href="/privacy-policy" style="color: #64748b; margin: 0 0.5rem;">Privacy Policy</a> |
        <a href="/terms" style="color: #64748b; margin: 0 0.5rem;">Terms</a> |
        <a href="/contact" style="color: #64748b; margin: 0 0.5rem;">Contact</a>
      </p>
    </footer>
  `;

  // Replace <title>
  let html = templateHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace OG tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`
  );

  // Replace JSON-LD
  html = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLdData, null, 2)}\n    </script>`
  );

  // Replace <div id="root"> content
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<script type="module"/i,
    `<div id="root">\n${routeContent}\n    </div>\n    <script type="module"`
  );

  // Output destination: dist/{subfolder}/index.html
  const cleanSubPath = routePath.replace(/^\//, '');
  const targetDir = path.join(distDir, cleanSubPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf-8');
  console.log(`Generated: ${targetFile}`);
}

console.log('Successfully generated all static HTML pages!');
