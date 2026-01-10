import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

// Standalone VideoHero component. Place your video at /public/videos/hero.mp4
// and a poster image at /public/images/hero-poster.jpg (optional).

const VideoHero = () => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const poster = '/images/hero-poster.jpg';

  // Handle dynamic viewport height for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(`${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  // Preload video with fetch for faster loading
  useEffect(() => {
    // Use link preload for video
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/videos/hero.mp4';
    link.type = 'video/mp4';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleCanPlay = () => {
    setVideoError(false);
    setVideoLoaded(true);
  };
  const handleError = () => setVideoError(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <header
      className="relative w-full overflow-hidden bg-[#0F0E0D]"
      style={{ height: viewportHeight, minHeight: '500px', maxHeight: '100dvh' }}
    >
      {!videoError ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          src="/videos/hero.mp4"
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleCanPlay}
          onError={handleError}
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label="InStyle Modern Wood Art - Crafted furniture"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent"></div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <div className="absolute -left-16 top-12 w-64 h-64 rounded-full bg-[#C5A059]/20 blur-3xl" />
        <div className="absolute right-10 bottom-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 sm:px-6 md:px-12 h-full flex items-center">
        <div className="max-w-2xl pt-16 md:pt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-5 sm:mb-6 opacity-0 animate-[fade-in_0.8s_ease-out_forwards]">
            Warmth in
            <br />
            Every Detail.
          </h1>

          <p className="text-base sm:text-lg text-gray-300/90 leading-relaxed mb-8 sm:mb-10 font-light max-w-md opacity-0 animate-[fade-in_0.8s_ease-out_0.3s_forwards]">
            Modern carpentry tailored to your exact space. From smart TV units that hide every cable to wall cladding that transforms a room.
          </p>

          <a href="#furniture" className="inline-block opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl bg-[#C5A059] text-white hover:bg-[#B08D45] shadow-lg shadow-[#C5A059]/30 hover:scale-105 active:scale-95">
              Discover the Collection
              <ArrowRight size={16} />
            </button>
          </a>
        </div>
      </div>

      {/* Mute/Unmute button */}
      {!videoError && (
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 transition-colors"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
      </div>
    </header>
  );
};

export default VideoHero;
