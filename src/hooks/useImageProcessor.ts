
import { useCallback, useRef } from 'react';
import { ImageFilters, CropArea, ResizeOptions, ExportOptions } from '@/types';

export const useImageProcessor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const applyFilters = useCallback((
    imageElement: HTMLImageElement,
    filters: ImageFilters
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;

      // Apply CSS filters to context
      const filterString = [
        `brightness(${filters.brightness}%)`,
        `contrast(${filters.contrast}%)`,
        `saturate(${filters.saturation}%)`,
        `blur(${filters.blur}px)`,
        `sepia(${filters.sepia}%)`,
        `hue-rotate(${filters.hue}deg)`,
        `grayscale(${filters.grayscale}%)`
      ].join(' ');

      ctx.filter = filterString;
      ctx.drawImage(imageElement, 0, 0);

      // Apply advanced filters
      if (filters.vintage) {
        applyVintageEffect(ctx, canvas.width, canvas.height);
      }

      if (filters.dramatic) {
        applyDramaticEffect(ctx, canvas.width, canvas.height);
      }

      // Apply tone adjustments
      if (filters.highlights || filters.shadows || filters.midtones) {
        applyToneAdjustments(ctx, canvas.width, canvas.height, filters);
      }

      // Apply color temperature
      if (filters.temperature || filters.tint) {
        applyTemperatureAdjustment(ctx, canvas.width, canvas.height, filters);
      }

      // Apply vibrance
      if (filters.vibrance) {
        applyVibranceAdjustment(ctx, canvas.width, canvas.height, filters.vibrance);
      }

      // Apply clarity
      if (filters.clarity) {
        applyClarityAdjustment(ctx, canvas.width, canvas.height, filters.clarity);
      }

      // Apply vignette
      if (filters.vignette) {
        applyVignetteEffect(ctx, canvas.width, canvas.height, filters.vignette);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
  }, []);

  const cropImage = useCallback((
    imageElement: HTMLImageElement,
    cropArea: CropArea
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const sourceWidth = imageElement.naturalWidth;
      const sourceHeight = imageElement.naturalHeight;

      const cropX = (cropArea.x / 100) * sourceWidth;
      const cropY = (cropArea.y / 100) * sourceHeight;
      const cropWidth = (cropArea.width / 100) * sourceWidth;
      const cropHeight = (cropArea.height / 100) * sourceHeight;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        imageElement,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
  }, []);

  const resizeImage = useCallback((
    imageElement: HTMLImageElement,
    options: ResizeOptions
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      let { width, height } = options;

      if (options.maintainAspectRatio) {
        const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
        if (width / height > aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(imageElement, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
  }, []);

  const exportImage = useCallback((
    imageElement: HTMLImageElement,
    filters: ImageFilters,
    options: ExportOptions
  ): Promise<string> => {
    return new Promise(async (resolve) => {
      // First apply all filters
      const filteredImage = await applyFilters(imageElement, filters);
      
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let mimeType = 'image/jpeg';
        if (options.format === 'png') mimeType = 'image/png';
        if (options.format === 'webp') mimeType = 'image/webp';

        const quality = options.quality / 100;
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.src = filteredImage;
    });
  }, [applyFilters]);

  const downloadImage = useCallback((dataUrl: string, filename: string, format: string) => {
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Advanced filter functions
  const applyVintageEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.1);
      data[i + 1] = Math.min(255, data[i + 1] * 0.9);
      data[i + 2] = Math.min(255, data[i + 2] * 0.7);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyDramaticEffect = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const factor = brightness > 128 ? 1.3 : 0.7;
      
      data[i] *= factor;
      data[i + 1] *= factor;
      data[i + 2] *= factor;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyToneAdjustments = (ctx: CanvasRenderingContext2D, width: number, height: number, filters: ImageFilters) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // Apply highlights adjustment
      if (brightness > 170 && filters.highlights) {
        const factor = 1 + (filters.highlights / 100);
        data[i] *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
      }
      
      // Apply shadows adjustment
      if (brightness < 85 && filters.shadows) {
        const factor = 1 + (filters.shadows / 100);
        data[i] *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
      }
      
      // Apply midtones adjustment
      if (brightness >= 85 && brightness <= 170 && filters.midtones) {
        const factor = 1 + (filters.midtones / 100);
        data[i] *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyTemperatureAdjustment = (ctx: CanvasRenderingContext2D, width: number, height: number, filters: ImageFilters) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const tempFactor = (filters.temperature || 0) / 100;
    const tintFactor = (filters.tint || 0) / 100;

    for (let i = 0; i < data.length; i += 4) {
      // Temperature adjustment (warm/cool)
      data[i] = Math.min(255, Math.max(0, data[i] + (tempFactor * 30))); // Red
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - (tempFactor * 30))); // Blue
      
      // Tint adjustment (green/magenta)
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (tintFactor * 20))); // Green
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyVibranceAdjustment = (ctx: CanvasRenderingContext2D, width: number, height: number, vibrance: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = vibrance / 100;

    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const amt = ((Math.abs(max - avg) * 2 / 255) * factor);
      
      if (data[i] !== max) data[i] += (max - data[i]) * amt;
      if (data[i + 1] !== max) data[i + 1] += (max - data[i + 1]) * amt;
      if (data[i + 2] !== max) data[i + 2] += (max - data[i + 2]) * amt;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyClarityAdjustment = (ctx: CanvasRenderingContext2D, width: number, height: number, clarity: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = clarity / 100;

    // Simple unsharp mask effect for clarity
    for (let i = 0; i < data.length; i += 4) {
      const original = [data[i], data[i + 1], data[i + 2]];
      
      // Apply sharpening
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.min(255, Math.max(0, original[c] + (original[c] - original[c] * 0.5) * factor));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyVignetteEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, vignette: number) => {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    const strength = vignette / 100;
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${strength * 0.6})`);
    
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  };

  return { 
    applyFilters, 
    cropImage, 
    resizeImage, 
    exportImage, 
    downloadImage 
  };
};
