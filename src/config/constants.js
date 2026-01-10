// Site-wide constants and configuration

export const CONTACT = {
  whatsapp: '96181773588',
  whatsappFormatted: '+961 81 773 588',
  email: 'instyle.lebanon@gmail.com',
};

export const STORAGE_KEYS = {
  favorites: 'instyle:favorites',
  cart: 'instyle:cart',
  recentlyViewed: 'instyle:recent',
};

export const getWhatsAppUrl = (message) => {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
};
