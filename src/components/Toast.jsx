import React, { useEffect, useState } from 'react';
import { Check, Heart, ShoppingBag, X, AlertCircle, Info } from 'lucide-react';

// Toast types with their icons and colors
const TOAST_TYPES = {
  success: {
    icon: Check,
    bgColor: 'bg-[#1C1B1A]',
    iconBg: 'bg-[#25D366]',
    iconColor: 'text-white'
  },
  cart: {
    icon: ShoppingBag,
    bgColor: 'bg-[#1C1B1A]',
    iconBg: 'bg-[#C5A059]',
    iconColor: 'text-white'
  },
  favorite: {
    icon: Heart,
    bgColor: 'bg-[#1C1B1A]',
    iconBg: 'bg-red-500',
    iconColor: 'text-white'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-600',
    iconBg: 'bg-white',
    iconColor: 'text-red-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-[#1C1B1A]',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white'
  }
};

// Individual Toast component
const ToastItem = ({ id, message, type = 'success', image, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = TOAST_TYPES[type] || TOAST_TYPES.success;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={`
        ${config.bgColor} text-white px-4 py-3 rounded-xl shadow-2xl
        flex items-center gap-3 min-w-[280px] max-w-[380px]
        transform transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
      style={{
        animation: isExiting ? '' : 'toast-enter 0.4s cubic-bezier(0.21, 1.02, 0.73, 1) forwards'
      }}
    >
      {/* Product image or icon */}
      {image ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/20">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center shrink-0`}>
          <Icon size={20} className={config.iconColor} />
        </div>
      )}

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Container - renders at bottom of screen
export const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', image = null) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, image }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showCartToast = (productName, image) => {
    addToast(`${productName} added to project`, 'cart', image);
  };

  const showFavoriteToast = (productName, added = true) => {
    addToast(
      added ? `${productName} added to favorites` : `${productName} removed from favorites`,
      'favorite'
    );
  };

  const showSuccessToast = (message) => {
    addToast(message, 'success');
  };

  const showErrorToast = (message) => {
    addToast(message, 'error');
  };

  return {
    toasts,
    dismissToast,
    addToast,
    showCartToast,
    showFavoriteToast,
    showSuccessToast,
    showErrorToast
  };
};

export default ToastContainer;
