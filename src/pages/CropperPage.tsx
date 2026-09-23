import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { FileUploader } from '../components/FileUploader';
import { PAGES_SEO } from '../utils/seoData';
import { 
  formatBytes, 
  renderTransformedImage,
  cropCanvas, 
  downloadBlob, 
  getImageInfo, 
  CropArea 
} from '../utils/imageProcessing';
import { 
  Crop, 
  RotateCw, 
  RotateCcw, 
  Download, 
  Check, 
  FlipHorizontal, 
  FlipVertical, 
  Layers, 
  Sparkles 
} from 'lucide-react';

type AspectRatioMode = 'free' | '1:1' | '4:3' | '16:9' | '9:16' | '3:2' | 'custom';

export const CropperPage: React.FC = () => {
  const seo = PAGES_SEO['/image-cropper'];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Transformed image state (rendered onto off-screen canvas with current rotation & flips)
  const [transformedCanvas, setTransformedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  const [currentHeight, setCurrentHeight] = useState<number>(0);

  // Crop Box normalized (0 to 1 relative to displayed transformed image)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8,
  });

  const [ratioMode, setRatioMode] = useState<AspectRatioMode>('free');
  const [customRatioX, setCustomRatioX] = useState<number>(2);
  const [customRatioY, setCustomRatioY] = useState<number>(3);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  // Cropped result
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedSize, setCroppedSize] = useState<number>(0);
  const [croppedDimensions, setCroppedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  // DOM Container ref for mouse drag math
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragTypeRef = useRef<'move' | 'nw' | 'ne' | 'sw' | 'se'>('move');
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; box: typeof cropBox }>({
    mouseX: 0,
    mouseY: 0,
    box: cropBox,
  });

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setOutputFormat(file.type === 'image/png' ? 'image/png' : 'image/jpeg');
    setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  };

  // Re-render transformed canvas when file, rotation, or flip changes
  useEffect(() => {
    if (!selectedFile) return;

    let isMounted = true;
    renderTransformedImage(selectedFile, rotation, flipH, flipV)
      .then((res) => {
        if (!isMounted) return;
        setTransformedCanvas(res.canvas);
        setTransformedUrl(res.dataUrl);
        setCurrentWidth(res.width);
        setCurrentHeight(res.height);
      })
      .catch((err) => {
        console.error('Failed to render transformed image:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFile, rotation, flipH, flipV]);

  // Enforce aspect ratio on cropBox changes
  const applyAspectRatioToBox = useCallback(
    (targetRatio: number | null, currentBox = cropBox) => {
      if (!targetRatio || !currentWidth || !currentHeight) return currentBox;

      const imgAspect = currentWidth / currentHeight;
      const normalizedRatio = targetRatio / imgAspect;

      let newW = currentBox.w;
      let newH = newW / normalizedRatio;

      if (newH > 1) {
        newH = 1;
        newW = newH * normalizedRatio;
      }
      if (newW > 1) {
        newW = 1;
        newH = newW / normalizedRatio;
      }

      let newX = Math.min(Math.max(0, currentBox.x), 1 - newW);
      let newY = Math.min(Math.max(0, currentBox.y), 1 - newH);

      return { x: newX, y: newY, w: newW, h: newH };
    },
    [currentWidth, currentHeight, cropBox]
  );

  const handleRatioChange = (mode: AspectRatioMode) => {
    setRatioMode(mode);
    let numericRatio: number | null = null;
    if (mode === '1:1') numericRatio = 1;
    else if (mode === '4:3') numericRatio = 4 / 3;
    else if (mode === '16:9') numericRatio = 16 / 9;
    else if (mode === '9:16') numericRatio = 9 / 16;
    else if (mode === '3:2') numericRatio = 3 / 2;
    else if (mode === 'custom') numericRatio = customRatioX / customRatioY;

    if (numericRatio) {
      setCropBox((prev) => applyAspectRatioToBox(numericRatio, prev));
    }
  };

  // Drag handlers
  const startDrag = (e: React.MouseEvent | React.TouchEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragTypeRef.current = type;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      box: { ...cropBox },
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - dragStartRef.current.mouseX) / rect.width;
      const deltaY = (clientY - dragStartRef.current.mouseY) / rect.height;

      const initialBox = dragStartRef.current.box;
      const type = dragTypeRef.current;

      let newX = initialBox.x;
      let newY = initialBox.y;
      let newW = initialBox.w;
      let newH = initialBox.h;

      const minSize = 0.05;

      if (type === 'move') {
        newX = Math.max(0, Math.min(1 - initialBox.w, initialBox.x + deltaX));
        newY = Math.max(0, Math.min(1 - initialBox.h, initialBox.y + deltaY));
      } else if (type === 'se') {
        newW = Math.max(minSize, Math.min(1 - initialBox.x, initialBox.w + deltaX));
        newH = Math.max(minSize, Math.min(1 - initialBox.y, initialBox.h + deltaY));
      } else if (type === 'nw') {
        const potentialW = initialBox.w - deltaX;
        const potentialH = initialBox.h - deltaY;
        if (potentialW >= minSize && initialBox.x + deltaX >= 0) {
          newX = initialBox.x + deltaX;
          newW = potentialW;
        }
        if (potentialH >= minSize && initialBox.y + deltaY >= 0) {
          newY = initialBox.y + deltaY;
          newH = potentialH;
        }
      } else if (type === 'ne') {
        const potentialH = initialBox.h - deltaY;
        newW = Math.max(minSize, Math.min(1 - initialBox.x, initialBox.w + deltaX));
        if (potentialH >= minSize && initialBox.y + deltaY >= 0) {
          newY = initialBox.y + deltaY;
          newH = potentialH;
        }
      } else if (type === 'sw') {
        const potentialW = initialBox.w - deltaX;
        newH = Math.max(minSize, Math.min(1 - initialBox.y, initialBox.h + deltaY));
        if (potentialW >= minSize && initialBox.x + deltaX >= 0) {
          newX = initialBox.x + deltaX;
          newW = potentialW;
        }
      }

      setCropBox({ x: newX, y: newY, w: newW, h: newH });
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  // Compute pixel dimensions for crop box
  const pixelCropW = Math.max(1, Math.round(cropBox.w * currentWidth));
  const pixelCropH = Math.max(1, Math.round(cropBox.h * currentHeight));
  const pixelCropX = Math.max(0, Math.round(cropBox.x * currentWidth));
  const pixelCropY = Math.max(0, Math.round(cropBox.y * currentHeight));

  // Perform crop calculation directly from transformed canvas
  const executeCrop = async () => {
    if (!transformedCanvas || !currentWidth) return;
    setIsCropping(true);

    try {
      const area: CropArea = {
        x: pixelCropX,
        y: pixelCropY,
        width: pixelCropW,
        height: pixelCropH,
      };

      const res = await cropCanvas(
        transformedCanvas,
        area,
        outputFormat,
        0.95
      );

      setCroppedBlob(res.blob);
      setCroppedSize(res.size);
      setCroppedDimensions({ width: res.width, height: res.height });
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
      const url = URL.createObjectURL(res.blob);
      setCroppedUrl(url);
    } catch (e) {
      console.error('Cropping error:', e);
    } finally {
      setIsCropping(false);
    }
  };

  const handleDownload = () => {
    if (!croppedBlob || !selectedFile) return;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    downloadBlob(croppedBlob, `${baseName}-cropped.${ext}`);
  };

  const handleReset = () => {
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setSelectedFile(null);
    setTransformedCanvas(null);
    setTransformedUrl(null);
    setCroppedBlob(null);
    setCroppedUrl(null);
    setCroppedSize(0);
    setCroppedDimensions(null);
    setCurrentWidth(0);
    setCurrentHeight(0);
  };

  return (
    <ToolLayout
      toolId="image-cropper"
      title={seo.h1}
      description={seo.description}
      breadcrumbs={seo.breadcrumbs}
      howToSteps={[
        {
          step: 'Upload Image',
          text: 'Drag & drop your photo. It loads directly into client memory with full fidelity.',
        },
        {
          step: 'Position Crop Area',
          text: 'Drag the visual handles to resize the crop boundary, or lock in standard presets like 1:1, 4:3, or 16:9.',
        },
        {
          step: 'Crop & Download',
          text: 'Click "Apply Crop" to extract the full-resolution pixels locally, then download your cropped file.',
        },
      ]}
      supportedFormats={[
        { format: 'Aspect Ratio Presets', desc: 'Includes Freeform, 1:1 (Square), 4:3 (Photo), 16:9 (Widescreen), and Custom ratios.' },
        { format: 'Orientation Tools', desc: 'Rotate in 90° increments and flip horizontally or vertically prior to cropping.' },
        { format: 'Full Resolution Preservation', desc: 'Coordinates are calculated against natural image pixels, preventing blurriness.' },
      ]}
      howItWorks="Our interactive cropper maps normalized bounding coordinates from the on-screen display directly to the underlying raw raster bitmap. The selected slice is then rendered into an off-screen HTML5 canvas using hardware anti-aliasing and exported to your preferred format (PNG, JPG, or WebP) completely inside your browser."
      faqs={seo.faqs}
      relatedToolIds={['image-resizer', 'image-compressor']}
    >
      {!selectedFile ? (
        <FileUploader
          onFileSelect={handleFileSelect}
          label="Drop your image to crop, or browse"
          sublabel="Supports all formats up to 50MB. Processed privately on your device."
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
                Current Canvas Resolution: <span className="font-medium text-slate-700 dark:text-slate-300">{currentWidth} × {currentHeight} px</span>
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

          {/* Ratio & Orientation Controls */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            {/* Aspect Ratio Buttons */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Aspect Ratio
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'free', label: 'Free Crop' },
                  { id: '1:1', label: '1:1 (Square)' },
                  { id: '4:3', label: '4:3' },
                  { id: '16:9', label: '16:9 (Landscape)' },
                  { id: '9:16', label: '9:16 (Story)' },
                  { id: '3:2', label: '3:2' },
                  { id: 'custom', label: 'Custom' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRatioChange(item.id as AspectRatioMode)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      ratioMode === item.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {ratioMode === 'custom' && (
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Ratio (W : H):</span>
                  <input
                    type="number"
                    min="1"
                    value={customRatioX}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value || '1', 10));
                      setCustomRatioX(val);
                      setCropBox((prev) => applyAspectRatioToBox(val / customRatioY, prev));
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="1"
                    value={customRatioY}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value || '1', 10));
                      setCustomRatioY(val);
                      setCropBox((prev) => applyAspectRatioToBox(customRatioX / val, prev));
                    }}
                    className="w-16 rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Transform Controls (Rotate & Flip) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">Rotate / Flip:</span>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  +90°
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    flipH
                      ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                  title="Flip Horizontally"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  Flip H
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    flipV
                      ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                  title="Flip Vertically"
                >
                  <FlipVertical className="h-3.5 w-3.5" />
                  Flip V
                </button>
              </div>

              {/* Output format */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Save As:</span>
                {(['image/png', 'image/jpeg', 'image/webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setOutputFormat(fmt)}
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      outputFormat === fmt
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WebP'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Visual Cropper Canvas */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 sm:p-6 dark:border-slate-800 flex flex-col items-center justify-center select-none overflow-hidden">
            <div
              ref={containerRef}
              className="relative max-h-[500px] max-w-full inline-block cursor-crosshair overflow-hidden touch-none"
            >
              {transformedUrl && (
                <img
                  src={transformedUrl}
                  alt="Crop Source"
                  className="max-h-[480px] max-w-full block pointer-events-none object-contain"
                />
              )}

              {/* Dimmed Overlay outside crop rectangle */}
              <div
                className="absolute inset-0 bg-black/60 pointer-events-none"
                style={{
                  clipPath: `polygon(
                    0% 0%, 0% 100%, 
                    ${cropBox.x * 100}% 100%, 
                    ${cropBox.x * 100}% ${cropBox.y * 100}%, 
                    ${(cropBox.x + cropBox.w) * 100}% ${cropBox.y * 100}%, 
                    ${(cropBox.x + cropBox.w) * 100}% ${(cropBox.y + cropBox.h) * 100}%, 
                    ${cropBox.x * 100}% ${(cropBox.y + cropBox.h) * 100}%, 
                    ${cropBox.x * 100}% 100%, 
                    100% 100%, 100% 0%
                  )`,
                }}
              />

              {/* Draggable Crop Box */}
              <div
                onMouseDown={(e) => startDrag(e, 'move')}
                onTouchStart={(e) => startDrag(e, 'move')}
                className="absolute border-2 border-white cursor-move shadow-2xl"
                style={{
                  left: `${cropBox.x * 100}%`,
                  top: `${cropBox.y * 100}%`,
                  width: `${cropBox.w * 100}%`,
                  height: `${cropBox.h * 100}%`,
                }}
              >
                {/* 3x3 Grid Guides */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* Corner Resize Handles */}
                <div
                  onMouseDown={(e) => startDrag(e, 'nw')}
                  onTouchStart={(e) => startDrag(e, 'nw')}
                  className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white cursor-nwse-resize"
                />
                <div
                  onMouseDown={(e) => startDrag(e, 'ne')}
                  onTouchStart={(e) => startDrag(e, 'ne')}
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white cursor-nesw-resize"
                />
                <div
                  onMouseDown={(e) => startDrag(e, 'sw')}
                  onTouchStart={(e) => startDrag(e, 'sw')}
                  className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white cursor-nesw-resize"
                />
                <div
                  onMouseDown={(e) => startDrag(e, 'se')}
                  onTouchStart={(e) => startDrag(e, 'se')}
                  className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white cursor-nwse-resize"
                />

                {/* Dimension Tooltip Badge */}
                <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-mono text-white pointer-events-none">
                  {pixelCropW} × {pixelCropH} px
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between w-full max-w-xl text-xs text-slate-300">
              <span>Target selection: {pixelCropW} × {pixelCropH} px</span>
              <button
                type="button"
                onClick={executeCrop}
                disabled={isCropping}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 shadow-md transition-all disabled:opacity-50"
              >
                <Crop className="h-4 w-4" />
                {isCropping ? 'Cropping...' : 'Apply Crop & Preview'}
              </button>
            </div>
          </div>

          {/* Cropped Result & Download */}
          {croppedUrl && croppedDimensions && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold uppercase tracking-wider">
                    Cropped Successfully
                  </span>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {croppedDimensions.width} × {croppedDimensions.height} px
                    <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                      ({formatBytes(croppedSize)})
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
                    Download Cropped Image
                  </button>
                </div>
              </div>

              {/* Visual preview of cropped output */}
              <div className="max-h-80 flex items-center justify-center p-3 rounded-lg bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 overflow-hidden">
                <img
                  src={croppedUrl}
                  alt="Cropped Output"
                  className="max-h-72 max-w-full object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
};
