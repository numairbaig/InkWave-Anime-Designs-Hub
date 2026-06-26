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
    title: 'Roronoa Zoro Ink Brush Slash',
    category: 'One Piece',
    tags: ['One Piece', 'Zoro', 'Samurai', 'Ink Brush', 'Apparel'],
    price: 29.00,
    downloads: 1420,
    likes: 485,
    rating: 4.9,
    reviewsCount: 42,
    imageKey: '/assets/zoro_crimson.png',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'A striking ink-brush style illustration of Roronoa Zoro in his signature battle stance with blood dripping and a high-contrast shadow. Designed for high-end streetwear merchandise and oversized black t-shirts.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-03-12',
    badge: 'Best Seller'
  },
  {
    id: 'p2',
    title: 'Straw Hat Pirate Trio & Jolly Roger',
    category: 'One Piece',
    tags: ['One Piece', 'Luffy', 'Zoro', 'Sanji', 'Jolly Roger', 'Lineart'],
    price: 35.00,
    downloads: 2150,
    likes: 720,
    rating: 5.0,
    reviewsCount: 68,
    imageKey: '/assets/one_piece_trio.png',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'A beautiful line-art composition featuring Monkey D. Luffy, Roronoa Zoro, Vinsmoke Sanji, a Devil Fruit, and the iconic Straw Hat pirate Jolly Roger. Optimized for screen-printing on hoodies and merchandise.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-04-01',
    badge: 'Trending'
  },
  {
    id: 'p3',
    title: 'Bartholomew Kuma Shichibukai Paw Paw',
    category: 'One Piece',
    tags: ['One Piece', 'Kuma', 'Shichibukai', 'Paw Paw', 'Revolutionary'],
    price: 32.00,
    downloads: 980,
    likes: 312,
    rating: 4.8,
    reviewsCount: 23,
    imageKey: '/assets/kuma_paw.png',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'A dynamic, high-contrast vector design of Bartholomew Kuma (The Paw-Paw Man) unleashing his signature Ursus Shock pressure bubble. Optimized for placement on oversized streetwear t-shirts.',
    fileFormats: ['PNG', 'SVG', 'AI', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Print-Ready PDF'],
    createdAt: '2026-05-18',
    badge: 'New Release'
  },
  {
    id: 'p4',
    title: 'Fiery Straw Hat Emblem',
    category: 'One Piece',
    tags: ['One Piece', 'Straw Hat', 'Luffy', 'Flame', 'Emblem'],
    price: 24.00,
    downloads: 1890,
    likes: 644,
    rating: 4.9,
    reviewsCount: 51,
    imageKey: '/assets/straw_hat_flame.png',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'Minimalist graphic of Luffy\'s iconic straw hat with a bold red band, enveloped in swirling black-and-white flame/smoke trails. Perfect for minimal anime merchandise.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-02-20',
    badge: 'Best Seller'
  },
  {
    id: 'p5',
    title: 'Trafalgar Law Surgeon of Death Ope Ope',
    category: 'One Piece',
    tags: ['One Piece', 'Trafalgar Law', 'Surgeon of Death', 'Room', 'Ope Ope'],
    price: 29.00,
    downloads: 1320,
    likes: 410,
    rating: 4.7,
    reviewsCount: 19,
    imageKey: '/assets/trafalgar_law.jpg',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'Trafalgar Law (Surgeon of Death) generating his spatial "Room" dome with Ope Ope No Mi devil fruit powers. Colorful graffiti background with high details.',
    fileFormats: ['PNG', 'SVG', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-05-10'
  },
  {
    id: 'p6',
    title: 'Whitebeard Shattered Wanted Poster',
    category: 'One Piece',
    tags: ['One Piece', 'Whitebeard', 'Wanted Poster', 'Shattered Glass', 'Emperor'],
    price: 34.00,
    downloads: 1110,
    likes: 388,
    rating: 4.9,
    reviewsCount: 30,
    imageKey: '/assets/whitebeard_wanted.jpg',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'A beautiful graphic of Edward Newgate (Whitebeard) emerging through a shattered glass effect on his classic wanted poster. Features high details and intense coloring.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-01-15'
  },
  {
    id: 'p7',
    title: 'Tony Tony Chopper Sparkle',
    category: 'One Piece',
    tags: ['One Piece', 'Chopper', 'Doctor', 'Kawaii', 'Sparkle'],
    price: 27.00,
    downloads: 850,
    likes: 295,
    rating: 4.8,
    reviewsCount: 14,
    imageKey: '/assets/chopper_sparkle.png',
    creatorId: 'c4',
    creatorName: 'Mei Lin',
    description: 'A super kawaii vector graphic of Tony Tony Chopper dancing with sparkling stars and a pastel purple aura trail. Perfect for cute anime merchandise lines.',
    fileFormats: ['PNG', 'SVG', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-06-02'
  },
  {
    id: 'p8',
    title: 'Soul King Brook Live World Tour',
    category: 'One Piece',
    tags: ['One Piece', 'Brook', 'Soul King', 'Music', 'Violin'],
    price: 30.00,
    downloads: 1750,
    likes: 580,
    rating: 5.0,
    reviewsCount: 47,
    imageKey: '/assets/brook_soul.png',
    creatorId: 'c1',
    creatorName: 'InkWave',
    description: 'Brook (Soul King) performing his live music world tour, shredding on the violin with dynamic musical notes, swirls, and skull graphics. Highly energetic color vector design.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS', 'PDF'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)', 'Print-Ready PDF'],
    createdAt: '2026-04-19',
    badge: 'Best Seller'
  },
  {
    id: 'p9',
    title: 'Straw Hat Pirate Alliance Wanted Poster',
    category: 'One Piece',
    tags: ['One Piece', 'Alliance', 'Luffy', 'Law', 'Wanted Poster', 'Retro'],
    price: 28.00,
    downloads: 710,
    likes: 215,
    rating: 4.6,
    reviewsCount: 11,
    imageKey: '/assets/wanted_alliance.jpg',
    creatorId: 'c2',
    creatorName: 'Yuki Sato',
    description: 'A retro-style custom wanted poster featuring the Straw Hat Pirate Alliance with a massive bounty. Beautiful halftone, vintage dots, and detailed sketches.',
    fileFormats: ['PNG', 'SVG', 'AI', 'EPS'],
    includedFiles: ['Transparent PNG (4500x5400px, 300 DPI)', 'Scalable Vector SVG', 'Adobe Illustrator Source (.ai)', 'Encapsulated PostScript (.eps)'],
    createdAt: '2026-06-11'
  },
  {
    id: 'p10',
    title: 'Kaido Strongest Beast Purple Dragon',
    category: 'One Piece',
    tags: ['One Piece', 'Kaido', 'Dragon', 'Emperor', 'Beast Pirates'],
    price: 26.00,
    downloads: 1450,
    likes: 490,
    rating: 4.8,
    reviewsCount: 38,
    imageKey: '/assets/kaido_dragon.jpg',
    creatorId: 'c3',
    creatorName: 'Ren Kuroda',
    description: 'A masterpiece vector poster of Kaido, the Strongest Creature, with his massive purple Eastern dragon form swirling in the background. Ready for high-quality oversized prints.',
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
