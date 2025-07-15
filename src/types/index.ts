
export interface ImageFile {
  id: string;
  file: File;
  src: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  filters: ImageFilters;
  processed: boolean;
  dimensions?: { width: number; height: number };
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  hue: number;
  grayscale: number;
  vintage: boolean;
  dramatic: boolean;
  // New tone adjustments
  highlights: number;
  shadows: number;
  midtones: number;
  temperature: number;
  tint: number;
  vibrance: number;
  clarity: number;
  vignette: number;
}

export interface FilterPreset {
  name: string;
  icon: string;
  filters: Partial<ImageFilters>;
}

export interface ColorPreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  filters: Partial<ImageFilters>;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export interface ExportOptions {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  filename: string;
}
