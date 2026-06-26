import React from 'react';
import { TShirtMockup } from './TShirtMockup';
import { DesignRenderer } from './DesignRenderer';
import { Download, CheckCircle, Flame, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onBrowseClick: () => void;
  onSellClick: () => void;
  bannerText?: string;
  announcementSub?: string;
  onSelectCategory?: (categoryTag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBrowseClick,
  onSellClick,
  bannerText,
  announcementSub,
  onSelectCategory
}) => {
  return (
    <section className="bg-white text-[#0d1400] pt-16 md:pt-24 pb-16 space-y-12 border-b border-[#0d1400] overflow-hidden">
      {/* Centered layout content */}
      <div className="max-w-4xl mx-auto text-center px-4 md:px-8">
        
        {/* Feature Strip tag with motion left to right */}
        <div className="w-full overflow-hidden mb-6 py-2 border-y border-[#0d1400]/10 bg-neutral-50/50">
          <div className="relative flex overflow-x-hidden">
            <motion.div 
              className="flex gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-[#0d1400]/60 py-1 select-none"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ 
                ease: "linear", 
                duration: 25, 
                repeat: Infinity 
              }}
            >
              <div className="flex items-center gap-8 shrink-0">
                <span>Instant Download</span>
                <span>•</span>
                <span>Commercial License</span>
                <span>•</span>
                <span>PNG + SVG Files</span>
                <span>•</span>
                <span>High Quality</span>
                <span>•</span>
                <span>POD Ready</span>
                <span>•</span>
              </div>
              <div className="flex items-center gap-8 shrink-0">
                <span>Instant Download</span>
                <span>•</span>
                <span>Commercial License</span>
                <span>•</span>
                <span>PNG + SVG Files</span>
                <span>•</span>
                <span>High Quality</span>
                <span>•</span>
                <span>POD Ready</span>
                <span>•</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-6 mb-10">
          <h1 className="font-display text-4xl sm:text-5xl md:text-[61px] font-semibold tracking-tighter text-[#0d1400] leading-[0.95] max-w-4xl mx-auto">
            {bannerText || "Premium Anime T-Shirt Designs Built To Sell"}
          </h1>
          <p className="text-[16px] text-[#0d1400]/70 max-w-2xl mx-auto leading-relaxed">
            {announcementSub || "Download professionally crafted anime-inspired artwork ready for Custom Store, TeePublic, Etsy, Redbubble, Merch by Amazon, and Shopify stores."}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={onBrowseClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] transition-colors text-xs font-bold tracking-widest uppercase border border-[#0d1400] rounded-full"
          >
            Browse Designs
          </button>
          <button
            onClick={onSellClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors text-xs font-bold tracking-widest uppercase border border-[#0d1400] rounded-full"
          >
            Sell Your Designs
          </button>
        </div>
      </div>

      {/* Hero artwork: Display a horizontal gallery of premium anime t-shirt mockups beneath the hero content */}
      <div className="w-full overflow-hidden py-8 border-t border-b border-[#0d1400] bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              Featured Showroom // Real-Time Interactive Canvas Models
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              Scroll to explore
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#0d1400]" />
            </span>
          </div>

          {/* Horizontal Gallery of mockups with scroll animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              onClick={() => onSelectCategory?.('One Piece')}
              className="bg-white p-4 border border-[#0d1400] rounded-[12px] space-y-3 hover:scale-[1.01] transition-transform flex flex-col justify-between cursor-pointer group"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full aspect-square overflow-hidden border border-[#0d1400] rounded-lg bg-neutral-50">
                <img 
                  src="/assets/luffy.jpg" 
                  alt="Monkey D. Luffy" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-sans font-bold text-xs text-[#0d1400] group-hover:underline">Monkey D. Luffy</span>
                <span className="font-mono text-[10px] text-neutral-400">Artwork</span>
              </div>
            </motion.div>

            <motion.div 
              onClick={() => onSelectCategory?.('Naruto')}
              className="bg-white p-4 border border-[#0d1400] rounded-[12px] space-y-3 hover:scale-[1.01] transition-transform flex flex-col justify-between cursor-pointer group"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            >
              <div className="w-full aspect-square overflow-hidden border border-[#0d1400] rounded-lg bg-neutral-50">
                <img 
                  src="/assets/naruto.jpg" 
                  alt="Naruto Uzumaki" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-sans font-bold text-xs text-[#0d1400] group-hover:underline">Naruto Uzumaki</span>
                <span className="font-mono text-[10px] text-neutral-400">Artwork</span>
              </div>
            </motion.div>

            <motion.div 
              onClick={() => onSelectCategory?.('Jujutsu Kaisen')}
              className="bg-white p-4 border border-[#0d1400] rounded-[12px] space-y-3 hover:scale-[1.01] transition-transform flex flex-col justify-between cursor-pointer group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full aspect-square overflow-hidden border border-[#0d1400] rounded-lg bg-neutral-50">
                <img 
                  src="/assets/gojo.jpg" 
                  alt="Satoru Gojo" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-sans font-bold text-xs text-[#0d1400] group-hover:underline">Satoru Gojo</span>
                <span className="font-mono text-[10px] text-neutral-400">Artwork</span>
              </div>
            </motion.div>

            <motion.div 
              onClick={() => onSelectCategory?.('Bleach')}
              className="bg-white p-4 border border-[#0d1400] rounded-[12px] space-y-3 hover:scale-[1.01] transition-transform flex flex-col justify-between cursor-pointer group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            >
              <div className="w-full aspect-square overflow-hidden border border-[#0d1400] rounded-lg bg-neutral-50">
                <img 
                  src="/assets/jinwoo.jpg" 
                  alt="Sung Jin-Woo" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-sans font-bold text-xs text-[#0d1400] group-hover:underline">Sung Jin-Woo</span>
                <span className="font-mono text-[10px] text-neutral-400">Artwork</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
