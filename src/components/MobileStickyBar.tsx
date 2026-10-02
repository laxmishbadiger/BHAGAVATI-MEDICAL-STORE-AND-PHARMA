import React from 'react';
import { Phone, FileText, ShoppingBag } from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

interface MobileStickyBarProps {
  onOpenUploadModal: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  onOpenUploadModal,
  onOpenCart,
  cartCount,
}) => {
  return (
    <aside
      aria-label="Quick mobile order bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] px-3 py-2"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
        {/* Direct Call to Order (08892450227 / 8867089557) */}
        <a
          href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
          aria-label="Call pharmacy directly to order"
          className="h-11 flex items-center justify-center gap-1.5 px-2 rounded-xl bg-slate-950 active:bg-slate-900 text-amber-300 font-bold text-[11px] uppercase tracking-wider transition-colors shadow-sm border border-amber-400/50"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate font-mono">08892450227</span>
        </a>

        {/* Cart or Upload Rx */}
        {cartCount > 0 ? (
          <button
            onClick={onOpenCart}
            aria-label="View medicine cart"
            className="h-11 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Cart ({cartCount})</span>
          </button>
        ) : (
          <button
            onClick={onOpenUploadModal}
            aria-label="Upload prescription"
            className="h-11 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shadow-emerald-600/30"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">Upload Rx</span>
          </button>
        )}
      </div>
    </aside>
  );
};
