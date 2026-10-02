import React, { useState, useEffect } from 'react';
import { Medicine, CartItem } from '../types/pharmacy';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import { getInventory, InventoryItem, isAntibioticMedicine } from '../lib/inventory';
import {
  Search,
  Plus,
  Check,
  ShieldAlert,
  Thermometer,
  Sparkles,
  Package,
  FileText,
  Phone,
  AlertTriangle,
  ShoppingBag,
  Tag,
  ChevronDown
} from 'lucide-react';

interface CatalogSectionProps {
  onAddToCart: (medicine: Medicine, quantity?: number) => void;
  onUpdateQuantity?: (medicineId: string, delta: number) => void;
  cartItems?: CartItem[];
  onOpenUploadModal: () => void;
  onOpenCart?: () => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onAddToCart,
  onUpdateQuantity,
  cartItems = [],
  onOpenUploadModal,
  onOpenCart,
}) => {
  const [medicines, setMedicines] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedIds, setJustAddedIds] = useState<{ [id: string]: boolean }>({});

  // Sync with live inventory
  const reloadInventory = () => {
    setMedicines(getInventory());
  };

  useEffect(() => {
    reloadInventory();
    const handleUpdate = () => reloadInventory();
    window.addEventListener('bhagavati_inventory_updated', handleUpdate);
    return () => window.removeEventListener('bhagavati_inventory_updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'All Medications' },
    { id: 'prescription', label: 'Prescription Rx' },
    { id: 'pain-relief', label: 'Pain & Fever' },
    { id: 'chronic-care', label: 'Cardiac & Diabetes' },
    { id: 'vitamins', label: 'Vitamins & Immunity' },
    { id: 'first-aid', label: 'First Aid & Antiseptic' },
    { id: 'baby-care', label: 'Baby Care & Diapers' },
  ];

  const filteredMedicines = medicines.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartItemQuantity = (medId: string) => {
    const found = cartItems.find((ci) => ci.medicine.id === medId);
    return found ? found.quantity : 0;
  };

  const handleAdd = (med: Medicine) => {
    onAddToCart(med, 1);
    setJustAddedIds((prev) => ({ ...prev, [med.id]: true }));
    setTimeout(() => {
      setJustAddedIds((prev) => ({ ...prev, [med.id]: false }));
    }, 1200);
  };

  return (
    <section id="catalog" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                10% – 20% Off · Best Price Dharwad
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Free Delivery over ₹300</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Store Pickup Available</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>20-Min Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
              Medicines & Healthcare Formulary
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Authentic Indian Pharmacopoeia (IP) grade medicines, baby essentials, and chronic care tablets at guaranteed best retail prices. In stock at Prabhu Complex, Dharwad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-[0.98] border border-amber-400/40"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call & Order: {PHARMACY_CONFIG.phoneHighlight}</span>
            </a>

            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>Upload Prescription</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine (e.g. Dolo, Augmentin)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Medicine Grid */}
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <p className="text-slate-600 text-sm font-semibold">
              No medications found matching "{searchQuery}".
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Need this specific medicine? Call 08892450227 directly and our pharmacist at Prabhu Complex will arrange it for you.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-emerald-700 font-bold hover:underline"
            >
              Reset search filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((med) => {
              const cartQty = getCartItemQuantity(med.id);
              const isJustAdded = justAddedIds[med.id];
              const isAntibiotic = med.isAntibiotic || isAntibioticMedicine(med);

              // Discount calculation
              const hasDiscount = med.originalPrice && med.originalPrice > med.price;
              const discountPct = hasDiscount
                ? Math.round(((med.originalPrice! - med.price) / med.originalPrice!) * 100)
                : 15;

              return (
                <div
                  key={med.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
                    cartQty > 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    {/* Top badges & metadata */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                        <span>{med.dosage}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span>{hasDiscount ? `${discountPct}% OFF` : '10-20% OFF'}</span>
                        </span>

                        {med.requiresRx ? (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <span className="font-serif font-black">℞</span> Rx
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-md">
                            OTC
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & generic */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {med.name}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      Generic: {med.genericName}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {med.description}
                    </p>

                    {/* Storage & Stock */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{med.temperatureRequirement}</span>
                      </div>
                      <span className="text-emerald-700 font-semibold">
                        In Stock · Prabhu Complex
                      </span>
                    </div>

                    {/* Antibiotic warning message requirement 3.1 */}
                    {isAntibiotic && (
                      <div className="mt-3 p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 leading-tight">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-amber-950 block">Antibiotic Course Notice:</strong>
                          <span>Take full course medicine as advised by doctor. Do not discontinue early.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart action bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black font-mono text-slate-900">
                            ₹{med.price.toFixed(2)}
                          </span>
                          {med.originalPrice && (
                            <span className="text-xs font-mono text-slate-400 line-through">
                              ₹{med.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          Quick Dharwad Delivery
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart / Active In-Cart Stepper */}
                    <div className="flex items-center gap-2">
                      {cartQty > 0 && onUpdateQuantity ? (
                        <div className="flex-1 flex items-center justify-between bg-emerald-50 border-2 border-emerald-400 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(med.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 font-black text-base flex items-center justify-center border border-emerald-200 transition-colors active:scale-95"
                            title="Decrease quantity"
                          >
                            -
                          </button>

                          <div className="text-center px-2">
                            <span className="text-xs font-black font-mono text-emerald-950 block">
                              {cartQty} in Cart
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold font-mono">
                              (₹{(cartQty * med.price).toFixed(2)})
                            </span>
                          </div>

                          <button
                            onClick={() => onUpdateQuantity(med.id, 1)}
                            className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center transition-colors shadow-sm active:scale-95"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(med)}
                          disabled={isJustAdded}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-xl transition-all active:scale-[0.97] ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm shadow-emerald-700/20'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* If in cart, show small cart jump button */}
                      {cartQty > 0 && onOpenCart && (
                        <button
                          onClick={onOpenCart}
                          className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors"
                          title="View Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
