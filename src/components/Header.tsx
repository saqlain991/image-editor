
import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Camera className="h-8 w-8 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Smart Gallery
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered Photo Editor</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Background Processing</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
