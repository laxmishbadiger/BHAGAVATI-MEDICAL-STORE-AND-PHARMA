import React from 'react';
import {
  X,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  ExternalLink,
  Navigation,
  Compass,
  Sparkles
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

interface StoreLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocationModal: React.FC<StoreLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {PHARMACY_CONFIG.name}
              </h3>
              <p className="text-xs text-slate-500">
                Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close location details"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Original Store Photo Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] shadow-sm">
            <img
              src={PHARMACY_CONFIG.realImages.storefrontReal}
              alt="Bhagavati Medical Store and Pharma Original Storefront"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between">
              <span>BHAGAVATI MEDICAL STORE AND PHARMA · ESTD. 2005</span>
              <span className="text-emerald-400 font-bold font-mono">Dharwad 580004</span>
            </div>
          </div>

          {/* Key Address Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Store Full Address
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                {PHARMACY_CONFIG.address}
              </p>
              <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                <p>
                  <strong>Landmark:</strong> {PHARMACY_CONFIG.landmark}
                </p>
                <p>
                  <strong>City & Pincode:</strong> {PHARMACY_CONFIG.city} - {PHARMACY_CONFIG.pincode}
                </p>
              </div>
            </div>

            {/* Direct Google Maps Links (User provided both) */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={PHARMACY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Google Maps (Store Link 1)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={PHARMACY_CONFIG.googleMapsAltUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Google Maps (Store Link 2)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct Phone & WhatsApp Highlight */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Call & Order Directly
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold block">
                      Call & Order Now
                    </span>
                    <div className="flex items-center gap-2 text-sm font-black text-slate-950 font-mono">
                      <a href={`tel:${PHARMACY_CONFIG.phoneRaw}`} className="hover:text-emerald-700 underline">
                        {PHARMACY_CONFIG.phoneHighlight}
                      </a>
                      <span className="text-slate-400 font-normal">/</span>
                      <a href={`tel:${PHARMACY_CONFIG.phoneRaw2}`} className="hover:text-emerald-700 underline">
                        {PHARMACY_CONFIG.phoneHighlight2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">WhatsApp Prescription</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <a
                        href={PHARMACY_CONFIG.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        08892450227
                      </a>
                      <span>·</span>
                      <a
                        href={PHARMACY_CONFIG.whatsappUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        8867089557
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating hours & license */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{PHARMACY_CONFIG.hours}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{PHARMACY_CONFIG.licenseNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
