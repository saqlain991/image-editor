import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  RotateCcw, 
  Palette, 
  Sliders, 
  FileImage,
  Sun,
  Thermometer,
  Sparkles,
  Copy,
  Save
} from 'lucide-react';
import { ImageFile, ColorPreset, CropArea, ResizeOptions, ExportOptions, ImageFilters } from '@/types';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useBackgroundTasks } from '@/hooks/useBackgroundTasks';
import { toast } from '@/hooks/use-toast';
import { RenameDialog } from './RenameDialog';

interface ImageEditorProps {
  image: ImageFile | null;
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (id: string, filters: ImageFilters) => void;
  onSaveAsCopy: (image: ImageFile, newName: string) => void;
}

const colorPresets: ColorPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    colors: { primary: '#8B7355', secondary: '#D4C5A9', accent: '#6B5B47' },
    filters: { temperature: 5, tint: 2, vibrance: 10, saturation: 105 }
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    colors: { primary: '#1A4B8C', secondary: '#FF8C42', accent: '#2E5984' },
    filters: { temperature: -15, shadows: 20, highlights: -10, contrast: 115, clarity: 15 }
  },
  {
    id: 'warm',
    name: 'Golden Hour',
    colors: { primary: '#FF6B35', secondary: '#FFD23F', accent: '#EE964B' },
    filters: { temperature: 25, tint: 10, highlights: 10, vibrance: 20, vignette: 15 }
  },
  {
    id: 'cool',
    name: 'Arctic',
    colors: { primary: '#4A90E2', secondary: '#B8E6B8', accent: '#7ED321' },
    filters: { temperature: -20, tint: -5, highlights: 15, shadows: -10, clarity: 10 }
  },
  {
    id: 'moody',
    name: 'Moody Dark',
    colors: { primary: '#2C3E50', secondary: '#E74C3C', accent: '#95A5A6' },
    filters: { shadows: 30, highlights: -20, contrast: 125, clarity: 20, vignette: 25 }
  }
];

