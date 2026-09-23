import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  convertPngToJpg, 
  downloadBlob, 
  getImageInfo 
} from '../utils/imageProcessing';
import { 
  Download, 
  RotateCcw, 
  Palette, 
  Check, 
  Sliders, 
  Eye 
} from 'lucide-react';

const COLOR_PRESETS = [
  { label: 'White', value: '#FFFFFF', border: true },
  { label: 'Black', value: '#000000', border: false },
  { label: 'Light Gray', value: '#F3F4F6', border: false },
  { label: 'Navy Blue', value: '#0F172A', border: false },
  { label: 'Soft Cream', value: '#FFFBEB', border: false },
];

export const PngToJpgPage: React.FC = () => {
  const seo = PAGES_SEO['/png-to-jpg'];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Settings
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  const [quality, setQuality] = useState<number>(90);

  // Result
  const [isProcessing, setIsProcessing] = useState(false);
  const [jpgBlob, setJpgBlob] = useState<Blob | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [jpgSize, setJpgSize] = useState<number>(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreviewUrl(url);

    try {
      const info = await getImageInfo(file);
      setDimensions({ width: info.width, height: info.height });
    } catch (e) {
      console.error(e);
    }
  };

  // Convert whenever settings change
  useEffect(() => {
    if (!selectedFile) return;

    const timer = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const res = await convertPngToJpg(selectedFile, bgColor, quality / 100);
        setJpgBlob(res.blob);
        setJpgSize(res.size);
        if (jpgUrl) URL.revokeObjectURL(jpgUrl);
        const newUrl = URL.createObjectURL(res.blob);
        setJpgUrl(newUrl);
      } catch (err) {
        console.error('PNG to JPG conversion failed:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedFile, bgColor, quality]);

  const handleDownload = () => {
    if (!jpgBlob || !selectedFile) return;
    const baseName = selectedFile.name.replace(/\.png$/i, '') || selectedFile.name;
    downloadBlob(jpgBlob, `${baseName}-converted.jpg`);
  };

  const handleReset = () => {
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (jpgUrl) URL.revokeObjectURL(jpgUrl);
    setSelectedFile(null);
    setOriginalPreviewUrl(null);
    setJpgBlob(null);
    setJpgUrl(null);
    setJpgSize(0);
    setDimensions(null);
  };

  return (
    <ToolLayout
      toolId="png-to-jpg"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload PNG Graphic',
          text: 'Drag & drop your transparent or opaque PNG file. File stays 100% on your device.',
        },
        {
          step: 'Pick Background Color',
          text: 'Choose a background color (such as crisp white or dark black) to neatly fill any transparent regions.',
        },
        {
          step: 'Save Lightweight JPG',
          text: 'Inspect the live preview, check the file size reduction, and download your JPG instantly.',
        },
      ]}
      supportedFormats={[
        { format: 'PNG Inputs', desc: 'Accepts 8-bit, 24-bit, and 32-bit PNG images with full alpha transparency.' },
        { format: 'JPEG Output', desc: 'Standard compressed photographic JPG with custom quality compression.' },
        { format: 'Color Replacement', desc: 'Pre-fills canvas background so transparent artwork never looks corrupt.' },
      ]}
      howItWorks="Because the JPEG format specification does not support alpha channels or transparent pixels, raw conversions in naive tools often result in black boxes or artifacted fringes. FreeImageTools paints an anti-aliased backdrop canvas in your designated background color, then smoothly composites your PNG over it before producing a clean, lightweight JPEG."
      faqs={seo.faqs}
      relatedToolIds={['jpg-to-png', 'webp-to-jpg', 'image-compressor']}
    >
      {!selectedFile ? (
        <FileUploader
          onFileSelect={handleFileSelect}
          accept="image/png"
          label="Drop PNG image here, or browse"
          sublabel="Supports transparent and opaque PNGs up to 50MB. Processed client-side."
        />
      ) : (
        <div className="space-y-6">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Original PNG: <span className="font-medium text-slate-700 dark:text-slate-300">{formatBytes(selectedFile.size)}</span>
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

          {/* Controls & Transparency Handling */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-5">
            {/* Background Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Fill Transparent Areas With:
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Since JPG does not support transparency, transparent background pixels will be filled with this color.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {COLOR_PRESETS.map((color) => {
                  const isSelected = bgColor.toUpperCase() === color.value.toUpperCase();
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setBgColor(color.value)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full ${color.border ? 'border border-slate-300 dark:border-slate-600' : ''}`}
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
                  <input
                    type="color"
                    id="custom-color-picker"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Custom background color picker"
                    className="h-8 w-8 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-slate-400" />
                  JPG Compression Quality:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded text-xs">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                aria-label="JPG Quality"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Smaller File (50%)</span>
                <span>High Quality (90%)</span>
                <span>Maximum (100%)</span>
              </div>
            </div>
          </div>

          {/* Results Bar */}
          {jpgSize > 0 && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                  Ready to Download
                </span>
                <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  JPG File Size: {formatBytes(jpgSize)}
                  {selectedFile.size > jpgSize && (
                    <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      -{Math.round(((selectedFile.size - jpgSize) / selectedFile.size) * 100)}% smaller
                    </span>
                  )}
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

          {/* Side by side comparison preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Original Transparent PNG
              </span>
              <div className="max-h-72 flex items-center justify-center p-3 rounded-lg bg-transparency-grid border border-slate-200 dark:border-slate-800 overflow-hidden">
                {originalPreviewUrl && (
                  <img
                    src={originalPreviewUrl}
                    alt="Original transparent PNG"
                    className="max-h-64 max-w-full object-contain rounded"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
                Output JPG with Filled Background
              </span>
              <div className="max-h-72 flex items-center justify-center p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden">
                {isProcessing ? (
                  <div className="py-12 text-slate-400 text-xs">Converting...</div>
                ) : jpgUrl ? (
                  <img
                    src={jpgUrl}
                    alt="Converted JPG"
                    className="max-h-64 max-w-full object-contain rounded shadow-sm"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
