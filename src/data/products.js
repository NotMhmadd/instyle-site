// Products & Categories Data
// Consolidated for use across all components

import TV1 from '../../images/TV1.webp';
import Table1 from '../../images/Table1.webp';
import Table2 from '../../images/Table2.webp';
import Sofa1 from '../../images/Sofa1.webp';
import Beds1 from '../../images/Beds1.webp';
import Dinning1 from '../../images/Dinning1.webp';
import Wall1 from '../../images/Wall1.webp';
import Wall2 from '../../images/Wall2.webp';
import Mirror1 from '../../images/Mirror1.webp';
import OP18 from '../../images/OP18.avif';

// New Image Imports
import Bedroom_1 from '../../images/Bedroom_1.webp';
import Bedroom_2 from '../../images/Bedroom_2.webp';
import Bedroom_3 from '../../images/Bedroom_3.webp';
import Bedroom_4 from '../../images/Bedroom_4.webp';
import Bedroom_5 from '../../images/Bedroom_5.webp';

import Tv_1 from '../../images/Tv_1.webp';
import Tv_2 from '../../images/Tv_2.webp';
import Tv_3 from '../../images/Tv_3.webp';
import Tv_4 from '../../images/Tv_4.webp';
import Tv_5 from '../../images/Tv_5.webp';
import Tv_6 from '../../images/Tv_6.webp';
import Tv_7 from '../../images/Tv_7.webp';
import Tv_8 from '../../images/Tv_8.webp';
import Tv_9 from '../../images/Tv_9.webp';
import Tv_10 from '../../images/Tv_10.webp';
import Tv_11 from '../../images/Tv_11.webp';

import S_1 from '../../images/S_1.webp';
import S_2 from '../../images/S_2.webp';
import S_3 from '../../images/S_3.webp';
import S_4 from '../../images/S_4.webp';
import S_5 from '../../images/S_5.webp';
import S_6 from '../../images/S_6.webp';

import Table_1 from '../../images/Table_1.webp';
import Table_2 from '../../images/Table_2.webp';
import Table_3 from '../../images/Table_3.webp';
import Table_4 from '../../images/Table_4.webp';
import Table_5 from '../../images/Table_5.webp';
import Table_6 from '../../images/Table_6.webp';
import Table_7 from '../../images/Table_7.webp';

import C_1 from '../../images/C_1.webp';
import C_2 from '../../images/C_2.webp';
import C_3 from '../../images/C_3.webp';
import C_4 from '../../images/C_4.webp';
import C_5 from '../../images/C_5.webp';
import C_6 from '../../images/C_6.webp';
import C_7 from '../../images/C_7.webp';
import C_7_1 from '../../images/C_7.1.webp';
import C_8 from '../../images/C_8.webp';
import C_9 from '../../images/C_9.webp';

import Dining_1 from '../../images/Dining_1.webp';
import Dining_2 from '../../images/Dining_2.webp';

import CH_1 from '../../images/CH_1.webp';
import CH_2 from '../../images/CH_2.webp';

export const CATEGORIES = [
  { id: 'bedrooms', name: 'Bedrooms', image: Bedroom_1 },
  { id: 'tv-units', name: 'TV Units', image: Tv_1 },
  { id: 'sofas', name: 'Sofas', image: S_1 },
  { id: 'tables', name: 'Tables', image: Table_1 },
  { id: 'consoles', name: 'Consoles', image: C_1 },
  { id: 'dining-tables', name: 'Dinning Tables', image: Dining_1 },
  { id: 'chairs', name: 'Chairs', image: CH_1 },
  { id: 'wall-cladding', name: 'Wall Cladding', image: Wall1 },
];

