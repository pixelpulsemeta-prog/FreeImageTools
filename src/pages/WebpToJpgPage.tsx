import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  convertWebpToJpg, 
  downloadBlob, 
  getImageInfo 
} from '../utils/imageProcessing';
import { 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  RefreshCw 
} from 'lucide-react';

export const WebpToJpgPage: React.FC = () => {
  const seo = PAGES_SEO['/webp-to-jpg'];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [quality, setQuality] = useState<number>(92);
  const [isConverting, setIsConverting] = useState(false);
  const [jpgBlob, setJpgBlob] = useState<Blob | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [jpgSize, setJpgSize] = useState<number>(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    try {
      const info = await getImageInfo(file);
      setDimensions({ width: info.width, height: info.height });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!selectedFile) return;

    const timer = setTimeout(async () => {
      setIsConverting(true);
      try {
        const res = await convertWebpToJpg(selectedFile, '#FFFFFF', quality / 100);
        setJpgBlob(res.blob);
        setJpgSize(res.size);
        if (jpgUrl) URL.revokeObjectURL(jpgUrl);
        const newUrl = URL.createObjectURL(res.blob);
        setJpgUrl(newUrl);
      } catch (err) {
        console.error('WebP conversion failed:', err);
      } finally {
        setIsConverting(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedFile, quality]);

  const handleDownload = () => {
    if (!jpgBlob || !selectedFile) return;
    const baseName = selectedFile.name.replace(/\.webp$/i, '') || selectedFile.name;
    downloadBlob(jpgBlob, `${baseName}-converted.jpg`);
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (jpgUrl) URL.revokeObjectURL(jpgUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setJpgBlob(null);
    setJpgUrl(null);
    setJpgSize(0);
    setDimensions(null);
  };

  return (
    <ToolLayout
      toolId="webp-to-jpg"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload WebP Image',
          text: 'Drag & drop any .webp file downloaded from websites, search engines, or modern messaging apps.',
        },
        {
          step: 'Adjust Quality',
          text: 'Select your preferred JPG output compression level (recommended 90-95% for high fidelity).',
        },
        {
          step: 'Download JPG',
          text: 'Get an instantly compatible JPG file that opens anywhere on Windows, Mac, iOS, Android, and Word.',
        },
      ]}
      supportedFormats={[
        { format: 'WebP Input', desc: 'Accepts lossy and lossless WebP images with transparency or animation keyframes.' },
        { format: 'Universal JPG Output', desc: 'Converts to baseline JPEG universally readable across all hardware and legacy software.' },
        { format: 'Client-Side Execution', desc: 'Decoded and re-encoded locally using your computer GPU without server uploads.' },
      ]}
      howItWorks="Modern web platforms frequently serve images in WebP format for data saving, but legacy desktop applications often cannot open them. Our client-side converter draws the WebP bitmap onto an off-screen HTML5 canvas element and invokes canvas.toBlob('image/jpeg') to produce an authentic JPEG file in milliseconds."
      faqs={seo.faqs}
      relatedToolIds={['png-to-jpg', 'image-compressor', 'jpg-to-png']}
    >
      {!selectedFile ? (
        <FileUploader
          onFileSelect={handleFileSelect}
          accept="image/webp"
          label="Drop WebP image here, or browse"
          sublabel="Convert downloaded WebP files into universally compatible JPGs. 100% private."
        />
      ) : (
        <div className="space-y-6">
          {/* Header summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                WebP Source: <span className="font-medium text-slate-700 dark:text-slate-300">{formatBytes(selectedFile.size)}</span>
                {dimensions && ` · ${dimensions.width} × ${dimensions.height} px`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Quality Slider */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-slate-400" />
                JPG Quality Setting:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded text-xs">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              aria-label="JPG Quality"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Standard (75%)</span>
              <span>High (92%)</span>
              <span>Maximum (100%)</span>
            </div>
          </div>

          {/* Action Bar */}
          {jpgSize > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                  Conversion Complete
                </span>
                <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  Output JPG: {formatBytes(jpgSize)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download JPG
                </button>
              </div>
            </div>
          )}

          {/* Visual Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              Converted JPG Preview
            </span>
            <div className="flex justify-center max-h-96 overflow-hidden rounded-lg bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
              {isConverting ? (
                <div className="py-12 text-slate-400 text-xs">Converting WebP to JPG...</div>
              ) : jpgUrl ? (
                <img
                  src={jpgUrl}
                  alt="Converted JPG"
                  className="max-h-80 max-w-full object-contain rounded shadow-sm"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
