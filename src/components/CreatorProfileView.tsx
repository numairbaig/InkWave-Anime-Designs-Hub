import React from 'react';
import { Creator, Product } from '../types';
import { BadgeCheck, Users, ShoppingBag, FolderOpen, Heart, ArrowLeft } from 'lucide-react';
import { DesignRenderer } from './DesignRenderer';

interface CreatorProfileViewProps {
  creator?: Creator;
  creatorProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  isLoading?: boolean;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  creator,
  creatorProducts,
  onBack,
  onSelectProduct,
  onToggleFavorite,
  favorites,
  isLoading = false
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 animate-fadeIn text-[#0d1400]">
      {/* Back link */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase hover:opacity-75 transition-opacity py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Profile Header Card */}
      <div className="border border-[#0d1400] bg-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-[12px]">
        {isLoading || !creator ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 md:w-24 md:h-24 border border-[#0d1400]/10 bg-[#0d1400]/5 rounded-full shrink-0 animate-pulse" />

            <div className="space-y-2 animate-pulse w-full max-w-md">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="h-8 w-48 bg-[#0d1400]/10 rounded" />
                <div className="h-6 w-28 bg-[#0d1400]/5 rounded-full" />
              </div>
              <div className="h-3 w-20 bg-[#0d1400]/5 rounded" />
              <div className="space-y-1.5 mt-2">
                <div className="h-4 w-full bg-[#0d1400]/5 rounded" />
                <div className="h-4 w-5/6 bg-[#0d1400]/5 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-[#0d1400] overflow-hidden rounded-full shrink-0">
              <img 
                src={creator.avatarUrl} 
                alt={creator.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#0d1400]">
                  {creator.name}
                </h2>
                {creator.verified && (
                  <div className="flex items-center gap-1 bg-[#0d1400] text-[#aaff00] text-[10px] font-mono uppercase tracking-wider px-3 py-1 font-bold rounded-full border border-[#0d1400]">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#aaff00]" />
                    VERIFIED DESIGNER
                  </div>
                )}
              </div>
              <p className="font-mono text-xs text-[#0d1400]/60">@{creator.username}</p>
              <p className="text-sm text-neutral-700 max-w-xl leading-relaxed">{creator.bio}</p>
            </div>
          </div>
        )}

        {/* Stats Column */}
        {isLoading || !creator ? (
          <div className="grid grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#0d1400]/10 pt-6 md:pt-0 md:pl-10 shrink-0 animate-pulse">
            <div className="text-center md:text-left space-y-2">
              <div className="h-3 w-12 bg-[#0d1400]/5 rounded mx-auto md:mx-0" />
              <div className="h-6 w-16 bg-[#0d1400]/10 rounded mx-auto md:mx-0" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="h-3 w-16 bg-[#0d1400]/5 rounded mx-auto md:mx-0" />
              <div className="h-6 w-16 bg-[#0d1400]/10 rounded mx-auto md:mx-0" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="h-3 w-12 bg-[#0d1400]/5 rounded mx-auto md:mx-0" />
              <div className="h-6 w-16 bg-[#0d1400]/10 rounded mx-auto md:mx-0" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#0d1400]/10 pt-6 md:pt-0 md:pl-10 shrink-0">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Followers</p>
              <p className="font-display font-bold text-xl md:text-2xl text-[#0d1400] mt-1 flex items-center justify-center md:justify-start gap-1">
                <Users className="w-4 h-4 opacity-55 shrink-0" />
                {creator.followers.toLocaleString()}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Total Sales</p>
              <p className="font-display font-bold text-xl md:text-2xl text-[#0d1400] mt-1 flex items-center justify-center md:justify-start gap-1">
                <ShoppingBag className="w-4 h-4 opacity-55 shrink-0" />
                {creator.sales.toLocaleString()}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Designs</p>
              <p className="font-display font-bold text-xl md:text-2xl text-[#0d1400] mt-1 flex items-center justify-center md:justify-start gap-1">
                <FolderOpen className="w-4 h-4 opacity-55 shrink-0" />
                {creatorProducts.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Grid */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-[#0d1400]">
            {isLoading ? "Design Catalog (Loading...)" : `Design Catalog (${creatorProducts.length})`}
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            BROWSE COMMERCIALLY LICENSED CREATIONS BY THIS DESIGNER
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`creator-product-skeleton-${idx}`}
                className="border border-[#0d1400]/10 bg-white overflow-hidden flex flex-col justify-between animate-pulse"
                style={{ borderRadius: '12px' }}
              >
                {/* Image Box Skeleton */}
                <div className="relative aspect-square border-b border-[#0d1400]/5 bg-neutral-50/70 p-6 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 bg-[#0d1400]/5 rounded-xl border border-[#0d1400]/5 animate-pulse"></div>
                </div>

                {/* Text Specs Skeleton */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Category Skeleton */}
                      <div className="h-2.5 w-16 bg-[#0d1400]/5 rounded font-mono"></div>
                      {/* Downloads Skeleton */}
                      <div className="h-2.5 w-12 bg-[#0d1400]/5 rounded font-mono"></div>
                    </div>
                    {/* Title Skeleton */}
                    <div className="h-4 w-3/4 bg-[#0d1400]/10 rounded font-display"></div>
                  </div>

                  {/* Foot pricing actions Skeleton */}
                  <div className="flex items-center justify-between border-t border-[#0d1400]/5 pt-3 mt-auto">
                    {/* Price Skeleton */}
                    <div className="h-4 w-12 bg-[#0d1400]/10 rounded font-mono"></div>
                    {/* Favorite Button Skeleton */}
                    <div className="h-7 w-7 bg-[#0d1400]/5 rounded border border-[#0d1400]/5"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            creatorProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <div 
                  key={product.id}
                  className="group border border-[#0d1400] bg-white overflow-hidden transition-all duration-300 flex flex-col rounded-[12px]"
                >
                  {/* Artwork Viewbox */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-square border-b border-[#0d1400] bg-neutral-50 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.04]">
                      <DesignRenderer imageKey={product.imageKey} className="w-full h-full object-contain" />
                    </div>

                    {/* Badges Overlay */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#0d1400] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}

                    {/* Hover Quick Preview overlay */}
                    <div className="absolute inset-0 bg-[#0d1400]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white border border-[#0d1400] px-4 py-2 text-xs font-mono font-bold text-[#0d1400] uppercase tracking-widest rounded-full">
                        Quick Preview
                      </span>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                          {product.category}
                        </span>
                        <span className="text-xs font-mono text-[#0d1400]/60">
                          {product.downloads.toLocaleString()} DLs
                        </span>
                      </div>
                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="font-sans font-bold text-sm text-[#0d1400] line-clamp-1 hover:underline cursor-pointer"
                      >
                        {product.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#0d1400]/10 pt-3 mt-auto">
                      <span className="font-mono font-bold text-sm text-[#0d1400]">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onToggleFavorite(product.id)}
                          className={`p-2 border rounded-full transition-colors ${isFav ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]' : 'border-[#0d1400] text-[#0d1400] hover:bg-neutral-50'}`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
