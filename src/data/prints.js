// Framed Prints Collection
// Premium quality framed prints for contemporary spaces

import PR1 from '../../images/1PR.webp';
import PR2 from '../../images/2PR.webp';
import PR3 from '../../images/3PR.webp';
import PR4 from '../../images/4PR.webp';
import PR5 from '../../images/5PR.webp';
import PR6 from '../../images/6PR.webp';
import PR7 from '../../images/7PR.webp';
import PR8 from '../../images/8PR.webp';
import PR9 from '../../images/9PR.webp';
import PR10 from '../../images/10PR.webp';
import PR11 from '../../images/11PR.webp';
import PR12 from '../../images/12PR.webp';
import PR13 from '../../images/13PR.webp';
import PR14 from '../../images/14PR.webp';
import PR15 from '../../images/15PR.webp';
import PR16 from '../../images/16PR.webp';
import PR17 from '../../images/17PR.webp';
import PR18 from '../../images/18PR.webp';
import PR19 from '../../images/19PR.webp';
import PR20 from '../../images/20PR.webp';
import PR21 from '../../images/21PR.webp';
import PR22 from '../../images/22PR.webp';
import PR23 from '../../images/23PR.webp';
import PR24 from '../../images/24PR.webp';
import PR25 from '../../images/25PR.webp';
import PR26 from '../../images/26PR.webp';
import PR27 from '../../images/27PR.webp';
import PR28 from '../../images/28PR.webp';
import PR29 from '../../images/29PR.webp';
import PR30 from '../../images/30PR.webp';
import PR31 from '../../images/31PR.webp';
import PR32 from '../../images/32PR.webp';

// Print sizes available (A3 and A2)
const SIZES = {
  a3: { label: '29.7 × 42 cm', dimensions: '29.7x42', basePrice: 29, antiReflectionPrice: 34 },
  a2: { label: '42 × 59.4 cm', dimensions: '42x59.4', basePrice: 44, antiReflectionPrice: 49 },
};

// Glass options
const GLASS_OPTIONS = [
  { id: 'standard', label: 'Standard Glass', priceModifier: 0 },
  { id: 'anti-reflection', label: 'Anti-Reflection Glass', priceModifier: 5 },
];

// Frame colors available (Black is default)
const FRAMES = ['Black', 'White', 'Walnut', 'Natural Oak'];

