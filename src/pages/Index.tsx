
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Stats } from '@/components/Stats';
import { ImageFile, ImageFilters } from '@/types';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { saveImagesToStorage, loadImagesFromStorage } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = loadImagesFromStorage();
    setImages(savedImages);
  }, []);

  // Save images to localStorage whenever images change
  useEffect(() => {
    saveImagesToStorage(images);
  }, [images]);

  const handleImagesAdd = useCallback((newImages: ImageFile[]) => {
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleFiltersChange = useCallback((id: string, filters: ImageFilters) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, filters, isEdited: true } : img
    ));
  }, []);

  const handleImageDelete = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Image deleted",
      description: "The image has been removed from your gallery.",
    });
  }, []);

  const handleSaveAsCopy = useCallback((newImage: ImageFile, newName: string) => {
    setImages(prev => [...prev, { ...newImage, name: newName }]);
  }, []);

  const stats = useMemo(() => {
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const processingTime = Math.random() * 50 + 10; // Simulated processing time

    return {
      totalImages: images.length,
      totalSize,
      processingTime,
    };
  }, [images]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transform Your Photos
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the power of AI-driven photo editing with real-time filters, 
                background processing, and intelligent optimization.
              </p>
            </div>

            {/* Stats */}
            {images.length > 0 && (
              <Stats
                totalImages={stats.totalImages}
                totalSize={stats.totalSize}
                processingTime={stats.processingTime}
              />
            )}

            {/* Upload Section */}
            {images.length === 0 && (
              <div className="max-w-2xl mx-auto">
                <ImageUpload onImagesAdd={handleImagesAdd} />
              </div>
            )}

            {/* Gallery */}
            {images.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Your Gallery</h3>
                    <p className="text-muted-foreground">
                      {images.length} image{images.length !== 1 ? 's' : ''} ready for editing
                    </p>
                  </div>
                  
                  <div className="w-full sm:w-auto">
                    <ImageUpload onImagesAdd={handleImagesAdd} />
                  </div>
                </div>

                <GalleryGrid
                  images={images}
                  onFiltersChange={handleFiltersChange}
                  onImageDelete={handleImageDelete}
                  onSaveAsCopy={handleSaveAsCopy}
                />
              </div>
            )}

            {/* Footer */}
            <footer className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                Powered by Canvas API, Intersection Observer, and Background Tasks API
              </p>
              <p className="text-xs mt-2">
                Images are stored in your browser's local storage and will persist until you clear your browser data.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
