import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { imageCache } from '@/services/imageCache';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = '/placeholder.svg',
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<'ultra' | 'high' | 'medium' | 'low' | 'original'>('ultra');
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Progressive image loading with multiple quality levels
  useEffect(() => {
    if (!isInView || !src) return;

    const loadImage = (imageSrc: string, level: typeof currentLevel) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        // Try next quality level
        const levels: Array<typeof currentLevel> = ['ultra', 'high', 'medium', 'low', 'original'];
        const currentIndex = levels.indexOf(level);
        const nextLevel = levels[currentIndex + 1];
        
        if (nextLevel && nextLevel !== 'original') {
          const urls = imageCache.generateOptimizedUrls(src);
          setCurrentLevel(nextLevel);
          setCurrentSrc(urls[nextLevel]);
          return;
        } else if (nextLevel === 'original') {
          setCurrentLevel('original');
          setCurrentSrc(src);
          return;
        }
        
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }, 2000); // 2 second timeout per level

      img.onload = () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setHasError(false);
        setCurrentSrc(imageSrc);
        imageCache.setCachedUrl(src, imageSrc);
    onLoad?.();
  };

      img.onerror = () => {
        clearTimeout(timeoutId);
        // Try next quality level
        const levels: Array<typeof currentLevel> = ['ultra', 'high', 'medium', 'low', 'original'];
        const currentIndex = levels.indexOf(level);
        const nextLevel = levels[currentIndex + 1];
        
        if (nextLevel) {
          const urls = imageCache.generateOptimizedUrls(src);
          setCurrentLevel(nextLevel);
          setCurrentSrc(urls[nextLevel]);
          return;
        }
        
        setHasError(true);
        setIsLoading(false);
    onError?.();
  };

      img.src = imageSrc;
      return () => clearTimeout(timeoutId);
    };

    // Start with ultra quality
    const urls = imageCache.generateOptimizedUrls(src);
    setCurrentLevel('ultra');
    setCurrentSrc(urls.ultra);
    loadImage(urls.ultra, 'ultra');
  }, [isInView, src, onLoad, onError]);


  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        className
      )}
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse">
          <div className="absolute inset-0 bg-muted/30" />
        </div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 mx-auto mb-2 bg-muted-foreground/20 rounded" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && !hasError && currentSrc && (
      <img
          src={currentSrc}
        alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            onError?.();
          }}
        />
      )}

      {/* Fallback for when not in view */}
      {!isInView && !priority && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};