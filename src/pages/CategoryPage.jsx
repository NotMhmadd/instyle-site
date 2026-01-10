import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Grid, List, Heart, ShoppingBag, SlidersHorizontal, X, Check, Eye } from 'lucide-react';
import { CATEGORY_PRODUCTS } from '../data/products';
import { STORAGE_KEYS } from '../config/constants';
import Breadcrumb from '../components/Breadcrumb';

const CATEGORY_INFO = {
  'bedrooms': { title: 'Bedrooms', subtitle: 'Wardrobe Solutions', description: 'Custom wardrobe systems and walk-in closets designed to maximize space and style.' },
  'tv-units': { title: 'TV Units', subtitle: 'Media & Entertainment', description: 'Modern media consoles handcrafted from premium wood, designed to anchor your living space with elegance.' },
  'sofas': { title: 'Sofas', subtitle: 'Living Room', description: 'Luxurious sofas with custom fabric options, built on solid wood frames.' },
  'tables': { title: 'Tables', subtitle: 'Dining Collection', description: 'Solid wood dining tables that bring family and friends together. Each piece tells a story.' },
  'consoles': { title: 'Consoles', subtitle: 'Decorative Accents', description: 'Statement consoles framed in premium materials to elevate any room.' },
  'dining-tables': { title: 'Dinning Tables', subtitle: 'Dining Collection', description: 'Solid wood dining tables that bring family and friends together. Each piece tells a story.' },
  'chairs': { title: 'Chairs', subtitle: 'Seating Collection', description: 'Elegant chairs designed for comfort and style.' },
  'wall-cladding': { title: 'Wall Cladding', subtitle: 'Wall Treatments', description: 'Transform your walls with sculptural wood panels and vertical slat systems.' },
};

