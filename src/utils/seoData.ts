import { ToolDefinition, PageSEO } from '../types';

export const TOOLS: ToolDefinition[] = [
  {
    id: 'image-compressor',
    name: 'Compress Image',
    path: '/image-compressor',
    category: 'Compress',
    shortDescription: 'Compress JPG, PNG, and WebP images to exact target file sizes or quality levels without server uploads.',
    badge: 'Popular',
    icon: 'Minimize2',
    seoTitle: 'Image Compressor Online – Compress JPG, PNG & WebP',
    metaDescription: 'Compress JPG, PNG, and WebP images online for free directly in your browser. Reduce file size to 50KB, 100KB, or custom sizes with instant live preview.',
    canonicalUrl: 'https://freeimagetools.org/image-compressor',
    relatedToolIds: ['image-resizer', 'jpg-to-png', 'png-to-jpg', 'webp-to-jpg'],
  },
  {
    id: 'image-resizer',
    name: 'Resize Image',
    path: '/image-resizer',
    category: 'Resize',
    shortDescription: 'Resize images by width, height, aspect ratio presets, or percentage with high-quality bicubic smoothing.',
    badge: 'Essential',
    icon: 'Maximize2',
    seoTitle: 'Image Resizer Online – Resize Images Free',
    metaDescription: 'Resize images online for free. Adjust image dimensions by pixels or percentage with aspect ratio lock and social media presets. Fast, client-side, and private.',
    canonicalUrl: 'https://freeimagetools.org/image-resizer',
    relatedToolIds: ['image-compressor', 'image-cropper', 'jpg-to-png'],
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    path: '/jpg-to-png',
    category: 'Convert',
    shortDescription: 'Convert JPG photos into lossless PNG format with transparent canvas support and batch processing.',
    icon: 'FileCode2',
    seoTitle: 'JPG to PNG Converter – Convert JPG to PNG Online',
    metaDescription: 'Convert JPG to PNG online in seconds. Free browser-based tool with instant conversion, batch image support, and zero server storage.',
    canonicalUrl: 'https://freeimagetools.org/jpg-to-png',
    relatedToolIds: ['png-to-jpg', 'image-compressor', 'webp-to-jpg'],
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    path: '/png-to-jpg',
    category: 'Convert',
    shortDescription: 'Convert transparent PNG images to lightweight JPG with customizable background color and quality control.',
    icon: 'FileImage',
    seoTitle: 'PNG to JPG Converter – Convert PNG to JPG Online',
    metaDescription: 'Convert PNG to JPG online for free. Cleanly handles transparent areas with custom background colors and adjustable JPEG quality. No uploads required.',
    canonicalUrl: 'https://freeimagetools.org/png-to-jpg',
    relatedToolIds: ['jpg-to-png', 'webp-to-jpg', 'image-compressor'],
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    path: '/webp-to-jpg',
    category: 'Convert',
    shortDescription: 'Convert modern WebP images into universally compatible high-resolution JPG format locally.',
    icon: 'RefreshCw',
    seoTitle: 'WebP to JPG Converter – Convert WebP Images to JPG',
    metaDescription: 'Convert WebP to JPG online for free. Make downloaded WebP images compatible with all devices, apps, and platforms. 100% private in-browser processing.',
    canonicalUrl: 'https://freeimagetools.org/webp-to-jpg',
    relatedToolIds: ['png-to-jpg', 'image-compressor', 'jpg-to-png'],
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    path: '/image-cropper',
    category: 'Edit',
    shortDescription: 'Crop photos with interactive visual handles, standard aspect ratios (1:1, 4:3, 16:9), rotation, and flipping.',
    badge: 'Interactive',
    icon: 'Crop',
    seoTitle: 'Image Cropper Online – Crop Images Free',
    metaDescription: 'Crop images online for free with interactive drag handles, aspect ratio presets (1:1, 4:3, 16:9, custom), and rotation. Instant client-side download.',
    canonicalUrl: 'https://freeimagetools.org/image-cropper',
    relatedToolIds: ['image-resizer', 'image-compressor'],
  },
];

