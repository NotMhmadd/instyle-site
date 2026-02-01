import React, { useState } from 'react';
import { PAINTINGS } from '../data/paintings';
import { PRINTS } from '../data/prints';
import { ART_CATEGORIES } from '../data/arts';
import { Heart, Share2, ArrowRight, Palette, Image, Sparkles, Eye } from 'lucide-react';

const HANDCRAFTED_LINE = 'Hand-drawn oil on canvas';
const PRINT_LINE = 'Premium framed print';

const InstyleArts = ({ limit = 6, items = null, navigate = null, showHeader = true, showCategories = true }) => {
  const [activeTab, setActiveTab] = useState('oil-paintings');
  const FALLBACK = 'https://placehold.co/800x600/efefef/666?text=Image+Not+Found';

  // Determine which items to show based on tab
  const getItemsForTab = () => {
    if (items) return items; // If items are passed directly, use them
    if (activeTab === 'oil-paintings') return PAINTINGS;
    if (activeTab === 'prints') return PRINTS;
    return PAINTINGS;
  };

  const paintingsToShow = getItemsForTab().slice(0, limit);
  const isOilPaintings = activeTab === 'oil-paintings' || (items && items[0]?.code?.startsWith('OP'));

  // Favorites stored in localStorage under key 'instyle:favorites'
  const [favorites, setFavorites] = React.useState(() => {
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
      try { localStorage.setItem('instyle:favorites', JSON.stringify(next)); } catch { void 0; }
      try { window.dispatchEvent(new CustomEvent('instyle:favorites-updated', { detail: { count: Object.keys(next).length } })); } catch { void 0; }
      return next;
    });
  };

  const isFavorite = (code) => !!favorites[code];

  // track loaded images for LQIP (blur -> clear)
  const [loaded, setLoaded] = React.useState(() => ({}));
  const markLoaded = (src) => setLoaded((s) => ({ ...s, [src]: true }));

  const sharePainting = async (painting, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/art/${painting.code}`;
    if (navigator.share) {
      try { await navigator.share({ title: painting.title, text: `Check out ${painting.title} from InStyle Arts`, url }); return; } catch { void 0; }
    }
    try { await navigator.clipboard.writeText(url); alert('Link copied to clipboard'); } catch { alert('Share not supported'); }
  };

  const handleItemClick = (painting) => {
    if (navigate) {
      navigate(`/art/${painting.code}`);
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'oil-paintings': return Palette;
      case 'prints': return Image;
      case 'decorations': return Sparkles;
      default: return Palette;
    }
  };

  return (
    <section id="instyle-arts" className="py-16 md:py-20 bg-[#F9F8F6] text-[#1C1B1A]">
      <div className="container mx-auto px-4 md:px-8">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2 block">InStyle Arts</span>
              <h2 className="text-3xl md:text-4xl font-serif">Art & Décor Collection</h2>
              <p className="text-[#666666] mt-2 max-w-xl text-sm md:text-base">Original paintings, premium prints, and unique decorative pieces to elevate your space.</p>
            </div>
            {navigate && (
              <button
                onClick={() => navigate('/arts')}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#1C1B1A] transition-colors group"
              >
                View All Collections
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        )}

        {/* Category Tabs */}
        {showHeader && showCategories && (
          <div className="flex flex-wrap gap-3 mb-8">
            {ART_CATEGORIES.filter(cat => cat.available).map((cat) => {
              const Icon = getCategoryIcon(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === cat.id
                    ? 'bg-[#1C1B1A] text-white shadow-md'
                    : 'bg-white text-[#666] border border-[#E5E5E5] hover:border-[#C5A059] hover:text-[#C5A059]'
                    }`}
                >
                  <Icon size={16} />
                  {cat.shortName}
                  <span className={`text-xs ${activeTab === cat.id ? 'text-[#C5A059]' : 'text-[#999]'}`}>
                    ({cat.count})
                  </span>
                </button>
              );
            })}
            {/* Coming Soon badge for Decorations */}
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#F0F0F0] text-[#999] cursor-not-allowed">
              <Sparkles size={16} />
              Decor
              <span className="text-[10px] bg-[#1C1B1A] text-white px-2 py-0.5 rounded-full ml-1">Soon</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paintingsToShow.map((painting) => (
            <article
              key={painting.code}
              className="group bg-white rounded-lg overflow-hidden shadow-sm border border-[#E5E5E5] hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleItemClick(painting)}
            >
              <div className="w-full block relative">
                {(() => {
                  // LQIP file is generated at src/assets/lqip/<CODE>.webp (only for oil paintings)
                  let lqip = '';
                  const itemIsOilPainting = painting.code?.startsWith('OP');
                  if (itemIsOilPainting) {
                    try {
                      lqip = new URL(`../assets/lqip/${painting.code}.webp`, import.meta.url).href;
                    } catch { }
                  }
                  return (
                    <div
                      className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative"
                      style={{ backgroundImage: lqip ? `url(${lqip})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <img
                        src={painting.image}
                        alt={`${painting.title} (${painting.code})`}
                        className={`w-full h-full object-contain bg-white transition-all duration-700 ease-out group-hover:scale-110 select-none ${loaded[painting.code] ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                        loading="lazy"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        onLoad={() => markLoaded(painting.code)}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
                      />
                      {!loaded[painting.code] && !lqip && (
                        <div className="absolute inset-0 bg-[#F0F0F0] animate-pulse"></div>
                      )}

                      {/* Hover overlay with View Details */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-[#1C1B1A]">
                          <Eye size={16} />
                          View Details
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={(e) => toggleFavorite(painting.code, e)}
                    aria-label={isFavorite(painting.code) ? 'Remove favorite' : 'Add to favorites'}
                    title={isFavorite(painting.code) ? 'Remove favorite' : 'Add to favorites'}
                    className="bg-white/90 px-2 py-1 rounded-sm hover:bg-white transition-colors"
                  >
                    <Heart size={16} className={`${isFavorite(painting.code) ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#666666]'}`} />
                  </button>
                  <button
                    onClick={(e) => sharePainting(painting, e)}
                    aria-label={`Share ${painting.title}`}
                    title="Share"
                    className="bg-white/90 px-2 py-1 rounded-sm hover:bg-white transition-colors"
                  >
                    <Share2 size={16} className="text-[#666666]" />
                  </button>
                </div>

                {/* Frame color for prints */}
                {painting.frameColor && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-[#1C1B1A]/80 text-white text-[10px] font-semibold px-3 py-1 rounded-sm">
                      {painting.frameColor} Frame
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-[#1C1B1A]/80 text-white text-[10px] font-semibold px-3 py-1 rounded-sm">
                  {painting.code?.startsWith('OP') ? HANDCRAFTED_LINE : PRINT_LINE}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-[#1C1B1A] leading-tight group-hover:text-[#C5A059] transition-colors">{painting.title}</h3>
                  <span className="text-xl font-serif text-[#C5A059] font-bold whitespace-nowrap">${painting.price}</span>
                </div>
                <div className="text-sm text-[#666666] flex flex-wrap gap-2">
                  <span>{painting.width} × {painting.height} cm</span>
                  {painting.sizes && (
                    <>
                      <span className="text-[#E5E5E5]">|</span>
                      <span>{painting.sizes.length} sizes</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View More Button */}
        {showHeader && navigate && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate(activeTab === 'oil-paintings' ? '/arts/oil-paintings' : '/arts/prints')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
            >
              View All {activeTab === 'oil-paintings' ? 'Paintings' : 'Prints'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstyleArts;
