import React from 'react';
import { X, Heart, ArrowRight } from 'lucide-react';
import { PAINTINGS } from '../data/paintings';
import { PRINTS } from '../data/prints';

const FavoritesDrawer = ({ open, onClose, navigate = null }) => {
  if (!open) return null;

  // Combine paintings and prints for favorites
  const allItems = [...PAINTINGS, ...PRINTS];
  
  let favorites = [];
  try {
    const raw = localStorage.getItem('instyle:favorites');
    const favs = raw ? JSON.parse(raw) : {};
    favorites = allItems.filter(p => favs[p.code]);
  } catch { favorites = []; }

  const handleItemClick = (item) => {
    if (navigate) {
      navigate(`/art/${item.code}`);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside 
        className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[70] flex flex-col border-l border-[#E5E5E5]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-title"
      >
        <div className="p-4 sm:p-6 border-b border-[#E5E5E5] flex justify-between items-center bg-[#F9F8F6]">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-[#C5A059]" />
            <div>
              <h3 id="favorites-title" className="text-lg font-serif text-[#1C1B1A]">Favorites</h3>
              <p className="text-xs text-[#666666]">{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#E5E5E5] rounded-full transition-colors" aria-label="Close favorites"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-16 text-[#666666]">
              <Heart size={40} className="mx-auto mb-4 opacity-20" />
              <p>No favorites yet.</p>
              <button 
                onClick={() => { navigate && navigate('/arts'); onClose(); }} 
                className="mt-4 text-[#C5A059] text-xs font-bold border-b border-[#C5A059] pb-1 uppercase hover:text-[#1C1B1A] hover:border-[#1C1B1A] transition-colors"
              >
                Browse Art Collection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map(p => (
                <button 
                  key={p.code} 
                  onClick={() => handleItemClick(p)}
                  className="w-full flex gap-3 p-3 border border-[#E5E5E5] rounded-lg bg-white hover:border-[#C5A059] transition-colors group text-left"
                >
                  <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1C1B1A] truncate group-hover:text-[#C5A059] transition-colors">{p.title}</h4>
                    <p className="text-xs text-[#666666]">{p.width} × {p.height} cm</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-bold text-[#C5A059]">${p.price}</p>
                      {p.frameColor && (
                        <span className="text-[10px] text-[#999] bg-[#F0F0F0] px-2 py-0.5 rounded">Print</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[#E5E5E5] group-hover:text-[#C5A059] shrink-0 self-center transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-[#E5E5E5] bg-[#F9F8F6]">
            <button
              onClick={() => { navigate && navigate('/favorites'); onClose(); }}
              className="w-full py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2"
            >
              View All Favorites
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default FavoritesDrawer;
