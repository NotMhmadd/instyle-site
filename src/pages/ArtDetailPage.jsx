import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Palette,
  Image,
  Ruler,
  Check,
  ZoomIn,
  X,
  ShoppingBag
} from 'lucide-react';
import { PAINTINGS } from '../data/paintings';
import { PRINTS, SIZES, GLASS_OPTIONS, FRAMES } from '../data/prints';
import { getWhatsAppUrl, STORAGE_KEYS } from '../config/constants';
import MobileFloatingCTA from '../components/MobileFloatingCTA';
import Breadcrumb from '../components/Breadcrumb';

const ArtDetailPage = ({ navigate, onAddToCart, onAddRecent, showToast }) => {
  const { artId } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState('a3');
  const [selectedGlass, setSelectedGlass] = useState('standard');
  const [selectedFrame, setSelectedFrame] = useState('Black');

  // Find the art piece
  const art = useMemo(() => {
    const allArt = [...PAINTINGS, ...PRINTS];
    return allArt.find(item => item.code.toLowerCase() === artId?.toLowerCase());
  }, [artId]);

  const isPainting = art?.code?.startsWith('OP');
  const isPrint = art?.code?.startsWith('PR');

  // Track recently viewed
  useEffect(() => {
    if (art && onAddRecent) {
      onAddRecent({
        id: art.code,
        name: art.title,
        image: art.image,
        price: art.price,
        category: isPainting ? 'Oil Painting' : 'Print',
        type: 'art'
      });
    }
  }, [art, onAddRecent, isPainting]);

  // Get related items (same category, exclude current)
  const relatedItems = useMemo(() => {
    if (!art) return [];
    const source = isPainting ? PAINTINGS : PRINTS;
    return source.filter(item => item.code !== art.code).slice(0, 4);
  }, [art, isPainting]);

  // Generate gallery images (single image per art piece)
  const galleryImages = useMemo(() => {
    if (!art) return [];
    return [
      { src: art.image, alt: art.title },
    ];
  }, [art]);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('instyle:favorites');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  const toggleFavorite = () => {
    if (!art) return;
    const wasAdded = !favorites[art.code];
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[art.code]) delete next[art.code];
      else next[art.code] = true;
      try { localStorage.setItem('instyle:favorites', JSON.stringify(next)); } catch {}
      try { window.dispatchEvent(new CustomEvent('instyle:favorites-updated', { detail: { count: Object.keys(next).length } })); } catch {}
      return next;
    });
    // Show toast notification
    if (showToast) {
      showToast(art.title, wasAdded);
    }
  };

  const isFavorite = art ? !!favorites[art.code] : false;

  // Share functionality
  const shareArt = async () => {
    if (!art) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: art.title, text: `Check out ${art.title} from InStyle Arts`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); alert('Link copied to clipboard!'); } catch { alert('Share not supported'); }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [artId]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKey = (e) => {
      if (isZoomed) {
        if (e.key === 'Escape') setIsZoomed(false);
        if (e.key === 'ArrowLeft') setSelectedImageIndex(i => i > 0 ? i - 1 : galleryImages.length - 1);
        if (e.key === 'ArrowRight') setSelectedImageIndex(i => i < galleryImages.length - 1 ? i + 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isZoomed, galleryImages.length]);

  if (!art) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-32">
        <div className="container mx-auto px-4 md:px-8 text-center py-20">
          <h1 className="text-3xl font-serif text-[#1C1B1A] mb-4">Artwork Not Found</h1>
          <p className="text-[#666] mb-8">The artwork you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/arts')}
            className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
          >
            Browse Collection
          </button>
        </div>
      </main>
    );
  }

  const whatsappMessage = isPrint 
    ? `Hi! I'm interested in "${art.title}" (${art.code})\n\n📐 Size: ${SIZES[selectedSize]?.label}\n🖼️ Frame: ${selectedFrame}\n✨ Glass: ${selectedGlass === 'anti-reflection' ? 'Anti-Reflection' : 'Standard'}\n💰 Price: $${selectedGlass === 'anti-reflection' ? SIZES[selectedSize]?.antiReflectionPrice : SIZES[selectedSize]?.basePrice}\n\nCan I place an order?`
    : `Hi! I'm interested in "${art.title}" (${art.code}) - ${art.width}×${art.height}cm - Price: $${art.price}. Can you tell me more?`;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-[#1C1B1A] text-white pt-28 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <Breadcrumb 
            navigate={navigate}
            items={[
              { label: 'InStyle Arts', href: '/arts' },
              { label: isPainting ? 'Oil Paintings' : 'Framed Prints', href: isPainting ? '/arts/oil-paintings' : '/arts/prints' },
              { label: art.title }
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-white rounded-xl overflow-hidden border border-[#E5E5E5] cursor-zoom-in group"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={galleryImages[selectedImageIndex]?.src}
                alt={galleryImages[selectedImageIndex]?.alt}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={20} className={isFavorite ? 'text-[#C5A059] fill-[#C5A059]' : 'text-[#666]'} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); shareArt(); }}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Share"
                >
                  <Share2 size={20} className="text-[#666]" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-[#666]">
                <ZoomIn size={14} />
                Click to zoom
              </div>
              
              {/* Navigation arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i > 0 ? i - 1 : galleryImages.length - 1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i < galleryImages.length - 1 ? i + 1 : 0); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-[#C5A059] shadow-md' 
                        : 'border-[#E5E5E5] hover:border-[#C5A059]/50'
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              {isPainting ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full text-xs font-bold uppercase tracking-widest">
                  <Palette size={14} />
                  Oil Painting
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full text-xs font-bold uppercase tracking-widest">
                  <Image size={14} />
                  Framed Print
                </span>
              )}
              <span className="text-xs text-[#999] uppercase tracking-widest">{art.code}</span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1B1A] mb-2">{art.title}</h1>
              {isPrint ? (
                <p className="text-3xl font-serif text-[#C5A059] font-bold">
                  ${selectedGlass === 'anti-reflection' 
                    ? SIZES[selectedSize]?.antiReflectionPrice 
                    : SIZES[selectedSize]?.basePrice}
                </p>
              ) : (
                <p className="text-3xl font-serif text-[#C5A059] font-bold">${art.price}</p>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm text-[#666] leading-relaxed">
              <p>
                {art.description || (isPainting 
                  ? `"${art.title}" is an original hand-painted oil painting on premium canvas. Each brushstroke captures the essence of the subject with rich, vibrant colors and exceptional detail. This unique piece will add warmth and character to any space.`
                  : `"${art.title}" is a museum-quality giclée print on 200gsm matte archival paper. Available in two sizes with your choice of frame color and glass type. Perfect for adding elegance to your home or office.`
                )}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 space-y-4">
              <h3 className="font-bold text-[#1C1B1A] text-sm uppercase tracking-widest">Specifications</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {isPainting && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                      <Ruler size={16} className="text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#999] uppercase tracking-wider">Dimensions</p>
                      <p className="font-medium text-[#1C1B1A]">{art.width} × {art.height} cm</p>
                    </div>
                  </div>
                )}

                {isPrint && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                      <Image size={16} className="text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#999] uppercase tracking-wider">Print Type</p>
                      <p className="font-medium text-[#1C1B1A]">Museum-Quality Giclée</p>
                    </div>
                  </div>
                )}

                {isPainting && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                      <Palette size={16} className="text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#999] uppercase tracking-wider">Medium</p>
                      <p className="font-medium text-[#1C1B1A]">Oil on Canvas</p>
                    </div>
                  </div>
                )}

                {isPrint && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                      <Ruler size={16} className="text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#999] uppercase tracking-wider">Paper</p>
                      <p className="font-medium text-[#1C1B1A]">200gsm Matte Archival</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Options for Prints */}
              {isPrint && art.sizes && art.sizes.length > 0 && (
                <div className="pt-4 border-t border-[#E5E5E5]">
                  <p className="text-xs text-[#999] uppercase tracking-wider mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {art.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-[#1C1B1A] text-white'
                            : 'bg-[#F9F8F6] text-[#666] hover:bg-[#E5E5E5]'
                        }`}
                      >
                        <span className="block">{SIZES[size]?.label}</span>
                        <span className="block text-xs opacity-75">${SIZES[size]?.basePrice}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glass Options for Prints */}
              {isPrint && (
                <div className="pt-4 border-t border-[#E5E5E5]">
                  <p className="text-xs text-[#999] uppercase tracking-wider mb-3">Glass Type</p>
                  <div className="flex flex-wrap gap-2">
                    {GLASS_OPTIONS.map((glass) => (
                      <button
                        key={glass.id}
                        onClick={() => setSelectedGlass(glass.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedGlass === glass.id
                            ? 'bg-[#1C1B1A] text-white'
                            : 'bg-[#F9F8F6] text-[#666] hover:bg-[#E5E5E5]'
                        }`}
                      >
                        <span className="block">{glass.label}</span>
                        {glass.priceModifier > 0 && (
                          <span className="block text-xs opacity-75">+${glass.priceModifier}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Frame Color Selection for Prints */}
              {isPrint && (
                <div className="pt-4 border-t border-[#E5E5E5]">
                  <p className="text-xs text-[#999] uppercase tracking-wider mb-3">Frame Color</p>
                  <div className="flex flex-wrap gap-2">
                    {FRAMES.map((frame) => (
                      <button
                        key={frame}
                        onClick={() => setSelectedFrame(frame)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedFrame === frame
                            ? 'bg-[#1C1B1A] text-white'
                            : 'bg-[#F9F8F6] text-[#666] hover:bg-[#E5E5E5]'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ 
                            backgroundColor: frame === 'Black' ? '#1C1B1A' : 
                                           frame === 'White' ? '#FFFFFF' : 
                                           frame === 'Walnut' ? '#5D4037' : 
                                           '#D4A574'
                          }}
                        />
                        {frame}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              {isPainting ? (
                <>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Hand-painted with premium oil paints</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Ready to hang with included hardware</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>High-quality canvas material</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Museum-quality giclée print</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Premium {art.frameColor?.toLowerCase() || 'wooden'} frame included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Archival paper with UV protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#666]">
                    <Check size={16} className="text-[#25D366]" />
                    <span>Ready to hang</span>
                  </div>
                </>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isPainting && onAddToCart && (
                <button
                  onClick={() => onAddToCart({
                    id: `art-${art.code}`,
                    name: art.title,
                    price: art.price,
                    image: art.image,
                    category: 'Oil Painting',
                    code: art.code
                  })}
                  className="flex-1 py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              )}
              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isPainting ? '' : 'flex-1 '}py-4 bg-[#25D366] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 px-6`}
              >
                <MessageCircle size={18} />
                Inquire on WhatsApp
              </a>
              <button
                onClick={toggleFavorite}
                className={`px-6 py-4 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors flex items-center justify-center gap-2 ${
                  isFavorite 
                    ? 'bg-[#C5A059] text-white' 
                    : 'bg-white border border-[#E5E5E5] text-[#1C1B1A] hover:border-[#C5A059]'
                }`}
              >
                <Heart size={18} className={isFavorite ? 'fill-white' : ''} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-[#F9F8F6] rounded-xl p-5 text-sm text-[#666]">
              <p className="font-bold text-[#1C1B1A] mb-2">Shipping & Delivery</p>
              <p>Delivery available across Lebanon. Carefully packaged to ensure your artwork arrives in perfect condition. Typical delivery time is 3-7 business days.</p>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16 pt-16 border-t border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-[#1C1B1A]">You May Also Like</h2>
              <button
                onClick={() => navigate(isPainting ? '/arts/oil-paintings' : '/arts/prints')}
                className="text-sm font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedItems.map((item) => (
                <button
                  key={item.code}
                  onClick={() => navigate(`/art/${item.code}`)}
                  className="group bg-white rounded-lg overflow-hidden border border-[#E5E5E5] hover:border-[#C5A059] hover:shadow-lg transition-all text-left"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-[#1C1B1A] group-hover:text-[#C5A059] transition-colors truncate">{item.title}</h3>
                    <p className="text-sm text-[#C5A059] font-bold">${item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
          
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i > 0 ? i - 1 : galleryImages.length - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i < galleryImages.length - 1 ? i + 1 : 0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          <img
            src={galleryImages[selectedImageIndex]?.src}
            alt={galleryImages[selectedImageIndex]?.alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full text-white text-sm">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* Mobile Floating CTA */}
      <MobileFloatingCTA
        price={selectedSize?.price || art.price}
        onFavorite={toggleFavorite}
        isFavorite={isFavorite}
        productName={art.title}
        showAddToCart={isPainting}
        onAddToCart={isPainting && onAddToCart ? () => onAddToCart({
          id: `art-${art.code}`,
          name: art.title,
          price: art.price,
          image: art.image,
          category: 'Oil Painting',
          code: art.code
        }) : undefined}
      />
    </main>
  );
};

export default ArtDetailPage;
