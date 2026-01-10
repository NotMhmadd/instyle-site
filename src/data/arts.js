// Central arts data index
// Organizes all art categories: Oil Paintings, Prints, and (future) Decorations

import { PAINTINGS } from './paintings';
import { PRINTS } from './prints';

// Art Categories with metadata
export const ART_CATEGORIES = [
  {
    id: 'oil-paintings',
    name: 'Oil Paintings',
    shortName: 'Paintings',
    description: 'Original hand-drawn oil paintings on canvas. Each piece is unique and crafted with care.',
    tagline: 'Hand-drawn oil on canvas',
    path: '/arts/oil-paintings',
    image: PAINTINGS[0]?.image,
    count: PAINTINGS.length,
    available: true,
  },
  {
    id: 'prints',
    name: 'Framed Prints',
    shortName: 'Prints',
    description: 'High-quality framed prints in various sizes. Perfect for any space.',
    tagline: 'Premium framed prints',
    path: '/arts/prints',
    image: PRINTS[0]?.image,
    count: PRINTS.length,
    available: true,
  },
  {
    id: 'decorations',
    name: 'Decorations',
    shortName: 'Decor',
    description: 'Crafty accessories, metal pieces, and unique decor items coming soon.',
    tagline: 'Artisanal decor pieces',
    path: '/arts/decorations',
    image: null, // No image yet
    count: 0,
    available: false, // Coming soon
    comingSoon: true,
  },
];

// Helper to get category by ID
export const getArtCategory = (id) => ART_CATEGORIES.find(cat => cat.id === id);

// Helper to get all available categories
export const getAvailableCategories = () => ART_CATEGORIES.filter(cat => cat.available);

// Re-export individual collections
export { PAINTINGS } from './paintings';
export { PRINTS } from './prints';

export default ART_CATEGORIES;
