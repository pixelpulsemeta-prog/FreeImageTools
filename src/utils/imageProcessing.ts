/**
 * Image processing utilities for client-side local browser manipulation.
 * Zero server uploads: 100% Canvas & Blob processing.
 */

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function loadImage(source: File | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    
    img.onload = () => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(url);
      }
      resolve(img);
    };
    
    img.onerror = (err) => {
      if (typeof source !== 'string') {
        URL.revokeObjectURL(url);
      }
      reject(new Error('Failed to load image. The file may be corrupt or an unsupported format.'));
    };
    
    img.src = url;
  });
}

export async function getImageInfo(file: File): Promise<{
  img: HTMLImageElement;
  width: number;
  height: number;
}> {
  const img = await loadImage(file);
  return {
    img,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export to blob failed.'));
        }
      },
      type,
      quality
    );
  });
}

export interface CompressOptions {
  mode: 'quality' | 'targetSize';
  quality: number; // 0.05 to 1.0
  targetSizeKb?: number;
  outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressResult {
  blob: Blob;
  size: number;
  width: number;
  height: number;
  reductionPercentage: number;
  reachedTarget?: boolean;
  actualTargetSizeKb?: number;
  processingTimeMs: number;
}

/**
 * Compresses an image client-side.
 * When targetSizeKb is requested, performs iterative binary search
 * over quality and dimension scaling if necessary.
 */
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const startTime = performance.now();
  const originalSize = file.size;
  const { img, width: originalWidth, height: originalHeight } = await getImageInfo(file);

  // Determine output MIME
  let mimeType = options.outputFormat;
  if (!mimeType) {
    if (file.type === 'image/png') {
      mimeType = 'image/png';
    } else if (file.type === 'image/webp') {
      mimeType = 'image/webp';
    } else {
      mimeType = 'image/jpeg';
    }
  }

  // Setup canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain 2D canvas context');

  let finalBlob: Blob;
  let finalWidth = originalWidth;
  let finalHeight = originalHeight;
  let reachedTarget: boolean | undefined = undefined;

  if (options.mode === 'quality' || !options.targetSizeKb) {
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, originalWidth, originalHeight);
    }
    ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

    finalBlob = await canvasToBlob(canvas, mimeType, options.quality);
  } else {
    // Target Size Mode: intelligent search
    const targetBytes = options.targetSizeKb * 1024;
    const isExplicitPng = options.outputFormat === 'image/png';
    // If output is explicitly PNG, preserve PNG format and downscale dimensions if needed.
    // If auto or JPEG/WebP, use lossy encoding which achieves dramatic size reductions.
    const compressionMime = isExplicitPng ? 'image/png' : (mimeType === 'image/png' ? 'image/webp' : mimeType);

    let bestBlob: Blob | null = null;

    if (isExplicitPng) {
      // PNG Lossless compression: binary scale dimensions down until size <= targetBytes
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
      const initialBlob = await canvasToBlob(canvas, 'image/png');

      if (initialBlob.size <= targetBytes) {
        bestBlob = initialBlob;
      } else {
        let currentScale = 0.85;
        for (let j = 0; j < 8; j++) {
          const scaledW = Math.max(50, Math.round(originalWidth * currentScale));
          const scaledH = Math.max(50, Math.round(originalHeight * currentScale));
          canvas.width = scaledW;
          canvas.height = scaledH;
          ctx.drawImage(img, 0, 0, scaledW, scaledH);
          const scaledBlob = await canvasToBlob(canvas, 'image/png');
          if (scaledBlob.size <= targetBytes) {
            bestBlob = scaledBlob;
            finalWidth = scaledW;
            finalHeight = scaledH;
            break;
          }
          currentScale *= 0.8;
        }
      }
    } else {
      // JPEG / WebP compression: binary search across quality 0.05 to 0.98
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (compressionMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, originalWidth, originalHeight);
      }
      ctx.drawImage(img, 0, 0, originalWidth, originalHeight);

      // Check max quality first
      const maxBlob = await canvasToBlob(canvas, compressionMime, 0.95);
      if (maxBlob.size <= targetBytes) {
        bestBlob = maxBlob;
      } else {
        // Binary search for highest quality under targetBytes
        let lowQuality = 0.05;
        let highQuality = 0.95;

        for (let i = 0; i < 8; i++) {
          const midQuality = (lowQuality + highQuality) / 2;
          const currentBlob = await canvasToBlob(canvas, compressionMime, midQuality);

          if (currentBlob.size <= targetBytes) {
            bestBlob = currentBlob;
            // Fits! Try higher quality
            lowQuality = midQuality;
          } else {
            // Exceeds target, decrease quality
            highQuality = midQuality;
          }
        }

        // If lowest quality (0.05) still exceeds targetBytes, downscale dimensions
        if (!bestBlob || bestBlob.size > targetBytes) {
          let currentScale = 0.85;
          for (let j = 0; j < 6; j++) {
            const scaledW = Math.max(50, Math.round(originalWidth * currentScale));
            const scaledH = Math.max(50, Math.round(originalHeight * currentScale));
            canvas.width = scaledW;
            canvas.height = scaledH;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            if (compressionMime === 'image/jpeg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, scaledW, scaledH);
            }
            ctx.drawImage(img, 0, 0, scaledW, scaledH);

            const scaleBlob = await canvasToBlob(canvas, compressionMime, 0.65);
            if (scaleBlob.size <= targetBytes) {
              bestBlob = scaleBlob;
              finalWidth = scaledW;
              finalHeight = scaledH;
              break;
            }
            currentScale *= 0.75;
          }
        }
      }
    }

    if (!bestBlob) {
      // If lowest compression still couldn't reach, get the smallest possible
      bestBlob = await canvasToBlob(canvas, compressionMime, 0.1);
    }

    reachedTarget = bestBlob.size <= targetBytes;
    finalBlob = bestBlob;
  }

  const reductionPercentage = Math.round(((originalSize - finalBlob.size) / originalSize) * 100);
  const endTime = performance.now();

  return {
    blob: finalBlob,
    size: finalBlob.size,
    width: finalWidth,
    height: finalHeight,
    reductionPercentage,
    reachedTarget,
    actualTargetSizeKb: options.targetSizeKb,
    processingTimeMs: Math.round(endTime - startTime),
  };
}

