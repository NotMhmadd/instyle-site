import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Ruler,
  Check,
  ShoppingBag,
  ZoomIn,
  X,
  Plus,
  Minus,
  Package,
  Truck,
  Clock,
  Eye
} from 'lucide-react';

// Import products data
import { PRODUCTS, CATEGORIES, ALL_PRODUCTS } from '../data/products';
import { CONTACT, STORAGE_KEYS, getWhatsAppUrl } from '../config/constants';
import MobileFloatingCTA from '../components/MobileFloatingCTA';
import Breadcrumb from '../components/Breadcrumb';

const ProductDetailPage = ({ navigate, onAddToCart, onAddRecent, showToast }) => {
  const { productId } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Find the product
  const product = useMemo(() => {
    return ALL_PRODUCTS.find(item => item.id === parseInt(productId) || item.id === productId);
  }, [productId]);

  // Track recently viewed
  useEffect(() => {
    if (product && onAddRecent) {
      onAddRecent({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        type: 'product'
      });
    }
  }, [product, onAddRecent]);

  // Get category info
  const category = useMemo(() => {
    if (!product) return null;
    return CATEGORIES.find(cat => cat.id === product.categoryId);
  }, [product]);

  // Get related items (same category first, then fill with random if needed)
  const relatedItems = useMemo(() => {
    if (!product) return [];
    
    // First try to get items from the same category
    const sameCategory = ALL_PRODUCTS.filter(
      item => item.categoryId === product.categoryId && item.id !== product.id
    );
    
    // If we have enough from the same category, use those
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    
    // Otherwise, fill with items from other categories
    const otherItems = ALL_PRODUCTS.filter(
      item => item.categoryId !== product.categoryId && item.id !== product.id
    );
    
    // Combine and shuffle the other items, then take what we need
    const shuffled = [...otherItems].sort(() => 0.5 - Math.random());
    const combined = [...sameCategory, ...shuffled].slice(0, 4);
    
    return combined;
  }, [product]);

  // Generate gallery images (single image per product)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [
      { src: product.image, alt: product.name },
    ];
  }, [product]);

  // Favorites - use unified storage key
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.favorites);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  const toggleFavorite = () => {
    if (!product) return;
    const wasAdded = !favorites[product.id];
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[product.id]) delete next[product.id];
      else next[product.id] = true;
      try { localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new CustomEvent('instyle:favorites-updated', { detail: { count: Object.keys(next).length } }));
      return next;
    });
    // Show toast notification
    if (showToast) {
      showToast(product.name, wasAdded);
    }
  };

  const isFavorite = product ? !!favorites[product.id] : false;

  // Share functionality
  const shareProduct = async () => {
    if (!product) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: `Check out ${product.name} from InStyle`, url }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(url); alert('Link copied to clipboard!'); } catch { alert('Share not supported'); }
  };

  // Handle Add to Cart/Project
  const handleAddToCart = () => {
    if (onAddToCart && product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

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

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-32">
        <div className="container mx-auto px-4 md:px-8 text-center py-20">
          <h1 className="text-3xl font-serif text-[#1C1B1A] mb-4">Product Not Found</h1>
          <p className="text-[#666] mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-[#C5A059] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const whatsappMessage = `Hi! I'm interested in "${product.name}" (${product.category}). Can you tell me more about pricing and availability?`;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-[#1C1B1A] text-white pt-28 pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <Breadcrumb 
            navigate={navigate}
            items={[
              { label: 'Collections', href: '/#collections' },
              { label: category?.name || 'Products', href: category ? `/category/${category.id}` : '/' },
              { label: product.name }
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image - swipeable on mobile */}
            <div 
              className="relative aspect-[4/3] bg-white rounded-xl md:rounded-2xl overflow-hidden border border-[#E5E5E5] cursor-zoom-in group"
              onClick={() => setIsZoomed(true)}
            >
              {/* Mobile: Horizontal swipe gallery */}
              <div className="md:hidden gallery-swipe absolute inset-0">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
              
              {/* Desktop: Single image view */}
              <img
                src={galleryImages[selectedImageIndex]?.src}
                alt={galleryImages[selectedImageIndex]?.alt}
                className="hidden md:block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Action buttons - larger on mobile */}
              <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
                  className="w-11 h-11 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg touch-btn"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-[#666]'} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); shareProduct(); }}
                  className="w-11 h-11 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg touch-btn"
                  aria-label="Share"
                >
                  <Share2 size={20} className="text-[#666]" />
                </button>
              </div>
              
              {/* Product Tag */}
              {product.tag && (
                <div className="absolute top-3 md:top-4 left-3 md:left-4">
                  <span className="bg-[#1C1B1A] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                    {product.tag}
                  </span>
                </div>
              )}
              
              {/* Zoom hint - desktop only */}
              <div className="hidden md:flex absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-full items-center gap-2 text-xs text-[#666]">
                <ZoomIn size={14} />
                Click to zoom
              </div>
              
              {/* Mobile swipe indicator dots */}
              {galleryImages.length > 1 && (
                <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 swipe-dots">
                  {galleryImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`swipe-dot ${selectedImageIndex === idx ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Navigation arrows - desktop only */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i > 0 ? i - 1 : galleryImages.length - 1); }}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i => i < galleryImages.length - 1 ? i + 1 : 0); }}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery - desktop only */}
            {galleryImages.length > 1 && (
              <div className="hidden md:flex gap-3">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] rounded-full text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              {product.material && (
                <span className="text-xs text-[#999] uppercase tracking-widest">{product.material}</span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1C1B1A] mb-2">{product.name}</h1>
              <p className="text-3xl font-serif text-[#C5A059] font-bold">
                ${product.price?.toLocaleString()}{product.unit || ''}
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-[#666] leading-relaxed">
              <p>
                {product.description || `The ${product.name} is a beautifully crafted piece from our ${product.category} collection. Designed with attention to detail and built using premium materials, this piece will transform your living space with its timeless elegance.`}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 space-y-4">
              <h3 className="font-bold text-[#1C1B1A] text-sm uppercase tracking-widest">Specifications</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                    <Ruler size={16} className="text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#999] uppercase tracking-wider">Dimensions</p>
                    <p className="font-medium text-[#1C1B1A]">{product.dimensions || 'Custom'}</p>
                  </div>
                </div>

                {product.material && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center shrink-0">
                      <Package size={16} className="text-[#C5A059]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#999] uppercase tracking-wider">Material</p>
                      <p className="font-medium text-[#1C1B1A]">{product.material}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector - mobile optimized */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#666]">Quantity:</span>
              <div className="mobile-qty-selector">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="touch-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="touch-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#666]">
                <Check size={16} className="text-[#25D366]" />
                <span>Custom sizing available</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#666]">
                <Check size={16} className="text-[#25D366]" />
                <span>Handcrafted with premium materials</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#666]">
                <Check size={16} className="text-[#25D366]" />
                <span>Professional installation available</span>
              </div>
            </div>

            {/* CTA Buttons - hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 bg-[#25D366] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle size={18} />
                Inquire on WhatsApp
              </a>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-[#F9F8F6] rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Truck size={18} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="font-bold text-[#1C1B1A] text-sm">Delivery & Installation</p>
                  <p className="text-xs text-[#666] mt-1">Delivery available across Lebanon. Professional installation available for an additional fee.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="font-bold text-[#1C1B1A] text-sm">Lead Time</p>
                  <p className="text-xs text-[#666] mt-1">Standard items: 2-3 weeks. Custom orders: 4-6 weeks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16 pt-16 border-t border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-[#1C1B1A]">You May Also Like</h2>
              {category && (
                <button
                  onClick={() => navigate(`/category/${category.id}`)}
                  className="text-sm font-bold uppercase tracking-widest text-[#C5A059] hover:text-[#1C1B1A] transition-colors"
                >
                  View All →
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="group bg-white rounded-lg overflow-hidden border border-[#E5E5E5] hover:border-[#C5A059] hover:shadow-lg transition-all text-left"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-[#1C1B1A]">
                        <Eye size={14} />
                        View
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] text-[#C5A059] uppercase tracking-widest font-medium mb-0.5">{item.category}</p>
                    <h3 className="font-medium text-sm text-[#1C1B1A] group-hover:text-[#C5A059] transition-colors truncate">{item.name}</h3>
                    <p className="text-sm text-[#C5A059] font-bold">${item.price?.toLocaleString()}{item.unit || ''}</p>
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
        price={product.price}
        onAddToCart={handleAddToCart}
        onFavorite={toggleFavorite}
        isFavorite={isFavorite}
        productName={product.name}
      />
    </main>
  );
};

export default ProductDetailPage;
