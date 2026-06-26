import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Layers, TrendingUp, Cpu, ShoppingCart, User, Heart, Shield, LogOut } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../types';

interface NavigationProps {
  activeView: 'marketplace' | 'dashboard' | 'detail' | 'creator' | 'admin' | 'affiliate' | 'terms' | 'privacy' | 'auth';
  onNavigate: (view: 'marketplace' | 'dashboard' | 'admin') => void;
  onScrollToSection: (id: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAffiliate: () => void;
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onNavigate,
  onScrollToSection,
  favoritesCount,
  onOpenFavorites,
  onOpenAffiliate,
  user,
  userProfile,
  onLogout,
  onOpenAuth
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar if scrolling up or if near the very top of the page (< 50px)
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    onNavigate('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (sectionId: string) => {
    onNavigate('marketplace');
    setIsOpen(false);
    setTimeout(() => {
      onScrollToSection(sectionId);
    }, 100);
  };

  return (
    <nav className={`sticky top-0 z-40 bg-white border-b border-[#0d1400] text-[#0d1400] transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left side: Brand Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-8 h-8 bg-[#0d1400] text-[#aaff00] flex items-center justify-center font-display font-extrabold text-sm tracking-tighter rounded-full">
            IW
          </div>
          <span className="font-display font-black text-2xl tracking-tighter uppercase hover:text-[#aaff00] transition-colors">
            InkWave
          </span>
        </div>

        {/* Center: Main Links */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider">
          <button 
            onClick={() => { onNavigate('marketplace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`hover:opacity-70 transition-opacity py-1 ${activeView === 'marketplace' ? 'border-b-2 border-[#0d1400]' : ''}`}
          >
            Explore
          </button>
          <button 
            onClick={() => handleNavClick('categories-section')}
            className="hover:opacity-70 transition-opacity py-1"
          >
            Categories
          </button>
          <button 
            onClick={() => handleNavClick('trending-section')}
            className="hover:opacity-70 transition-opacity py-1"
          >
            Trending Designs
          </button>
        </div>

        {/* Right side: Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Wishlist Button */}
          <button 
            onClick={onOpenFavorites}
            className="relative p-2 border border-[#0d1400] hover:bg-neutral-50 transition-colors rounded-full mr-1 cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center border border-white animate-bounce">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* User authentication info */}
          {user ? (
            <div className="flex items-center gap-3 border border-[#0d1400] bg-neutral-50 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 bg-[#0d1400] text-[#aaff00] flex items-center justify-center rounded-full text-[10px] font-bold uppercase font-mono">
                {userProfile?.displayName ? userProfile.displayName[0] : (user.displayName ? user.displayName[0] : (user.email ? user.email[0] : 'U'))}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold leading-tight line-clamp-1 max-w-[100px]">
                  {userProfile?.displayName || user.displayName || 'User'}
                </span>
                <span className="text-[8px] font-mono text-neutral-500 leading-none">
                  {userProfile?.role === 'creator' ? 'Creator / Seller' : 'Buyer Account'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1 hover:bg-neutral-200 rounded-full text-red-500 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 border border-[#0d1400] text-[11px] font-mono font-bold uppercase tracking-wider rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Start Selling Outlined CTA */}
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-5 py-2 border text-[13px] font-semibold uppercase tracking-wider transition-all rounded-full cursor-pointer ${activeView === 'dashboard' ? 'bg-[#0d1400] text-[#aaff00] border-[#0d1400]' : 'border-[#0d1400] text-[#0d1400] hover:bg-[#0d1400] hover:text-white'}`}
          >
            {userProfile?.role === 'creator' ? 'Creator Console' : 'Start Selling'}
          </button>

          {/* Upload Design CTA */}
          <button
            onClick={() => { onNavigate('dashboard'); }}
            className="px-5 py-2 bg-[#aaff00] text-[#0d1400] hover:bg-[#0d1400] hover:text-white text-[13px] font-semibold uppercase tracking-wider border border-[#0d1400] rounded-full transition-colors cursor-pointer"
          >
            Upload Design
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={onOpenFavorites}
            className="relative p-2 border border-[#0d1400] rounded-full cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#ef4444] text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center border border-white">
                {favoritesCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 border border-[#0d1400] text-[#0d1400] rounded-full cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[#0d1400] bg-white text-[#0d1400] p-6 space-y-6 font-display text-sm uppercase tracking-wider font-bold">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { onNavigate('marketplace'); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); }}
              className="text-left py-2 hover:opacity-75 transition-opacity"
            >
              Explore
            </button>
            <button 
              onClick={() => handleNavClick('categories-section')}
              className="text-left py-2 hover:opacity-75 transition-opacity"
            >
              Categories
            </button>
            <button 
              onClick={() => handleNavClick('trending-section')}
              className="text-left py-2 hover:opacity-75 transition-opacity"
            >
              Trending Designs
            </button>
          </div>

          <hr className="border-[#0d1400]/10" />

          {/* User Auth block in Mobile Drawer */}
          <div className="space-y-4">
            {user ? (
              <div className="flex items-center justify-between border border-[#0d1400]/10 p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0d1400] text-[#aaff00] flex items-center justify-center rounded-full text-xs font-bold uppercase font-mono">
                    {userProfile?.displayName ? userProfile.displayName[0] : (user.displayName ? user.displayName[0] : (user.email ? user.email[0] : 'U'))}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight">
                      {userProfile?.displayName || user.displayName || 'User'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 lowercase leading-none">
                      {userProfile?.role === 'creator' ? 'Creator / Seller' : 'Buyer Account'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="px-3 py-1.5 border border-red-500 text-red-500 text-[10px] font-mono uppercase tracking-wider rounded-lg flex items-center gap-1 hover:bg-red-50"
                >
                  <LogOut className="w-3 h-3" /> Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setIsOpen(false); }}
                className="w-full text-center py-2.5 border border-[#0d1400] text-xs font-bold rounded-full bg-neutral-50 hover:bg-neutral-100"
              >
                Sign In / Sign Up
              </button>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
                className="w-full text-center py-2.5 border border-[#0d1400] text-xs font-bold rounded-full"
              >
                {userProfile?.role === 'creator' ? 'Creator Console' : 'Start Selling'}
              </button>
              <button
                onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
                className="w-full text-center py-2.5 bg-[#aaff00] text-[#0d1400] text-xs font-bold border border-[#0d1400] rounded-full"
              >
                Upload Design
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
