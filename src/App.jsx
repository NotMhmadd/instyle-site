import React, { useState, useEffect, lazy, Suspense, useRef, useMemo, useCallback, memo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
  Phone,
  MapPin,
  Instagram,
  ShoppingBag,
  Plus,
  Heart,
  PenTool,
  Ruler,
  Clock,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Mail,
  Facebook,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ProductGridSkeleton } from './components/Skeleton.jsx';
import InstyleArts from './components/InstyleArts.jsx';
import VideoHero from './components/VideoHero.jsx';
import FavoritesDrawer from './components/FavoritesDrawer.jsx';
import { ToastContainer, useToast } from './components/Toast.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import RecentlyViewed, { useRecentlyViewed } from './components/RecentlyViewed.jsx';
import { EmptyCart, EmptyFavorites } from './components/EmptyStates.jsx';
import { PRODUCTS, CATEGORIES, ALL_PRODUCTS } from './data/products.js';

// Lazy load pages for code splitting
const PaintingsPage = lazy(() => import('./pages/PaintingsPage.jsx'));
const PrintsPage = lazy(() => import('./pages/PrintsPage.jsx'));
const ArtsLandingPage = lazy(() => import('./pages/ArtsLandingPage.jsx'));
const ArtDetailPage = lazy(() => import('./pages/ArtDetailPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const RatingsPage = lazy(() => import('./pages/RatingsPage.jsx'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20">
    <div className="container mx-auto px-4 md:px-8">
      <ProductGridSkeleton count={6} />
    </div>
  </div>
);

// Category images are now imported in src/data/products.js

// ==========================================
// 1. DESIGN SYSTEM & THEME
// ==========================================

const THEME = {
  colors: {
    primary: '#1C1B1A',       // Soft Black
    secondary: '#F9F8F6',     // Limestone / Bone White
    white: '#FFFFFF',
    accent: '#C5A059',        // InStyle Gold
    accentHover: '#B08D45',
    text: '#2C2C2C',
    muted: '#666666',
    border: '#E5E5E5'
  }
};

// ==========================================
// 2. MOCK DATA
// ==========================================

const HERO_SLIDE = {
  title: "Warmth in\nEvery Detail.",
  description: "Modern carpentry tailored to your exact space. From smart TV units that hide every cable to wall cladding that transforms a room. Serving homes across all of Lebanon.",
  image: "/images/hero-poster.jpg",
  cta: "Discover the Collection"
};

// CATEGORIES is now imported from src/data/products.js

// PRODUCTS is now imported from src/data/products.js

const SERVICE_PATHS = [
  {
    id: 'standard',
    icon: ShoppingBag,
    title: "Shop Standard",
    desc: "Curated, standard-sized units ready for quick delivery.",
    action: "View Catalog",
    href: "#collections"
  },
  {
    id: 'measure',
    icon: PenTool,
    title: "Made to Measure",
    desc: "Love a design? Send us your wall dimensions and we'll adjust it.",
    action: "Customize",
    href: "https://wa.me/96181773588?text=Hi!%20I%27d%20like%20to%20customize%20a%20piece%20with%20my%20dimensions."
  },
  {
    id: 'custom',
    icon: Ruler,
    title: "Full Custom",
    desc: "Complex room? We handle measurements and full fit-out.",
    action: "Book Visit",
    href: "https://wa.me/96181773588?text=Hi!%20I%27d%20like%20to%20book%20a%20home%20visit%20for%20a%20custom%20project."
  }
];

const CONTACT = {
  whatsapp: "https://wa.me/96181773588",
  phone: "+961 81 773 588",
  email: "instyle.lebanon@gmail.com"
};

// ==========================================
// 3. UTILITY COMPONENTS
// ==========================================

const TrustBar = memo(() => (
  <div className="bg-[#1C1B1A]" data-trust-bar>
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex items-center justify-center py-4 sm:py-5 gap-x-8 sm:gap-x-12 gap-y-2 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-2.5 text-white/80">
          <ShieldCheck size={15} className="text-[#C5A059] shrink-0" />
          <span className="text-[13px] sm:text-sm whitespace-nowrap">Premium Wood Craftsmanship</span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2 sm:gap-2.5 text-white/80">
          <CheckCircle size={15} className="text-[#C5A059] shrink-0" />
          <span className="text-[13px] sm:text-sm whitespace-nowrap">Fair Pricing</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-white/20" />
        <div className="hidden md:flex items-center gap-2.5 text-white/80">
          <Clock size={15} className="text-[#C5A059] shrink-0" />
          <span className="text-sm whitespace-nowrap">Delivery Across Lebanon</span>
        </div>
      </div>
    </div>
  </div>
));
TrustBar.displayName = 'TrustBar';

const Button = memo(({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm";
  const variants = {
    primary: `bg-[#1C1B1A] text-white hover:bg-[#C5A059] shadow-md hover:shadow-xl`,
    secondary: `bg-transparent border border-[#1C1B1A] text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white`,
    outline: `bg-transparent border border-white text-white hover:bg-white hover:text-[#1C1B1A]`,
    gold: `bg-[#C5A059] text-white hover:bg-[#B08D45] shadow-lg hover:shadow-gold/20`,
    whatsapp: `bg-[#25D366] text-white hover:bg-[#128C7E] shadow-sm`,
    ghost: `bg-transparent text-[#1C1B1A] hover:text-[#C5A059]`
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
});
Button.displayName = 'Button';

// ✅ fixed version - memoized
const SectionTitle = memo(({ subtitle, title, align = 'center' }) => {
  const alignClass =
    align === 'left'
      ? 'text-left'
      : align === 'right'
        ? 'text-right'
        : 'text-center';

  return (
    <div className={`mb-12 ${alignClass}`}>
      {subtitle && (
        <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-serif text-[#1C1B1A] leading-tight">
        {title}
      </h2>
    </div>
  );
});
SectionTitle.displayName = 'SectionTitle';

// ==========================================
// 4. FEATURE COMPONENTS
// ==========================================

// --- 4.1 Quote Builder (State Management) ---
const QuoteBuilder = ({ isOpen, onClose, items, onRemove, navigate }) => {
  if (!isOpen) return null;
  const totalEstimate = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-[400px] md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col border-l border-[#E5E5E5] sm:rounded-none rounded-t-3xl sm:inset-y-0 inset-x-0 top-auto max-h-[90vh] sm:max-h-full drawer-mobile animate-in slide-in-from-right sm:slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Drag handle for mobile */}
        <div className="sm:hidden flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-6 border-b border-[#E5E5E5] flex justify-between items-center bg-[#F9F8F6]">
          <div>
            <h3 id="cart-title" className="text-lg font-serif text-[#1C1B1A]">Project Bag</h3>
            <p className="text-xs text-[#666666]">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-[#E5E5E5] rounded-full transition-colors touch-btn" aria-label="Close cart"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-12 sm:py-20 text-[#666666]">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg mb-2">Your bag is empty.</p>
              <button onClick={onClose} className="mt-4 text-[#C5A059] text-sm font-bold border-b-2 border-[#C5A059] pb-1 uppercase hover:text-[#1C1B1A] hover:border-[#1C1B1A] transition-colors">Browse Collection</button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-3 p-3 border border-[#E5E5E5] rounded-xl bg-white relative group hover:border-[#C5A059] active:scale-[0.99] transition-all">
                <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-16 sm:h-16 object-cover rounded-xl bg-gray-100 shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className="font-bold text-sm text-[#1C1B1A] truncate">{item.name}</h4>
                  <p className="text-xs text-[#666666] truncate">{item.dimensions || item.category}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-bold text-[#C5A059]">${item.price.toLocaleString()}</span>
                    {(item.quantity || 1) > 1 && <span className="text-xs text-[#999] bg-[#F5F5F5] px-2 py-0.5 rounded-full">× {item.quantity}</span>}
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-[#999] hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all touch-btn" aria-label={`Remove ${item.name} from cart`}><X size={16} /></button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-[#E5E5E5] bg-[#F9F8F6] space-y-3 safe-area-bottom">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Estimated Total</span>
              <span className="text-2xl font-serif font-bold text-[#1C1B1A]">${totalEstimate.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-widest rounded-xl active:bg-[#C5A059] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg touch-btn"
            >
              <ShoppingBag size={18} />
              Proceed to Checkout
            </button>
            <a
              href="https://wa.me/96181773588"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white font-bold uppercase text-xs tracking-widest rounded-xl active:bg-[#128C7E] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg touch-btn"
            >
              <MessageCircle size={18} />
              Quick Quote via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
};

// --- 4.2 Navigation ---
const Navbar = ({ cartCount, favCount = 0, onOpenCart, navigate, openFavorites, cartBadgeKey }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (e, item, href) => {
    e.preventDefault();
    closeMobileMenu();
    if (item === 'Contact Us' || item === 'Contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Collections') {
      // Navigate home first if not on home, then scroll
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'Process' || item === 'How It Works') {
      // Scroll to service strip section
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const sections = document.querySelectorAll('section');
          for (const section of sections) {
            if (section.textContent.includes('Choose Your Journey')) {
              section.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
        }, 100);
      } else {
        const sections = document.querySelectorAll('section');
        for (const section of sections) {
          if (section.textContent.includes('Choose Your Journey')) {
            section.scrollIntoView({ behavior: 'smooth' });
            break;
          }
        }
      }
    } else if (item === 'Curated') {
      // Scroll to Curated Picks section within collections
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const curatedSection = document.querySelector('h3');
          const sections = document.querySelectorAll('h3');
          for (const section of sections) {
            if (section.textContent.includes('Curated Picks')) {
              section.scrollIntoView({ behavior: 'smooth', block: 'center' });
              break;
            }
          }
        }, 100);
      } else {
        const sections = document.querySelectorAll('h3');
        for (const section of sections) {
          if (section.textContent.includes('Curated Picks')) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      }
    } else if (item === 'Spotlight') {
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item === 'Favorites') {
      navigate('/favorites');
    } else if (navigate) {
      navigate(href);
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-sm py-4 top-0' : 'bg-transparent py-5 top-0'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <a href="/" onClick={(e) => { e.preventDefault(); if (navigate) navigate('/'); }} className="flex items-center group">
            <img src="/images/instyle-logo.png" alt="InStyle Modern Wood Art" className="h-40 w-auto object-contain transition-opacity group-hover:opacity-80 -my-10" />
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {['Collections', 'Curated', 'Spotlight', 'Process', 'Contact'].map((item) => {
              const href = `/#${item.toLowerCase()}`;
              return (
                <a
                  key={item}
                  href={href}
                  onClick={(e) => handleNavClick(e, item, href)}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {item}
                </a>
              );
            })}

            {/* InStyle Arts - Premium Sub-brand */}
            <a
              href="/arts"
              onClick={(e) => handleNavClick(e, 'InStyle Arts', '/arts')}
              className="group relative mx-3 px-5 py-2 text-sm font-medium overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-black"
            >
              {/* Background gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#C5A059] via-[#D4AF61] to-[#C5A059] opacity-90"></span>
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {/* Border glow */}
              <span className="absolute inset-0 rounded-full border border-[#D4AF61]/50 group-hover:border-white/30 transition-colors"></span>
              {/* Content */}
              <span className="relative flex items-center gap-2 text-[#1C1B1A] font-semibold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                InStyle Arts
              </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenCart} className="relative p-2 text-white hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-full btn-press">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span key={cartBadgeKey} className="absolute top-0 right-0 bg-[#C5A059] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold badge-animate">{cartCount}</span>
              )}
            </button>
            <div className="relative">
              <button onClick={() => openFavorites && openFavorites()} aria-label="Open favorites" className="p-2 text-white hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-full btn-press"><Heart size={18} /></button>
              {favCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold badge-animate">{favCount}</span>)}
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-white hover:text-[#C5A059] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded"><Menu size={24} /></button>
            <a href="https://wa.me/96181773588" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="hidden lg:inline-flex py-2 px-5 text-[10px] h-10 btn-shine">Book Visit</Button>
            </a>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col mobile-menu-enter safe-area-top">
          {/* Header with close button */}
          <div className="flex justify-between items-center p-4 border-b border-[#E5E5E5]">
            <span className="text-lg font-bold uppercase tracking-wider">Menu</span>
            <button onClick={closeMobileMenu} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]" aria-label="Close menu"><X size={24} /></button>
          </div>

          {/* Menu items with staggered animation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {['Collections', 'Curated', 'Spotlight', 'Process', 'Favorites', 'Contact'].map((item, index) => {
                const href = item === 'Favorites' ? '/favorites' : `/#${item.toLowerCase()}`;
                return (
                  <a
                    key={item}
                    href={href}
                    onClick={(e) => handleNavClick(e, item, href)}
                    className="mobile-menu-item text-lg font-medium text-[#1C1B1A] py-4 px-5 rounded-2xl hover:bg-[#F5F5F5] active:bg-[#EEEEEE] flex justify-between items-center transition-colors touch-state"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span>{item}</span>
                    <ChevronRight size={20} className="text-[#C5A059]" />
                  </a>
                );
              })}
            </div>

            {/* InStyle Arts - Distinct Sub-brand in Mobile */}
            <div className="mt-6 pt-6 border-t border-[#E5E5E5] mobile-menu-item" style={{ animationDelay: '350ms' }}>
              <p className="text-xs uppercase tracking-wider text-[#999] mb-3 px-2">Sub-brand</p>
              <a
                href="/arts"
                onClick={(e) => handleNavClick(e, 'InStyle Arts', '/arts')}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-2xl active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 bg-[#C5A059] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">IA</span>
                </div>
                <div className="flex-1">
                  <span className="text-lg font-medium text-[#1C1B1A] block">InStyle Arts</span>
                  <p className="text-sm text-[#666]">Paintings & Wall Art</p>
                </div>
                <ArrowRight size={20} className="text-[#C5A059]" />
              </a>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-4 border-t border-[#E5E5E5] safe-area-bottom mobile-menu-item" style={{ animationDelay: '400ms' }}>
            <a
              href="https://wa.me/96181773588"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white font-bold uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
};

// --- 4.4 Collections Section (Unified Premium Category + Products) ---
const CollectionsSection = memo(({ onAddToCart, navigate }) => {
  // Memoized product counts per category
  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = ALL_PRODUCTS.filter(p => p.categoryId === cat.id).length;
      return acc;
    }, {});
  }, []);

  // Featured products (ones with tags)
  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.tag).slice(0, 8);
  }, []);

  const handleCategoryClick = useCallback((catId) => {
    // Navigate directly to the category page
    navigate(`/category/${catId}`);
  }, [navigate]);

  return (
    <section id="collections" className="py-16 md:py-24 bg-gradient-to-b from-white via-[#FAFAFA] to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4 px-4 py-2 bg-[#C5A059]/10 rounded-full">
            ✦ The Collections ✦
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1B1A] leading-tight mb-4">
            Crafted for Living
          </h2>
          <p className="text-[#666] max-w-2xl mx-auto text-base md:text-lg">
            Discover furniture that transforms spaces. Each category represents years of refined craftsmanship.
          </p>
        </div>

        {/* Premium Category Display - Equal Grid Layout */}
        <div className="mb-16">
          {/* Desktop Grid - All equal sizes */}
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer text-left"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover Ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-[#C5A059] group-hover:ring-2 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[#C5A059] text-xs font-medium tracking-wide mb-2 block">
                        {categoryCounts[cat.id]} Pieces
                      </span>
                      <h3 className="text-white text-2xl font-serif group-hover:text-[#FFD700] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-300">
                      <ArrowRight size={18} className="text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Grid - 2 columns with improved touch */}
          <div className="md:hidden grid grid-cols-2 gap-3 mobile-compact-grid">
            {CATEGORIES.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer text-left active:scale-[0.97] transition-transform touch-state gpu-accelerated"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index < 4 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-active:ring-[#C5A059]" />

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-[#C5A059] text-[10px] font-bold tracking-wide mb-1.5 block">
                    {categoryCounts[cat.id]} Pieces
                  </span>
                  <h3 className="text-white text-base font-serif leading-tight line-clamp-2">
                    {cat.name}
                  </h3>
                </div>

                {/* Touch feedback overlay */}
                <div className="absolute inset-0 bg-white/0 group-active:bg-white/10 transition-colors duration-150" />
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products - Clean Grid */}
        {featuredProducts.length > 0 && (
          <div className="mt-16">
            {/* Simple header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-[#C5A059]" />
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1C1B1A]">Curated Picks</h3>
              </div>
              <button
                onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-[#666] hover:text-[#C5A059] transition-colors flex items-center gap-1.5 group"
              >
                View all
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Products grid - 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F5F5F5] mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Tag */}
                    {product.tag && (
                      <span className={`absolute top-2.5 left-2.5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide rounded-md ${product.tag === 'Best Seller' ? 'bg-[#C5A059] text-white' : 'bg-white text-[#1C1B1A] shadow-sm'
                        }`}>
                        {product.tag}
                      </span>
                    )}

                    {/* Hover overlay with add button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059] hover:text-white shadow-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#C5A059] mb-0.5">{product.category}</p>
                    <h4 className="text-sm font-medium text-[#1C1B1A] mb-0.5 truncate group-hover:text-[#C5A059] transition-colors">{product.name}</h4>
                    <p className="text-sm text-[#666]">${product.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
CollectionsSection.displayName = 'CollectionsSection';

// --- Reusable Product Card Component ---
const ProductCard = memo(({ product, onAddToCart, navigate, index, compact = false }) => {
  const handleQuickAdd = useCallback((e) => {
    e.stopPropagation();
    onAddToCart(product);
  }, [onAddToCart, product]);

  const handleClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  return (
    <div
      className="group cursor-pointer"
      onClick={handleClick}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`relative overflow-hidden bg-[#F5F5F5] rounded-xl ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md ${product.tag === 'New' ? 'bg-[#1C1B1A] text-white' :
            product.tag === 'Best Seller' ? 'bg-[#C5A059] text-white' :
              'bg-white text-[#1C1B1A]'
            }`}>
            {product.tag}
          </span>
        )}

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C5A059] hover:text-white transform scale-90 group-hover:scale-100"
          title="Quick add to cart"
        >
          <Plus size={18} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View Details Pill */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
          <span className="bg-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium text-[#1C1B1A] shadow-lg">
            <Eye size={14} />
            View Details
          </span>
        </div>

        {/* Quick Actions Bar */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
          <a
            href={`https://wa.me/96181773588?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-[#25D366] text-white py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle size={12} />
            Inquire
          </a>
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#1C1B1A] text-white py-2.5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
          >
            <Plus size={12} />
            Add
          </button>
        </div>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <p className="text-[9px] uppercase tracking-widest text-[#C5A059] mb-0.5 font-medium">{product.category}</p>
        <h3 className={`font-medium text-[#1C1B1A] group-hover:text-[#C5A059] transition-colors leading-tight ${compact ? 'text-sm truncate' : 'text-base'}`}>
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-serif font-bold text-[#1C1B1A]">${product.price.toLocaleString()}</span>
          {!compact && product.dimensions && (
            <span className="text-[10px] text-[#999]">{product.dimensions}</span>
          )}
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// --- 4.5 Real Homes Project ---
const RealHomesProject = memo(() => {
  return (
    <section id="about" className="py-24 bg-[#1C1B1A] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="lg:w-1/2">
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-4 block">Project Spotlight</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 lg:mb-8 leading-tight">The Achrafieh Penthouse.</h2>
            <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8">
              We transformed a concrete shell into a warm, wood-clad sanctuary. Featuring our signature Walnut Wall Panels, custom hidden storage, and a 4-meter cantilevered dining table.
            </p>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 border-t border-white/10 pt-6 lg:pt-8">
              <div className="text-center lg:text-left">
                <span className="block text-2xl lg:text-3xl font-serif text-[#C5A059]">45</span>
                <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider">Days to Build</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl lg:text-3xl font-serif text-[#C5A059]">100%</span>
                <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider">Solid Walnut</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl lg:text-3xl font-serif text-[#C5A059]">0</span>
                <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider">Visible Cables</span>
              </div>
            </div>

            <div className="mt-8 lg:mt-10">
              <a href="https://wa.me/96181773588?text=Hi!%20I%27d%20love%20to%20discuss%20a%20custom%20project%20like%20the%20Achrafieh%20Penthouse." target="_blank" rel="noopener noreferrer">
                <Button variant="outline" icon={ArrowRight}>Discuss Your Project</Button>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-3 lg:gap-4 w-full">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img src="/ops/OP1.avif" alt="Custom TV unit installation" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500" loading="lazy" />
            </div>
            <div className="flex flex-col gap-3 lg:gap-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src="/ops/OP19.avif" alt="Dining table craftsmanship" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500" loading="lazy" />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src="/ops/OP17.avif" alt="Wall panel detail" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
RealHomesProject.displayName = 'RealHomesProject';

// --- 4.6 Service Strip - Interactive Journey Selector ---
const ServiceStrip = memo(() => {
  const [activeService, setActiveService] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const services = [
    {
      ...SERVICE_PATHS[0],
      step: '01',
      gradient: 'from-amber-500 to-orange-600',
      bgPattern: 'radial-gradient(circle at 30% 70%, rgba(197,160,89,0.1) 0%, transparent 50%)',
      features: ['Ready to ship', '2-5 day delivery', 'Full catalog access']
    },
    {
      ...SERVICE_PATHS[1],
      step: '02',
      gradient: 'from-emerald-500 to-teal-600',
      bgPattern: 'radial-gradient(circle at 70% 30%, rgba(16,185,129,0.1) 0%, transparent 50%)',
      features: ['Your dimensions', 'Same design', 'Perfect fit']
    },
    {
      ...SERVICE_PATHS[2],
      step: '03',
      gradient: 'from-violet-500 to-purple-600',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 50%)',
      features: ['Home visit', 'Full room design', 'Professional installation']
    }
  ];

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleClick = (e, service) => {
    if (service.href.startsWith('#')) {
      e.preventDefault();
      document.getElementById(service.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAFAFA] to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1C1B1A] mb-4">
            Choose Your Journey
          </h2>
          <p className="text-[#666] max-w-xl mx-auto">
            Three paths to your perfect piece — from ready-made to fully custom
          </p>
        </div>

        {/* Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = activeService === index;
            const isExternal = service.href.startsWith('http');

            return (
              <div
                key={service.id}
                className="group relative"
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
                onMouseMove={(e) => handleMouseMove(e, index)}
              >
                {/* Card */}
                <div
                  className={`relative h-full bg-white rounded-3xl border-2 transition-all duration-500 overflow-hidden ${isActive
                    ? 'border-[#C5A059] shadow-2xl shadow-[#C5A059]/20 scale-[1.02]'
                    : 'border-[#E5E5E5] hover:border-[#C5A059]/50'
                    }`}
                  style={{ backgroundImage: service.bgPattern }}
                >
                  {/* Spotlight effect */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(197,160,89,0.3) 0%, transparent 50%)`
                      }}
                    />
                  )}

                  {/* Step number */}
                  <div className={`absolute top-6 right-6 text-6xl font-serif font-bold transition-all duration-500 ${isActive ? 'text-[#C5A059]/30 scale-110' : 'text-[#E5E5E5]'}`}>
                    {service.step}
                  </div>

                  {/* Content */}
                  <div className="relative p-8 pt-12">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-[#C5A059] text-white rotate-6 scale-110' : 'bg-[#F9F8F6] text-[#1C1B1A]'}`}>
                      <Icon size={28} />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-serif text-[#1C1B1A] mb-3">{service.title}</h3>
                    <p className="text-sm text-[#666] mb-6 leading-relaxed">{service.desc}</p>

                    {/* Features - slide in on hover */}
                    <div className={`space-y-2 mb-8 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#1C1B1A]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <a
                      href={service.href}
                      onClick={(e) => handleClick(e, service)}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-500 ${isActive
                        ? 'bg-[#1C1B1A] text-white'
                        : 'bg-[#F9F8F6] text-[#1C1B1A] group-hover:bg-[#1C1B1A] group-hover:text-white'
                        }`}
                    >
                      {service.action}
                      <ArrowRight size={16} className={`transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`} />
                    </a>
                  </div>

                  {/* Bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* Connection line to next card */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 w-8 lg:w-12 h-px bg-gradient-to-r from-[#E5E5E5] to-transparent z-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-sm text-[#666] mb-4">Not sure which is right for you?</p>
          <a
            href="https://wa.me/96181773588?text=Hi!%20I%20need%20help%20choosing%20the%20right%20service%20for%20my%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#C5A059] font-bold hover:text-[#1C1B1A] transition-colors"
          >
            <MessageCircle size={18} />
            Chat with us — we'll guide you
          </a>
        </div>
      </div>
    </section>
  );
});
ServiceStrip.displayName = 'ServiceStrip';

// --- 4.7 Footer ---
const Footer = memo(() => {
  return (
    <footer className="bg-white text-[#1C1B1A] pt-12 md:pt-24 pb-6 md:pb-10 border-t border-[#E5E5E5]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Contact Grid */}
        <div id="contact" className="mb-8 md:mb-16">
          <FooterContactGrid />
        </div>

        {/* Social Row - horizontal scroll on mobile */}
        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <a
            href="https://www.instagram.com/instyle.modernwoodart/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E5E5E5] active:border-[#C5A059] active:bg-[#F9F8F6] transition-colors shrink-0 touch-state"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#C5A059]"><Instagram size={18} /></div>
            <span className="text-xs font-medium tracking-widest uppercase text-[#666]">Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/instylemodernwoodart"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="group flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E5E5E5] active:border-[#C5A059] active:bg-[#F9F8F6] transition-colors shrink-0 touch-state"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#C5A059]"><Facebook size={18} /></div>
            <span className="text-xs font-medium tracking-widest uppercase text-[#666]">Facebook</span>
          </a>
        </div>

        <div className="border-t border-[#E5E5E5] pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#999] uppercase tracking-widest text-center gap-2">
          <p>© 2025 InStyle Modern Wood Art. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = 'Footer';

// --- 4.8 Contact Components ---
// Reusable contact card (clean version)
const ContactCard = ({ href, icon: Icon, title, label, external = false, copyValue, onCopy, variant }) => {
  const Tag = href ? 'a' : 'div';
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue).then(() => {
      setCopied(true);
      onCopy && onCopy(copyValue);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <Tag
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group relative flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border border-[#E5E5E5] active:border-[#C5A059] active:bg-white transition-all cursor-pointer bg-white active:shadow-lg touch-state"
    >
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all bg-[#C5A059] text-white shadow-sm shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex flex-col flex-1 min-w-0 pr-6 md:pr-8">
        <span className="text-sm font-medium text-[#1C1B1A] truncate">{title}</span>
        <span className="text-[10px] uppercase tracking-widest text-[#999]">{label}</span>
      </div>
      <ArrowRight size={16} className="absolute right-4 text-[#C5A059]" />
      {copyValue && (
        <button
          onClick={handleCopy}
          className="absolute top-2 md:top-3 right-10 md:right-12 w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E5E5] text-[#666] active:text-[#C5A059] active:border-[#C5A059] bg-white text-[10px] touch-btn"
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </Tag>
  );
};

// Footer contact grid (4 cards + hours + toast)
const FooterContactGrid = () => {
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const update = () => {
      const beirut = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
      const h = beirut.getHours();
      setOpen(h >= 10 && h < 19);
    };
    update();
    const id = setInterval(update, 600000); // every 10 minutes
    return () => clearInterval(id);
  }, []);

  const pushToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
        <ContactCard onCopy={pushToast} copyValue="https://maps.app.goo.gl/vhtHmwwqjrUgQMb66" href="https://maps.app.goo.gl/vhtHmwwqjrUgQMb66" icon={MapPin} title="Hadath, Al Jamous Street" label="Location" external />
        <ContactCard onCopy={pushToast} copyValue="+961 81 773 588" href="tel:+96181773588" icon={Phone} title="+961 81 773 588" label="Mobile" />
        <ContactCard variant="whatsapp" onCopy={pushToast} copyValue="+961 81 773 588" href="https://wa.me/96181773588" icon={MessageCircle} title="+961 81 773 588" label="WhatsApp" external />
        <ContactCard onCopy={pushToast} copyValue="instyle.lebanon@gmail.com" href="mailto:instyle.lebanon@gmail.com" icon={Mail} title="instyle.lebanon@gmail.com" label="Email" />
      </div>
      <div className="p-4 md:p-5 rounded-xl border border-[#E5E5E5] bg-[#F9F8F6] flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#C5A059] text-white shadow-sm shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#1C1B1A]">Mon – Sat: 10am – 7pm</span>
            <span className="text-[10px] uppercase tracking-widest text-[#999]">Hours</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg ${open ? 'bg-[#25D366] text-white' : 'bg-[#1C1B1A] text-white'}`}>{open ? 'Open Now' : 'Closed'}</span>
      </div>
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-[#1C1B1A] text-white text-xs px-4 py-3 rounded-xl shadow-lg z-50 text-center">
          Copied: {toast}
        </div>
      )}
    </div>
  );
};

// --- 4.9 Floating Actions ---
const FloatingActions = memo(({ onOpenCart, cartCount }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Check if we're on a product/art detail page (where we show MobileFloatingCTA)
  const isDetailPage = location.pathname.startsWith('/product/') || location.pathname.startsWith('/art/');

  React.useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      style={{
        position: 'fixed',
        right: 'calc(16px + env(safe-area-inset-right, 0px))',
        bottom: isDetailPage
          ? 'calc(100px + env(safe-area-inset-bottom, 0px))'
          : 'calc(24px + env(safe-area-inset-bottom, 0px))',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {/* WhatsApp - always visible */}
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform whatsapp-pulse touch-btn"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} />
      </a>

      {/* Cart button - hidden on mobile detail pages */}
      <button
        onClick={onOpenCart}
        className={`w-12 h-12 bg-[#1C1B1A] text-[#C5A059] rounded-full items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform touch-btn ${isDetailPage ? 'hidden md:flex' : 'flex'
          }`}
        title="View Project Bag"
        aria-label={`View cart with ${cartCount} items`}
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center badge-animate">
            {cartCount}
          </span>
        )}
      </button>

      {/* Scroll to Top - appears when scrolled */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 bg-white/95 backdrop-blur-md text-[#1C1B1A] border border-[#E5E5E5] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all touch-btn"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ChevronRight size={18} className="-rotate-90" />
        </button>
      )}
    </div>
  );
});
FloatingActions.displayName = 'FloatingActions';

// ==========================================
// 5. MAIN APP
// ==========================================

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('instyle:cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartBadgeKey, setCartBadgeKey] = useState(0);

  // Toast notifications
  const { toasts, dismissToast, showCartToast, showFavoriteToast, showSuccessToast } = useToast();

  // Recently viewed items
  const { recentItems, addItem: addRecentItem } = useRecentlyViewed();

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('instyle:cart', JSON.stringify(cartItems));
    } catch { }
  }, [cartItems]);
  const navigate = useNavigate();
  const location = useLocation();

  // favorites count for navbar badge
  const [favCount, setFavCount] = useState(() => {
    try { const raw = localStorage.getItem('instyle:favorites'); return raw ? Object.keys(JSON.parse(raw)).length : 0; } catch { return 0; }
  });

  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);

  useEffect(() => {
    const onFav = (e) => setFavCount(e && e.detail && typeof e.detail.count === 'number' ? e.detail.count : (() => {
      try { const raw = localStorage.getItem('instyle:favorites'); return raw ? Object.keys(JSON.parse(raw)).length : 0; } catch { return 0; }
    })());
    window.addEventListener('instyle:favorites-updated', onFav);
    return () => window.removeEventListener('instyle:favorites-updated', onFav);
  }, []);

  // listen for add-to-cart events from CategoryPage
  useEffect(() => {
    const onAddToCart = (e) => {
      if (e.detail) addToCart(e.detail);
    };
    window.addEventListener('instyle:add-to-cart', onAddToCart);
    return () => window.removeEventListener('instyle:add-to-cart', onAddToCart);
  }, [cartItems]);

  // update document title based on route
  useEffect(() => {
    const p = location.pathname;
    if (p === '/arts') {
      document.title = 'InStyle — Arts Collection';
    } else if (p === '/arts/oil-paintings' || p === '/paintings') {
      document.title = 'InStyle — Oil Paintings';
    } else if (p === '/arts/prints') {
      document.title = 'InStyle — Framed Prints';
    } else if (p.startsWith('/art/')) {
      document.title = 'InStyle — Artwork Details';
    } else {
      document.title = 'InStyle — Modern Carpentry & Art';
    }
  }, [location.pathname]);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Trigger badge animation
    setCartBadgeKey(prev => prev + 1);
    // Show toast notification
    showCartToast(product.name, product.image);
  }, [showCartToast]);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans selection:bg-[#C5A059] selection:text-white bg-white text-[#2C2C2C]">
        <ScrollProgress />
        <Navbar cartCount={cartItems.length} favCount={favCount} onOpenCart={() => setCartOpen(true)} navigate={navigate} openFavorites={() => setFavoritesDrawerOpen(true)} cartBadgeKey={cartBadgeKey} />
        <QuoteBuilder isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={removeFromCart} navigate={navigate} />

        <main className="page-transition">
          <Routes>
            <Route path="/ratings" element={<Suspense fallback={<PageLoader />}><RatingsPage /></Suspense>} />
            <Route path="/arts" element={<ArtsLandingPage navigate={navigate} />} />
            <Route path="/arts/oil-paintings" element={<PaintingsPage navigate={navigate} />} />
            <Route path="/arts/prints" element={<PrintsPage navigate={navigate} />} />
            <Route path="/art/:artId" element={<ArtDetailPage navigate={navigate} onAddToCart={addToCart} onAddRecent={addRecentItem} showToast={showFavoriteToast} />} />
            <Route path="/paintings" element={<PaintingsPage navigate={navigate} />} />
            <Route path="/favorites" element={<FavoritesPage navigate={navigate} />} />
            <Route path="/category/:categoryId" element={<CategoryPage navigate={navigate} />} />
            <Route path="/product/:productId" element={<ProductDetailPage navigate={navigate} onAddToCart={addToCart} onAddRecent={addRecentItem} showToast={showFavoriteToast} />} />
            <Route path="/checkout" element={<CheckoutPage navigate={navigate} cartItems={cartItems} onUpdateCart={updateCartQuantity} onRemoveItem={removeFromCart} onClearCart={() => setCartItems([])} />} />
            <Route
              path="/"
              element={
                <>
                  <VideoHero />
                  <TrustBar />
                  <CollectionsSection onAddToCart={addToCart} navigate={navigate} />
                  <RealHomesProject />
                  <InstyleArts navigate={navigate} />
                  <ServiceStrip />
                </>
              }
            />
            <Route path="*" element={<NotFoundPage navigate={navigate} />} />
          </Routes>
        </main>

        <FavoritesDrawer open={favoritesDrawerOpen} onClose={() => setFavoritesDrawerOpen(false)} navigate={navigate} />

        <Footer />
        <FloatingActions onOpenCart={() => setCartOpen(true)} cartCount={cartItems.length} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