export interface ResizeOptions {
  width: number;
  height: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const { img } = await getImageInfo(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(options.width));
  canvas.height = Math.max(1, Math.round(options.height));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (options.outputFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const quality = options.quality ?? 0.92;
  const blob = await canvasToBlob(canvas, options.outputFormat, quality);

  return {
    blob,
    size: blob.size,
    width: canvas.width,
    height: canvas.height,
  };
}

export async function convertJpgToPng(file: File): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const { img, width, height } = await getImageInfo(file);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, 'image/png');

  return {
    blob,
    size: blob.size,
    width,
    height,
  };
}

export async function convertPngToJpg(
  file: File,
  backgroundColor: string = '#FFFFFF',
  quality: number = 0.92
): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const { img, width, height } = await getImageInfo(file);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  // Fill transparent areas with user-selected background color
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);

  return {
    blob,
    size: blob.size,
    width,
    height,
  };
}

export async function convertWebpToJpg(
  file: File,
  backgroundColor: string = '#FFFFFF',
  quality: number = 0.92
): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const { img, width, height } = await getImageInfo(file);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);

  return {
    blob,
    size: blob.size,
    width,
    height,
  };
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an in-memory canvas with the applied rotation (in 90° steps)
 * and horizontal/vertical flip transformations.
 */
export async function renderTransformedImage(
  file: File,
  rotationAngle: number = 0,
  flipH: boolean = false,
  flipV: boolean = false
): Promise<{
  canvas: HTMLCanvasElement;
  dataUrl: string;
  width: number;
  height: number;
}> {
  const { img } = await getImageInfo(file);

  const normalizedAngle = ((rotationAngle % 360) + 360) % 360;
  const isRotated90or270 = normalizedAngle === 90 || normalizedAngle === 270;
  const transformedWidth = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
  const transformedHeight = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = transformedWidth;
  canvas.height = transformedHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  ctx.translate(transformedWidth / 2, transformedHeight / 2);
  ctx.rotate((normalizedAngle * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');

  return {
    canvas,
    dataUrl,
    width: transformedWidth,
    height: transformedHeight,
  };
}

/**
 * Crops a specific pixel rectangle from a transformed canvas.
 */
export async function cropCanvas(
  sourceCanvas: HTMLCanvasElement,
  cropArea: CropArea,
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  quality: number = 0.95
): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const cropW = Math.max(1, Math.min(sourceCanvas.width, Math.round(cropArea.width)));
  const cropH = Math.max(1, Math.min(sourceCanvas.height, Math.round(cropArea.height)));
  const cropX = Math.max(0, Math.min(sourceCanvas.width - cropW, Math.round(cropArea.x)));
  const cropY = Math.max(0, Math.min(sourceCanvas.height - cropH, Math.round(cropArea.y)));

  const destCanvas = document.createElement('canvas');
  destCanvas.width = cropW;
  destCanvas.height = cropH;
  const destCtx = destCanvas.getContext('2d');
  if (!destCtx) throw new Error('Could not obtain canvas context');

  destCtx.imageSmoothingEnabled = true;
  destCtx.imageSmoothingQuality = 'high';

  if (outputFormat === 'image/jpeg') {
    destCtx.fillStyle = '#FFFFFF';
    destCtx.fillRect(0, 0, cropW, cropH);
  }

  destCtx.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  const blob = await canvasToBlob(destCanvas, outputFormat, quality);

  return {
    blob,
    size: blob.size,
    width: cropW,
    height: cropH,
  };
}

export async function cropImage(
  file: File,
  cropArea: CropArea,
  rotationAngle: number = 0,
  flipH: boolean = false,
  flipV: boolean = false,
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  quality: number = 0.95
): Promise<{
  blob: Blob;
  size: number;
  width: number;
  height: number;
}> {
  const transformed = await renderTransformedImage(file, rotationAngle, flipH, flipV);
  return cropCanvas(transformed.canvas, cropArea, outputFormat, quality);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
