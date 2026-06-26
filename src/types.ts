export type LicenseType = 'personal' | 'commercial' | 'extended';

export interface Product {
  id: string;
  title: string;
  category: string;
  tags: string[];
  price: number;
  downloads: number;
  likes: number;
  rating: number;
  reviewsCount: number;
  imageKey: string; // key to draw custom beautiful vector SVG/canvas
  creatorId: string;
  creatorName: string;
  description: string;
  fileFormats: string[];
  includedFiles: string[];
  createdAt: string;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  designsCount: number;
  followers: number;
  sales: number;
  bio: string;
  verified: boolean;
}

export interface SaleRecord {
  id: string;
  date: string;
  productTitle: string;
  price: number;
  earnings: number;
  buyerCountry: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'creator' | 'admin';
  createdAt: string;
}

export interface PlatformConfig {
  maintenanceMode: boolean;
  disableRegistrations: boolean;
  commissionFee: number;
  featuredBannerText: string;
  announcementSub: string;
  allowInstantFreeDownloads: boolean;
}

export interface AffiliateApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  platform: string;
  handle: string;
  followerCount: string;
  motivation: string;
  promoCode: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}


