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
  // Get 4 distinct product imageKeys for a category to populate the 2x2 grid
  const getCategoryPreviews = (tag: string) => {
    const matched = products.filter((p) => p.category === tag || p.tags.includes(tag));
    // Default fallback imageKeys if fewer than 4 items match
    const defaultKeys = ['samurai_crimson', 'straw_hat_pirate', 'oni_mech', 'cursed_eyes'];
    const previews = matched.map((p) => p.imageKey);
    
    // Fill up to 4 elements
    while (previews.length < 4) {
      previews.push(defaultKeys[previews.length % defaultKeys.length]);
    }
    return previews.slice(0, 4);
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
          const previews = getCategoryPreviews(cat.tag);
          const isSelected = selectedCategory === cat.tag;

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
              {/* 2x2 Design Preview Grid */}
              <div className="grid grid-cols-2 gap-2 aspect-square w-full border border-[#0d1400] bg-white p-3 rounded-[8px] overflow-hidden">
                {previews.map((imageKey, idx) => (
                  <div key={idx} className="aspect-square bg-neutral-50 p-1 flex items-center justify-center border border-neutral-100 overflow-hidden rounded-[4px]">
                    <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                      <DesignRenderer imageKey={imageKey} className="w-full h-full object-contain" />
                    </div>
                  </div>
                ))}
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
