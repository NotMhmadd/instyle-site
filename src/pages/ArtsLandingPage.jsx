import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Palette, Image, Sparkles, Clock, Brush, Frame, Eye, Truck, Shield } from 'lucide-react';
import { ART_CATEGORIES, PAINTINGS, PRINTS } from '../data/arts';

const ArtsLandingPage = ({ navigate }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getCategoryIcon = (id) => {
    switch(id) {
      case 'oil-paintings': return Palette;
      case 'prints': return Image;
      case 'decorations': return Sparkles;
      default: return Palette;
    }
  };

  const getCategoryPreviewImages = (id) => {
    switch(id) {
      case 'oil-paintings': return PAINTINGS.slice(0, 4);
      case 'prints': return PRINTS.slice(0, 4);
      default: return [];
    }
  };

  const features = [
    { icon: Brush, text: "Original hand-painted artworks" },
    { icon: Frame, text: "Premium museum-quality framing" },
    { icon: Eye, text: "Curated for aesthetic appeal" }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C]">
      {/* Compact Hero Header - mobile optimized */}
      <div className="bg-[#1C1B1A] text-white pt-24 md:pt-28 pb-8 md:pb-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate && navigate('/')}
            className="flex items-center gap-2 text-sm text-[#666] active:text-[#C5A059] transition-colors mb-4 md:mb-6 py-2 touch-state"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            {/* Left: Title & Description */}
            <div>
              <div className="flex items-center gap-3 mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-10 md:h-10 bg-[#C5A059] rounded-xl flex items-center justify-center shadow-lg">
                  <Palette size={20} className="text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl font-serif">InStyle Arts</h1>
              </div>
              <p className="text-[#888] max-w-md text-sm">
                Original artworks and premium prints to transform your space.
              </p>
            </div>

            {/* Right: Quick Features - horizontal scroll on mobile */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#888] shrink-0 bg-white/5 px-3 py-2 rounded-full md:bg-transparent md:px-0 md:py-0">
                  <f.icon size={14} className="text-[#C5A059]" />
                  <span className="whitespace-nowrap">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid - Main Focus */}
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {ART_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.id);
            const previewImages = getCategoryPreviewImages(category.id);
            const isComingSoon = category.comingSoon;

            return (
              <div
                key={category.id}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E5E5] transition-all duration-300 ${
                  isComingSoon 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'active:scale-[0.98] md:hover:border-[#C5A059] md:hover:shadow-xl md:hover:-translate-y-1 cursor-pointer touch-state'
                }`}
                onClick={() => !isComingSoon && navigate && navigate(category.path)}
              >
                {/* Preview Images Grid */}
                <div className="aspect-[2.2/1] md:aspect-[2/1] relative overflow-hidden bg-[#F5F5F5]">
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-4 h-full">
                      {previewImages.map((item, idx) => (
                        <div key={idx} className="relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              !isComingSoon ? 'md:group-hover:scale-105' : ''
                            }`}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Clock size={32} className="mx-auto text-[#C5A059] mb-2" />
                        <span className="text-xs text-[#999] uppercase tracking-widest">Coming Soon</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay - desktop only */}
                  {!isComingSoon && (
                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                      <div className="bg-white px-5 py-2.5 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
                        <span className="text-sm font-semibold text-[#1C1B1A]">View Collection</span>
                        <ArrowRight size={16} className="text-[#C5A059]" />
                      </div>
                    </div>
                  )}

                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute top-3 right-3 bg-[#1C1B1A] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isComingSoon ? 'bg-[#E5E5E5] text-[#999]' : 'bg-[#C5A059]/10 text-[#C5A059] md:group-hover:bg-[#C5A059] md:group-hover:text-white'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className={`text-lg md:text-xl font-serif transition-colors ${
                          isComingSoon ? 'text-[#666]' : 'text-[#1C1B1A] md:group-hover:text-[#C5A059]'
                        }`}>
                          {category.name}
                        </h2>
                        {/* Mobile arrow indicator */}
                        {!isComingSoon && (
                          <ArrowRight size={18} className="md:hidden text-[#C5A059]" />
                        )}
                      </div>
                      <p className="text-[#666] text-sm leading-relaxed line-clamp-1 md:line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                        <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">
                          {category.tagline}
                        </span>
                        {category.count > 0 && (
                          <span className="text-xs text-[#999]">
                            {category.count} pieces
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple Value Props Strip - horizontal scroll on mobile */}
        <div className="mt-8 md:mt-12 p-4 md:p-6 bg-[#1C1B1A] rounded-2xl overflow-hidden">
          <div className="flex md:flex-wrap md:justify-center items-center gap-x-6 md:gap-x-10 gap-y-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-2 shrink-0">
              <Frame size={16} className="text-[#C5A059]" />
              <span className="text-sm text-white whitespace-nowrap">Premium Framing</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Truck size={16} className="text-[#C5A059]" />
              <span className="text-sm text-white whitespace-nowrap">Delivery Across Lebanon</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Shield size={16} className="text-[#C5A059]" />
              <span className="text-sm text-white whitespace-nowrap">Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArtsLandingPage;
