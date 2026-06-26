import { Product, Creator, Review } from './types';

export const CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'InkWave',
    username: 'inkwave',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designsCount: 34,
    followers: 12400,
    sales: 4500,
    bio: 'Official InkWave Design Studio curation account. Premium streetwear graphics and mecha aesthetics.',
    verified: true
  },
  {
    id: 'c2',
    name: 'Yuki Sato',
    username: 'sato_ink',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designsCount: 22,
    followers: 8900,
    sales: 3100,
    bio: 'Calligraphy expert and traditional sumi-e anime style t-shirt designer. Making artwork ready for print-on-demand.',
    verified: true
  },
  {
    id: 'c3',
    name: 'Ren Kuroda',
    username: 'cyberpunk_kuroda',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    designsCount: 41,
    followers: 15600,
    sales: 6200,
    bio: 'Creating cyberpunk, synthwave, and future-retro anime graphics. Master of flat vector lineart for commercial merchandise.',
    verified: true
  },
  {
    id: 'c4',
    name: 'Mei Lin',
    username: 'mei_kawaii',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    designsCount: 18,
    followers: 5300,
    sales: 1800,
    bio: 'Cute but deadly. Kawaii horror, chibi warriors, and bright pastel anime elements optimized for high-volume apparel sales.',
    verified: false
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Minimalist Samurai Crimson Moon',
    category: 'Samurai',
    tags: ['Samurai', 'Streetwear', 'Minimalist', 'Red Sun', 'Kanji'],
    price: 29.00,
    downloads: 1420,
    likes: 485,
    rating: 4.9,
    reviewsCount: 42,
    imageKey: 'samurai_crimson',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'A striking minimalist Japanese samurai silhouette in front of a giant bold crimson moon. Features professional kanji brushwork translates to "Indomitable Spirit". Perfectly balanced composition suited for heavy cotton black t-shirts or oversizes.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-03-12',
    badge: 'Best Seller'
  },
  {
    id: 'p2',
    title: 'The Great Straw Hat Jolly Roger',
    category: 'One Piece',
    tags: ['One Piece', 'Pirate', 'Straw Hat', 'Anime Ink', 'Splatters'],
    price: 35.00,
    downloads: 2150,
    likes: 720,
    rating: 5.0,
    reviewsCount: 68,
    imageKey: 'straw_hat_pirate',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'Stylized anime pirate skull styled with deep brush splatters and a classic yellow straw hat. Features double cross swords and vintage Japanese stamps. Engineered specifically for high-detail screen printing and DTG printers.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-04-01',
    badge: 'Trending'
  },
  {
    id: 'p3',
    title: 'Cyberpunk Oni Mech Unit-01',
    category: 'Mecha',
    tags: ['Mecha', 'Cyberpunk', 'Eva', 'Oni Mask', 'Futuristic'],
    price: 32.00,
    downloads: 980,
    likes: 312,
    rating: 4.8,
    reviewsCount: 23,
    imageKey: 'oni_mech',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'A futuristic fusion of a traditional Japanese Oni demon and a sci-fi mecha cockpit unit. Sharp angular lines, high-contrast flat violet and neon lime paneling. Comes with tech decals and HUD layout overlays.',
    fileFormats: ['PNG', 'SVG', 'AI', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Print-Ready PDF'],
    createdAt: '2026-05-18',
    badge: 'New Release'
  },
  {
    id: 'p4',
    title: 'Cursed King Eyes & Domain Stamp',
    category: 'Jujutsu Kaisen',
    tags: ['Jujutsu Kaisen', 'Cursed', 'Streetwear', 'Tattoos', 'Gothic'],
    price: 24.00,
    downloads: 1890,
    likes: 644,
    rating: 4.9,
    reviewsCount: 51,
    imageKey: 'cursed_eyes',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'The iconic four eyes of the Cursed King, highlighted in deep black ink outline and crimson accents. Centered over a distressed streetwear stamp design with warnings. Extremely popular among Gen-Z aesthetic streetwear lines.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-02-20',
    badge: 'Best Seller'
  },
  {
    id: 'p5',
    title: 'Shinobi Nine-Tails Chakra Seal',
    category: 'Naruto',
    tags: ['Naruto', 'Nine-Tails', 'Seal', 'Chakra', 'Flame Brush'],
    price: 29.00,
    downloads: 1320,
    likes: 410,
    rating: 4.7,
    reviewsCount: 19,
    imageKey: 'chakra_seal',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'A majestic dynamic ink-brush rendering of the iconic spiral stomach seal. Wisps of dark orange and black fiery chakra trail upwards to outline the snarling gaze of the fox demon. Traditional calligraphy styling.',
    fileFormats: ['PNG', 'SVG', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-05-10'
  },
  {
    id: 'p6',
    title: 'Colossal Giant steam Engine',
    category: 'Attack on Titan',
    tags: ['Titan', 'Eldian', 'Vintage', 'Gothic', 'Anatomy'],
    price: 34.00,
    downloads: 1110,
    likes: 388,
    rating: 4.9,
    reviewsCount: 30,
    imageKey: 'colossal_titan',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'An anatomically precise, vintage lithograph-inspired illustration of the Colossal Giant head venting steam. Clean cross-hatching and dot-pattern shading give it an editorial, historic book-illustration aesthetic.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-01-15'
  },
  {
    id: 'p7',
    title: 'Shinigami Ryuk Apple Orchard',
    category: 'Death Note',
    tags: ['Death Note', 'Shinigami', 'Gothic', 'Apple', 'Darkwear'],
    price: 27.00,
    downloads: 850,
    likes: 295,
    rating: 4.8,
    reviewsCount: 14,
    imageKey: 'shinigami_apple',
    creatorId: 'c4',
    creatorName: 'Mei Lin',
    description: 'A dark humor gothic streetwear graphic showing a feathered wing silhouette of a death god snatching a bright pixel-art red apple. Embellished with vertical text translating to "Boredom is the catalyst".',
    fileFormats: ['PNG', 'SVG', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-06-02'
  },
  {
    id: 'p8',
    title: 'Breath of Water Nichirin Wave',
    category: 'Demon Slayer',
    tags: ['Demon Slayer', 'Water Breath', 'Ukiyo-e', 'Wave', 'Katana'],
    price: 30.00,
    downloads: 1750,
    likes: 580,
    rating: 5.0,
    reviewsCount: 47,
    imageKey: 'nichirin_wave',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'An ukiyo-e inspired woodblock-print style wave wrapping around a diagonal nichirin sword blade. The dynamic flow of the white-capped deep blue wave is optimized to drape beautifully across the shoulders and chest of a t-shirt.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-04-19',
    badge: 'Best Seller'
  },
  {
    id: 'p9',
    title: 'Shinobi Hollow Mask Graffiti',
    category: 'Bleach',
    tags: ['Bleach', 'Hollow Mask', 'Graffiti', 'Streetwear', 'Grunge'],
    price: 28.00,
    downloads: 710,
    likes: 215,
    rating: 4.6,
    reviewsCount: 11,
    imageKey: 'hollow_mask',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'A striking grunge representation of a hollow skull mask with split red stripes. Splattered paint drops, dry brush lines, and urban t-shirt style framing makes this a standout piece for distressed collections.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-06-11'
  },
  {
    id: 'p10',
    title: 'Over 9000 Power Level Radar',
    category: 'Dragon Ball',
    tags: ['Dragon Ball', 'Power Level', 'Retro', 'Scouter', '90s'],
    price: 26.00,
    downloads: 1450,
    likes: 490,
    rating: 4.8,
    reviewsCount: 38,
    imageKey: 'power_level',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'A retro-inspired green sci-fi HUD displaying scanning coordinates, power surges, and the legendary reading in digital typography. Perfect for oversized graphics with a technical, vaporwave or 90s gaming appeal.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-03-30',
    badge: 'Best Seller'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    user: 'PrintVibe Customs',
    rating: 5,
    comment: 'Exceptional vector nodes. Crucial for screen printing with clean separation layers. Customer loved the final look!',
    date: '2026-05-14'
  },
  {
    id: 'r2',
    productId: 'p1',
    user: 'Kaito Designs',
    rating: 5,
    comment: 'Absolute top-tier t-shirt asset. Fits our oversized black blank perfectly. Clean transparency with no jagged edges.',
    date: '2026-06-01'
  },
  {
    id: 'r3',
    productId: 'p2',
    user: 'Etsy Merchant 99',
    rating: 5,
    comment: 'Instantly uploaded to our Etsy shop connected with Printify. Already generated 15 sales in the first week. Will buy from Yuki again!',
    date: '2026-04-20'
  },
  {
    id: 'r4',
    productId: 'p2',
    user: 'StreetWear_HQ',
    rating: 5,
    comment: 'The source file is organized so well. Made modifying the accent color for our seasonal drop a breeze. 10/10.',
    date: '2026-05-02'
  },
  {
    id: 'r5',
    productId: 'p3',
    user: 'MechaFashion Lab',
    rating: 4,
    comment: 'Super cool mecha graphic. The neon lines pop beautifully on DTG. Wish it had an EPS file format too but AI/SVG worked fine.',
    date: '2026-05-25'
  },
  {
    id: 'r6',
    productId: 'p4',
    user: 'SukunaStan Store',
    rating: 5,
    comment: 'This design prints like a dream. The spacing on the domain stamps translates beautifully to a huge print across the back.',
    date: '2026-03-10'
  },
  {
    id: 'r7',
    productId: 'p8',
    user: 'Tsushima Prints',
    rating: 5,
    comment: 'The woodblock printing styling is highly detailed. Beautiful wave rendering. Our customers appreciate authentic-feeling streetwear design.',
    date: '2026-05-20'
  }
];

export const CATEGORIES_LIST = [
  { id: 'naruto', name: 'Naruto Collection', tag: 'Naruto', count: 12, color: '#fef3c7' }, // pastel amber
  { id: 'one-piece', name: 'One Piece Collection', tag: 'One Piece', count: 18, color: '#dbeafe' }, // pastel blue
  { id: 'demon-slayer', name: 'Demon Slayer Collection', tag: 'Demon Slayer', count: 15, color: '#e0f2fe' }, // pastel sky
  { id: 'attack-on-titan', name: 'Attack on Titan Collection', tag: 'Attack on Titan', count: 9, color: '#fee2e2' }, // pastel red
  { id: 'jujutsu-kaisen', name: 'Jujutsu Kaisen Collection', tag: 'Jujutsu Kaisen', count: 14, color: '#f3e8ff' }, // pastel purple
  { id: 'dragon-ball', name: 'Dragon Ball Collection', tag: 'Dragon Ball', count: 11, color: '#ffedd5' }, // pastel orange
  { id: 'bleach', name: 'Bleach Collection', tag: 'Bleach', count: 8, color: '#f1f5f9' }, // pastel slate
  { id: 'death-note', name: 'Death Note Collection', tag: 'Death Note', count: 6, color: '#e2e8f0' } // pastel zinc
];
