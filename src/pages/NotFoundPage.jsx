import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[180px] md:text-[220px] font-serif font-bold text-[#F0F0F0] leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-serif font-bold text-[#1C1B1A]">
              Oops!
            </span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-[#1C1B1A] mb-4">
          Page Not Found
        </h1>
        
        <p className="text-[#666] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
          >
            <Home size={18} />
            Back to Home
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#E5E5E5] text-[#1C1B1A] font-bold uppercase text-xs tracking-widest rounded-lg hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
          <p className="text-sm text-[#999] mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/arts')}
              className="text-sm text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
            >
              InStyle Arts
            </button>
            <span className="text-[#E5E5E5]">|</span>
            <button
              onClick={() => navigate('/category/tv-units')}
              className="text-sm text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
            >
              TV Units
            </button>
            <span className="text-[#E5E5E5]">|</span>
            <button
              onClick={() => navigate('/category/dining-tables')}
              className="text-sm text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
            >
              Dining
            </button>
            <span className="text-[#E5E5E5]">|</span>
            <button
              onClick={() => navigate('/favorites')}
              className="text-sm text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
            >
              Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
