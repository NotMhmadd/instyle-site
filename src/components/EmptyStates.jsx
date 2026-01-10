import React from 'react';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';

// Empty state illustrations with custom SVG graphics
export const EmptyCart = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    {/* Illustration */}
    <div className="relative w-40 h-40 mb-6">
      {/* Shopping bag SVG */}
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="#F9F8F6" />
        
        {/* Bag body */}
        <path 
          d="M30 45H90L85 100H35L30 45Z" 
          fill="white" 
          stroke="#E5E5E5" 
          strokeWidth="2"
        />
        
        {/* Bag handles */}
        <path 
          d="M45 45V35C45 26.7157 51.7157 20 60 20C68.2843 20 75 26.7157 75 35V45" 
          stroke="#C5A059" 
          strokeWidth="3" 
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Decorative dots */}
        <circle cx="60" cy="65" r="3" fill="#C5A059" />
        <circle cx="60" cy="75" r="2" fill="#E5E5E5" />
        <circle cx="60" cy="83" r="1.5" fill="#E5E5E5" />
      </svg>
      
      {/* Floating elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C5A059]/10 rounded-full animate-pulse" />
      <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-[#C5A059]/10 rounded-full animate-pulse delay-300" />
    </div>

    <h3 className="text-xl font-serif text-[#1C1B1A] mb-2">Your project bag is empty</h3>
    <p className="text-[#666] text-sm mb-6 max-w-xs">
      Start building your dream space by adding beautiful pieces to your project.
    </p>
    
    {onBrowse && (
      <button
        onClick={onBrowse}
        className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
      >
        Browse Collection
      </button>
    )}
  </div>
);

export const EmptyFavorites = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    {/* Illustration */}
    <div className="relative w-40 h-40 mb-6">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="#FFF5F5" />
        
        {/* Heart outline */}
        <path 
          d="M60 95L52.5 88.1C35 72.5 25 63.5 25 52.5C25 43.5 32.5 36 42.5 36C48 36 53.5 38.5 60 44C66.5 38.5 72 36 77.5 36C87.5 36 95 43.5 95 52.5C95 63.5 85 72.5 67.5 88.1L60 95Z" 
          fill="white" 
          stroke="#FFD5D5" 
          strokeWidth="2"
        />
        
        {/* Inner heart */}
        <path 
          d="M60 80L55 75.5C44 65.5 38 60 38 53C38 47.5 42.5 43 48 43C51 43 54 44.5 60 49C66 44.5 69 43 72 43C77.5 43 82 47.5 82 53C82 60 76 65.5 65 75.5L60 80Z" 
          fill="#FFE5E5" 
          stroke="#FFCCCC" 
          strokeWidth="1"
        />
        
        {/* Decorative hearts */}
        <path d="M20 35L18 33C16 31 16 28 18 26C20 24 23 24 25 26L27 28L29 26C31 24 34 24 36 26C38 28 38 31 36 33L27 42L20 35Z" fill="#C5A059" opacity="0.3" transform="scale(0.5) translate(15, 20)" />
        <path d="M20 35L18 33C16 31 16 28 18 26C20 24 23 24 25 26L27 28L29 26C31 24 34 24 36 26C38 28 38 31 36 33L27 42L20 35Z" fill="#C5A059" opacity="0.2" transform="scale(0.4) translate(200, 30)" />
      </svg>
      
      {/* Floating elements */}
      <div className="absolute -top-1 right-2 w-6 h-6 bg-red-100 rounded-full animate-pulse" />
      <div className="absolute bottom-4 -left-2 w-4 h-4 bg-red-50 rounded-full animate-pulse delay-500" />
    </div>

    <h3 className="text-xl font-serif text-[#1C1B1A] mb-2">No favorites yet</h3>
    <p className="text-[#666] text-sm mb-6 max-w-xs">
      Save pieces you love by tapping the heart icon. They'll appear here for easy access.
    </p>
    
    {onBrowse && (
      <button
        onClick={onBrowse}
        className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
      >
        Discover Pieces
      </button>
    )}
  </div>
);

export const EmptySearch = ({ query, onClear }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    {/* Illustration */}
    <div className="relative w-40 h-40 mb-6">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="#F9F8F6" />
        
        {/* Magnifying glass */}
        <circle 
          cx="52" 
          cy="52" 
          r="22" 
          fill="white" 
          stroke="#E5E5E5" 
          strokeWidth="3"
        />
        <line 
          x1="68" 
          y1="68" 
          x2="88" 
          y2="88" 
          stroke="#C5A059" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        
        {/* Question mark */}
        <path 
          d="M47 45C47 42 49.5 40 52 40C54.5 40 57 42 57 45C57 48 54 49 52 51V54" 
          stroke="#E5E5E5" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="52" cy="59" r="1.5" fill="#E5E5E5" />
      </svg>
    </div>

    <h3 className="text-xl font-serif text-[#1C1B1A] mb-2">No results found</h3>
    <p className="text-[#666] text-sm mb-6 max-w-xs">
      {query ? `We couldn't find anything matching "${query}". Try a different search term.` : 'Try searching for something else.'}
    </p>
    
    {onClear && (
      <button
        onClick={onClear}
        className="px-6 py-3 border border-[#E5E5E5] text-[#1C1B1A] font-bold uppercase text-xs tracking-widest rounded-lg hover:border-[#C5A059] transition-colors"
      >
        Clear Search
      </button>
    )}
  </div>
);

export const NoProducts = ({ category, onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    {/* Illustration */}
    <div className="relative w-40 h-40 mb-6">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="#F9F8F6" />
        
        {/* Box */}
        <rect x="30" y="45" width="60" height="45" rx="3" fill="white" stroke="#E5E5E5" strokeWidth="2" />
        <path d="M30 55H90" stroke="#E5E5E5" strokeWidth="2" />
        
        {/* Box flaps */}
        <path d="M35 45L45 30H75L85 45" stroke="#C5A059" strokeWidth="2" fill="none" />
        
        {/* Decorative circles */}
        <circle cx="60" cy="72" r="8" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      </svg>
    </div>

    <h3 className="text-xl font-serif text-[#1C1B1A] mb-2">Coming Soon</h3>
    <p className="text-[#666] text-sm mb-6 max-w-xs">
      {category ? `We're preparing amazing pieces for ${category}. Check back soon!` : 'New pieces are being added. Check back soon!'}
    </p>
    
    {onBrowse && (
      <button
        onClick={onBrowse}
        className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
      >
        Browse Other Categories
      </button>
    )}
  </div>
);

export default {
  EmptyCart,
  EmptyFavorites,
  EmptySearch,
  NoProducts
};
