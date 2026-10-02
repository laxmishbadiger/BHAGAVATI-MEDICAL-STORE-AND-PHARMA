import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  MapPin,
  Sparkles,
  Search,
  Check,
  Zap,
  Package,
  Phone,
  ThermometerSnowflake,
  FileCheck2
} from 'lucide-react';
import { PHARMACY_CONFIG, DHARWAD_LOCALITIES } from '../data/pharmacyData';

export const DeliveryJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(3);
  const [pincodeInput, setPincodeInput] = useState('');
  const [coverageResult, setCoverageResult] = useState<{
    zone: string;
    type: 'dharwad-quick' | 'pan-india';
    eta: string;
    hub: string;
    deliveryFee: string;
  } | null>({
    zone: '580004 (Dharwad, Karnataka)',
    type: 'dharwad-quick',
    eta: '20 - 25 Minutes Express',
    hub: 'Prabhu Complex Store (Opp. JSS College Gate)',
    deliveryFee: 'FREE in Local Dharwad Zone',
  });

  const steps = [
    {
      id: 0,
      time: '00:00 - 04:00',
      title: 'Doctor Rx & Interaction Check',
      subtitle: 'Verified by Pharmacist at Dharwad Store',
      description: 'Your uploaded prescription is verified against certified drug-interaction lists and clinical dosage requirements before preparation.',
      icon: FileCheck2,
      badge: '100% Inspected',
    },
    {
      id: 1,
      time: '04:00 - 08:00',
      title: 'Cold-Chain & Dispensing Check',
      subtitle: 'Temperature Controlled Storage',
      description: 'Insulins, syrups, and tablets are picked from temperature-monitored cabinets and cross-checked against batch and expiry numbers.',
      icon: ThermometerSnowflake,
      badge: 'Authentic Batch',
    },
    {
      id: 2,
      time: '08:00 - 11:00',
      title: 'Tamper-Evident Safety Seal',
      subtitle: 'Hygienic Moisture Barrier Bag',
      description: 'Packaged in sealed carry pouches with patient confidentiality tags. Tamper-proof seals guarantee safety from store counter to your home.',
      icon: ShieldCheck,
      badge: 'Zero-Tamper Guarantee',
    },
    {
      id: 3,
      time: '11:00 - 25:00',
      title: 'Quick Dharwad Express Dispatch',
      subtitle: 'Direct from Prabhu Complex, Opp. JSS Gate',
      description: 'Dedicated courier navigates Dharwad roads (Vidyagiri, Toll Naka, JSS Campus, Sattur) for doorstep drop within 20 to 30 minutes.',
      icon: Zap,
      badge: 'Dharwad 20-30 Min',
    },
    {
      id: 4,
      time: 'Doorstep',
      title: 'Doorstep Handover & Tele-Consult',
      subtitle: 'Safe Handover with OTP Check',
      description: 'Courier safely hands over medication package. Call 08892450227 anytime for free pharmacist dosage questions and refill guidance.',
      icon: MapPin,
      badge: 'Handover Complete',
    },
  ];

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const query = pincodeInput.trim().toLowerCase();
    if (!query) return;

    const isDharwad =
      query.startsWith('580') ||
      query.includes('dharwad') ||
      query.includes('jss') ||
      query.includes('vidyagiri');

    if (isDharwad) {
      setCoverageResult({
        zone: pincodeInput || 'Dharwad, Karnataka',
        type: 'dharwad-quick',
        eta: '20 - 30 Minutes Express Doorstep',
        hub: 'Prabhu Complex Store (Opp. JSS College Gate)',
        deliveryFee: 'FREE / Minimal Local Charge',
      });
    } else {
      setCoverageResult({
        zone: pincodeInput || 'All-India National Zone',
        type: 'pan-india',
        eta: '2 - 3 Days (Speed-Post & Safe Courier)',
        hub: 'Central Dispatch Hub via Dharwad Express',
        deliveryFee: 'Safe Tracked Courier',
      });
    }
  };

  return (
    <section id="delivery" className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast Delivery in Dharwad · All-India Shipping</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Your Medicine Reaches You
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Quick 20–30 minute emergency delivery across Dharwad, and secure pan-India courier shipping for all maintenance prescriptions.
          </p>
        </div>

        {/* Interactive Delivery Route Track Visual */}
        <div className="mb-14 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-100/80">
          {/* Progress Path Indicator */}
          <div className="relative mb-12 hidden md:block">
            {/* Base line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />

            {/* Active connecting line */}
            <motion.div
              className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 -translate-y-1/2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 90}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />

            {/* Stepper nodes */}
            <div className="relative z-10 flex items-center justify-between">
              {steps.map((step, idx) => {
                const isPassed = idx <= activeStep;
                const isCurrent = idx === activeStep;
                const IconComponent = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center group focus:outline-none"
                    aria-label={`Jump to stage: ${step.title}`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 scale-110 ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-teal-700 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="mt-2 text-xs font-mono font-semibold text-slate-600 group-hover:text-emerald-700">
                      {step.time.split(' - ')[0]}
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 ${
                        isCurrent ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      Stage 0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Highlight Card */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                    {steps[activeStep].time}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-semibold">
                    {steps[activeStep].badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  0{activeStep + 1}. {steps[activeStep].title}
                </h3>
                <p className="text-sm font-medium text-emerald-700">
                  {steps[activeStep].subtitle}
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex sm:flex-col items-center justify-end gap-2.5 pt-4 lg:pt-0 border-t sm:border-t-0 border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white shadow-sm transition-colors"
                  >
                    Next Stage
                  </button>
                </div>
                <span className="text-[11px] text-slate-600 text-center">
                  Stage {activeStep + 1} of {steps.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PINCODE & DHARWAD SPEED CHECKER */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>Pincode / Area Speed Checker</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Check Delivery Time for Your Locality
              </h3>

              <p className="text-slate-300 text-sm sm:text-base">
                Enter your Dharwad PIN (e.g. 580004, 580001) or any Indian state / city to verify courier coverage and arrival speed.
              </p>

              {/* Form Input */}
              <form onSubmit={handlePincodeCheck} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="Enter Pincode or Locality (e.g. 580004 / Vidyagiri)"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Check Speed</span>
                </button>
              </form>
            </div>

            {/* Results Display */}
            {coverageResult && (
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                      {coverageResult.type === 'dharwad-quick'
                        ? 'Quick Dharwad Zone Active'
                        : 'Pan-India Courier Active'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {coverageResult.zone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Estimated ETA</span>
                    <span className="text-xl font-mono font-black text-white">
                      {coverageResult.eta}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-0.5">Dispatched From</span>
                    <span className="text-xs font-semibold text-emerald-300 block">
                      Prabhu Complex Store
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct Call & Order Available: 08892450227</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dispensary: Opposite JSS College Gate</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
