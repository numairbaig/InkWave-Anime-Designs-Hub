import React, { useState } from 'react';
import { Product, Review } from '../types';
import { REVIEWS } from '../data';
import { DesignRenderer } from './DesignRenderer';
import { TShirtMockup } from './TShirtMockup';
import { Heart, Flame, ShoppingBag, ArrowLeft, Image, FileDown, Shield, CheckCircle2, MessageSquare } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPurchase: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onSelectCreator: (id: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onPurchase,
  onToggleFavorite,
  isFavorite,
  onSelectCreator
}) => {
  // Mockup mode switcher: 'design' (raw vector) vs t-shirt mockups
  const [mockupView, setMockupView] = useState<'design' | 'white' | 'black' | 'cream'>('design');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [licenseType, setLicenseType] = useState<'personal' | 'commercial' | 'extended'>('commercial');
  
  // Reviews state
  const [productReviews, setProductReviews] = useState<Review[]>(
    REVIEWS.filter((r) => r.productId === product.id)
  );
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewUser, setNewReviewUser] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  const getPrice = () => {
    if (licenseType === 'personal') return product.price * 0.75;
    if (licenseType === 'extended') return product.price * 2.5;
    return product.price;
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim() || !newReviewUser.trim()) return;

    const added: Review = {
      id: `new-r-${Date.now()}`,
      productId: product.id,
      user: newReviewUser,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    setProductReviews([added, ...productReviews]);
    setNewReviewComment('');
    setNewReviewUser('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 animate-fadeIn text-[#0d1400]">
      {/* Back to Marketplace */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase hover:opacity-75 transition-opacity py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Large Preview + Mockup Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#0d1400] bg-white relative flex flex-col items-center justify-center min-h-[450px] md:min-h-[550px] p-6 rounded-[12px] overflow-hidden">
            
            {/* Real Render Container */}
            <div 
              className="w-full max-w-md mx-auto aspect-square flex items-center justify-center transition-all duration-300"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {mockupView === 'design' ? (
                <DesignRenderer imageKey={product.imageKey} className="w-full h-full object-contain max-h-[400px]" />
              ) : (
                <TShirtMockup imageKey={product.imageKey} shirtColor={mockupView} className="w-full h-full" />
              )}
            </div>

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#0d1400] text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              {product.badge && (
                <span className="bg-[#aaff00] text-[#0d1400] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border border-[#0d1400] rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Zoom Slider */}
            <div className="absolute bottom-4 right-4 bg-white border border-[#0d1400] px-3.5 py-1.5 flex items-center gap-3 rounded-full">
              <span className="text-[10px] font-mono uppercase text-[#0d1400]/50">Zoom</span>
              <input 
                type="range" 
                min="80" 
                max="130" 
                value={zoomLevel} 
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-20 accent-[#0d1400]"
              />
              <span className="text-xs font-mono font-bold w-8">{zoomLevel}%</span>
            </div>
          </div>

          {/* Mockup Gallery Thumbnails */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#0d1400]/60">Interactive Previews</p>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setMockupView('design')}
                className={`p-2 border bg-white flex flex-col items-center gap-1.5 transition-all rounded-[12px] ${mockupView === 'design' ? 'border-[#0d1400] ring-1 ring-[#0d1400]' : 'border-[#0d1400]/30 hover:border-[#0d1400]'}`}
              >
                <div className="w-12 h-12 bg-neutral-50 p-1 flex items-center justify-center border border-neutral-100 rounded-lg">
                  <Image className="w-5 h-5 text-neutral-400" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-[#0d1400]">Flat Vector</span>
              </button>

              <button
                onClick={() => setMockupView('white')}
                className={`p-2 border bg-white flex flex-col items-center gap-1.5 transition-all rounded-[12px] ${mockupView === 'white' ? 'border-[#0d1400] ring-1 ring-[#0d1400]' : 'border-[#0d1400]/30 hover:border-[#0d1400]'}`}
              >
                <div className="w-12 h-12 bg-white flex items-center justify-center border border-neutral-200 rounded-lg">
                  <div className="w-6 h-6 border border-[#0d1400]/20 bg-white" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-[#0d1400]">White Tee</span>
              </button>

              <button
                onClick={() => setMockupView('black')}
                className={`p-2 border bg-white flex flex-col items-center gap-1.5 transition-all rounded-[12px] ${mockupView === 'black' ? 'border-[#0d1400] ring-1 ring-[#0d1400]' : 'border-[#0d1400]/30 hover:border-[#0d1400]'}`}
              >
                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center border border-neutral-800 rounded-lg">
                  <div className="w-6 h-6 border border-white/20 bg-neutral-950" />
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-[#0d1400]">Black Tee</span>
              </button>

              <button
                onClick={() => setMockupView('cream')}
                className={`p-2 border bg-white flex flex-col items-center gap-1.5 transition-all rounded-[12px] ${mockupView === 'cream' ? 'border-[#0d1400] ring-1 ring-[#0d1400]' : 'border-[#0d1400]/30 hover:border-[#0d1400]'}`}
              >
                <div className="w-12 h-12 bg-[#f7f5eb] flex items-center justify-center border border-[#e0ddcc] rounded-lg">
                  <div className="w-6 h-6 border border-[#0d1400]/10 bg-[#f7f5eb]" />
                </div>
                <span className="text-[9px] font-mono uppercase">Cream Tee</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Buying info + Formats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header titles */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onSelectCreator(product.creatorId)}
                className="text-xs font-mono font-bold hover:underline"
              >
                Designed by @{product.creatorName}
              </button>
              <div className="flex items-center gap-1.5 border-l border-neutral-300 pl-4">
                <div className="flex text-[#ef4444]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-mono font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-xs font-mono text-neutral-400">({productReviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <hr className="border-[#0d1400]/10" />

          {/* Pricing Box */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Pricing</span>
              <p className="font-display text-4xl font-bold tracking-tight text-[#0d1400]">
                ${getPrice().toFixed(2)}
              </p>
            </div>

            {/* License Type Picker */}
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Select License Agreement</p>
              <div className="grid grid-cols-1 gap-2">
                
                {/* Personal Option */}
                <div 
                  onClick={() => setLicenseType('personal')}
                  className={`p-3 border flex justify-between items-center cursor-pointer transition-all rounded-[12px] ${licenseType === 'personal' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono">Personal Use Only</span>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Use in single non-commercial project. No resale.</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-500">-${(product.price * 0.25).toFixed(2)}</span>
                </div>

                {/* Commercial Option */}
                <div 
                  onClick={() => setLicenseType('commercial')}
                  className={`p-3 border flex justify-between items-center cursor-pointer transition-all rounded-[12px] ${licenseType === 'commercial' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono flex items-center gap-1.5">
                      Commercial Use <span className="text-[9px] bg-[#aaff00] text-[#0d1400] px-1.5 font-bold py-0.5 border border-[#0d1400] rounded-full">RECOMMENDED</span>
                    </span>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Etsy, Shopify, Merch by Amazon & POD ready. Unlimited sales.</p>
                  </div>
                  <span className="font-mono text-xs font-bold">Standard Price</span>
                </div>

                {/* Extended Option */}
                <div 
                  onClick={() => setLicenseType('extended')}
                  className={`p-3 border flex justify-between items-center cursor-pointer transition-all rounded-[12px] ${licenseType === 'extended' ? 'border-[#0d1400] bg-neutral-50 ring-1 ring-[#0d1400]' : 'border-[#0d1400] hover:bg-neutral-50'}`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono">Extended License</span>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Resale rights, transfer ownership, sub-licensing permission.</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-500">+${(product.price * 1.5).toFixed(2)}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPurchase({ ...product, price: getPrice() })}
              className="flex-1 py-4 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono font-bold tracking-widest text-xs uppercase border border-[#0d1400] transition-colors flex items-center justify-center gap-2 rounded-full"
            >
              <ShoppingBag className="w-4 h-4" />
              DOWNLOAD NOW — ${getPrice().toFixed(2)}
            </button>
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`w-14 h-14 border flex items-center justify-center transition-colors rounded-full shrink-0 ${isFavorite ? 'bg-[#ef4444]/10 border-[#ef4444] text-[#ef4444]' : 'border-[#0d1400] text-[#0d1400] hover:bg-neutral-50'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Safety badges */}
          <div className="p-4 border border-[#0d1400] bg-neutral-50/50 flex items-start gap-3 rounded-[12px]">
            <Shield className="w-5 h-5 text-neutral-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500">Verified Marketplace Guarantee</span>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                All uploaded designs undergo pixel-level validation for stray transparent pixels, duplicate vectors, and profile color mismatches. Fully compatible with Printful, Printify, Gelato, and custom screen presses.
              </p>
            </div>
          </div>

          {/* Included Files Specs */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Included High-Res Files</p>
            <div className="border border-[#0d1400] divide-y divide-[#0d1400] bg-white rounded-[12px] overflow-hidden">
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold">PNG Transparent Graphic</span>
                <span className="font-mono text-neutral-400">4500 × 5400 px // 300 DPI</span>
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold">Scalable Vector (SVG)</span>
                <span className="font-mono text-[#0d1400] bg-[#aaff00] border border-[#0d1400] px-2 font-bold rounded-full py-0.5">Infinite Resolution</span>
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold">Adobe Illustrator Source (.ai)</span>
                <span className="font-mono text-neutral-400">Layered Vector Source</span>
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs">
                <span className="font-bold">Encapsulated PostScript (.eps)</span>
                <span className="font-mono text-neutral-400">Universal Vector</span>
              </div>
            </div>
          </div>

          {/* Description text */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Design Specifications</p>
            <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
          </div>

        </div>
      </div>

      {/* REVIEWS & RATINGS */}
      <div className="border-t border-[#0d1400]/10 pt-10 space-y-8">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 opacity-60" />
            Reviews and Printing Feedback
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            VERIFIED EXPERIENCES FROM PRINT-ON-DEMAND STORE OWNERS & MERCHANTS
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of reviews */}
          <div className="lg:col-span-7 space-y-4">
            {productReviews.length === 0 ? (
              <p className="text-xs text-neutral-400 font-mono">No reviews left for this design yet. Be the first to print and review!</p>
            ) : (
              productReviews.map((review) => (
                <div key={review.id} className="p-5 border border-[#0d1400] bg-white space-y-3 rounded-[12px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs">{review.user}</span>
                      <p className="text-[9px] text-[#0d1400]/50 font-mono uppercase mt-0.5">{review.date}</p>
                    </div>
                    <div className="flex text-[#ef4444]">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add a review form */}
          <div className="lg:col-span-5 border border-[#0d1400] bg-neutral-50 p-6 space-y-4 rounded-[12px]">
            <h4 className="font-display font-bold text-sm uppercase">Submit Merchant Feedback</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Help fellow print creators by sharing details on color vibrancy, printing technology (DTG/Screen-print), or file layer usage.
            </p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">Your Store/Brand Name</label>
                <input
                  type="text"
                  required
                  value={newReviewUser}
                  onChange={(e) => setNewReviewUser(e.target.value)}
                  placeholder="e.g. Kyoto Apparel Group"
                  className="w-full px-3.5 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">Flame Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-full appearance-none"
                >
                  <option value={5}>🔥🔥🔥🔥🔥 (5/5 Excellence)</option>
                  <option value={4}>🔥🔥🔥🔥 (4/5 Very Good)</option>
                  <option value={3}>🔥🔥🔥 (3/5 Average)</option>
                  <option value={2}>🔥🔥 (2/5 Subpar)</option>
                  <option value={1}>🔥 (1/5 Unusable)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#0d1400] uppercase mb-1">Feedback/Review</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell us about your print quality, file layer settings, or shop response..."
                  className="w-full px-4 py-3 border border-[#0d1400] focus:outline-hidden text-xs bg-white rounded-[16px]"
                />
              </div>

              {showReviewSuccess && (
                <div className="p-3 bg-[#aaff00]/25 text-[#0d1400] border border-[#0d1400] text-xs flex items-center gap-2 rounded-[8px]">
                  <CheckCircle2 className="w-4 h-4 text-[#0d1400]" />
                  <span>Review successfully submitted to community.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono text-xs font-bold uppercase transition-colors rounded-full border border-[#0d1400]"
              >
                PUBLISH COMMUNITY FEEDBACK
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
