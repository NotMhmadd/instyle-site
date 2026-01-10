import React, { useState, useEffect } from 'react';
import { Eye, Clock } from 'lucide-react';

// Hook to manage recently viewed items
export const useRecentlyViewed = (maxItems = 8) => {
  const STORAGE_KEY = 'instyle:recently-viewed';

  const [recentItems, setRecentItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addItem = (item) => {
    if (!item || !item.id) return;

    setRecentItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((i) => i.id !== item.id);
      
      // Add to beginning
      const updated = [
        {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          category: item.category,
          type: item.type || 'product', // 'product' or 'art'
          viewedAt: Date.now()
        },
        ...filtered
      ].slice(0, maxItems);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const clearHistory = () => {
    setRecentItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return { recentItems, addItem, clearHistory };
};

// Recently Viewed Section Component
const RecentlyViewed = ({ items = [], navigate, title = "Recently Viewed" }) => {
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-[#F9F8F6]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#1C1B1A] flex items-center justify-center">
            <Clock size={18} className="text-[#C5A059]" />
          </div>
          <h2 className="text-xl font-serif text-[#1C1B1A]">{title}</h2>
        </div>

        {/* Scrollable Items */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.type === 'art' ? `/art/${item.id}` : `/product/${item.id}`)}
                className="group w-[160px] md:w-[200px] bg-white rounded-xl overflow-hidden border border-[#E5E5E5] hover:border-[#C5A059] hover:shadow-lg transition-all duration-300 text-left shrink-0"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full text-xs font-medium text-[#1C1B1A]">
                        <Eye size={12} />
                        View
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[9px] text-[#C5A059] uppercase tracking-widest font-medium mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="font-medium text-sm text-[#1C1B1A] group-hover:text-[#C5A059] transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#C5A059] font-bold mt-1">
                    ${item.price?.toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
