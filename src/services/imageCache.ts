class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50; // Maximum number of cached images
  private cacheOrder: string[] = []; // LRU order

  // Get cached image or return original
  getCachedUrl(originalUrl: string): string {
    if (this.cache.has(originalUrl)) {
      // Move to end (most recently used)
      const index = this.cacheOrder.indexOf(originalUrl);
      if (index > -1) {
        this.cacheOrder.splice(index, 1);
      }
      this.cacheOrder.push(originalUrl);
      return this.cache.get(originalUrl)!;
    }
    return originalUrl;
  }

  // Cache an optimized URL
  setCachedUrl(originalUrl: string, optimizedUrl: string): void {
    // Remove oldest if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cacheOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(originalUrl, optimizedUrl);
    this.cacheOrder.push(originalUrl);
  }

  // Generate multiple optimization levels for fallback
  generateOptimizedUrls(originalUrl: string): {
    ultra: string;
    high: string;
    medium: string;
    low: string;
    original: string;
  } {
    if (!originalUrl.includes('supabase.co/storage')) {
      return {
        ultra: originalUrl,
        high: originalUrl,
        medium: originalUrl,
        low: originalUrl,
        original: originalUrl
      };
    }

    const baseUrl = originalUrl.split('?')[0];
    
    const ultraParams = new URLSearchParams({
      width: '200',
      height: '150',
      quality: '40',
      format: 'webp',
      resize: 'cover'
    });

    const highParams = new URLSearchParams({
      width: '300',
      height: '200',
      quality: '50',
      format: 'webp',
      resize: 'cover'
    });

    const mediumParams = new URLSearchParams({
      width: '400',
      height: '300',
      quality: '60',
      format: 'webp',
      resize: 'cover'
    });

    const lowParams = new URLSearchParams({
      width: '600',
      height: '400',
      quality: '70',
      format: 'webp',
      resize: 'cover'
    });

    return {
      ultra: `${baseUrl}?${ultraParams.toString()}`,
      high: `${baseUrl}?${highParams.toString()}`,
      medium: `${baseUrl}?${mediumParams.toString()}`,
      low: `${baseUrl}?${lowParams.toString()}`,
      original: originalUrl
    };
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
    this.cacheOrder = [];
  }

  // Get cache stats
  getStats(): { size: number; urls: string[] } {
    return {
      size: this.cache.size,
      urls: Array.from(this.cache.keys())
    };
  }
}

export const imageCache = new ImageCache();
