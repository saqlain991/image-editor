
import React from 'react';
import { ImageFile, ImageFilters } from '@/types';
import { ImageCard } from './ImageCard';

interface GalleryGridProps {
  images: ImageFile[];
  onFiltersChange: (id: string, filters: ImageFilters) => void;
  onImageDelete: (id: string) => void;
  onSaveAsCopy: (image: ImageFile, newName: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  onFiltersChange,
  onImageDelete,
  onSaveAsCopy,
}) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-accent rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No images in your gallery
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload some photos to get started with our AI-powered editing tools and filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onFiltersChange={onFiltersChange}
          onDelete={onImageDelete}
          onSaveAsCopy={onSaveAsCopy}
        />
      ))}
    </div>
  );
};
