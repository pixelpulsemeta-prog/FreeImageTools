import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  resizeImage, 
  downloadBlob, 
  getImageInfo 
} from '../utils/imageProcessing';
import { 
  Lock, 
  Unlock, 
  Download, 
  RotateCcw, 
  Sliders, 
  Maximize2, 
  Check, 
  Layers 
} from 'lucide-react';

interface Preset {
  label: string;
  width: number;
  height: number;
  category: string;
}

const PRESETS: Preset[] = [
  { label: 'Instagram Square (1080 × 1080)', width: 1080, height: 1080, category: 'Social' },
  { label: 'Story / Reel / TikTok (1080 × 1920)', width: 1080, height: 1920, category: 'Social' },
  { label: 'Social Share / OpenGraph (1200 × 630)', width: 1200, height: 630, category: 'Social' },
  { label: 'YouTube Thumbnail / HD (1280 × 720)', width: 1280, height: 720, category: 'Video' },
  { label: 'Full HD (1920 × 1080)', width: 1920, height: 1080, category: 'Display' },
  { label: 'Web Standard (800 × 600)', width: 800, height: 600, category: 'Web' },
  { label: 'Avatar / Profile (400 × 400)', width: 400, height: 400, category: 'Avatar' },
];

export const ResizerPage: React.FC = () => {
  const seo = PAGES_SEO['/image-resizer'];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Resize controls
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [percentage, setPercentage] = useState<number>(100);
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage'>('pixels');
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Result state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedDimensions, setResizedDimensions] = useState<{ width: number; height: number; size: number } | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    try {
      const info = await getImageInfo(file);
      setOrigWidth(info.width);
      setOrigHeight(info.height);
      setTargetWidth(info.width);
      setTargetHeight(info.height);
      setPercentage(100);
      setOutputFormat(file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg');
    } catch (e) {
      console.error(e);
    }
  };

  // Keep aspect ratio in sync when width/height change in pixels mode
  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspectRatio && origWidth > 0 && origHeight > 0) {
      const ratio = origHeight / origWidth;
      setTargetHeight(Math.max(1, Math.round(w * ratio)));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspectRatio && origWidth > 0 && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setTargetWidth(Math.max(1, Math.round(h * ratio)));
    }
  };

  // Percentage scaling
  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (origWidth > 0 && origHeight > 0) {
      const scale = pct / 100;
      setTargetWidth(Math.max(1, Math.round(origWidth * scale)));
      setTargetHeight(Math.max(1, Math.round(origHeight * scale)));
    }
  };

  const applyPreset = (preset: Preset) => {
    setResizeMode('pixels');
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setLockAspectRatio(false); // Presets define both explicit W and H
  };

  // Generate preview/result
  useEffect(() => {
    if (!selectedFile || targetWidth <= 0 || targetHeight <= 0) return;

    const timer = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const res = await resizeImage(selectedFile, {
          width: targetWidth,
          height: targetHeight,
          outputFormat,
        });
        setResizedBlob(res.blob);
        setResizedDimensions({ width: res.width, height: res.height, size: res.size });
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        const newUrl = URL.createObjectURL(res.blob);
        setResizedUrl(newUrl);
      } catch (err) {
        console.error('Resize error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedFile, targetWidth, targetHeight, outputFormat]);

  const handleDownload = () => {
    if (!resizedBlob || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    downloadBlob(resizedBlob, `${baseName}-${targetWidth}x${targetHeight}.${ext}`);
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setResizedBlob(null);
    setResizedUrl(null);
    setResizedDimensions(null);
    setOrigWidth(0);
    setOrigHeight(0);
  };

  return (
    <ToolLayout
      toolId="image-resizer"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload Image',
          text: 'Upload any photo or image format to resize. The file is kept entirely on your local machine.',
        },
        {
          step: 'Specify Dimensions',
          text: 'Enter pixel values, pick a social media preset, or adjust the percentage slider. Lock aspect ratio to prevent distortion.',
        },
        {
          step: 'Download Resized File',
          text: 'Preview the new dimensions and file size instantly, then click download to save.',
        },
      ]}
      supportedFormats={[
        { format: 'All Standard Formats', desc: 'Accepts JPG, PNG, WebP, GIF, and BMP files.' },
        { format: 'Custom Resizing', desc: 'Downscale for web speed or upscale graphics with bicubic interpolation.' },
        { format: 'Aspect Ratio Control', desc: 'Preserve natural image proportions or crop to explicit dimensions.' },
      ]}
      howItWorks="Resizing executes via the browser's CanvasRenderingContext2D using bicubic anti-aliasing interpolation. Pixels are re-sampled and smoothed locally on your GPU/CPU, preventing pixelation and delivering crisp web assets."
      faqs={seo.faqs}
      relatedToolIds={['image-compressor', 'image-cropper', 'jpg-to-png']}
    >
      {!selectedFile ? (
        <FileUploader
          onFileSelect={handleFileSelect}
          label="Drop your image to resize, or browse"
          sublabel="Supports all formats up to 50MB. Processed directly in your browser."
        />
      ) : (
        <div className="space-y-6">
          {/* File summary & reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-md">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Original Dimensions: <span className="font-medium text-slate-700 dark:text-slate-300">{origWidth} × {origHeight} px</span> ({formatBytes(selectedFile.size)})
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

          {/* Resize Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Controls: Mode & Inputs */}
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setResizeMode('pixels')}
                  className={`flex-1 rounded-md py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    resizeMode === 'pixels'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Exact Pixels
                </button>
                <button
                  type="button"
                  onClick={() => setResizeMode('percentage')}
                  className={`flex-1 rounded-md py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    resizeMode === 'percentage'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  By Percentage
                </button>
              </div>

              {resizeMode === 'pixels' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {/* Width */}
                    <div className="flex-1">
                      <label htmlFor="resize-width" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Width (px)
                      </label>
                      <input
                        id="resize-width"
                        type="number"
                        min="1"
                        max="15000"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value || '1', 10)))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Lock aspect ratio button */}
                    <div className="pt-5">
                      <button
                        type="button"
                        onClick={() => setLockAspectRatio(!lockAspectRatio)}
                        title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                          lockAspectRatio
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'border-slate-300 text-slate-400 hover:text-slate-600 dark:border-slate-700'
                        }`}
                      >
                        {lockAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Height */}
                    <div className="flex-1">
                      <label htmlFor="resize-height" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Height (px)
                      </label>
                      <input
                        id="resize-height"
                        type="number"
                        min="1"
                        max="15000"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value || '1', 10)))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {lockAspectRatio
                      ? 'Proportions locked: changing width or height automatically calculates the other.'
                      : 'Proportions unlocked: width and height can be changed independently.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Scale Factor:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded text-xs">
                      {percentage}% ({targetWidth} × {targetHeight} px)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={percentage}
                    onChange={(e) => handlePercentageChange(parseInt(e.target.value, 10))}
                    aria-label="Resize Percentage"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-700"
                  />

                  {/* Percentage quick pills */}
                  <div className="flex flex-wrap gap-2">
                    {[25, 50, 75, 125, 150, 200].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePercentageChange(p)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold border ${
                          percentage === p
                            ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Output format */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Output Format
                </span>
                <div className="flex gap-2">
                  {[
                    { label: 'JPG', value: 'image/jpeg' },
                    { label: 'PNG', value: 'image/png' },
                    { label: 'WebP', value: 'image/webp' },
                  ].map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setOutputFormat(f.value as any)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                        outputFormat === f.value
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Presets */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Size Presets
              </span>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {PRESETS.map((p) => {
                  const isMatch = targetWidth === p.width && targetHeight === p.height;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs sm:text-sm transition-colors border ${
                        isMatch
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-medium">{p.label}</span>
                      {isMatch && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary & Download */}
          {resizedDimensions && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                  Resized Output
                </span>
                <div className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {resizedDimensions.width} × {resizedDimensions.height} px
                  <span className="ml-2 text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({formatBytes(resizedDimensions.size)})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download Resized Image
                </button>
              </div>
            </div>
          )}

          {/* Visual Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
              Live Preview
            </span>
            <div className="flex justify-center max-h-96 overflow-hidden rounded-lg bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
              {resizedUrl ? (
                <img
                  src={resizedUrl}
                  alt="Resized Preview"
                  className="max-h-80 max-w-full object-contain rounded"
                />
              ) : (
                <div className="py-12 text-slate-400 text-xs">Loading preview...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
