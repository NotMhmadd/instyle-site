import React from 'react';
import { ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { CONTACT, getWhatsAppUrl } from '../config/constants';

// Mobile floating CTA bar for product/art detail pages
const MobileFloatingCTA = ({ 
  price, 
  onAddToCart, 
  onWhatsApp, 
  onFavorite,
  isFavorite = false,
  productName = 'this item',
  showAddToCart = true  // Hide cart button for art items (inquiry-only)
}) => {
  const whatsappMessage = `Hi! I'm interested in "${productName}". Can you tell me more about pricing and availability?`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden floating-cta">
      {/* Blur backdrop effect */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-[#E5E5E5]" />
      
      <div className="relative flex items-center gap-3 px-4 py-3 safe-area-bottom">
        {/* Price section */}
        <div className="shrink-0 min-w-[80px]">
          <p className="text-[10px] text-[#999] uppercase tracking-wider font-medium">Price</p>
          <p className="text-xl font-serif text-[#C5A059] font-bold leading-tight">${price?.toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="flex-1 flex items-center gap-2 justify-end">
          {/* Favorite button with haptic feedback style */}
          <button
            onClick={onFavorite}
            className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90 touch-btn ${
              isFavorite 
                ? 'border-red-300 bg-red-50 text-red-500' 
                : 'border-[#E5E5E5] text-[#666] active:border-[#C5A059] active:bg-[#C5A059]/5'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={22} className={isFavorite ? 'fill-red-500' : ''} strokeWidth={2} />
          </button>

          {/* WhatsApp button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${showAddToCart ? 'w-12' : 'flex-1 max-w-[200px]'} h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center gap-2 transition-all active:scale-95 active:bg-[#128C7E] shadow-lg shadow-[#25D366]/30 touch-btn`}
            aria-label="Inquire on WhatsApp"
          >
            <MessageCircle size={22} strokeWidth={2} />
            {!showAddToCart && <span className="font-bold uppercase text-xs tracking-wider">Inquire</span>}
          </a>

          {/* Add to Cart button - only show for products, not art */}
          {showAddToCart && (
            <button
              onClick={onAddToCart}
              className="flex-1 max-w-[160px] h-12 bg-[#1C1B1A] text-white font-bold uppercase text-xs tracking-wider rounded-2xl active:bg-[#C5A059] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg touch-btn"
            >
              <ShoppingBag size={18} strokeWidth={2} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileFloatingCTA;
