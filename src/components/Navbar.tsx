import React, { useState } from 'react';
import {
  ShoppingBag,
  FileText,
  Phone,
  Menu,
  X,
  MapPin,
  Sparkles,
  QrCode,
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  User
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenUploadModal: () => void;
  onOpenLocationModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenCustomerAuth: () => void;
  onOpenCounselingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenUploadModal,
  onOpenLocationModal,
  onOpenTrackerModal,
  onOpenAdminPortal,
  onOpenCustomerAuth,
  onOpenCounselingModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Urgent Call-and-Order + UPI / Cash on Delivery Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 text-white text-xs font-semibold py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Dharwad 20-Min Delivery
            </span>
            <span className="text-[11px]">
              💳 UPI & COD Accepted · FREE Delivery over ₹300 (Within 3.5km) · Store Pickup Available
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-emerald-100 hidden md:inline">
              GST: {PHARMACY_CONFIG.gstNumber}
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-mono font-bold hover:bg-slate-900 transition-colors shadow-sm text-[11px]"
                title="Call Helpline 1"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{PHARMACY_CONFIG.phoneHighlight}</span>
              </a>
              <span className="text-white/50 text-xs">/</span>
              <a
                href={`tel:${PHARMACY_CONFIG.phoneRaw2}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-mono font-bold hover:bg-slate-900 transition-colors shadow-sm text-[11px]"
                title="Call Helpline 2"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{PHARMACY_CONFIG.phoneHighlight2}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Wordmark (Cleanly aligned on left) */}
            <a
              href="/"
              className="flex items-center gap-2.5 focus:outline-none shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                ✚
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-tight font-display">
                  BHAGAVATI MEDICAL STORE
                </span>
                <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                  & PHARMA · VIDYAGIRI DHARWAD
                </span>
              </div>
            </a>

            {/* Navigation links (Desktop & Laptop) */}
            <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600">
              <a
                href="#smart-search"
                className="hover:text-emerald-700 transition-colors whitespace-nowrap"
              >
                Search Medicines
              </a>
              <a
                href="#catalog"
                className="hover:text-emerald-700 transition-colors whitespace-nowrap"
              >
                Medicines List
              </a>
              <button
                onClick={onOpenTrackerModal}
                className="hover:text-emerald-700 transition-colors whitespace-nowrap font-semibold text-slate-600"
              >
                Track Order
              </button>
              <button
                onClick={onOpenLocationModal}
                className="hover:text-emerald-700 transition-colors whitespace-nowrap font-semibold text-slate-600"
              >
                Store Location
              </button>
            </nav>

            {/* Primary Action Buttons (Carefully aligned for laptop & desktop screens) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Free Counselling Button with requested label */}
              <button
                onClick={onOpenCounselingModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors whitespace-nowrap shadow-xs"
                title="Ask Pharmacist if you need any free advice on what to consume and how much quantity and when, before or after or any other question related to drug."
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ask Pharmacist (Free Advice)</span>
              </button>

              {/* Customer Login & Order History Button */}
              <button
                onClick={onOpenCustomerAuth}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                title="Customer Login / Order History"
              >
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden sm:inline">My Orders</span>
              </button>

              {/* Shopkeeper Admin Button (Single clean button, protected by Admin Login) */}
              <button
                onClick={onOpenAdminPortal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
                title="Admin Orders & Inventory Desk (Login Required)"
              >
                <ClipboardList className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Admin Portal</span>
              </button>

              {/* Upload Rx CTA */}
              <button
                onClick={onOpenUploadModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap active:scale-[0.98] shadow-sm shadow-emerald-600/20"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Upload Rx</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                aria-label="View delivery cart"
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-5 space-y-4">
            {/* Highlighted Mobile Call banner */}
            <a
              href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
              className="p-3 bg-slate-950 text-white rounded-2xl flex items-center justify-between border border-amber-400/60 shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📞</span>
                <div>
                  <span className="text-[11px] font-black text-amber-300 block uppercase">
                    Call & Order Directly:
                  </span>
                  <span className="text-base font-bold font-mono text-white">
                    {PHARMACY_CONFIG.phoneHighlight}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg">
                Call Now
              </span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCounselingModal();
                }}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-900 flex flex-col items-center justify-center gap-1"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Ask Pharmacist</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomerAuth();
                }}
                className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-800 flex flex-col items-center justify-center gap-1"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>My Orders</span>
              </button>
            </div>

            <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
              <a
                href="#smart-search"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                🔍 Search Medicines & Voice Order
              </a>
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                💊 Medicines List & Prices
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUploadModal();
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-left font-bold text-emerald-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Upload Doctor Prescription (Rx)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackerModal();
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-left"
              >
                🛵 Track My Order
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLocationModal();
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-left"
              >
                📍 Store Location & Google Map
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPortal();
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-left font-bold text-slate-700 flex items-center gap-2 border-t border-slate-100 pt-2"
              >
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                <span>Admin Orders Portal (Pharmacist Login)</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-mono text-emerald-700 font-bold">GSTIN: {PHARMACY_CONFIG.gstNumber}</p>
              <p>{PHARMACY_CONFIG.address}</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
