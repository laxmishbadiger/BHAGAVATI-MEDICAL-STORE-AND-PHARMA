import React from 'react';
import { Phone, MapPin, ShieldCheck, ExternalLink, Database, ClipboardList, QrCode } from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface FooterProps {
  onOpenUploadModal: () => void;
  onOpenLocationModal: () => void;
  onOpenTrackerModal: () => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenUploadModal,
  onOpenLocationModal,
  onOpenTrackerModal,
  onOpenAdminPortal,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pb-20 md:pb-8 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              className="text-lg font-black tracking-tight text-white font-display flex items-center gap-2"
            >
              <span className="text-emerald-400 text-2xl leading-none">✚</span>
              <span>{PHARMACY_CONFIG.name}</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your neighborhood licensed retail pharmacy in Dharwad. Authentic medicines, child care, baby essentials, and quick 20–30 minute emergency delivery across Dharwad.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Registered Pharmacist on Duty · {PHARMACY_CONFIG.hours}</p>
              <p>License: {PHARMACY_CONFIG.licenseNumber}</p>
              <p className="font-mono text-emerald-400 font-bold">GSTIN: {PHARMACY_CONFIG.gstNumber}</p>
              <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>Accepted Payments: UPI (PhonePe, GPay, Paytm) & Cash on Delivery (COD)</span>
              </p>
            </div>
          </div>

          {/* Customer & Store Services */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Store Services
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenUploadModal}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Upload Doctor Prescription (Rx)
                </button>
              </li>
              <li>
                <a href="#smart-search" className="hover:text-emerald-400 transition-colors">
                  Instant Medicine Search & Voice Order
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-emerald-400 transition-colors">
                  Medicine Formulary & Prices (₹)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTrackerModal}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Live Courier Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdminPortal}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-left font-bold flex items-center gap-1"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Shopkeeper Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Call & Order */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Direct Phone Order
            </span>
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
              <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">
                Call / WhatsApp for Order:
              </span>
              <div className="space-y-1">
                <a
                  href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                  className="text-base font-black font-mono text-white hover:text-emerald-400 flex items-center justify-between"
                >
                  <span>{PHARMACY_CONFIG.phoneHighlight}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Helpline 1</span>
                </a>
                <a
                  href={`tel:${PHARMACY_CONFIG.phoneRaw2}`}
                  className="text-base font-black font-mono text-emerald-400 hover:text-emerald-300 flex items-center justify-between"
                >
                  <span>{PHARMACY_CONFIG.phoneHighlight2}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Helpline 2</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                Quick 20-30 min delivery in Dharwad · All-India courier also dispatched daily.
              </p>
            </div>
          </div>

          {/* Store & Contact */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              Store Address & Maps
            </span>
            <div className="space-y-2 text-slate-400">
              <p className="text-white font-medium leading-snug">
                Prabhu Complex, Opp. JSS Gate, Vidyagiri<br />
                Dharwad, Karnataka 580004
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <a
                  href={PHARMACY_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>Google Maps Location 1</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={PHARMACY_CONFIG.googleMapsAltUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold"
                >
                  <span>Google Maps Location 2</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Medical Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center md:text-left leading-relaxed max-w-2xl">
            <strong>Store Notice:</strong> BHAGAVATI MEDICAL STORE AND PHARMA is a licensed retail pharmacy in Dharwad, Karnataka. Open daily 8:00 AM – 11:30 PM. For life-threatening emergencies, please dial 108 or visit the nearest hospital.
          </p>

          <div className="text-center md:text-right whitespace-nowrap">
            © {new Date().getFullYear()} {PHARMACY_CONFIG.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
