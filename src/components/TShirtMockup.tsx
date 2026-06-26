import React from 'react';
import { DesignRenderer } from './DesignRenderer';

interface TShirtMockupProps {
  imageKey: string;
  shirtColor?: 'white' | 'black' | 'cream';
  className?: string;
}

export const TShirtMockup: React.FC<TShirtMockupProps> = ({
  imageKey,
  shirtColor = 'white',
  className = "w-full aspect-square"
}) => {
  const getBgColor = () => {
    switch (shirtColor) {
      case 'black': return '#121212';
      case 'cream': return '#f7f5eb';
      case 'white':
      default:
        return '#f9f9f9';
    }
  };

  const getSleeveColor = () => {
    switch (shirtColor) {
      case 'black': return '#1a1a1a';
      case 'cream': return '#f0eee2';
      case 'white':
      default:
        return '#f0f0f0';
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden border border-[#0d1400] rounded-xl bg-neutral-50 p-6 ${className}`}>
      {/* T-Shirt Vector Background Outline */}
      <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {/* T-shirt main body shadow (very soft flat shadow or double stroke) */}
        <path 
          d="M 150 70 
             Q 200 88, 250 88 
             Q 300 88, 350 70 
             L 450 140 
             L 390 200 
             L 360 180 
             L 360 460 
             L 140 460 
             L 140 180 
             L 110 200 
             L 50 140 Z" 
          fill={getBgColor()} 
          stroke="#0d1400" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
        />

        {/* Sleeves details/seams */}
        <path d="M 110 200 L 140 180" stroke="#0d1400" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
        <path d="M 390 200 L 360 180" stroke="#0d1400" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
        
        {/* Sleeve fold highlights */}
        <path d="M 50 140 L 110 200" fill={getSleeveColor()} opacity="0.15" />
        <path d="M 450 140 L 390 200" fill={getSleeveColor()} opacity="0.15" />

        {/* Neck collar ribbing */}
        <path 
          d="M 150 70 
             Q 200 88, 250 88 
             Q 300 88, 350 70 
             Q 300 102, 250 102 
             Q 200 102, 150 70 Z" 
          fill={getSleeveColor()} 
          stroke="#0d1400" 
          strokeWidth="2.5" 
        />
        
        {/* Inner tag print mockup (Artboard Editorial language) */}
        <text x="250" y="125" fontFamily="monospace" fontSize="8" fontWeight="bold" fill={shirtColor === 'black' ? '#ffffff' : '#0d1400'} textAnchor="middle" opacity="0.3">
          INKWAVE • SIZE L • 100% COTTON
        </text>

        {/* T-shirt bottom hem seam line */}
        <line x1="140" y1="452" x2="360" y2="452" stroke="#0d1400" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />
      </svg>

      {/* Actual anime design artwork container centered on chest (responsive absolute percentage sizing) */}
      <div className="absolute w-[36%] h-[36%] left-[32%] top-[31%] z-10 select-none">
        {/* The vector artwork rendered perfectly with absolute scale */}
        <div className="w-full h-full rounded border border-[#0d1400]/5 overflow-hidden transition-transform duration-300 hover:scale-[1.03]">
          <DesignRenderer imageKey={imageKey} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Quality Badge overlays */}
      <div className="absolute bottom-3 left-3 flex gap-1 z-10 pointer-events-none">
        <span className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 bg-[#0d1400] text-white border border-[#0d1400] rounded-sm">
          {shirtColor}
        </span>
        <span className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 bg-[#aaff00] text-[#0d1400] font-bold border border-[#0d1400] rounded-sm">
          300 DPI
        </span>
      </div>
    </div>
  );
};
