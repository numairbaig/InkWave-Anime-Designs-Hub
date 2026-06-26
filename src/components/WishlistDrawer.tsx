import React, { useState } from 'react';
import { Product } from '../types';
import { DesignRenderer } from './DesignRenderer';
import { X, Trash2, ArrowRight, Download, CheckCircle } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProduct
}) => {
  const [csvExported, setCsvExported] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    // Generate simple mock CSV for user's favorite products
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Category,Price,Url\n";
    favorites.forEach((p) => {
      csvContent += `"${p.id}","${p.title}","${p.category}",${p.price},"https://inkwave.com/design/${p.id}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inkwave_curated_designs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0d1400]/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-[#0d1400] text-[#0d1400] flex flex-col h-full animate-slideIn">
        {/* Header */}
        <div className="p-5 border-b border-[#0d1400] flex justify-between items-center bg-neutral-50">
          <div>
            <h3 className="font-display font-bold text-lg text-[#0d1400]">My Favorites ({favorites.length})</h3>
            <p className="text-[10px] font-mono text-[#0d1400]/60 uppercase tracking-widest mt-0.5">Your curated design collection</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-[#0d1400] hover:bg-[#0d1400] hover:text-white transition-colors rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {favorites.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-xs font-mono text-neutral-400 uppercase">Your list is empty</p>
              <p className="text-xs text-neutral-500 max-w-xs font-sans">
                Browse our collections and hit the heart icon to save designs you want to test or buy for your store!
              </p>
            </div>
          ) : (
            favorites.map((product) => (
              <div 
                key={product.id} 
                className="flex gap-4 p-3.5 border border-[#0d1400] bg-neutral-50/30 hover:bg-neutral-50/70 transition-all rounded-[12px]"
              >
                {/* Design Preview */}
                <div className="w-16 h-16 bg-white border border-[#0d1400] p-0.5 shrink-0 flex items-center justify-center rounded-lg overflow-hidden">
                  <DesignRenderer imageKey={product.imageKey} className="w-full h-full object-contain" />
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase bg-[#0d1400] text-white px-2 py-0.5 rounded-full border border-[#0d1400]">
                      {product.category}
                    </span>
                    <h4 
                      onClick={() => { onSelectProduct(product); onClose(); }}
                      className="font-sans font-bold text-sm truncate mt-2 hover:underline cursor-pointer text-[#0d1400]"
                    >
                      {product.title}
                    </h4>
                    <p className="text-xs font-mono font-bold mt-1 text-[#0d1400]">${product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#0d1400]/10 pt-2 mt-2">
                    <button
                      onClick={() => { onSelectProduct(product); onClose(); }}
                      className="text-[10px] font-mono font-bold text-neutral-500 hover:text-[#0d1400] flex items-center gap-1 uppercase cursor-pointer"
                    >
                      Specifications
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(product.id)}
                      className="p-1.5 border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white rounded-full transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {favorites.length > 0 && (
          <div className="p-5 border-t border-[#0d1400] bg-neutral-50/50 space-y-3">
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              <span>ESTIMATED PORTFOLIO VALUE:</span>
              <span className="font-bold text-sm text-[#0d1400]">${favorites.reduce((acc, p) => acc + p.price, 0).toFixed(2)}</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="w-full py-3.5 bg-[#0d1400] text-white hover:bg-[#aaff00] hover:text-[#0d1400] font-mono font-bold tracking-widest text-xs uppercase border border-[#0d1400] transition-colors flex items-center justify-center gap-2 rounded-full cursor-pointer"
            >
              <Download className="w-4 h-4" />
              EXPORT CSV CHECKLIST
            </button>
            {csvExported && (
              <p className="text-[10px] text-[#0d1400] font-mono text-center flex items-center justify-center gap-1 uppercase font-bold mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#0d1400]" />
                Curated designs CSV downloaded successfully!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
