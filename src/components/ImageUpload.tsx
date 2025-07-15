
import React, { useCallback, useState } from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageFile } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesAdd: (images: ImageFile[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesAdd }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList) => {
    const imageFiles: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const imageFile: ImageFile = {
          id: crypto.randomUUID(),
          file,
          src: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
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
          processed: false,
        };
        imageFiles.push(imageFile);
      }
    });

    if (imageFiles.length > 0) {
      onImagesAdd(imageFiles);
      toast({
        title: "Images uploaded successfully!",
        description: `${imageFiles.length} image(s) added to your gallery.`,
      });
    } else {
      toast({
        title: "No valid images found",
        description: "Please upload image files only.",
        variant: "destructive",
      });
    }
  }, [onImagesAdd]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragOver
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragOver ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
          }`}>
            {isDragOver ? (
              <Upload className="w-8 h-8" />
            ) : (
              <FileImage className="w-8 h-8" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragOver ? 'Drop your images here!' : 'Upload your photos'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop your images here, or click to browse. Supports JPG, PNG, WEBP, and more.
            </p>
          </div>

          <Button
            variant="outline"
            className="relative overflow-hidden group"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-1" />
            Choose Files
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-primary/5 rounded-xl flex items-center justify-center">
            <div className="text-primary font-medium text-lg">Drop to upload!</div>
          </div>
        )}
      </div>
    </div>
  );
};