// All products organized by category
export const CATEGORY_PRODUCTS = {
  'bedrooms': [
    { id: 1001, name: 'Premium Master Suite', price: 1450, image: Bedroom_1, tag: 'Premium', category: 'Bedrooms', categoryId: 'bedrooms', description: 'A luxurious master bedroom set featuring a grand headboard and integrated nightstands.' },
    { id: 1002, name: 'Modern Bed Frame', price: 780, image: Bedroom_2, tag: 'New', category: 'Bedrooms', categoryId: 'bedrooms', description: 'Clean lines and natural wood textures define this contemporary sleeping solution.' },
    { id: 1003, name: 'Classic Bed Frame', price: 950, image: Bedroom_3, tag: null, category: 'Bedrooms', categoryId: 'bedrooms', description: 'Spacious wardrobe crafted from aromatic cedar with traditional joinery.' },
    { id: 1004, name: 'Modern Vanity Set', price: 580, image: Bedroom_4, tag: 'Popular', category: 'Bedrooms', categoryId: 'bedrooms', description: 'A sophisticated vanity with a large mirror and ample storage for essentials.' },
    { id: 1005, name: 'Standard Bed Frame', price: 520, image: Bedroom_5, tag: null, category: 'Bedrooms', categoryId: 'bedrooms', description: 'Perfect for smaller rooms, offering comfort and style without compromise.' },
  ],
  'tv-units': [
    { id: 2001, name: 'Levant Floating Console', price: 320, image: Tv_1, tag: 'Best Seller', category: 'TV Units', categoryId: 'tv-units', description: 'Sleek floating design that hides all cables for a clean, modern look.' },
    { id: 2002, name: 'Rustic TV Stand', price: 160, image: Tv_2, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'A robust combination of solid wood and industrial metal accents.' },
    { id: 2003, name: 'Floating TV Board', price: 99, image: Tv_3, tag: 'New', category: 'TV Units', categoryId: 'tv-units', description: 'Low-profile unit perfect for large screens and minimalist interiors.' },
    { id: 2004, name: 'Custom TV Center', price: 380, image: Tv_4, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'A grand piece with plenty of storage for media, books, and decor.' },
    { id: 2005, name: 'Modern Media Unit', price: 288, image: Tv_5, tag: 'Popular', category: 'TV Units', categoryId: 'tv-units', description: 'Features beautiful vertical slats that allow remote signals to pass through.' },
    { id: 2006, name: 'Simple TV Shelf', price: 88, image: Tv_6, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'Designed to fit perfectly in corners, maximizing space in smaller rooms.' },
    { id: 2007, name: 'Marble Top Media Unit', price: 520, image: Tv_7, tag: 'Premium', category: 'TV Units', categoryId: 'tv-units', description: 'Exquisite walnut base topped with premium Italian marble.' },
    { id: 2008, name: 'Standard TV Bench', price: 195, image: Tv_8, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'Warm, rustic charm with plenty of character and storage.' },
    { id: 2009, name: 'Black TV Console', price: 350, image: Tv_9, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'Modern black oak finish with smoked glass doors.' },
    { id: 2010, name: 'Decorative TV Console', price: 420, image: Tv_10, tag: 'New', category: 'TV Units', categoryId: 'tv-units', description: 'Elegant Art Deco inspired design with gold hardware.' },
    { id: 2011, name: 'Simple TV Bench', price: 245, image: Tv_11, tag: null, category: 'TV Units', categoryId: 'tv-units', description: 'Simple, functional, and beautiful Scandinavian design.' },
  ],
  'sofas': [
    { id: 3001, name: 'Velvet Sectional', price: 780, dimensions: '320 x 240 cm', image: S_1, tag: 'Best Seller', material: 'Velvet', category: 'Sofas', categoryId: 'sofas', description: 'Ultra-soft velvet sectional that offers unparalleled comfort and style.' },
    { id: 3002, name: 'L-Shape Sofa', price: 650, dimensions: '220 x 95 cm', image: S_2, tag: 'Premium', material: 'Top Grain Leather', category: 'Sofas', categoryId: 'sofas', description: 'Timeless leather sofa that ages beautifully and fits any decor.' },
    { id: 3003, name: 'Modern Linen Sofa', price: 520, dimensions: '240 x 100 cm', image: S_3, tag: 'New', material: 'Linen', category: 'Sofas', categoryId: 'sofas', description: 'Breathable linen fabric and deep cushions for a relaxed, airy feel.' },
    { id: 3004, name: 'Compact 2-Seater', price: 380, dimensions: '160 x 85 cm', image: S_4, tag: null, material: 'Cotton Blend', category: 'Sofas', categoryId: 'sofas', description: 'Perfect for apartments or as an accent piece in larger rooms.' },
    { id: 3005, name: 'Modular Cloud Sofa', price: 920, dimensions: 'Custom', image: S_5, tag: 'Popular', material: 'Performance Fabric', category: 'Sofas', categoryId: 'sofas', description: 'Fully modular system that can be configured to fit any space.' },
    { id: 3006, name: 'Tufted Sofa', price: 580, dimensions: '210 x 90 cm', image: S_6, tag: null, material: 'Velvet', category: 'Sofas', categoryId: 'sofas', description: 'Elegant tufted backrest and rolled arms for a classic look.' },
  ],
  'tables': [
    { id: 4001, name: 'Standard Coffee Table', price: 165, image: Table_1, tag: 'Best Seller', category: 'Tables', categoryId: 'tables', description: 'A sturdy and beautiful coffee table that anchors your living room.' },
    { id: 4002, name: 'Trio Nesting Set', price: 280, image: Table_2, tag: 'New', category: 'Tables', categoryId: 'tables', description: 'Versatile nesting tables that can be used together or separately.' },
    { id: 4003, name: 'Premium Coffee Table', price: 220, image: Table_3, tag: null, category: 'Tables', categoryId: 'tables', description: 'Elegant round table with a marble top and solid wood base.' },
    { id: 4004, name: 'Square Coffee Table', price: 145, image: Table_4, tag: null, category: 'Tables', categoryId: 'tables', description: 'Compact side table with a rugged industrial aesthetic.' },
    { id: 4005, name: 'Sequoia Table', price: 380, image: Table_5, tag: 'Premium', category: 'Tables', categoryId: 'tables', description: 'Unique live edge slab that brings the beauty of nature indoors.' },
    { id: 4006, name: 'Modern Coffee Table', price: 185, image: Table_6, tag: 'Popular', category: 'Tables', categoryId: 'tables', description: 'Slim profile table perfect for entryways or behind sofas.' },
    { id: 4007, name: 'Bistro Table', price: 250, image: Table_7, tag: null, category: 'Tables', categoryId: 'tables', description: 'Modern bistro table for small dining areas or balconies.' },
  ],
  'consoles': [
    { id: 5001, name: 'Premium Entry Console', price: 320, image: C_1, tag: 'Best Seller', category: 'Consoles', categoryId: 'consoles', description: 'A beautiful first impression for your home with ample storage.' },
    { id: 5002, name: 'Mirror Console', price: 225, image: C_2, tag: 'Premium', category: 'Consoles', categoryId: 'consoles', description: 'Reflective surfaces that make your entryway feel larger and brighter.' },
    { id: 5003, name: 'Rustic Hall Table', price: 280, image: C_3, tag: null, category: 'Consoles', categoryId: 'consoles', description: 'Warm and inviting rustic table with a distressed finish.' },
    { id: 5004, name: 'Modern Hallway Table', price: 250, image: C_4, tag: 'New', category: 'Consoles', categoryId: 'consoles', description: 'Ultra-slim design for tight spaces and modern interiors.' },
    { id: 5005, name: 'Carved Wooden Console', price: 420, image: C_5, tag: null, category: 'Consoles', categoryId: 'consoles', description: 'Intricately carved details for a touch of traditional elegance.' },
    { id: 5006, name: 'Retro Console', price: 295, image: C_6, tag: 'Popular', category: 'Consoles', categoryId: 'consoles', description: 'Iconic mid-century design with tapered legs and clean lines.' },
    { id: 5007, name: 'Minimalist Hall Table', price: 145, image: C_7, tag: null, category: 'Consoles', categoryId: 'consoles', description: 'Combines open shelving with closed storage for versatility.' },
    { id: 5009, name: 'Dark Wood Console', price: 330, image: C_8, tag: null, category: 'Consoles', categoryId: 'consoles', description: 'Sleek black finish that adds drama and sophistication.' },
    { id: 5010, name: 'Simple Hall Table', price: 195, image: C_9, tag: null, category: 'Consoles', categoryId: 'consoles', description: 'Simple, clean, and functional Scandinavian design.' },
  ],
  'dining-tables': [
    { id: 6001, name: 'Large Banquet Table', price: 650, image: Dining_1, tag: 'Premium', category: 'Dinning Tables', categoryId: 'dining-tables', description: 'An impressive table that seats up to 12 guests for grand gatherings.' },
    { id: 6002, name: 'Standard Dining Table', price: 420, image: Dining_2, tag: 'Best Seller', category: 'Dinning Tables', categoryId: 'dining-tables', description: 'The perfect centerpiece for daily family meals and conversations.' },
  ],
  'chairs': [
    { id: 7001, name: 'Velvet Chair', price: 120, image: CH_1, tag: 'Popular', category: 'Chairs', categoryId: 'chairs', description: 'Comfortable and stylish dining chair with premium velvet upholstery.' },
    { id: 7002, name: 'Accent Chair', price: 195, image: CH_2, tag: 'New', category: 'Chairs', categoryId: 'chairs', description: 'A statement accent chair that adds comfort and style to any corner.' },
  ],
  'wall-cladding': [
    { id: 501, name: 'Wall Paneling', price: 220, unit: '/sqm', image: Wall1, tag: null, category: 'Wall Cladding', categoryId: 'wall-cladding', description: 'Transform any wall into a statement piece with our signature wood paneling. Easy to install, these panels add warmth and texture while providing excellent acoustic properties.' },
    { id: 502, name: 'Slat Wall Panel', price: 195, unit: '/sqm', image: Wall2, tag: 'Popular', category: 'Wall Cladding', categoryId: 'wall-cladding', description: 'Contemporary vertical slat design creates depth and visual interest. Perfect for feature walls in living rooms or bedrooms.' },
  ],
};

// Flat array of all products for easy lookup
export const ALL_PRODUCTS = Object.values(CATEGORY_PRODUCTS).flat();

// Legacy PRODUCTS array for backwards compatibility (now synced with CATEGORY_PRODUCTS)
export const PRODUCTS = ALL_PRODUCTS;

export default PRODUCTS;