const defaultFilters: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  hue: 0,
  grayscale: 0,
  vintage: false,
  dramatic: false,
  highlights: 0,
  shadows: 0,
  midtones: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  clarity: 0,
  vignette: 0,
};

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  isOpen,
  onClose,
  onFiltersChange,
  onSaveAsCopy,
}) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ImageFilters>(image?.filters || defaultFilters);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'jpeg',
    quality: 90,
    filename: image?.name.split('.')[0] + '_edited' || 'edited_image'
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const { applyFilters, downloadImage } = useImageProcessor();
  const { scheduleTask } = useBackgroundTasks();

  useEffect(() => {
    if (image) {
      setCurrentFilters(image.filters);
      setExportOptions(prev => ({
        ...prev,
        filename: image.name.split('.')[0] + '_edited'
      }));
    }
  }, [image]);

  useEffect(() => {
    if (!imageRef.current || !image) return;

    const processImage = () => {
      setIsProcessing(true);
      scheduleTask(async () => {
        try {
          const processed = await applyFilters(imageRef.current!, currentFilters);
          setProcessedImageUrl(processed);
        } catch (error) {
          console.error('Error processing image:', error);
        } finally {
          setIsProcessing(false);
        }
      });
    };

    processImage();
  }, [currentFilters, image, applyFilters, scheduleTask]);

  const updateFilter = (key: keyof ImageFilters, value: number | boolean) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    if (image) {
      onFiltersChange(image.id, newFilters);
    }
  };

  const applyColorPreset = (preset: ColorPreset) => {
    const newFilters = { ...currentFilters, ...preset.filters };
    setCurrentFilters(newFilters);
    if (image) {
      onFiltersChange(image.id, newFilters);
    }
    toast({
      title: "Preset applied",
      description: `${preset.name} color preset has been applied.`,
    });
  };

  const resetFilters = () => {
    setCurrentFilters(defaultFilters);
    if (image) {
      onFiltersChange(image.id, defaultFilters);
    }
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values.",
    });
  };

  const handleSaveAsCopy = (newName: string) => {
    if (image) {
      const copyImage: ImageFile = {
        ...image,
        id: Date.now().toString(),
        name: newName,
        filters: currentFilters,
        isEdited: true,
        originalId: image.originalId || image.id,
      };
      onSaveAsCopy(copyImage, newName);
      toast({
        title: "Copy saved",
        description: `${newName} has been saved as a copy.`,
      });
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current || !image) return;

    setIsProcessing(true);
    try {
      const processed = await applyFilters(imageRef.current, currentFilters);
      downloadImage(processed, exportOptions.filename, exportOptions.format);
      toast({
        title: "Download successful",
        description: `${exportOptions.filename}.${exportOptions.format} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!image) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Photo Editor - {image.name}</span>
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRenameDialog(true)}
                  disabled={isProcessing}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Save as Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Image Preview Section */}
            <div className="flex-1 relative bg-muted/30 flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
              {image && (
                <>
                  <img
                    ref={imageRef}
                    src={image.src}
                    alt={image.name}
                    className="hidden"
                    crossOrigin="anonymous"
                  />
                  
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={processedImageUrl || image.src}
                      alt={image.name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="bg-white/90 rounded-full p-3">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <Tabs defaultValue="filters" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="filters" className="text-xs">Filters</TabsTrigger>
                      <TabsTrigger value="tone" className="text-xs">Tone</TabsTrigger>
                      <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
                      <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
                    </TabsList>

                    <TabsContent value="filters" className="space-y-4">
                      <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center space-x-2">
                          <Sliders className="w-4 h-4" />
                          <span>Basic Filters</span>
                        </Label>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
                            { key: 'contrast', label: 'Contrast', min: 0, max: 200 },
                            { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
                            { key: 'blur', label: 'Blur', min: 0, max: 10 },
                            { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
                            { key: 'hue', label: 'Hue', min: 0, max: 360 },
                            { key: 'grayscale', label: 'Grayscale', min: 0, max: 100 },
                          ].map(({ key, label, min, max }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">{label}</Label>
                                <span className="text-xs text-muted-foreground">
                                  {currentFilters[key as keyof ImageFilters] || 0}
                                </span>
                              </div>
                              <Slider
                                value={[currentFilters[key as keyof ImageFilters] as number || 0]}
                                onValueChange={([value]) => updateFilter(key as keyof ImageFilters, value)}
                                min={min}
                                max={max}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tone" className="space-y-4">
                      <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center space-x-2">
                          <Sun className="w-4 h-4" />
                          <span>Tone Adjustments</span>
                        </Label>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'highlights', label: 'Highlights' },
                            { key: 'shadows', label: 'Shadows' },
                            { key: 'midtones', label: 'Midtones' },
                            { key: 'clarity', label: 'Clarity' },
                            { key: 'vibrance', label: 'Vibrance' },
                            { key: 'vignette', label: 'Vignette' },
                          ].map(({ key, label }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">{label}</Label>
                                <span className="text-xs text-muted-foreground">
                                  {currentFilters[key as keyof ImageFilters] || 0}
                                </span>
                              </div>
                              <Slider
                                value={[currentFilters[key as keyof ImageFilters] as number || 0]}
                                onValueChange={([value]) => updateFilter(key as keyof ImageFilters, value)}
                                min={key === 'vignette' ? 0 : -100}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <Label className="text-sm font-medium flex items-center space-x-2">
                            <Thermometer className="w-4 h-4" />
                            <span>Color Temperature</span>
                          </Label>
                          
                          {[
                            { key: 'temperature', label: 'Temperature' },
                            { key: 'tint', label: 'Tint' },
                          ].map(({ key, label }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">{label}</Label>
                                <span className="text-xs text-muted-foreground">
                                  {currentFilters[key as keyof ImageFilters] || 0}
                                </span>
                              </div>
                              <Slider
                                value={[currentFilters[key as keyof ImageFilters] as number || 0]}
                                onValueChange={([value]) => updateFilter(key as keyof ImageFilters, value)}
                                min={-100}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="color" className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center space-x-2">
                          <Palette className="w-4 h-4" />
                          <span>Color Presets</span>
                        </Label>
                        <div className="grid grid-cols-1 gap-2">
                          {colorPresets.map((preset) => (
                            <Button
                              key={preset.id}
                              variant="outline"
                              size="sm"
                              onClick={() => applyColorPreset(preset)}
                              className="h-auto p-3 flex items-center justify-between hover:bg-accent/80 transition-all duration-200"
                            >
                              <span className="text-sm">{preset.name}</span>
                              <div className="flex space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.primary }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.secondary }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: preset.colors.accent }}
                                />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="export" className="space-y-4">
                      <div className="space-y-4">
                        <Label className="text-sm font-medium flex items-center space-x-2">
                          <FileImage className="w-4 h-4" />
                          <span>Export Settings</span>
                        </Label>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Format</Label>
                            <Select 
                              value={exportOptions.format} 
                              onValueChange={(value: 'jpeg' | 'png' | 'webp') => 
                                setExportOptions(prev => ({ ...prev, format: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jpeg">JPEG</SelectItem>
                                <SelectItem value="png">PNG</SelectItem>
                                <SelectItem value="webp">WebP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Quality</Label>
                              <span className="text-xs text-muted-foreground">{exportOptions.quality}%</span>
                            </div>
                            <Slider
                              value={[exportOptions.quality]}
                              onValueChange={([value]) => setExportOptions(prev => ({ ...prev, quality: value }))}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Filename</Label>
                            <Input
                              value={exportOptions.filename}
                              onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
                              placeholder="Enter filename"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={handleDownload} className="flex-1" disabled={isProcessing}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button onClick={resetFilters} variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RenameDialog
        isOpen={showRenameDialog}
        onClose={() => setShowRenameDialog(false)}
        onRename={handleSaveAsCopy}
        currentName={image.name.split('.')[0] + '_copy'}
      />
    </>
  );
};
