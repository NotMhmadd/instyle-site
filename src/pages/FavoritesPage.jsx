import React, { useMemo, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import InstyleArts from '../components/InstyleArts';
import { PAINTINGS } from '../data/paintings';
import { PRINTS } from '../data/prints';

const FavoritesPage = ({ navigate = null }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Combine paintings and prints for favorites
  const allItems = useMemo(() => [...PAINTINGS, ...PRINTS], []);

  const favorites = useMemo(() => {
    try {
      const raw = localStorage.getItem('instyle:favorites');
      const favs = raw ? JSON.parse(raw) : {};
      return allItems.filter(p => favs[p.code]);
    } catch { return []; }
  }, [allItems]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C]">
      {/* Header */}
      <div className="bg-[#1C1B1A] text-white pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate && navigate('/')}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-[#C5A059] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <Heart size={28} className="text-[#C5A059]" />
            <h1 className="text-4xl md:text-5xl font-serif">Your Favorites</h1>
          </div>
          <p className="text-[#999] mt-4 max-w-lg">Your saved art collection. Click the heart icon on any artwork to add or remove from favorites.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-[#E5E5E5]">
            <Heart size={48} className="mx-auto mb-4 text-[#E5E5E5]" />
            <p className="text-[#666666] mb-4">You haven't favorited any artworks yet.</p>
            <button
              onClick={() => navigate && navigate('/arts')}
              className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
            >
              Browse Art Collection
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#666] mb-6">
              <span className="font-semibold text-[#1C1B1A]">{favorites.length}</span> item{favorites.length !== 1 ? 's' : ''} saved
            </p>
            <InstyleArts items={favorites} limit={favorites.length} navigate={navigate} showHeader={false} showCategories={false} />
          </>
        )}
      </div>
    </main>
  );
};

export default FavoritesPage;