export const PRINTS = [
  {
    code: 'PR1',
    image: PR1,
    title: 'Morning Moka',
    price: 29,
    description: 'Warm terracotta moka pot on a checkered table; a playful kitchen print with a cozy retro feel.',
    category: 'Kitchen',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR2',
    image: PR2,
    title: 'Ciao Bella',
    price: 29,
    description: 'Bold Italian greeting in playful green hand-drawn typography; a cheerful statement piece for any room.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR3',
    image: PR3,
    title: 'Coffee Cat',
    price: 29,
    description: 'Charming illustration of a black cat in a striped sweater enjoying a warm cup of coffee.',
    category: 'Illustration',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR4',
    image: PR4,
    title: 'No Place Like Home',
    price: 29,
    description: 'Vintage-style kitchen illustration celebrating the warmth and comfort of home.',
    category: 'Vintage',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR5',
    image: PR5,
    title: 'Koi in the Waves',
    price: 29,
    description: 'Playful abstract illustration of two golden koi swimming through deep swirling blue waves.',
    category: 'Japanese',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR6',
    image: PR6,
    title: 'Coastal Dream',
    price: 29,
    description: 'Serene illustration of a woman resting by swirling blue waters under a golden sun.',
    category: 'Coastal',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR7',
    image: PR7,
    title: 'Trust the Flow',
    price: 29,
    description: 'Hand-lettered mantra in soft coastal colours with playful details; calm, optimistic, and easy to live with.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR8',
    image: PR8,
    title: 'Dancing Koi',
    price: 29,
    description: 'Traditional Japanese-inspired artwork of koi fish swimming gracefully in deep indigo waters.',
    category: 'Japanese',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR9',
    image: PR9,
    title: 'Great Things Take Time',
    price: 29,
    description: 'Bold black-and-white typography art with an inspiring message about patience and persistence.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR10',
    image: PR10,
    title: 'Blue Sardines',
    price: 29,
    description: 'Elegant illustration of blue sardines swimming on a warm coral background.',
    category: 'Coastal',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR11',
    image: PR11,
    title: 'Call of the Sea',
    price: 29,
    description: 'Elegant navy wave pattern with “Call of the Sea” typography; ocean-inspired minimalist art.',
    category: 'Coastal',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR12',
    image: PR12,
    title: 'Play It Twice',
    price: 29,
    description: 'Retro record player illustration with a music-lover message; simple, fun, and giftable.',
    category: 'Retro',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR13',
    image: PR13,
    title: 'Koi Pond',
    price: 29,
    description: 'Delicate watercolor-style illustration of koi fish swimming among soft turquoise brushstrokes.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR14',
    image: PR14,
    title: 'Think Outside the Box',
    price: 29,
    description: 'Playful typography with tic-tac-toe illustration; a creative reminder to think differently.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR15',
    image: PR15,
    title: 'Home Sweet Home',
    price: 29,
    description: 'Warm heart-shaped typography with radiating sunburst pattern in red and cream tones.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR16',
    image: PR16,
    title: 'Grip Yourself',
    price: 29,
    description: 'Bold hand-painted typography with flowing letterforms; high-contrast and graphic for a statement wall.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR17',
    image: PR17,
    title: 'Eye Spiral',
    price: 29,
    description: 'High-contrast black-and-cream optical pattern with repeating “eyes”; bold, artsy, and statement-heavy.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR18',
    image: PR18,
    title: 'Crimson Texture',
    price: 29,
    description: 'A rich red textured field; minimal, moody, and perfect as a modern accent piece.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR19',
    image: PR19,
    title: 'Night Signal',
    price: 29,
    description: 'Comic-style cityscape with a dramatic spotlight symbol; playful, cinematic, and perfect for an office or media room.',
    category: 'Illustration',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR20',
    image: PR20,
    title: 'Desert Botanicals',
    price: 29,
    description: 'Vintage-style cactus and succulent study chart; detailed, timeless, and easy to style.',
    category: 'Vintage',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR21',
    image: PR21,
    title: 'In the Sun by the Sea',
    price: 29,
    description: 'Sunny coastal typography in warm blue and yellow tones celebrating seaside living.',
    category: 'Coastal',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR22',
    image: PR22,
    title: 'Melting Time',
    price: 29,
    description: 'Surreal melting clock on a clean white field; witty, minimal, and a conversation piece.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR23',
    image: PR23,
    title: 'Owl Atlas',
    price: 29,
    description: 'Vintage owl identification chart; warm, scholarly, and perfect for reading corners.',
    category: 'Vintage',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR24',
    image: PR24,
    title: 'Coffee, Please!',
    price: 29,
    description: 'Simple line illustration with a coffee plea; quirky, minimal, and ideal for kitchens.',
    category: 'Kitchen',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR25',
    image: PR25,
    title: 'Tiger Acrobat',
    price: 29,
    description: 'Vintage poster-style tiger in a dynamic pose; bold, playful energy with strong character.',
    category: 'Vintage',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR26',
    image: PR26,
    title: 'Wild Gaze',
    price: 29,
    description: 'High-contrast close-up of a big cat mid-expression; intense, modern, and striking.',
    category: 'Photography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR27',
    image: PR27,
    title: 'The Chill Out Room',
    price: 29,
    description: 'Retro typography poster with soft border; fun, youthful, and lounge-ready.',
    category: 'Typography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR28',
    image: PR28,
    title: '3D Audience',
    price: 29,
    description: 'Classic black-and-white crowd in 3D glasses; iconic, graphic, and made for gallery walls.',
    category: 'Photography',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR29',
    image: PR29,
    title: 'Cosmic Balance',
    price: 29,
    description: 'Astronaut holding a stacked solar system; playful, modern, and giftable.',
    category: 'Illustration',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR30',
    image: PR30,
    title: 'Red Line Grid',
    price: 29,
    description: 'Minimal striped composition with a single red bar; crisp, architectural, and modern.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR31',
    image: PR31,
    title: 'Midcentury Orbit',
    price: 29,
    description: 'Teal-and-orange geometric forms in a midcentury style; warm, design-forward, and furniture-friendly.',
    category: 'Geometric',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
  {
    code: 'PR32',
    image: PR32,
    title: 'Botanical Forms',
    price: 29,
    description: 'Minimal plant-inspired shapes in deep green and burgundy; calm, contemporary, and clean.',
    category: 'Abstract',
    defaultFrame: 'Black',
    sizes: ['a3', 'a2'],
  },
];

// Export sizes, frames, and glass options for use in other components
export { SIZES, FRAMES, GLASS_OPTIONS };
export default PRINTS;
