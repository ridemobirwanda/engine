class ImagePreloader {
  private cache = new Map<string, Promise<boolean>>();
  private loadingQueue: string[] = [];
  private maxConcurrent = 3;
  private currentlyLoading = 0;

  async preloadImage(src: string, timeout = 10000): Promise<boolean> {
    // Return cached result if available
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Create preload promise
    const preloadPromise = this.loadImage(src, timeout);
    this.cache.set(src, preloadPromise);

    return preloadPromise;
  }

  private async loadImage(src: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(false);
      };

      // Optimize Supabase URLs
      const optimizedSrc = this.optimizeSupabaseUrl(src);
      img.src = optimizedSrc;
    });
  }

  private optimizeSupabaseUrl(src: string): string {
    if (!src.includes('supabase.co/storage')) return src;
    
    const baseUrl = src.split('?')[0];
    const params = new URLSearchParams();
    
    // Add performance optimizations
    params.set('quality', '75'); // Lower quality for faster loading
    params.set('format', 'webp'); // Better compression
    params.set('resize', 'cover'); // Consistent sizing
    
    return `${baseUrl}?${params.toString()}`;
  }

  async preloadImages(urls: string[], batchSize = 3): Promise<{ loaded: number; failed: number }> {
    let loaded = 0;
    let failed = 0;

    // Process in batches to avoid overwhelming the browser
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(url => this.preloadImage(url))
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          loaded++;
        } else {
          failed++;
        }
      });

      // Small delay between batches to prevent blocking
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return { loaded, failed };
  }

  // Preload critical images immediately
  async preloadCriticalImages(urls: string[]): Promise<void> {
    const criticalUrls = urls.slice(0, 3); // Only first 3 images
    await this.preloadImages(criticalUrls, 1);
  }

  // Preload remaining images in background
  async preloadBackgroundImages(urls: string[]): Promise<void> {
    const backgroundUrls = urls.slice(3);
    if (backgroundUrls.length === 0) return;

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.preloadImages(backgroundUrls, 2);
      }, { timeout: 5000 });
    } else {
      setTimeout(() => {
        this.preloadImages(backgroundUrls, 2);
      }, 2000);
    }
  }

  // Clear cache to free memory
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; urls: string[] } {
    return {
      size: this.cache.size,
      urls: Array.from(this.cache.keys())
    };
  }
}

export const imagePreloader = new ImagePreloader();
