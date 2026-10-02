import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAnimation } from './components/HeroAnimation';
import { Showcase3DSection } from './components/Showcase3DSection';
import { SmartMedicineSearch } from './components/SmartMedicineSearch';
import { CatalogSection } from './components/CatalogSection';
import { SafetySection } from './components/SafetySection';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { AdminOrdersPortal } from './components/AdminOrdersPortal';
import { LiveTrackerModal } from './components/LiveTrackerModal';
import { StoreLocationModal } from './components/StoreLocationModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { FreeCounselingModal } from './components/FreeCounselingModal';
import { Medicine, CartItem } from './types/pharmacy';
import { PHARMACY_CONFIG } from './data/pharmacyData';
import {
  FileText,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Thermometer,
  Zap,
  MapPin,
  ExternalLink,
  QrCode,
  DollarSign,
  Search,
  ClipboardList,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('BMS-89421');

  // Cart operations
  const handleAddToCart = (medicine: Medicine, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { medicine, quantity }];
    });
  };

  const handleUpdateQuantity = (medicineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id === medicineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const handleCheckoutComplete = (newOrderId: string) => {
    setActiveTrackingOrderId(newOrderId);
    setCart([]);
    setIsTrackerOpen(true);
  };

  const handleOrderCreatedFromRx = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setIsTrackerOpen(true);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with Phone & Admin Link */}
      <Navbar
        cartItemCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
        onOpenCounselingModal={() => setIsCounselingModalOpen(true)}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden border-b border-slate-200/70">
          {/* Subtle Ambient Parallax Floating Pills in Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
            <div className="absolute top-12 left-10 w-24 h-10 rounded-full border border-emerald-300/40 bg-emerald-100/30 rotate-12 blur-[1px] animate-float-slow" />
            <div className="absolute bottom-16 left-24 w-14 h-14 rounded-full border border-slate-300 bg-white/40 shadow-sm blur-[0.5px] animate-float-slow [animation-delay:2s]" />
            <div className="absolute top-20 right-8 w-28 h-12 rounded-full border border-amber-300/40 bg-amber-100/20 -rotate-12 blur-[1px] animate-float-slow [animation-delay:1s]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Store Details & CTAs */}
              <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                {/* Location metadata lead-in */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-700">
                  <span className="text-emerald-800 font-bold">
                    Prabhu Complex, Opp. JSS Gate, Vidyagiri
                  </span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span>Dharwad, Karnataka 580004</span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-amber-700 font-bold">20-Min Delivery</span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-display text-balance">
                  {PHARMACY_CONFIG.name}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Your neighborhood retail pharmacy in Dharwad. Quick 20–30 minute emergency delivery in Dharwad, safe all-India courier shipping, and 100% genuine pharmaceuticals.
                </p>

                {/* BIG PROMINENT PHONE CALL & ORDER HIGHLIGHT */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-2xl shadow-lg border-2 border-amber-300 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] font-black uppercase tracking-wider block text-slate-900">
                      Need Medicines Fast? Call Me & Order Directly:
                    </span>
                    <a
                      href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                      className="text-2xl sm:text-3xl font-black font-mono tracking-wide text-slate-950 hover:underline block"
                    >
                      {PHARMACY_CONFIG.phoneHighlight}
                    </a>
                  </div>

                  <a
                    href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Tap to Call & Order</span>
                  </a>
                </div>

                {/* UPI & CASH ON DELIVERY NOTICE BANNER */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UPI Accepted (PhonePe / GPay / Paytm QR)</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span>💵 Cash on Delivery (COD)</span>
                  </div>
                </div>

                {/* Exact User Requested Free Advice Interactive Banner */}
                <button
                  onClick={() => setIsCounselingModalOpen(true)}
                  className="w-full text-left p-3.5 sm:p-4 bg-emerald-50 hover:bg-emerald-100/90 border-2 border-emerald-400 rounded-2xl shadow-sm transition-all group flex items-start sm:items-center justify-between gap-3 active:scale-[0.99]"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <HeartHandshake className="w-5 h-5 text-emerald-200" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded mb-1">
                        Free Patient & Drug Counselling
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-emerald-950 group-hover:text-emerald-900 leading-snug">
                        Ask Pharmacist if you need any free advice on what to consume and how much quantity and when, before or after or any other question related to drug.
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs group-hover:bg-emerald-800 hidden sm:inline-block">
                    Ask Free Now →
                  </span>
                </button>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>Upload Prescription (Rx)</span>
                  </button>

                  <button
                    onClick={() => setIsCounselingModalOpen(true)}
                    className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-950 font-bold text-xs sm:text-sm rounded-xl border border-emerald-300 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                    title="Ask Pharmacist if you need any free advice on what to consume and how much quantity and when, before or after or any other question related to drug."
                  >
                    <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free Pharmacist Advice</span>
                  </button>

                  <a
                    href="#smart-search"
                    className="px-4 py-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xs"
                  >
                    <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Search Medicines</span>
                  </a>

                  <a
                    href={PHARMACY_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Store Map</span>
                  </a>
                </div>

                {/* Three Trust Markers */}
                <div className="pt-3 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-200/80 text-left">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-xs sm:text-sm">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>20-Min Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      JSS, Vidyagiri, Toll Naka, Sattur
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Genuine</span>
                    </div>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      Authentic medicines & surgicals
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>UPI & COD</span>
                    </div>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      Pay via QR or Cash at doorstep
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Medicine Animation Theater */}
              <div className="lg:col-span-6 flex justify-center">
                <HeroAnimation
                  onOpenUploadModal={() => setIsUploadOpen(true)}
                  onTrackOrder={() => setIsTrackerOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* REAL STORE PHOTOGRAPHY & 3D SHOWCASE */}
        <Showcase3DSection
          onOpenUploadModal={() => setIsUploadOpen(true)}
        />

        {/* SMART AUTO-SEARCH WITH VOICE, VIDEO, TEXT, AND RX ORDERING */}
        <SmartMedicineSearch
          onAddToCart={handleAddToCart}
          onOpenUploadModal={() => setIsUploadOpen(true)}
        />

        {/* PHARMACY CATALOG & FORMULARY */}
        <CatalogSection
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          cartItems={cart}
          onOpenUploadModal={() => setIsUploadOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* SAFETY, CLINICAL STANDARDS & CUSTOMER REVIEWS */}
        <SafetySection />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* MANDATORY STICKY BOTTOM ACTION BAR ON MOBILE */}
      <MobileStickyBar
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartTotalCount}
      />

      {/* SHOPKEEPER ADMIN ORDERS PORTAL */}
      <AdminOrdersPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* PRESCRIPTION UPLOAD MODAL */}
      <PrescriptionUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onOrderCreated={handleOrderCreatedFromRx}
      />

      {/* LIVE DISPATCH TRACKER */}
      <LiveTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orderId={activeTrackingOrderId}
      />

      {/* STORE LOCATION MODAL */}
      <StoreLocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutComplete}
        onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
        onOpenUploadModal={() => {
          setIsCartOpen(false);
          setIsUploadOpen(true);
        }}
      />

      {/* CUSTOMER PHONE LOGIN & ORDER HISTORY MODAL */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onTrackOrder={(orderId) => {
          setActiveTrackingOrderId(orderId);
          setIsTrackerOpen(true);
        }}
      />

      {/* FREE PHARMACIST COUNSELLING MODAL */}
      <FreeCounselingModal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
      />
    </div>
  );
}
