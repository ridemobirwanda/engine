import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PerformanceLoaderProps {
  count?: number;
  className?: string;
}

export const PerformanceLoader = memo(({ count = 6, className = '' }: PerformanceLoaderProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
});

PerformanceLoader.displayName = 'PerformanceLoader';



