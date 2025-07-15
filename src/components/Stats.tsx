
import React from 'react';
import { Images, HardDrive, Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsProps {
  totalImages: number;
  totalSize: number;
  processingTime: number;
}

export const Stats: React.FC<StatsProps> = ({ totalImages, totalSize, processingTime }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    {
      icon: Images,
      label: 'Total Images',
      value: totalImages.toString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatFileSize(totalSize),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Avg Processing',
      value: `${processingTime.toFixed(1)}ms`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Zap,
      label: 'Performance',
      value: 'Optimized',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
