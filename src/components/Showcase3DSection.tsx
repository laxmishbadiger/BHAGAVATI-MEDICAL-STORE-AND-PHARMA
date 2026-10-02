import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  Sparkles,
  Zap,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Layers,
  FileText,
  QrCode
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

interface Showcase3DSectionProps {
  onOpenUploadModal: () => void;
}

export const Showcase3DSection: React.FC<Showcase3DSectionProps> = ({
  onOpenUploadModal,
}) => {
  const [viewMode, setViewMode] = useState<'real' | '3d'>('real');
  const [selectedRealImage, setSelectedRealImage] = useState<'storefront' | 'interior' | 'complex'>('storefront');
  const [active3DTab, setActive3DTab] = useState<'store' | 'dispensary' | 'delivery'>('store');

  const realImageDetails = {
    storefront: {
      title: 'Authentic Bhagavati Medical Store Counter',
      subtitle: 'Shop no B-13, 1st Floor, Prabhu Complex, Opp. JSS Gate, Dharwad',
      description: 'Authentic shop photograph of Bhagavati Medical Store and Pharma featuring the royal blue display counters with baby care and personal essentials, overhead directional spotlight track, hanging medicine strips, blue Kannada signboard (ಭಗವತಿ ಮೆಡಿಕಲ್ ಸ್ಟೋರ್ ಫಾರ್ಮಾ), and PhonePe UPI QR stand.',
      image: PHARMACY_CONFIG.realImages.storefrontReal,
      badge: 'Official Store Photo',
    },
    interior: {
      title: 'Shop Counter & Medicine Dispensary',
      subtitle: 'Blue Display Counters, Kannada Board & UPI QR Stand',
      description: 'Fully stocked pharmacy cabinets with IP/BP verified tablets, syrups, first-aid, ointments, baby diapers, and surgical items ready for immediate delivery in Dharwad.',
      image: PHARMACY_CONFIG.realImages.interiorReal,
      badge: 'Real Store Photo',
    },
    complex: {
      title: 'Prabhu Complex Exterior — Opp. JSS Gate',
      subtitle: 'Prime Location in Dharwad, Karnataka 580004',
      description: 'Commercial building perspective on the first floor above Prabhu ceramics and Galpi cha shop, directly opposite the main JSS College gate.',
      image: PHARMACY_CONFIG.realImages.complexReal,
      badge: 'Prabhu Complex Building',
    },
  };

  const currentReal = realImageDetails[selectedRealImage];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Dynamic ambient medical lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* BIG HIGHLIGHTED CALL-AND-ORDER BANNER */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 shadow-[0_15px_40px_rgba(16,185,129,0.35)] border-2 border-amber-300 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/40 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-wider border border-amber-300/40">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Instant Call & Order Service</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                "Call Me & Order Any Medicine Directly"
              </h2>

              <p className="text-emerald-50 text-sm sm:text-base font-medium leading-relaxed">
                Send your doctor prescription on WhatsApp or call us directly. We pack immediately from Prabhu Complex and deliver to your doorstep in 20 minutes across Dharwad!
              </p>

              {/* UPI & CASH PAYMENT HIGHLIGHT */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs">
                <span className="px-3 py-1 rounded-lg bg-slate-950/60 text-amber-200 font-bold border border-amber-400/40 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pay via UPI (PhonePe / GPay / Paytm QR)</span>
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950/60 text-white font-bold border border-white/20 flex items-center gap-1.5">
                  <span>💵 Cash on Delivery (COD) Accepted</span>
                </span>
              </div>
            </div>

            {/* Glowing Big Phone CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                className="w-full sm:w-auto px-7 py-4 bg-slate-950 hover:bg-slate-900 active:scale-[0.98] text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-2xl flex items-center justify-center gap-3 border border-amber-400/60 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-lg animate-bounce">
                  📞
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-amber-300 uppercase block tracking-wider font-semibold">
                    Tap to Call Store
                  </span>
                  <span className="font-mono text-xl sm:text-2xl text-white tracking-wide">
                    {PHARMACY_CONFIG.phoneHighlight}
                  </span>
                </div>
              </a>

              <a
                href={PHARMACY_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION HEADER: REAL STORE GALLERY + 3D SHOWCASE */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Actual Store Photos & Architectural Renders</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Inside {PHARMACY_CONFIG.name}
          </h3>

          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Shop no B-13, 1st Floor, Prabhu Complex, Opp. JSS College Gate, Dharwad. Fully stocked medical store serving Dharwad with daily medicines, baby care, and surgical supplies.
          </p>

          {/* VIEW MODE TOGGLE */}
          <div className="mt-5 inline-flex p-1.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 gap-1.5 shadow-lg">
            <button
              onClick={() => setViewMode('real')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'real'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Real Store Photos</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === '3d'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3D Render Model</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: REAL STORE PHOTOGRAPHY */}
        {viewMode === 'real' && (
          <div className="space-y-5">
            {/* Real Image Subtabs */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setSelectedRealImage('storefront')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRealImage === 'storefront'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🏬 Storefront with Signboard
              </button>
              <button
                onClick={() => setSelectedRealImage('interior')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRealImage === 'interior'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🔬 Shop Counter & Kannada Board
              </button>
              <button
                onClick={() => setSelectedRealImage('complex')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRealImage === 'complex'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🏢 Prabhu Complex Building View
              </button>
            </div>

            {/* Featured Real Image Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Image Frame */}
                <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-[16/10] bg-slate-950">
                  <img
                    src={currentReal.image}
                    alt={currentReal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-emerald-300 font-semibold border border-emerald-500/30">
                      {currentReal.badge}
                    </span>
                    <span className="font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
                      Dharwad 580004
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Opposite JSS College Gate, Dharwad</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {currentReal.title}
                  </h4>

                  <p className="text-xs font-medium text-emerald-300">
                    {currentReal.subtitle}
                  </p>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentReal.description}
                  </p>

                  {/* Actions & Map Links */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={PHARMACY_CONFIG.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Google Maps Link 1</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={PHARMACY_CONFIG.googleMapsAltUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Google Maps Link 2</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={onOpenUploadModal}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Upload Prescription (Rx)</span>
                      </button>

                      <a
                        href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 font-mono"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call: 08892450227</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: 3D RENDER SHOWCASE */}
        {viewMode === '3d' && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setActive3DTab('store')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active3DTab === 'store'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🏬 3D Storefront & Counter
              </button>
              <button
                onClick={() => setActive3DTab('dispensary')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active3DTab === 'dispensary'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🔬 3D Clinical Dispensary
              </button>
              <button
                onClick={() => setActive3DTab('delivery')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active3DTab === 'delivery'
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🛵 Dharwad Express 3D
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-[16/10] bg-slate-950">
                  <img
                    src={
                      active3DTab === 'store'
                        ? PHARMACY_CONFIG.images.storefront3D
                        : active3DTab === 'dispensary'
                        ? PHARMACY_CONFIG.images.dispensary3D
                        : PHARMACY_CONFIG.images.courier3D
                    }
                    alt={`${PHARMACY_CONFIG.name} 3D architectural showcase`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-emerald-300 font-semibold border border-emerald-500/30">
                      {active3DTab === 'store'
                        ? '3D Isometric Storefront Render'
                        : active3DTab === 'dispensary'
                        ? '3D Clinical Dispensary Model'
                        : '3D Dharwad Delivery Scooter'}
                    </span>
                    <span className="font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
                      3D Asset
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Architectural 3D Render</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {active3DTab === 'store' && '3D Concept of Bhagavati Medical Store'}
                    {active3DTab === 'dispensary' && 'Authentic Clinical Dispensing Station'}
                    {active3DTab === 'delivery' && 'Quick 20-30 Min Delivery across Dharwad'}
                  </h4>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {active3DTab === 'store' &&
                      'Designed to showcase our clean clinical atmosphere, illuminated signage, and organized counter opposite JSS College gate.'}
                    {active3DTab === 'dispensary' &&
                      'Calibrated temperature storage, robotic barcode checking, and licensed pharmacist supervision on every dose.'}
                    {active3DTab === 'delivery' &&
                      'Dedicated zero-emission e-scooter fleet delivering rapidly to Vidyagiri, Toll Naka, Sattur, and Dharwad residential colonies.'}
                  </p>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={onOpenUploadModal}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Upload Prescription</span>
                    </button>
                    <a
                      href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call: 08892450227</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
