import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Crop, 
  Download, 
  RotateCcw, 
  Palette, 
  Sliders, 
  Expand,
  FileImage,
  Sun,
  Moon,
  Thermometer,
  Contrast,
  Sparkles
} from 'lucide-react';
import { ImageFile, ColorPreset, CropArea, ResizeOptions, ExportOptions, ImageFilters } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AdvancedEditorProps {
  image: ImageFile;
  onFiltersChange: (filters: ImageFilters) => void;
  onCrop: (cropArea: CropArea) => void;
  onResize: (options: ResizeOptions) => void;
  onExport: (options: ExportOptions) => void;
  onReset: () => void;
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

export const AdvancedEditor: React.FC<AdvancedEditorProps> = ({
  image,
  onFiltersChange,
  onCrop,
  onResize,
  onExport,
  onReset
}) => {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: image.dimensions?.width || 800,
    height: image.dimensions?.height || 600,
    maintainAspectRatio: true
  });
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'jpeg',
    quality: 90,
    filename: image.name.split('.')[0] + '_edited'
  });

  const updateFilter = (key: keyof ImageFilters, value: number | boolean) => {
    onFiltersChange({
      ...image.filters,
      [key]: value,
    });
  };

  const applyColorPreset = (preset: ColorPreset) => {
    onFiltersChange({
      ...image.filters,
      ...preset.filters,
    });
    toast({
      title: "Preset applied",
      description: `${preset.name} color preset has been applied.`,
    });
  };

  const handleCrop = () => {
    onCrop(cropArea);
    toast({
      title: "Crop applied",
      description: "Image has been cropped successfully.",
    });
  };

  const handleResize = () => {
    onResize(resizeOptions);
    toast({
      title: "Resize applied",
      description: `Image resized to ${resizeOptions.width}x${resizeOptions.height}px.`,
    });
  };

  const handleExport = () => {
    onExport(exportOptions);
  };

  return (
    <Card className="w-full bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-primary" />
          <span>Advanced Editor</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="tone" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tone">Tone</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="tone" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <span>Tone Adjustments</span>
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Highlights</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.highlights || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.highlights || 0]}
                    onValueChange={([value]) => updateFilter('highlights', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Shadows</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.shadows || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.shadows || 0]}
                    onValueChange={([value]) => updateFilter('shadows', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Midtones</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.midtones || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.midtones || 0]}
                    onValueChange={([value]) => updateFilter('midtones', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Clarity</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.clarity || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.clarity || 0]}
                    onValueChange={([value]) => updateFilter('clarity', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Vibrance</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.vibrance || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.vibrance || 0]}
                    onValueChange={([value]) => updateFilter('vibrance', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Vignette</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.vignette || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.vignette || 0]}
                    onValueChange={([value]) => updateFilter('vignette', value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Thermometer className="w-4 h-4" />
                <span>Color Temperature</span>
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Temperature</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.temperature || 0}K</span>
                  </div>
                  <Slider
                    value={[image.filters.temperature || 0]}
                    onValueChange={([value]) => updateFilter('temperature', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Tint</Label>
                    <span className="text-xs text-muted-foreground">{image.filters.tint || 0}</span>
                  </div>
                  <Slider
                    value={[image.filters.tint || 0]}
                    onValueChange={([value]) => updateFilter('tint', value)}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="color" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Color Presets</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyColorPreset(preset)}
                    className="h-auto p-3 flex flex-col space-y-2 hover:bg-accent/80 transition-all duration-200"
                  >
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
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Crop className="w-4 h-4" />
                <span>Crop Image</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">X Position (%)</Label>
                  <Input
                    type="number"
                    value={cropArea.x}
                    onChange={(e) => setCropArea(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Y Position (%)</Label>
                  <Input
                    type="number"
                    value={cropArea.y}
                    onChange={(e) => setCropArea(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Width (%)</Label>
                  <Input
                    type="number"
                    value={cropArea.width}
                    onChange={(e) => setCropArea(prev => ({ ...prev, width: parseInt(e.target.value) || 100 }))}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Height (%)</Label>
                  <Input
                    type="number"
                    value={cropArea.height}
                    onChange={(e) => setCropArea(prev => ({ ...prev, height: parseInt(e.target.value) || 100 }))}
                    min={1}
                    max={100}
                  />
                </div>
              </div>
              <Button onClick={handleCrop} className="w-full">
                <Crop className="w-4 h-4 mr-2" />
                Apply Crop
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Expand className="w-4 h-4" />
                <span>Resize Image</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Width (px)</Label>
                  <Input
                    type="number"
                    value={resizeOptions.width}
                    onChange={(e) => setResizeOptions(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                    min={1}
                    max={4000}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Height (px)</Label>
                  <Input
                    type="number"
                    value={resizeOptions.height}
                    onChange={(e) => setResizeOptions(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                    min={1}
                    max={4000}
                  />
                </div>
              </div>
              <Button onClick={handleResize} className="w-full">
                <Expand className="w-4 h-4 mr-2" />
                Apply Resize
              </Button>
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
                <Button onClick={handleExport} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Image
                </Button>
                <Button onClick={onReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
