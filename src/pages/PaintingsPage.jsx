import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Palette } from 'lucide-react';
import InstyleArts from '../components/InstyleArts';
import { PAINTINGS } from '../data/paintings';
import PriceRangeSlider from '../components/PriceRangeSlider';

const SORTERS = {
  default: { label: 'Default', fn: () => 0 },
  price_asc: { label: 'Price ↑', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price ↓', fn: (a, b) => b.price - a.price },
  height_desc: { label: 'Height ↓', fn: (a, b) => b.height - a.height },
  width_desc: { label: 'Width ↓', fn: (a, b) => b.width - a.width },
};

const PAGE_SIZE = 9;

const PaintingsPage = ({ navigate = null }) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('default');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [orientation, setOrientation] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // set default price range from dataset
    const prices = PAINTINGS.map(p => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? PAINTINGS.filter(p => p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) : PAINTINGS.slice();
    // price filter
    const [minP, maxP] = priceRange;
    let results = base.filter(p => (p.price || 0) >= minP && (p.price || 0) <= maxP);
    // orientation filter
    if (orientation !== 'all') {
      results = results.filter(p => {
        if (orientation === 'portrait') return p.height > p.width;
        if (orientation === 'landscape') return p.width > p.height;
        if (orientation === 'square') return p.width === p.height;
        return true;
      });
    }
    // favorites filter (reads from localStorage)
    if (onlyFavorites) {
      try {
        const raw = localStorage.getItem('instyle:favorites');
        const favs = raw ? JSON.parse(raw) : {};
        results = results.filter(p => favs[p.code]);
      } catch { void 0; }
    }

    const sorter = SORTERS[sortKey] || SORTERS.default;
    if (sortKey === 'default') return results;
    return results.sort(sorter.fn);
  }, [query, sortKey, priceRange, orientation, onlyFavorites]);

  const visibleItems = filtered.slice(0, visible);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C]">
      {/* Header - compact on mobile */}
      <div className="bg-[#1C1B1A] text-white pt-24 md:pt-32 pb-10 md:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate && navigate('/arts')}
            className="flex items-center gap-2 text-sm text-[#999] active:text-[#C5A059] transition-colors mb-4 md:mb-6 py-2 touch-state"
          >
            <ArrowLeft size={16} />
            Back to InStyle Arts
          </button>
          <div className="flex items-center gap-3">
            <Palette size={24} className="text-[#C5A059]" />
            <h1 className="text-3xl md:text-5xl font-serif">Oil Paintings</h1>
          </div>
          <p className="text-[#888] mt-3 md:mt-4 max-w-lg text-sm md:text-base">Explore our complete collection of original hand-painted oil paintings.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Mobile: Horizontal scrollable filters */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 mb-4 hide-scrollbar">
          <div className="flex gap-2 pb-2">
            <select 
              value={sortKey} 
              onChange={(e) => { setSortKey(e.target.value); setVisible(PAGE_SIZE); }} 
              className="filter-chip shrink-0 appearance-none pr-8 bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}
            >
              {Object.entries(SORTERS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            
            <select 
              value={orientation} 
              onChange={(e) => { setOrientation(e.target.value); setVisible(PAGE_SIZE); }} 
              className="filter-chip shrink-0 appearance-none pr-8 bg-no-repeat"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}
            >
              <option value="all">All Sizes</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
            
            <button
              onClick={() => { setOnlyFavorites(!onlyFavorites); setVisible(PAGE_SIZE); }}
              className={`filter-chip shrink-0 ${onlyFavorites ? 'active' : ''}`}
            >
              <span className="text-red-500">♥</span>
              Favorites
            </button>
          </div>
        </div>
        
        {/* Mobile: Price range slider */}
        <div className="md:hidden bg-white p-4 rounded-xl mb-4 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#666]">Price Range</span>
            <span className="text-sm text-[#C5A059] font-bold">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <PriceRangeSlider min={minPrice} max={maxPrice} value={priceRange} onChange={(r) => { setPriceRange(r); setVisible(PAGE_SIZE); }} />
        </div>
        
        {/* Mobile: Search bar */}
        <div className="md:hidden mb-4">
          <input
            aria-label="Search paintings"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Search by title or code..."
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-white focus:outline-none focus:border-[#C5A059] transition-colors text-base"
          />
        </div>
        
        {/* Desktop: Filters Section */}
        <div className="hidden md:block bg-white p-4 md:p-6 rounded-lg mb-8 space-y-4 border border-[#E5E5E5]">
          {/* Search and Sort Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              aria-label="Search paintings"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search by title or code..."
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-[#E5E5E5] rounded-lg bg-[#F9F8F6] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
            />

            <select 
              value={sortKey} 
              onChange={(e) => { setSortKey(e.target.value); setVisible(PAGE_SIZE); }} 
              className="px-4 py-2.5 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#C5A059]"
            >
              {Object.entries(SORTERS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            <select 
              value={orientation} 
              onChange={(e) => { setOrientation(e.target.value); setVisible(PAGE_SIZE); }} 
              className="px-4 py-2.5 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Orientations</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors">
              <input 
                id="favToggle" 
                type="checkbox" 
                checked={onlyFavorites} 
                onChange={(e) => { setOnlyFavorites(e.target.checked); setVisible(PAGE_SIZE); }}
                className="w-4 h-4 text-[#C5A059] rounded focus:ring-[#C5A059]"
              />
              <span className="text-sm font-medium">Favorites Only</span>
            </label>
          </div>

          {/* Price Range Row */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#666666] min-w-[80px]">Price Range:</label>
            <div className="flex-1 max-w-md">
              <PriceRangeSlider min={minPrice} max={maxPrice} value={priceRange} onChange={(r) => { setPriceRange(r); setVisible(PAGE_SIZE); }} />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <p className="text-sm text-[#666666]">
            Showing <span className="font-semibold text-[#1C1B1A]">{Math.min(visible, filtered.length)}</span> of <span className="font-semibold text-[#1C1B1A]">{filtered.length}</span>
          </p>
        </div>

        <InstyleArts items={visibleItems} limit={visibleItems.length} navigate={navigate} showHeader={false} />

        {visible < filtered.length && (
          <div className="text-center mt-8 md:mt-10">
            <button 
              onClick={() => setVisible(v => Math.min(filtered.length, v + PAGE_SIZE))} 
              className="w-full md:w-auto px-8 py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-xl active:bg-[#C5A059] active:scale-[0.98] transition-all touch-btn"
            >
              Load More Paintings
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaintingsPage;