export const PAGES_SEO: Record<string, PageSEO> = {
  '/': {
    title: 'Free Online Image Tools – Compress, Resize & Convert Images',
    description: 'Free online image tools to compress, resize, convert, and crop images directly in your browser. Fast, private, zero server uploads, and 100% free.',
    canonicalPath: '/',
    h1: 'Free Online Image Tools',
    breadcrumbs: [{ name: 'Home', path: '/' }],
    faqs: [
      {
        question: 'Are my images uploaded to your servers?',
        answer: 'No. Every tool on FreeImageTools processes files directly inside your web browser using HTML5 Canvas and Web APIs. Your images are never uploaded, stored, or viewed by anyone.',
      },
      {
        question: 'Is FreeImageTools completely free?',
        answer: 'Yes! All tools are 100% free to use with no hidden subscriptions, no credit cards, no login, and no registration required.',
      },
      {
        question: 'What file formats are supported?',
        answer: 'We support all standard web image formats including JPG/JPEG, PNG, WebP, GIF, and BMP.',
      },
      {
        question: 'Is there a file size limit?',
        answer: 'Because processing happens on your own device hardware, limits depend only on your browser memory. Typically, high-resolution photos up to 30-50MB work seamlessly.',
      },
    ],
  },
  '/image-tools': {
    title: 'All Image Tools – Free Online Image Utilities | FreeImageTools',
    description: 'Browse our complete collection of free client-side image tools: image compressor, resizer, format converters (JPG, PNG, WebP), and cropper.',
    canonicalPath: '/image-tools',
    h1: 'All Image Tools',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
    ],
  },
  '/image-compressor': {
    title: 'Image Compressor Online – Compress JPG, PNG & WebP',
    description: 'Compress JPG, PNG, and WebP images online for free directly in your browser. Reduce file size to 50KB, 100KB, or custom sizes with instant live preview.',
    canonicalPath: '/image-compressor',
    h1: 'Image Compressor Online',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'Image Compressor', path: '/image-compressor' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'How does client-side image compression work?',
        answer: 'Our compressor utilizes the browser HTML5 Canvas context to re-encode image pixels with fine-tuned lossy and lossless algorithms. When a target file size like 100 KB is requested, an iterative binary search optimizes the compression parameters to reach the exact target without uploading bytes over the internet.',
      },
      {
        question: 'Will compressing my image reduce its quality?',
        answer: 'Visual compression smartly discards subtle high-frequency color variations that the human eye cannot detect. At quality levels between 70% and 85%, file sizes drop by 60% to 80% while retaining crisp visual fidelity.',
      },
      {
        question: 'Can I set a specific target file size like 50KB or 100KB?',
        answer: 'Yes! Select one of the preset target buttons (50KB, 100KB, 200KB, 500KB) or enter a custom KB value. The tool will iteratively dial in the exact compression needed to hit your target.',
      },
      {
        question: 'Which format compresses best?',
        answer: 'WebP offers the highest compression efficiency, often 25-35% smaller than JPEG at comparable quality. JPEG is best for broad compatibility with email and legacy systems.',
      },
    ],
  },
  '/image-resizer': {
    title: 'Image Resizer Online – Resize Images Free',
    description: 'Resize images online for free. Adjust image dimensions by pixels or percentage with aspect ratio lock and social media presets. Fast, client-side, and private.',
    canonicalPath: '/image-resizer',
    h1: 'Image Resizer Online',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'Image Resizer', path: '/image-resizer' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'How do I maintain the aspect ratio when resizing?',
        answer: 'Keep the aspect ratio lock icon active (enabled by default). When you change the width or height, the other dimension automatically recalculates to keep your image from stretching or distorting.',
      },
      {
        question: 'What are the recommended dimensions for social media?',
        answer: 'We provide one-click presets: 1080x1080 for Instagram square posts, 1080x1920 for Stories/Reels/TikTok, 1200x630 for Facebook and OpenGraph share cards, and 1280x720 for YouTube thumbnails.',
      },
      {
        question: 'Does resizing affect file size?',
        answer: 'Yes, decreasing width and height exponentially reduces total pixel count, resulting in much smaller file sizes and faster webpage loading speeds.',
      },
    ],
  },
  '/jpg-to-png': {
    title: 'JPG to PNG Converter – Convert JPG to PNG Online',
    description: 'Convert JPG to PNG online in seconds. Free browser-based tool with instant conversion, batch image support, and zero server storage.',
    canonicalPath: '/jpg-to-png',
    h1: 'JPG to PNG Converter',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'JPG to PNG', path: '/jpg-to-png' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'Why convert JPG to PNG?',
        answer: 'PNG uses lossless compression and supports transparency. Converting to PNG is ideal when you need to prevent artifacts from further editing or when creating assets for graphic design.',
      },
      {
        question: 'Can I convert multiple JPG files at once?',
        answer: 'Yes, our batch converter allows you to select multiple JPG photos simultaneously and download all converted PNGs individually or as a single organized ZIP file.',
      },
      {
        question: 'Will converting JPG to PNG make the image transparent?',
        answer: 'No, original JPG images do not have transparency data. Converting to PNG retains the opaque background, but the resulting PNG can now have transparent layers added in photo editors.',
      },
    ],
  },
  '/png-to-jpg': {
    title: 'PNG to JPG Converter – Convert PNG to JPG Online',
    description: 'Convert PNG to JPG online for free. Cleanly handles transparent areas with custom background colors and adjustable JPEG quality. No uploads required.',
    canonicalPath: '/png-to-jpg',
    h1: 'PNG to JPG Converter',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'PNG to JPG', path: '/png-to-jpg' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'What happens to transparent areas in my PNG?',
        answer: 'Since JPEG does not support transparency, transparent areas must be filled with a solid color. Our tool lets you choose white (#FFFFFF), black (#000000), or pick any custom background color.',
      },
      {
        question: 'Why convert PNG to JPG?',
        answer: 'PNG files are often 4x to 10x larger than JPGs because of lossless compression. Converting to JPG drastically cuts file size, making them ideal for emails, websites, and upload portals with strict limits.',
      },
    ],
  },
  '/webp-to-jpg': {
    title: 'WebP to JPG Converter – Convert WebP Images to JPG',
    description: 'Convert WebP to JPG online for free. Make downloaded WebP images compatible with all devices, apps, and platforms. 100% private in-browser processing.',
    canonicalPath: '/webp-to-jpg',
    h1: 'WebP to JPG Converter',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'WebP to JPG', path: '/webp-to-jpg' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'Why do I need to convert WebP to JPG?',
        answer: 'While WebP is great for modern web browsers, many older software applications, operating system previewers, presentation tools, and office suites still cannot open WebP files. Converting to JPG guarantees universal compatibility.',
      },
      {
        question: 'Is any data sent to an external server?',
        answer: 'No. The conversion is performed entirely within your browser using the HTML5 Canvas API. Your files stay strictly on your computer or mobile device.',
      },
    ],
  },
  '/image-cropper': {
    title: 'Image Cropper Online – Crop Images Free',
    description: 'Crop images online for free with interactive drag handles, aspect ratio presets (1:1, 4:3, 16:9, custom), and rotation. Instant client-side download.',
    canonicalPath: '/image-cropper',
    h1: 'Image Cropper Online',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Image Tools', path: '/image-tools' },
      { name: 'Image Cropper', path: '/image-cropper' },
    ],
    applicationCategory: 'MultimediaApplication',
    faqs: [
      {
        question: 'How do I crop an image to an exact aspect ratio?',
        answer: 'Click on one of the ratio presets (such as 1:1 for profile pictures or 16:9 for YouTube covers). The crop boundary will automatically maintain that geometric ratio as you move and scale it.',
      },
      {
        question: 'Can I rotate or flip my image before cropping?',
        answer: 'Yes! Use the 90° rotation buttons or horizontal/vertical flip controls to orient your image before dragging the crop rectangle.',
      },
    ],
  },
  '/about': {
    title: 'About FreeImageTools – Fast, Private Browser Image Processing',
    description: 'Learn about FreeImageTools, our mission to provide lightning-fast, zero-upload, free image utilities directly in your browser with complete privacy.',
    canonicalPath: '/about',
    h1: 'About FreeImageTools',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  '/privacy-policy': {
    title: 'Privacy Policy – FreeImageTools',
    description: 'Read our transparent privacy policy. FreeImageTools processes all images locally inside your browser. We never upload, view, or store your photos.',
    canonicalPath: '/privacy-policy',
    h1: 'Privacy Policy',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
    ],
  },
  '/terms': {
    title: 'Terms of Service – FreeImageTools',
    description: 'Terms of Service for FreeImageTools. Understand your rights and responsibilities when using our free client-side image compression, resizing, and conversion tools.',
    canonicalPath: '/terms',
    h1: 'Terms of Service',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Terms', path: '/terms' },
    ],
  },
  '/contact': {
    title: 'Contact Us – FreeImageTools',
    description: 'Get in touch with the FreeImageTools team. Send feedback, suggest new image editing tools, or report issues.',
    canonicalPath: '/contact',
    h1: 'Contact Us',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
  },
};
