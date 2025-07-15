
import { ImageFile } from '@/types';

const STORAGE_KEY = 'photo-editor-images';

export const saveImagesToStorage = (images: ImageFile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    console.error('Error saving images to localStorage:', error);
  }
};

export const loadImagesFromStorage = (): ImageFile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading images from localStorage:', error);
    return [];
  }
};

export const clearImagesFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing images from localStorage:', error);
  }
};
