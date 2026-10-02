import React from 'react';
import {
  ShieldCheck,
  Award,
  Lock,
  UserCheck,
  CheckCircle2,
  Quote,
  Star,
  HeartHandshake,
  Phone
} from 'lucide-react';
import { TESTIMONIALS, REVIEWS_SUMMARY, PHARMACY_CONFIG } from '../data/pharmacyData';

export const SafetySection: React.FC = () => {
  return (
    <section id="safety" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Clinical Assurance & Quality Control</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Every Dose Inspected by Registered Pharmacists
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Speed never compromises clinical safety. We combine automated optical inspection, licensed doctor interaction verification, and continuous cold-chain telematics.
          </p>
        </div>

        {/* 4 Pillars of Medical Safety & Pharmacy Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Registered Pharmacist on Duty
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Every prescription and dosage is clinically evaluated by our licensed pharmacist at Prabhu Complex before dispatch.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-teal-700">
              100% Licensed Staff · Dharwad
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                100% Genuine IP/BP Medicines
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Directly sourced from authorized pharmaceutical manufacturers (Cipla, Sun Pharma, Abbott, Alkem). Fresh batches with verified expiry.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-sky-700">
              GST: 29BVXPR783D1ZO
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tamper-Evident Packaging
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Secure moisture-shield packaging with discreet labeling for patient privacy and safe doorstep delivery in Dharwad.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-emerald-700">
              Hygienic & Tamper-Sealed
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-500/40 space-y-3 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/30">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-600 text-white">
                  Free Service
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Free Patient Counselling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Need guidance on dosage timings, taking medicines before/after food, or antibiotic course completion? Talk directly with our pharmacist.
              </p>
            </div>

            <a
              href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
              className="mt-2 w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call for Free Counselling</span>
            </a>
          </div>
        </div>

        {/* Quantitative Proof Metric Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-16 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-3 md:pt-0">
              <span className="text-3xl sm:text-4xl font-mono font-black text-teal-400">
                {REVIEWS_SUMMARY.averageTime}
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-medium">
                Average Metro Transit Time
              </span>
            </div>

            <div className="pt-3 md:pt-0">
              <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">
                {REVIEWS_SUMMARY.onTimeRate}
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-medium">
                On-Time Delivery Success Rate
              </span>
            </div>

            <div className="pt-3 md:pt-0">
              <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                {REVIEWS_SUMMARY.rating}
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-medium flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Across {REVIEWS_SUMMARY.totalReviews} Deliveries</span>
              </span>
            </div>

            <div className="pt-3 md:pt-0">
              <span className="text-3xl sm:text-4xl font-mono font-black text-sky-400">
                24/7/365
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-medium">
                Licensed Pharmacist Coverage
              </span>
            </div>
          </div>
        </div>

        {/* Authentic Testimonials Adjacent to Safety Claims */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-teal-700 font-bold">
                    {item.deliveryTime}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
                    {item.verificationBadge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>{item.role}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
