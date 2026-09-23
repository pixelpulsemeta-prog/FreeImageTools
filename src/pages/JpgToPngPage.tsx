import React, { useState } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  convertJpgToPng, 
  downloadBlob 
} from '../utils/imageProcessing';
import JSZip from 'jszip';
import { 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Archive, 
  FileCode2, 
  ArrowRight,
  Eye
} from 'lucide-react';

interface ConvertedItem {
  id: string;
  originalName: string;
  originalSize: number;
  pngBlob: Blob;
  pngUrl: string;
  width: number;
  height: number;
  newSize: number;
}

export const JpgToPngPage: React.FC = () => {
  const seo = PAGES_SEO['/jpg-to-png'];

  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<ConvertedItem | null>(null);

  const processFiles = async (files: File[]) => {
    setIsConverting(true);
    const results: ConvertedItem[] = [];

    for (const file of files) {
      try {
        const { blob, size, width, height } = await convertJpgToPng(file);
        const url = URL.createObjectURL(blob);
        const baseName = file.name.replace(/\.(jpe?g)$/i, '') || file.name;

        results.push({
          id: Math.random().toString(36).substring(2, 9),
          originalName: baseName + '.png',
          originalSize: file.size,
          pngBlob: blob,
          pngUrl: url,
          width,
          height,
          newSize: size,
        });
      } catch (err) {
        console.error(`Failed to convert ${file.name}:`, err);
      }
    }

    setItems((prev) => [...prev, ...results]);
    if (results.length > 0 && !selectedPreview) {
      setSelectedPreview(results[0]);
    }
    setIsConverting(false);
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    downloadBlob(item.pngBlob, item.originalName);
  };

  const handleDownloadAllZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();

    items.forEach((item) => {
      zip.file(item.originalName, item.pngBlob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, 'converted-png-images.zip');
  };

  const handleReset = () => {
    items.forEach((item) => URL.revokeObjectURL(item.pngUrl));
    setItems([]);
    setSelectedPreview(null);
  };

  return (
    <ToolLayout
      toolId="jpg-to-png"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload JPG Images',
          text: 'Drag and drop one or several JPG/JPEG files into the box. Batch conversion is fully supported.',
        },
        {
          step: 'Instant Client-Side Conversion',
          text: 'The browser decodes each frame and re-encodes it into 24/32-bit lossless PNG format locally.',
        },
        {
          step: 'Download PNG or ZIP',
          text: 'Download converted PNGs individually or click "Download All (ZIP)" to save all files at once.',
        },
      ]}
      supportedFormats={[
        { format: 'JPG & JPEG Input', desc: 'Standard photographic JPEG inputs from smartphones, digital cameras, and websites.' },
        { format: 'Lossless PNG Output', desc: 'High-fidelity PNG format with support for alpha channel layers and transparency.' },
        { format: 'Batch Processing', desc: 'Convert multiple pictures in parallel without waiting for server queues.' },
      ]}
      howItWorks="Conversion from JPG to PNG takes place purely in client-side memory using HTML5 Canvas pixel rendering. The original JPEG discrete cosine transform data is decompressed and saved into lossless Deflate-compressed PNG scanlines. Nothing is transmitted over the internet."
      faqs={seo.faqs}
      relatedToolIds={['png-to-jpg', 'image-compressor', 'webp-to-jpg']}
    >
      {items.length === 0 ? (
        <FileUploader
          onFileSelect={(file) => processFiles([file])}
          onMultipleFilesSelect={(files) => processFiles(files)}
          allowMultiple={true}
          accept="image/jpeg"
          label="Drop JPG images here, or browse"
          sublabel="Supports single or batch JPG/JPEG uploads up to 50MB. Processed 100% locally."
        />
      ) : (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Converted {items.length} {items.length === 1 ? 'Image' : 'Images'} to PNG
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% lossless conversion completed in browser memory
              </p>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition-colors"
                >
                  <Archive className="h-3.5 w-3.5" />
                  Download All (ZIP)
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Convert More
              </button>
            </div>
          </div>

          {/* Files List & Preview Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List of converted files */}
            <div className="lg:col-span-6 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {items.map((item) => {
                const isSelected = selectedPreview?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPreview(item)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                        <img src={item.pngUrl} alt={item.originalName} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white" title={item.originalName}>
                          {item.originalName}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.width} × {item.height} px · <span className="text-emerald-600 dark:text-emerald-400 font-medium">{formatBytes(item.newSize)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSingle(item);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                        title="Download PNG"
                      >
                        <Download className="h-3.5 w-3.5" />
                        PNG
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Inspection Panel */}
            <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Preview: {selectedPreview?.originalName}
                </span>

                <div className="relative max-h-72 w-full overflow-hidden rounded-lg bg-transparency-grid border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3">
                  {selectedPreview && (
                    <img
                      src={selectedPreview.pngUrl}
                      alt={selectedPreview.originalName}
                      className="max-h-64 max-w-full object-contain rounded"
                    />
                  )}
                </div>
              </div>

              {selectedPreview && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Resolution: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedPreview.width} × {selectedPreview.height}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(selectedPreview)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download This PNG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
