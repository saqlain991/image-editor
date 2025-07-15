
import React from 'react';
import { RotateCcw, Sparkles, Image as ImageIcon, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageFilters, FilterPreset } from '@/types';

interface FilterControlsProps {
  filters: ImageFilters;
  onFiltersChange: (filters: ImageFilters) => void;
  onReset: () => void;
}

const filterPresets: FilterPreset[] = [
  {
    name: 'Original',
    icon: '🖼️',
    filters: {
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
    },
  },
  {
    name: 'Vintage',
    icon: '📸',
    filters: {
      brightness: 90,
      contrast: 110,
      saturation: 80,
      sepia: 30,
      vintage: true,
      temperature: 15,
      vignette: 20,
    },
  },
  {
    name: 'Dramatic',
    icon: '🎭',
    filters: {
      brightness: 95,
      contrast: 130,
      saturation: 120,
      dramatic: true,
      clarity: 25,
      shadows: 20,
    },
  },
  {
    name: 'B&W',
    icon: '⚫',
    filters: {
      grayscale: 100,
      contrast: 110,
      clarity: 15,
    },
  },
  {
    name: 'Warm',
    icon: '🌅',
    filters: {
      brightness: 105,
      saturation: 110,
      hue: 10,
      temperature: 20,
      vibrance: 15,
    },
  },
  {
    name: 'Cool',
    icon: '❄️',
    filters: {
      brightness: 95,
      saturation: 105,
      hue: -10,
      temperature: -15,
      highlights: 10,
    },
  },
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const updateFilter = (key: keyof ImageFilters, value: number | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const applyPreset = (preset: FilterPreset) => {
    onFiltersChange({
      ...filters,
      ...preset.filters,
    });
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <span>Basic Filters</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Quick Presets</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {filterPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="h-auto p-2 flex flex-col space-y-1 hover:bg-accent/80 transition-all duration-200"
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-xs">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Basic Adjustments */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <ImageIcon className="w-4 h-4" />
            <span>Basic Adjustments</span>
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Brightness</Label>
                <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
              </div>
              <Slider
                value={[filters.brightness]}
                onValueChange={([value]) => updateFilter('brightness', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Contrast</Label>
                <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
              </div>
              <Slider
                value={[filters.contrast]}
                onValueChange={([value]) => updateFilter('contrast', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Saturation</Label>
                <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
              </div>
              <Slider
                value={[filters.saturation]}
                onValueChange={([value]) => updateFilter('saturation', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Blur</Label>
                <span className="text-xs text-muted-foreground">{filters.blur}px</span>
              </div>
              <Slider
                value={[filters.blur]}
                onValueChange={([value]) => updateFilter('blur', value)}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Sepia</Label>
                <span className="text-xs text-muted-foreground">{filters.sepia}%</span>
              </div>
              <Slider
                value={[filters.sepia]}
                onValueChange={([value]) => updateFilter('sepia', value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Hue</Label>
                <span className="text-xs text-muted-foreground">{filters.hue}°</span>
              </div>
              <Slider
                value={[filters.hue]}
                onValueChange={([value]) => updateFilter('hue', value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Grayscale</Label>
                <span className="text-xs text-muted-foreground">{filters.grayscale}%</span>
              </div>
              <Slider
                value={[filters.grayscale]}
                onValueChange={([value]) => updateFilter('grayscale', value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Special Effects */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Special Effects</Label>
          
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="vintage" className="text-sm">Vintage Effect</Label>
              <Switch
                id="vintage"
                checked={filters.vintage}
                onCheckedChange={(checked) => updateFilter('vintage', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dramatic" className="text-sm">Dramatic Effect</Label>
              <Switch
                id="dramatic"
                checked={filters.dramatic}
                onCheckedChange={(checked) => updateFilter('dramatic', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
