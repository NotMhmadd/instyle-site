import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Image, Heart, Share2, Eye } from 'lucide-react';
import { PRINTS } from '../data/prints';
import PriceRangeSlider from '../components/PriceRangeSlider';

const SORTERS = {
  default: { label: 'Default', fn: () => 0 },
  price_asc: { label: 'Price ↑', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price ↓', fn: (a, b) => b.price - a.price },
  newest: { label: 'Newest', fn: () => 0 },
};

// Get unique categories from prints
const CATEGORIES = ['All', ...new Set(PRINTS.map(p => p.category))];
const PAGE_SIZE = 9;

const PrintsPage = ({ navigate = null }) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('default');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const FALLBACK = 'https://placehold.co/800x600/efefef/666?text=Image+Not+Found';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const prices = PRINTS.map(p => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
  }, []);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('instyle:favorites');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleFavorite = (code, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[code]) delete next[code];
      else next[code] = true;
      try { localStorage.setItem('instyle:favorites', JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new CustomEvent('instyle:favorites-updated', { detail: { count: Object.keys(next).length } })); } catch {}
      return next;
    });
  };

  const isFavorite = (code) => !!favorites[code];

  // Loaded images tracking
  const [loaded, setLoaded] = useState({});
  const markLoaded = (code) => setLoaded((s) => ({ ...s, [code]: true }));

  // Share functionality
  const sharePrint = async (print, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/art/${print.code}`;
    if (navigator.share) {
      try { await navigator.share({ title: print.title, text: `Check out ${print.title} from InStyle Arts`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); } catch { alert('Share not supported'); }
  };

  const handleItemClick = (print) => {
    if (navigate) {
      navigate(`/art/${print.code}`);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let results = q 
      ? PRINTS.filter(p => p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) 
      : PRINTS.slice();

    // Price filter
    const [minP, maxP] = priceRange;
    results = results.filter(p => (p.price || 0) >= minP && (p.price || 0) <= maxP);

    // Category filter
    if (categoryFilter !== 'All') {
      results = results.filter(p => p.category === categoryFilter);
    }

    // Favorites filter
    if (onlyFavorites) {
      results = results.filter(p => favorites[p.code]);
    }

    // Sorting
    const sorter = SORTERS[sortKey] || SORTERS.default;
    if (sortKey !== 'default') {
      results = results.sort(sorter.fn);
    }

    return results;
  }, [query, sortKey, priceRange, categoryFilter, onlyFavorites, favorites]);

  const visibleItems = filtered.slice(0, visible);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C]">
      {/* Header */}
      <div className="bg-[#1C1B1A] text-white pt-24 sm:pt-32 pb-10 sm:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate && navigate('/arts')}
            className="flex items-center gap-2 text-sm text-[#999] hover:text-[#C5A059] transition-colors mb-4 sm:mb-6 touch-btn"
          >
            <ArrowLeft size={16} />
            Back to InStyle Arts
          </button>
          <div className="flex items-center gap-3">
            <Image size={24} className="text-[#C5A059] sm:w-7 sm:h-7" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif">Framed Prints</h1>
          </div>
          <p className="text-[#999] mt-3 sm:mt-4 max-w-lg text-sm sm:text-base">
            Premium quality framed prints available in multiple sizes. Perfect for adding style to any room.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6 sm:py-8">
        {/* Filters Section - Mobile Optimized */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl mb-6 sm:mb-8 space-y-3 sm:space-y-4 border border-[#E5E5E5]">
          {/* Search */}
          <input
            aria-label="Search prints"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Search prints..."
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-[#F9F8F6] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors text-base"
          />

          {/* Filter chips - horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-1 px-1">
            <select 
              value={sortKey} 
              onChange={(e) => { setSortKey(e.target.value); setVisible(PAGE_SIZE); }} 
              className="shrink-0 px-3 py-2 border border-[#E5E5E5] rounded-full bg-white focus:outline-none focus:border-[#C5A059] text-sm"
            >
              {Object.entries(SORTERS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            <select 
              value={categoryFilter} 
              onChange={(e) => { setCategoryFilter(e.target.value); setVisible(PAGE_SIZE); }} 
              className="shrink-0 px-3 py-2 border border-[#E5E5E5] rounded-full bg-white focus:outline-none focus:border-[#C5A059] text-sm"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            <label className={`shrink-0 flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer transition-colors text-sm ${
              onlyFavorites ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' : 'border-[#E5E5E5] bg-white text-[#666]'
            }`}>
              <input 
                type="checkbox" 
                checked={onlyFavorites} 
                onChange={(e) => { setOnlyFavorites(e.target.checked); setVisible(PAGE_SIZE); }}
                className="sr-only"
              />
              <Heart size={14} className={onlyFavorites ? 'fill-current' : ''} />
              <span className="font-medium whitespace-nowrap">Favorites</span>
            </label>
          </div>

          {/* Price Range - collapsible on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-[#F0F0F0]">
            <label className="text-sm font-medium text-[#666666] shrink-0">Price:</label>
            <div className="flex-1">
              <PriceRangeSlider min={minPrice} max={maxPrice} value={priceRange} onChange={(r) => { setPriceRange(r); setVisible(PAGE_SIZE); }} />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-[#666666]">
            Showing <span className="font-semibold text-[#1C1B1A]">{Math.min(visible, filtered.length)}</span> of <span className="font-semibold text-[#1C1B1A]">{filtered.length}</span> prints
          </p>
        </div>

        {/* Prints Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {visibleItems.map((print) => (
            <article 
              key={print.code} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-[#E5E5E5] hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.98]"
              onClick={() => handleItemClick(print)}
            >
              <div className="w-full block relative">
                <div className="w-full aspect-[4/5] bg-[#F9F8F6] overflow-hidden relative">
                  <img
                    src={print.image}
                    alt={`${print.title} (${print.code})`}
                    className={`w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 transition-opacity duration-700 ${loaded[print.code] ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => markLoaded(print.code)}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
                  />
                  {!loaded[print.code] && (
                    <div className="absolute inset-0 bg-[#F0F0F0] animate-pulse"></div>
                  )}
                  
                  {/* Hover overlay - desktop only */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-[#1C1B1A]">
                      <Eye size={16} />
                      View Details
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 sm:gap-2 z-10">
                  <button 
                    onClick={(e) => toggleFavorite(print.code, e)} 
                    aria-label={isFavorite(print.code) ? 'Remove favorite' : 'Add to favorites'} 
                    className="bg-white/90 w-8 h-8 sm:w-auto sm:h-auto sm:px-2 sm:py-1 rounded-full sm:rounded-sm hover:bg-white transition-colors flex items-center justify-center touch-btn"
                  >
                    <Heart size={14} className={isFavorite(print.code) ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#666666]'} />
                  </button>
                  <button 
                    onClick={(e) => sharePrint(print, e)} 
                    aria-label={`Share ${print.title}`} 
                    className="hidden sm:flex bg-white/90 px-2 py-1 rounded-sm hover:bg-white transition-colors items-center justify-center"
                  >
                    <Share2 size={14} className="text-[#666666]" />
                  </button>
                </div>

                {/* Category badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                  <span className="bg-[#1C1B1A]/80 text-white text-[9px] sm:text-[10px] font-semibold px-2 sm:px-3 py-1 rounded-full">
                    {print.category}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[#1C1B1A] leading-tight group-hover:text-[#C5A059] transition-colors line-clamp-2">{print.title}</h3>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#999]">from</span>
                    <span className="text-base sm:text-xl font-serif text-[#C5A059] font-bold ml-1">${print.price}</span>
                  </div>
                </div>
                <p className="hidden sm:block text-sm text-[#666] line-clamp-2 mb-2">{print.description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 text-[11px] sm:text-sm text-[#666666]">
                  <span className="bg-[#F5F5F5] px-2 py-0.5 rounded">29.7×42 cm</span>
                  <span className="bg-[#F5F5F5] px-2 py-0.5 rounded">42×59.4 cm</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="text-center py-16">
            <Image size={48} className="mx-auto text-[#E5E5E5] mb-4" />
            <h3 className="text-lg font-serif text-[#666]">No prints found</h3>
            <p className="text-sm text-[#999] mt-2">Try adjusting your filters</p>
          </div>
        )}

        {visible < filtered.length && (
          <div className="text-center mt-10">
            <button 
              onClick={() => setVisible(v => Math.min(filtered.length, v + PAGE_SIZE))} 
              className="px-8 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
            >
              Load More Prints
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PrintsPage;