const SORTERS = {
  default: { label: 'Featured', fn: () => 0 },
  price_asc: { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  name_asc: { label: 'Name: A-Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

const CategoryPage = ({ navigate }) => {
  const { categoryId } = useParams();
  const [favorites, setFavorites] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  // Filter states
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const categoryInfo = CATEGORY_INFO[categoryId] || { title: 'Category', subtitle: '', description: '' };
  const allProducts = CATEGORY_PRODUCTS[categoryId] || [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId]);

  // Load favorites
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.favorites);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  // Get unique materials for filter
  const availableMaterials = useMemo(() => {
    const materials = new Set(allProducts.map(p => p.material).filter(Boolean));
    return Array.from(materials);
  }, [allProducts]);

  // Get price bounds
  const priceBounds = useMemo(() => {
    const prices = allProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allProducts]);

  // Reset price range when category changes
  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSelectedMaterials([]);
    setQuery('');
    setSortKey('default');
  }, [categoryId, priceBounds]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let results = [...allProducts];

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q));
    }

    // Price filter
    results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Material filter
    if (selectedMaterials.length > 0) {
      results = results.filter(p => selectedMaterials.includes(p.material));
    }

    // Favorites filter
    if (onlyFavorites) {
      results = results.filter(p => favorites[p.id]);
    }

    // Sort
    const sorter = SORTERS[sortKey];
    if (sorter && sortKey !== 'default') {
      results.sort(sorter.fn);
    }

    return results;
  }, [allProducts, query, priceRange, selectedMaterials, onlyFavorites, sortKey, favorites]);

  const toggleFavorite = (productId) => {
    const updated = { ...favorites };
    if (updated[productId]) {
      delete updated[productId];
    } else {
      updated[productId] = true;
    }
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('instyle:favorites-updated', { detail: { count: Object.keys(updated).length } }));
  };

  const handleAddToBag = (product) => {
    window.dispatchEvent(new CustomEvent('instyle:add-to-cart', { detail: product }));
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 2000);
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSortKey('default');
    setPriceRange([priceBounds.min, priceBounds.max]);
    setSelectedMaterials([]);
    setOnlyFavorites(false);
  };

  const activeFilterCount = [
    query.trim() ? 1 : 0,
    priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max ? 1 : 0,
    selectedMaterials.length > 0 ? 1 : 0,
    onlyFavorites ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Header - compact on mobile */}
      <div className="bg-[#1C1B1A] text-white pt-28 md:pt-32 pb-10 md:pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <Breadcrumb 
            navigate={navigate}
            items={[
              { label: 'Collections', href: '/#collections' },
              { label: categoryInfo.title }
            ]}
          />
          <span className="text-[#C5A059] text-[10px] md:text-xs font-bold uppercase tracking-widest block mb-2">
            {categoryInfo.subtitle}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-4">{categoryInfo.title}</h1>
          <p className="text-[#888] text-sm md:text-lg max-w-2xl line-clamp-2 md:line-clamp-none">{categoryInfo.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Mobile: Horizontal scrollable filter chips */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 mb-4 hide-scrollbar">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`filter-chip shrink-0 ${filtersOpen || activeFilterCount > 0 ? 'active' : ''}`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-[#C5A059] text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="filter-chip shrink-0 appearance-none pr-6 bg-no-repeat bg-right"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}
            >
              {Object.entries(SORTERS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`filter-chip shrink-0 ${onlyFavorites ? 'active' : ''}`}
            >
              <Heart size={14} className={onlyFavorites ? 'fill-current' : ''} />
              Favorites
            </button>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="filter-chip shrink-0 text-red-500 border-red-200"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Desktop Toolbar */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-lg bg-[#F9F8F6] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
              />
            </div>

            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E5E5] rounded-lg bg-white focus:outline-none focus:border-[#C5A059]"
            >
              {Object.entries(SORTERS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
                filtersOpen || activeFilterCount > 0
                  ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                  : 'border-[#E5E5E5] hover:border-[#C5A059]'
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#C5A059] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-[#F9F8F6] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-[#C5A059] shadow-sm' : 'text-[#999] hover:text-[#1C1B1A]'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-[#C5A059] shadow-sm' : 'text-[#999] hover:text-[#1C1B1A]'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-[#1C1B1A] block mb-3">Price Range</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#C5A059]"
                      placeholder="Min"
                    />
                    <span className="text-[#999]">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#C5A059]"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <label className="text-sm font-medium text-[#1C1B1A] block mb-3">Material</label>
                  <div className="flex flex-wrap gap-2">
                    {availableMaterials.map((material) => (
                      <button
                        key={material}
                        onClick={() => toggleMaterial(material)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                          selectedMaterials.includes(material)
                            ? 'border-[#C5A059] bg-[#C5A059] text-white'
                            : 'border-[#E5E5E5] hover:border-[#C5A059] text-[#666]'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorites Toggle */}
                <div>
                  <label className="text-sm font-medium text-[#1C1B1A] block mb-3">Show</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyFavorites}
                      onChange={(e) => setOnlyFavorites(e.target.checked)}
                      className="w-5 h-5 rounded border-[#E5E5E5] text-[#C5A059] focus:ring-[#C5A059]"
                    />
                    <span className="text-sm text-[#666]">Favorites only</span>
                  </label>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-[#C5A059] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#666]">
            Showing <span className="font-semibold text-[#1C1B1A]">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-[#1C1B1A]">{allProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-white rounded-xl border border-[#E5E5E5]">
            <ShoppingBag size={48} className="mx-auto mb-4 text-[#E5E5E5]" />
            <p className="text-[#666] mb-4">No products match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-[#C5A059] hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl md:rounded-lg border border-[#E5E5E5] overflow-hidden active:scale-[0.98] md:hover:border-[#C5A059] md:hover:shadow-xl transition-all duration-300 cursor-pointer touch-state"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative overflow-hidden aspect-square md:aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  {product.tag && (
                    <span className="absolute top-2 md:top-3 left-2 md:left-3 bg-[#1C1B1A] text-white text-[8px] md:text-[9px] px-2 md:px-3 py-1 md:py-1.5 uppercase tracking-widest font-bold rounded-lg">
                      {product.tag}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    className="absolute top-2 md:top-3 right-2 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md active:scale-90 transition-all touch-btn"
                  >
                    <Heart
                      size={16}
                      className={favorites[product.id] ? 'fill-red-500 text-red-500' : 'text-[#666]'}
                    />
                  </button>
                  {/* Desktop: Hover overlay with View Details */}
                  <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-[#1C1B1A]">
                      <Eye size={16} />
                      View Details
                    </div>
                  </div>
                  {/* Desktop: Quick Add Overlay */}
                  <div className="hidden md:block absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToBag(product); }}
                      className="w-full py-3 bg-[#1C1B1A]/95 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-colors"
                    >
                      <ShoppingBag size={14} />
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-5">
                  <p className="text-[9px] md:text-[10px] text-[#C5A059] uppercase tracking-widest font-medium mb-0.5 md:mb-1">{product.material}</p>
                  <h3 className="font-bold text-[#1C1B1A] text-sm md:text-base mb-1 md:mb-2 md:group-hover:text-[#C5A059] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-[#999] mb-2 md:mb-3 hidden md:block">{product.dimensions}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-xl font-serif text-[#1C1B1A]">
                      ${product.price.toLocaleString()}
                    </span>
                    {/* Mobile: Quick add button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToBag(product); }}
                      className="md:hidden w-8 h-8 bg-[#1C1B1A] text-white rounded-lg flex items-center justify-center active:bg-[#C5A059] active:scale-95 touch-btn"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col md:flex-row gap-6 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden hover:border-[#C5A059] hover:shadow-lg transition-all p-4 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative w-full md:w-56 h-48 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-[#1C1B1A] text-white text-[9px] px-2 py-1 uppercase tracking-widest font-bold rounded-sm">
                      {product.tag}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-[#1C1B1A]">
                      <Eye size={14} />
                      View
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-medium mb-1">{product.material}</p>
                    <h3 className="text-xl font-bold text-[#1C1B1A] mb-2 group-hover:text-[#C5A059] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#666]">Dimensions: {product.dimensions}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4">
                    <span className="text-2xl font-serif text-[#1C1B1A]">
                      ${product.price.toLocaleString()}{product.unit || ''}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                        className="w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:border-[#C5A059] transition-colors"
                      >
                        <Heart
                          size={20}
                          className={favorites[product.id] ? 'fill-red-500 text-red-500' : 'text-[#666]'}
                        />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToBag(product); }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
                      >
                        <ShoppingBag size={16} />
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification - mobile optimized */}
      {addedToast && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto bg-[#1C1B1A] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 safe-area-bottom">
          <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">Added to bag</p>
            <p className="text-sm text-[#999] truncate">{addedToast}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
