
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden border-0 bg-background/50 backdrop-blur-md hover:bg-background/80 transition-all duration-300"
    >
      <Sun className={`h-4 w-4 transition-all duration-500 ${
        theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      }`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-500 ${
        theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
