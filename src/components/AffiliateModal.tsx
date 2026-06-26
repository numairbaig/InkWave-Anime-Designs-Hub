import React, { useState } from 'react';
import { Zap, Copy, CheckCircle2, DollarSign, Award, ArrowUpRight, X } from 'lucide-react';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliateModal: React.FC<AffiliateModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [promoCode, setPromoCode] = useState('AMB_ANIME_STREET');
  const trackingLink = `https://inkwave.com/join?ref=${promoCode.toLowerCase()}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1400]/80 backdrop-blur-xs">
      <div 
        id="affiliate-modal"
        className="w-full max-w-xl bg-white border border-[#0d1400] text-[#0d1400] flex flex-col overflow-hidden max-h-[90vh] rounded-[12px]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#aaff00] fill-current stroke-[#0d1400]" />
              InkWave Ambassador Hub
            </h3>
            <p className="text-xs text-[#0d1400]/60 font-mono mt-0.5 uppercase tracking-wider">
              EARN 15% RECURRING ON ALL SALES REFERRED
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-base">Make Money Selling Anime Streetwear Graphics</h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Print-on-demand stores, Etsy sellers, and Shopify brands are constantly hunting for high-resolution premium anime vectors. By joining the InkWave Ambassador program, you get rewarded every single time a merchant registers and downloads any design using your unique referral footprint.
            </p>
          </div>

          {/* Core Rewards Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 border border-[#0d1400] bg-neutral-50 text-center space-y-1.5 rounded-[12px]">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#aaff00]/20 border border-[#0d1400] mb-1">
                <DollarSign className="w-4 h-4 text-[#0d1400]" />
              </div>
              <p className="font-display font-bold text-base">15% Cut</p>
              <p className="text-[9px] font-mono text-[#0d1400]/60 uppercase">Per purchase fee</p>
            </div>

            <div className="p-4 border border-[#0d1400] bg-neutral-50 text-center space-y-1.5 rounded-[12px]">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#aaff00]/20 border border-[#0d1400] mb-1">
                <Award className="w-4 h-4 text-[#0d1400]" />
              </div>
              <p className="font-display font-bold text-base">30 Days</p>
              <p className="text-[9px] font-mono text-[#0d1400]/60 uppercase">Cookie validity</p>
            </div>

            <div className="p-4 border border-[#0d1400] bg-neutral-50 text-center space-y-1.5 rounded-[12px]">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#aaff00]/20 border border-[#0d1400] mb-1">
                <ArrowUpRight className="w-4 h-4 text-[#0d1400]" />
              </div>
              <p className="font-display font-bold text-base">Instant</p>
              <p className="text-[9px] font-mono text-[#0d1400]/60 uppercase">Earnings transfer</p>
            </div>
          </div>

          {/* Code Customization Section */}
          <div className="space-y-4 p-5 border border-[#0d1400] bg-[#aaff00]/5 rounded-[12px]">
            <div>
              <label className="block text-[10px] font-mono text-[#0d1400] uppercase font-bold mb-1.5">
                Customize Your Tracker Code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                placeholder="AMB_ANIME_STREET"
                className="w-full px-4 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs font-mono uppercase bg-white rounded-full text-[#0d1400]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#0d1400]/60 block font-bold">Your Ambassador Referral URL</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={trackingLink}
                  className="flex-1 px-4 py-2.5 border border-[#0d1400] text-xs font-mono bg-neutral-50 select-all text-[#0d1400]/70 focus:outline-hidden rounded-full"
                />
                <button
                  onClick={handleCopy}
                  className="px-5 py-2.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] text-xs font-mono font-bold uppercase transition-colors shrink-0 rounded-full cursor-pointer border border-[#0d1400]"
                >
                  {copiedLink ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-neutral-600 font-sans">
            <h5 className="font-mono text-xs font-bold uppercase text-[#0d1400]">How to promote your code:</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create apparel design review tutorials on YouTube, TikTok or Instagram.</li>
              <li>Include your referral link in descriptions when showing your print setup.</li>
              <li>Post mockup boards on Pinterest with links straight to our high-resolution pages.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#0d1400] bg-neutral-50 text-right flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] border border-[#0d1400] text-xs font-mono font-bold uppercase transition-colors rounded-full cursor-pointer"
          >
            Got It, Start Referring!
          </button>
        </div>
      </div>
    </div>
  );
};
