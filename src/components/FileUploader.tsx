import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { formatBytes } from '../utils/imageProcessing';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onMultipleFilesSelect?: (files: File[]) => void;
  accept?: string;
  allowMultiple?: boolean;
  maxSizeBytes?: number;
  label?: string;
  sublabel?: string;
  allowSample?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  onMultipleFilesSelect,
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/bmp',
  allowMultiple = false,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
  label = 'Drop your image here, or browse',
  sublabel = 'Supports JPG, PNG, and WebP up to 50MB. Processed 100% in your browser.',
  allowSample = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndHandleFiles = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Filter valid image types
    const validImages = files.filter((file) => {
      // Check MIME type or extension
      const isImg = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name);
      return isImg;
    });

    if (validImages.length === 0) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }

    // Check size limit
    const oversized = validImages.find((f) => f.size > maxSizeBytes);
    if (oversized) {
      setErrorMessage(`File "${oversized.name}" exceeds the ${formatBytes(maxSizeBytes)} limit.`);
      return;
    }

    if (allowMultiple && onMultipleFilesSelect && validImages.length > 1) {
      onMultipleFilesSelect(validImages);
    } else {
      onFileSelect(validImages[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      validateAndHandleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndHandleFiles(e.target.files);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.items) return;
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            validateAndHandleFiles([file]);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Generate a clean sample test image
  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scenic gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Draw geometric shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(300, 300, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(550, 200, 500, 350, 32);
    ctx.fill();

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('FreeImageTools Demo Canvas', 200, 720);
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('Sample high-resolution test image (1200 × 800)', 200, 765);

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], 'sample-landscape.jpg', { type: 'image/jpeg' });
        validateAndHandleFiles([sampleFile]);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload Image Dropzone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 dark:border-blue-400 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-slate-600 dark:hover:bg-slate-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={allowMultiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm transition-transform duration-200 group-hover:scale-110 dark:bg-blue-900/40 dark:text-blue-400">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
          {label}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          {sublabel}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <ImageIcon className="h-4 w-4" />
            Select Image
          </span>

          {allowSample && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                loadSampleImage();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Try with Sample Image
            </button>
          )}
        </div>

        <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Or paste from clipboard (<kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">Ctrl+V</kbd> / <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">Cmd+V</kbd>)
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
