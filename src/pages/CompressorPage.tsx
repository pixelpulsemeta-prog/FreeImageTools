import React, { useState, useEffect, useCallback } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  compressImage, 
  downloadBlob, 
  CompressResult 
} from '../utils/imageProcessing';
import { 
  Download, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Layers, 
  ArrowRight,
  Eye
} from 'lucide-react';

export const CompressorPage: React.FC = () => {
  const seo = PAGES_SEO['/image-compressor'];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Compression Mode: 'quality' or 'targetSize'
  const [mode, setMode] = useState<'quality' | 'targetSize'>('quality');
  const [quality, setQuality] = useState<number>(80);
  const [targetPreset, setTargetPreset] = useState<'50' | '100' | '200' | '500' | 'custom'>('100');
  const [customTargetKb, setCustomTargetKb] = useState<number>(150);
  const [outputFormat, setOutputFormat] = useState<'auto' | 'image/jpeg' | 'image/webp' | 'image/png'>('auto');

  // Processing state & result
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'sideBySide' | 'compressed' | 'original'>('sideBySide');

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;

    // Reset previous compression
    setResult(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
  };

  // Run compression algorithm
  const processCompression = useCallback(async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      let targetKb: number | undefined = undefined;
      if (mode === 'targetSize') {
        targetKb = targetPreset === 'custom' ? customTargetKb : parseInt(targetPreset, 10);
      }

      let formatParam: 'image/jpeg' | 'image/webp' | 'image/png' | undefined = undefined;
      if (outputFormat !== 'auto') {
        formatParam = outputFormat;
      }

      const res = await compressImage(selectedFile, {
        mode,
        quality: quality / 100,
        targetSizeKb: targetKb,
        outputFormat: formatParam,
      });

      setResult(res);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const newResultUrl = URL.createObjectURL(res.blob);
      setResultUrl(newResultUrl);
    } catch (err: any) {
      console.error('Compression error:', err);
      alert('An error occurred while compressing the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, mode, quality, targetPreset, customTargetKb, outputFormat, resultUrl]);

  // Auto trigger compression on settings change or initial file load
  useEffect(() => {
    if (selectedFile) {
      const timer = setTimeout(() => {
        processCompression();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [selectedFile, mode, quality, targetPreset, customTargetKb, outputFormat]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  const handleDownload = () => {
    if (!result || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const ext = result.blob.type === 'image/webp' ? 'webp' : result.blob.type === 'image/png' ? 'png' : 'jpg';
    downloadBlob(result.blob, `${baseName}-compressed.${ext}`);
  };

  const handleReset = () => {
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSelectedFile(null);
    setOriginalPreviewUrl(null);
    setOriginalDimensions(null);
    setResult(null);
    setResultUrl(null);
  };

  return (
    <ToolLayout
      toolId="image-compressor"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload Your Image',
          text: 'Drag & drop any JPG, PNG, or WebP file into the upload box or click to select from your device.',
        },
        {
          step: 'Choose Compression Mode',
          text: 'Dial in a quality percentage slider (e.g. 75%) or select a strict target file size (50KB, 100KB, 200KB).',
        },
        {
          step: 'Inspect & Download',
          text: 'Verify the before/after preview, check the exact reduced file size, and download your optimized image.',
        },
      ]}
      supportedFormats={[
        { format: 'JPG / JPEG', desc: 'Industry-standard lossy photo format with high compression efficiency.' },
        { format: 'PNG', desc: 'Lossless graphic format; automatically optimized with palette quantization.' },
        { format: 'WebP', desc: 'Modern high-performance web format delivering 30%+ smaller sizes than JPG.' },
      ]}
      howItWorks="FreeImageTools uses the browser's hardware-accelerated Canvas 2D engine to draw and re-encode image pixels directly in device memory. When a specific target file size (like 100 KB) is requested, our intelligent binary search iteratively tests compression parameters in milliseconds until the output matches or best approaches your target. No server requests, no telemetry, and 100% data privacy."
      faqs={seo.faqs}
      relatedToolIds={['image-resizer', 'jpg-to-png', 'png-to-jpg', 'webp-to-jpg']}
    >
      {!selectedFile ? (
        <FileUploader
          onFileSelect={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          label="Drop your image to compress, or browse"
          sublabel="Supports JPG, PNG, and WebP up to 50MB. 100% processed locally in your browser."
        />
      ) : (
        <div className="space-y-6">
          {/* Top Status & File Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white" title={selectedFile.name}>
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Original: <span className="font-medium text-slate-700 dark:text-slate-300">{formatBytes(selectedFile.size)}</span>
                {originalDimensions && ` · ${originalDimensions.width} × ${originalDimensions.height} px`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-5">
            {/* Mode Selector Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800 max-w-md">
              <button
                type="button"
                onClick={() => setMode('quality')}
                className={`flex-1 rounded-md py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  mode === 'quality'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  Quality Slider
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('targetSize')}
                className={`flex-1 rounded-md py-1.5 text-xs sm:text-sm font-medium transition-all ${
                  mode === 'targetSize'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Target File Size
                </span>
              </button>
            </div>

            {/* Mode A: Quality Slider */}
            {mode === 'quality' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Compression Quality:
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded text-xs">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  aria-label="Compression Quality"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-700"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Smaller Size (10%)</span>
                  <span>Balanced (70-80%)</span>
                  <span>Maximum Quality (100%)</span>
                </div>
              </div>
            ) : (
              /* Mode B: Target Size Presets */
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Target File Size Options:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['50', '100', '200', '500', 'custom'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetPreset(preset)}
                      className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-semibold transition-all ${
                        targetPreset === preset
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {preset === 'custom' ? 'Custom Size' : `${preset} KB`}
                    </button>
                  ))}
                </div>

                {targetPreset === 'custom' && (
                  <div className="flex items-center gap-3 pt-2">
                    <label htmlFor="custom-kb" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Enter target in KB:
                    </label>
                    <div className="relative w-36">
                      <input
                        id="custom-kb"
                        type="number"
                        min="10"
                        max="10000"
                        value={customTargetKb}
                        onChange={(e) => setCustomTargetKb(Math.max(5, parseInt(e.target.value || '10', 10)))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="absolute right-3 top-1.5 text-xs text-slate-400">KB</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Format Selection Option */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-400" />
                Output Format:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Auto (Original)', value: 'auto' },
                  { label: 'JPG', value: 'image/jpeg' },
                  { label: 'WebP (Smallest)', value: 'image/webp' },
                  { label: 'PNG', value: 'image/png' },
                ].map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setOutputFormat(fmt.value as any)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      outputFormat === fmt.value
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compression Results & Comparison Statistics */}
          {result && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Original Size */}
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Original File Size</span>
                  <div className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-200">
                    {formatBytes(selectedFile.size)}
                  </div>
                </div>

                {/* Compressed Size */}
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Compressed File Size
                  </span>
                  <div className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(result.size)}
                  </div>
                </div>

                {/* Reduction Percentage */}
                <div className="rounded-lg bg-white p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Reduction</span>
                  <div className="mt-1 flex items-center gap-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                    {result.reductionPercentage > 0 ? (
                      <>
                        <span className="text-emerald-500 font-extrabold">-</span>
                        {result.reductionPercentage}% saved
                      </>
                    ) : (
                      'Optimized'
                    )}
                  </div>
                </div>
              </div>

              {/* Target Size Accuracy Report */}
              {mode === 'targetSize' && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  {result.reachedTarget ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <span>
                    {result.reachedTarget
                      ? `Successfully reached target threshold (under ${result.actualTargetSizeKb} KB).`
                      : `Closest achievable compression without excessive degradation is ${formatBytes(result.size)}.`}
                  </span>
                  <span className="ml-auto text-slate-400">
                    Processed in {result.processingTimeMs}ms
                  </span>
                </div>
              )}

              {/* Primary Actions: Download & Process Another */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download Compressed Image
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  Process Another Image
                </button>
              </div>
            </div>
          )}

          {/* Before / After Preview Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-slate-400" />
                Visual Preview
              </span>

              <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTab('sideBySide')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    previewTab === 'sideBySide'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('compressed')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    previewTab === 'compressed'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Compressed Only
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('original')}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    previewTab === 'original'
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Original Only
                </button>
              </div>
            </div>

            {/* Preview Canvas Display */}
            {previewTab === 'sideBySide' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Original ({formatBytes(selectedFile.size)})
                  </span>
                  <div className="relative max-h-80 w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center p-2">
                    {originalPreviewUrl && (
                      <img
                        src={originalPreviewUrl}
                        alt="Original before compression"
                        className="max-h-72 max-w-full object-contain rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                    Compressed {result ? `(${formatBytes(result.size)})` : ''}
                  </span>
                  <div className="relative max-h-80 w-full overflow-hidden rounded-lg border border-emerald-300 bg-white dark:border-emerald-900 dark:bg-slate-950 flex items-center justify-center p-2">
                    {isProcessing ? (
                      <div className="flex flex-col items-center py-12 text-slate-400">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-2" />
                        <span className="text-xs">Optimizing image in browser...</span>
                      </div>
                    ) : resultUrl ? (
                      <img
                        src={resultUrl}
                        alt="Compressed output preview"
                        className="max-h-72 max-w-full object-contain rounded"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : previewTab === 'compressed' ? (
              <div className="flex justify-center p-2">
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Compressed output preview"
                    className="max-h-96 max-w-full object-contain rounded-lg border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="py-12 text-slate-400 text-xs">Generating preview...</div>
                )}
              </div>
            ) : (
              <div className="flex justify-center p-2">
                {originalPreviewUrl && (
                  <img
                    src={originalPreviewUrl}
                    alt="Original preview"
                    className="max-h-96 max-w-full object-contain rounded-lg border border-slate-200 dark:border-slate-800"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
