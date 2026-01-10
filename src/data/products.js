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
  { id: 'bedrooms', name: 'Bedrooms', image: Beds1 },
  { id: 'tv-units', name: 'TV Units', image: TV1 },
  { id: 'sofas', name: 'Sofas', image: Sofa1 },
  { id: 'tables', name: 'Tables', image: Table1 },
  { id: 'consoles', name: 'Consoles', image: Table2 },
  { id: 'dining-tables', name: 'Dinning Tables', image: Dinning1 },
  { id: 'chairs', name: 'Chairs', image: Mirror1 },
  { id: 'wall-cladding', name: 'Wall Cladding', image: Wall1 },
];

// All products organized by category
export const CATEGORY_PRODUCTS = {
  'bedrooms': [
    { id: 1001, name: 'Phoenician Master Suite', price: 4200, dimensions: 'Custom', image: Bedroom_1, tag: 'Premium', material: 'Walnut', category: 'Bedrooms', categoryId: 'bedrooms', description: 'A luxurious master bedroom set featuring a grand headboard and integrated nightstands, inspired by ancient Phoenician craftsmanship.' },
    { id: 1002, name: 'Zenith Oak Bed', price: 2400, dimensions: '200 x 180 cm', image: Bedroom_2, tag: 'New', material: 'Oak', category: 'Bedrooms', categoryId: 'bedrooms', description: 'Clean lines and natural wood textures define this contemporary sleeping solution.' },
    { id: 1003, name: 'Lebanon Cedar Bed', price: 3200, dimensions: '240 x 60 x 220 cm', image: Bedroom_3, tag: null, material: 'Cedar', category: 'Bedrooms', categoryId: 'bedrooms', description: 'Spacious wardrobe crafted from aromatic cedar with traditional joinery.' },
    { id: 1004, name: 'Aura Vanity Set', price: 1800, dimensions: '120 x 45 cm', image: Bedroom_4, tag: 'Popular', material: 'Maple', category: 'Bedrooms', categoryId: 'bedrooms', description: 'A sophisticated vanity with a large mirror and ample storage for essentials.' },
    { id: 1005, name: 'Urban Guest Bed', price: 2100, dimensions: 'Custom', image: Bedroom_5, tag: null, material: 'Pine', category: 'Bedrooms', categoryId: 'bedrooms', description: 'Perfect for smaller rooms, offering comfort and style without compromise.' },
  ],
  'tv-units': [
    { id: 2001, name: 'Levant Floating Unit', price: 1400, dimensions: '200 x 40 cm', image: Tv_1, tag: 'Best Seller', material: 'Walnut', category: 'TV Units', categoryId: 'tv-units', description: 'Sleek floating design that hides all cables for a clean, modern look.' },
    { id: 2002, name: 'Titan Industrial Stand', price: 1100, dimensions: '180 x 45 cm', image: Tv_2, tag: null, material: 'Oak & Steel', category: 'TV Units', categoryId: 'tv-units', description: 'A robust combination of solid wood and industrial metal accents.' },
    { id: 2003, name: 'Horizon Lowboard', price: 950, dimensions: '160 x 35 cm', image: Tv_3, tag: 'New', material: 'Ash', category: 'TV Units', categoryId: 'tv-units', description: 'Low-profile unit perfect for large screens and minimalist interiors.' },
    { id: 2004, name: 'Estate Media Center', price: 2200, dimensions: '240 x 50 cm', image: Tv_4, tag: null, material: 'Cherry', category: 'TV Units', categoryId: 'tv-units', description: 'A grand piece with plenty of storage for media, books, and decor.' },
    { id: 2005, name: 'Rhythm Slat Unit', price: 1350, dimensions: '190 x 42 cm', image: Tv_5, tag: 'Popular', material: 'Oak', category: 'TV Units', categoryId: 'tv-units', description: 'Features beautiful vertical slats that allow remote signals to pass through.' },
    { id: 2006, name: 'Vantage Corner Stand', price: 850, dimensions: '120 x 40 cm', image: Tv_6, tag: null, material: 'Pine', category: 'TV Units', categoryId: 'tv-units', description: 'Designed to fit perfectly in corners, maximizing space in smaller rooms.' },
    { id: 2007, name: 'Carrara Media Unit', price: 2800, dimensions: '220 x 45 cm', image: Tv_7, tag: 'Premium', material: 'Walnut & Marble', category: 'TV Units', categoryId: 'tv-units', description: 'Exquisite walnut base topped with premium Italian marble.' },
    { id: 2008, name: 'Rustic Heritage Stand', price: 980, dimensions: '170 x 48 cm', image: Tv_8, tag: null, material: 'Reclaimed Wood', category: 'TV Units', categoryId: 'tv-units', description: 'Warm, rustic charm with plenty of character and storage.' },
    { id: 2009, name: 'Onyx Black Oak Console', price: 1700, dimensions: '200 x 40 cm', image: Tv_9, tag: null, material: 'Black Oak', category: 'TV Units', categoryId: 'tv-units', description: 'Modern black oak finish with smoked glass doors.' },
    { id: 2010, name: 'Gatsby Deco Console', price: 1900, dimensions: '180 x 42 cm', image: Tv_10, tag: 'New', material: 'Mahogany', category: 'TV Units', categoryId: 'tv-units', description: 'Elegant Art Deco inspired design with gold hardware.' },
    { id: 2011, name: 'Nordic Light Oak Bench', price: 1200, dimensions: '150 x 40 cm', image: Tv_11, tag: null, material: 'Light Oak', category: 'TV Units', categoryId: 'tv-units', description: 'Simple, functional, and beautiful Scandinavian design.' },
  ],
  'sofas': [
    { id: 3001, name: 'Velvet Dream Sectional', price: 2800, dimensions: '320 x 240 cm', image: S_1, tag: 'Best Seller', material: 'Velvet', category: 'Sofas', categoryId: 'sofas', description: 'Ultra-soft velvet sectional that offers unparalleled comfort and style.' },
    { id: 3002, name: 'Sovereign Leather Sofa', price: 3200, dimensions: '220 x 95 cm', image: S_2, tag: 'Premium', material: 'Top Grain Leather', category: 'Sofas', categoryId: 'sofas', description: 'Timeless leather sofa that ages beautifully and fits any decor.' },
    { id: 3003, name: 'Linen Lounge Sofa', price: 1900, dimensions: '240 x 100 cm', image: S_3, tag: 'New', material: 'Linen', category: 'Sofas', categoryId: 'sofas', description: 'Breathable linen fabric and deep cushions for a relaxed, airy feel.' },
    { id: 3004, name: 'Compact Duo Sofa', price: 1200, dimensions: '160 x 85 cm', image: S_4, tag: null, material: 'Cotton Blend', category: 'Sofas', categoryId: 'sofas', description: 'Perfect for apartments or as an accent piece in larger rooms.' },
    { id: 3005, name: 'Cloud Modular Sofa', price: 3500, dimensions: 'Custom', image: S_5, tag: 'Popular', material: 'Performance Fabric', category: 'Sofas', categoryId: 'sofas', description: 'Fully modular system that can be configured to fit any space.' },
    { id: 3006, name: 'Atelier Tufted Sofa', price: 2100, dimensions: '210 x 90 cm', image: S_6, tag: null, material: 'Velvet', category: 'Sofas', categoryId: 'sofas', description: 'Elegant tufted backrest and rolled arms for a classic look.' },
  ],
  'tables': [
    { id: 4001, name: 'Oak Ridge Coffee Table', price: 750, dimensions: '120 x 60 cm', image: Table_1, tag: 'Best Seller', material: 'Oak', category: 'Tables', categoryId: 'tables', description: 'A sturdy and beautiful coffee table that anchors your living room.' },
    { id: 4002, name: 'Trio Nesting Set', price: 550, dimensions: 'Set of 3', image: Table_2, tag: 'New', material: 'Walnut', category: 'Tables', categoryId: 'tables', description: 'Versatile nesting tables that can be used together or separately.' },
    { id: 4003, name: 'Orbit Marble Table', price: 950, dimensions: '100 cm diameter', image: Table_3, tag: null, material: 'Marble & Wood', category: 'Tables', categoryId: 'tables', description: 'Elegant round table with a marble top and solid wood base.' },
    { id: 4004, name: 'Industrial Side Table', price: 380, dimensions: '50 x 50 cm', image: Table_4, tag: null, material: 'Oak & Iron', category: 'Tables', categoryId: 'tables', description: 'Compact side table with a rugged industrial aesthetic.' },
    { id: 4005, name: 'Sequoia Live Edge', price: 1400, dimensions: '140 x 70 cm', image: Table_5, tag: 'Premium', material: 'Walnut', category: 'Tables', categoryId: 'tables', description: 'Unique live edge slab that brings the beauty of nature indoors.' },
    { id: 4006, name: 'Essential Ash Console', price: 750, dimensions: '120 x 35 cm', image: Table_6, tag: 'Popular', material: 'Ash', category: 'Tables', categoryId: 'tables', description: 'Slim profile table perfect for entryways or behind sofas.' },
    { id: 4007, name: 'Metro Bistro Table', price: 520, dimensions: '80 cm diameter', image: Table_7, tag: null, material: 'Glass & Chrome', category: 'Tables', categoryId: 'tables', description: 'Modern bistro table for small dining areas or balconies.' },
  ],
  'consoles': [
    { id: 5001, name: 'Walnut Entry Console', price: 1250, dimensions: '140 x 40 cm', image: C_1, tag: 'Best Seller', material: 'Walnut', category: 'Consoles', categoryId: 'consoles', description: 'A beautiful first impression for your home with ample storage.' },
    { id: 5002, name: 'Mirror Glow Console', price: 1600, dimensions: '120 x 35 cm', image: C_2, tag: 'Premium', material: 'Glass & Wood', category: 'Consoles', categoryId: 'consoles', description: 'Reflective surfaces that make your entryway feel larger and brighter.' },
    { id: 5003, name: 'Country Pine Table', price: 850, dimensions: '130 x 38 cm', image: C_3, tag: null, material: 'Pine', category: 'Consoles', categoryId: 'consoles', description: 'Warm and inviting rustic table with a distressed finish.' },
    { id: 5004, name: 'Steel Line Table', price: 750, dimensions: '110 x 30 cm', image: C_4, tag: 'New', material: 'Steel', category: 'Consoles', categoryId: 'consoles', description: 'Ultra-slim design for tight spaces and modern interiors.' },
    { id: 5005, name: 'Beirut Legacy Console', price: 2100, dimensions: '150 x 45 cm', image: C_5, tag: null, material: 'Mahogany', category: 'Consoles', categoryId: 'consoles', description: 'Intricately carved details for a touch of traditional elegance.' },
    { id: 5006, name: 'Retro Teak Console', price: 1150, dimensions: '140 x 42 cm', image: C_6, tag: 'Popular', material: 'Teak', category: 'Consoles', categoryId: 'consoles', description: 'Iconic mid-century design with tapered legs and clean lines.' },
    { id: 5007, name: 'Industrial Depot Console', price: 950, dimensions: '120 x 40 cm', image: C_7, tag: null, material: 'Oak & Steel', category: 'Consoles', categoryId: 'consoles', description: 'Combines open shelving with closed storage for versatility.' },
    { id: 5009, name: 'Midnight Oak Console', price: 1250, dimensions: '140 x 38 cm', image: C_8, tag: null, material: 'Black Oak', category: 'Consoles', categoryId: 'consoles', description: 'Sleek black finish that adds drama and sophistication.' },
    { id: 5010, name: 'Nordic Fjord Table', price: 800, dimensions: '100 x 35 cm', image: C_9, tag: null, material: 'Light Oak', category: 'Consoles', categoryId: 'consoles', description: 'Simple, clean, and functional Scandinavian design.' },
  ],
  'dining-tables': [
    { id: 6001, name: 'Feast Banquet Table', price: 3500, dimensions: '280 x 110 cm', image: Dining_1, tag: 'Premium', material: 'Walnut', category: 'Dinning Tables', categoryId: 'dining-tables', description: 'An impressive table that seats up to 12 guests for grand gatherings.' },
    { id: 6002, name: 'Gathering Oak Table', price: 1900, dimensions: '200 x 100 cm', image: Dining_2, tag: 'Best Seller', material: 'Oak', category: 'Dinning Tables', categoryId: 'dining-tables', description: 'The perfect centerpiece for daily family meals and conversations.' },
  ],
  'chairs': [
    { id: 7001, name: 'Velvet Dining Chair', price: 350, dimensions: 'Standard', image: CH_1, tag: 'Popular', material: 'Velvet & Oak', category: 'Chairs', categoryId: 'chairs', description: 'Comfortable and stylish dining chair with premium velvet upholstery.' },
    { id: 7002, name: 'Modern Accent Chair', price: 850, dimensions: 'Large', image: CH_2, tag: 'New', material: 'Linen & Walnut', category: 'Chairs', categoryId: 'chairs', description: 'A statement accent chair that adds comfort and style to any corner.' },
  ],
  'wall-cladding': [
    { id: 501, name: 'Beirut Loft Panel', price: 220, dimensions: 'Custom Fit', unit: '/sqm', image: Wall1, tag: null, material: 'Mixed', category: 'Wall Cladding', categoryId: 'wall-cladding', description: 'Transform any wall into a statement piece with our signature wood paneling. Easy to install, these panels add warmth and texture while providing excellent acoustic properties.' },
    { id: 502, name: 'Rhythm Slat Wall', price: 195, dimensions: 'Custom Fit', unit: '/sqm', image: Wall2, tag: 'Popular', material: 'Oak', category: 'Wall Cladding', categoryId: 'wall-cladding', description: 'Contemporary vertical slat design creates depth and visual interest. Perfect for feature walls in living rooms or bedrooms.' },
  ],
};

// Flat array of all products for easy lookup
export const ALL_PRODUCTS = Object.values(CATEGORY_PRODUCTS).flat();

// Legacy PRODUCTS array for backwards compatibility (now synced with CATEGORY_PRODUCTS)
export const PRODUCTS = ALL_PRODUCTS;

export default PRODUCTS;
