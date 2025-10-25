import { DynamicProductPage } from "@/components/DynamicProductPage";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);

  // Mobile detection and video optimization
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      // Always load video, but with different settings for mobile
      setShouldLoadVideo(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video loading and mobile optimization
  useEffect(() => {
    if (!shouldLoadVideo) return;
    
    // Preload video for better performance
    const preloadVideo = () => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = '/videos/engine-background.mp4';
      video.load();
    };
    
    // Start preloading immediately
    preloadVideo();

    // Mobile-specific video handling
    if (isMobile) {
      const handleVideoLoad = () => {
        const video = document.querySelector('.hero-video') as HTMLVideoElement;
        if (video) {
          // Ensure video is muted and plays inline on mobile
          video.muted = true;
          video.playsInline = true;
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('x5-playsinline', 'true');
          
          // Try to play the video
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Video autoplay failed on mobile:', error);
              // Video will fall back to poster image
            });
          }
        }
      };

      // Wait for video to be ready
      setTimeout(handleVideoLoad, 100);
    }
  }, [shouldLoadVideo, isMobile]);

  return (
    <div className="relative">

      {/* Ultra-Fast Hero Section */}
      <div className="hero-section">
        {shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
            preload={isMobile ? "metadata" : "metadata"}
            poster="/videos/engine-background-poster.jpg"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            style={{ 
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            // Additional mobile-specific attributes
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="false"
          >
            <source src="/videos/engine-background.mp4" type="video/mp4" />
            {/* Fallback for unsupported formats */}
            <source src="/videos/engine-background.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Fallback background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 transition-opacity duration-1000 ${
            (videoLoaded && !videoError) ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div>
            <h1 className="hero-title">EngineCore</h1>
            <p className="hero-subtitle">
              Your premier destination for high-quality automotive engines and parts
            </p>
            <div className="hero-buttons">
              <a href="/products" className="btn-primary">
                Browse Products
              </a>
              <a href="/about" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Products Section */}
      <div className="bg-background">
        <DynamicProductPage
          categorySlug="all-products"
          title="All Products"
          description="Complete selection of all automotive engines, parts, and accessories"
        />
      </div>

    </div>
  );
}
