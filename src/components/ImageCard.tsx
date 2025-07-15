
import React, { useState, useRef, useEffect } from 'react';
import { Download, Trash2, Eye, EyeOff, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageFile, ImageFilters } from '@/types';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useBackgroundTasks } from '@/hooks/useBackgroundTasks';
import { ImageEditor } from './ImageEditor';
import { ConfirmationDialog } from './ConfirmationDialog';
import { toast } from '@/hooks/use-toast';

interface ImageCardProps {
  image: ImageFile;
  onFiltersChange: (id: string, filters: ImageFilters) => void;
  onDelete: (id: string) => void;
  onSaveAsCopy: (image: ImageFile, newName: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onFiltersChange,
  onDelete,
  onSaveAsCopy,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { elementRef, isIntersecting } = useIntersectionObserver();
  const { applyFilters, downloadImage } = useImageProcessor();
  const { scheduleTask } = useBackgroundTasks();

  // Process image in background when filters change
  useEffect(() => {
    if (!imageRef.current || !isIntersecting) return;

    const processImage = () => {
      setIsProcessing(true);
      scheduleTask(async () => {
        try {
          const processed = await applyFilters(imageRef.current!, image.filters);
          setProcessedImageUrl(processed);
        } catch (error) {
          console.error('Error processing image:', error);
          toast({
            title: "Processing failed",
            description: "Failed to apply filters to the image.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      });
    };

    processImage();
  }, [image.filters, isIntersecting, applyFilters, scheduleTask]);

  const handleDownload = () => {
    if (processedImageUrl) {
      const fileName = `${image.name.split('.')[0]}_edited`;
      downloadImage(processedImageUrl, fileName, 'jpg');
      toast({
        title: "Download started",
        description: `${fileName}.jpg is being downloaded.`,
      });
    }
  };

  const handleDelete = () => {
    onDelete(image.id);
    setShowDeleteDialog(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageFormat = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase();
    return ext || 'UNKNOWN';
  };

  return (
    <>
      <div ref={elementRef} className="w-full">
        <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl ${
          isIntersecting ? 'animate-fade-in' : 'opacity-0'
        }`}>
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              {isIntersecting && (
                <>
                  {/* Original Image (hidden) */}
                  <img
                    ref={imageRef}
                    src={image.src}
                    alt={image.name}
                    className="hidden"
                    crossOrigin="anonymous"
                  />
                  
                  {/* Display Image */}
                  <img
                    src={processedImageUrl || image.src}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </>
              )}

              {/* Loading Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                </div>
              )}

              {/* Image Type Badge */}
              <div className="absolute top-2 left-2">
                <Badge 
                  variant={image.isEdited ? "default" : "secondary"}
                  className="text-xs"
                >
                  {image.isEdited ? "Edited" : "Original"}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => setShowEditor(true)}
                  title="Edit Image"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={handleDownload}
                  disabled={!processedImageUrl || isProcessing}
                  title="Quick Download"
                >
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => setShowDeleteDialog(true)}
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image Footer Info */}
            <div className="p-4 bg-card space-y-2">
              <h3 className="font-medium text-sm truncate">{image.name}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <span>{formatFileSize(image.size)}</span>
                  <span>•</span>
                  <span>{getImageFormat(image.name)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Editor Dialog */}
      <ImageEditor
        image={image}
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onFiltersChange={onFiltersChange}
        onSaveAsCopy={onSaveAsCopy}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Image"
        description={`Are you sure you want to delete "${image.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
