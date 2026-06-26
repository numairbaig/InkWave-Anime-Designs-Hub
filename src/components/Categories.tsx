import React from 'react';
import { CATEGORIES_LIST } from '../data';
import { Product } from '../types';
import { DesignRenderer } from './DesignRenderer';
import { ArrowRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (categoryTag: string) => void;
  selectedCategory: string | null;
  products: Product[];
}

export const Categories: React.FC<CategoriesProps> = ({
  onSelectCategory,
  selectedCategory,
  products
}) => {
  const getCategoryCover = (tag: string) => {
    switch (tag) {
      case 'Jujutsu Kaisen':
        return '/assets/jujutsu_kaisen_cover.jpg';
      case 'Death Note':
        return '/assets/death_note_cover.jpg';
      case 'Demon Slayer':
        return '/assets/demon_slayer_cover.jpg';
      case 'Dragon Ball':
        return '/assets/dragon_ball_cover.jpg';
      case 'Bleach':
        return '/assets/bleach_cover.jpg';
      case 'Attack on Titan':
        return '/assets/attack_on_titan_cover.jpg';
      case 'Naruto':
        return '/assets/naruto_cover.jpg';
      case 'One Piece':
        return '/assets/one_piece_cover.jpg';
      default:
        return '/assets/one_piece_cover.jpg';
    }
  };

  return (
    <div id="categories-section" className="space-y-6 text-[#0d1400]">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Browse Core Collections
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            EXPLORE HIGH-YIELD ASSET PACKS CODED BY HISTORIC ANIME FRANCHISES
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-[#0d1400] underline"
          >
            Clear Active Category Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.tag;
          const coverImage = getCategoryCover(cat.tag);

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.tag)}
              className={`group border cursor-pointer p-5 flex flex-col justify-between gap-5 transition-all duration-300 ${isSelected ? 'border-[#0d1400] ring-1 ring-[#0d1400]' : 'border-[#0d1400] bg-white'}`}
              style={{ 
                borderRadius: '12px',
                backgroundColor: isSelected ? '#ffffff' : cat.color
              }}
            >
              {/* Category Cover Image */}
              <div className="aspect-square w-full border border-[#0d1400] bg-white rounded-[8px] overflow-hidden">
                <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={coverImage}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Title & Count */}
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-base tracking-tight text-[#0d1400] group-hover:underline">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#0d1400]/60">
                    {cat.count} curated designs
                  </p>
                </div>
                <div className="p-2 border border-[#0d1400] rounded-full bg-white text-[#0d1400] group-hover:bg-[#0d1400] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
