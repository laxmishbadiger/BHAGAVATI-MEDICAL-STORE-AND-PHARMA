import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  MessageSquare,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

interface LiveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

export const LiveTrackerModal: React.FC<LiveTrackerModalProps> = ({
  isOpen,
  onClose,
  orderId = 'RX-89421',
}) => {
  const [activeStep, setActiveStep] = useState(3); // 3: On Scooter
  const [estimatedMinutes, setEstimatedMinutes] = useState(12);
  const [scooterProgress, setScooterProgress] = useState(55); // percentage along the road
  const [isSimulatingMovement, setIsSimulatingMovement] = useState(true);

  // Progressive movement simulation
  useEffect(() => {
    if (!isOpen || !isSimulatingMovement) return;

    const interval = setInterval(() => {
      setScooterProgress((prev) => {
        if (prev >= 96) {
          setActiveStep(4); // Delivered
          setEstimatedMinutes(0);
          return 100;
        }
        return prev + 1.5;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen, isSimulatingMovement]);

  if (!isOpen) return null;

  const trackingSteps = [
    { label: 'Rx Verified', time: '11:42 AM', done: true },
    { label: 'Dispensed & Checked', time: '11:46 AM', done: true },
    { label: 'Thermal Pack Sealed', time: '11:49 AM', done: true },
    { label: 'E-Scooter En Route', time: '11:51 AM', done: activeStep >= 3 },
    { label: 'Doorstep Delivered', time: 'Est 12:03 PM', done: activeStep >= 4 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Navigation className="w-4 h-4 animate-spin text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Live Dispatch Telemetry
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                  {orderId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connected to Courier GPS Transponder #ES-48
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close tracking modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Live Simulated Map Stage */}
          <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Dark Map Vector Graphic */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              <defs>
                {/* Street grid patterns */}
                <pattern id="gridMap" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="50%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="#090d16" />
              <rect width="100%" height="100%" fill="url(#gridMap)" opacity="0.6" />

              {/* City Avenues */}
              <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeWidth="12" />
              <line x1="160" y1="0" x2="160" y2="240" stroke="#1e293b" strokeWidth="10" />
              <line x1="340" y1="0" x2="340" y2="240" stroke="#1e293b" strokeWidth="10" />

              {/* S-curved Delivery Route */}
              <path
                id="courierRoute"
                d="M 60 170 Q 160 170 200 120 T 360 80 T 440 60"
                fill="none"
                stroke="#134e4a"
                strokeWidth="5"
                strokeDasharray="4 4"
              />

              {/* Traveled Route Segment */}
              <path
                d="M 60 170 Q 160 170 200 120 T 360 80 T 440 60"
                fill="none"
                stroke="url(#routeGlow)"
                strokeWidth="5"
                strokeDasharray="300"
                strokeDashoffset={300 - (scooterProgress / 100) * 300}
              />

              {/* Start: AuraMed Central Hub */}
              <g transform="translate(60, 170)">
                <circle cx="0" cy="0" r="14" fill="#042f2e" stroke="#2dd4bf" strokeWidth="2" />
                <circle cx="0" cy="0" r="6" fill="#2dd4bf" />
                <text x="0" y="24" fill="#99f6e4" fontSize="9" fontWeight="bold" textAnchor="middle">
                  AuraMed Hub
                </text>
              </g>

              {/* End: Patient Destination */}
              <g transform="translate(440, 60)">
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="0" cy="0" r="7" fill="#38bdf8" />
                <text x="0" y="26" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Your Address
                </text>
              </g>
            </svg>

            {/* Dynamic Courier Rider Marker */}
            <motion.div
              className="absolute z-20 flex flex-col items-center pointer-events-none"
              style={{
                left: `${12 + (scooterProgress / 100) * 76}%`,
                top: `${68 - (scooterProgress / 100) * 44}%`,
              }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-[0_0_18px_rgba(45,212,191,0.8)] border border-white flex items-center justify-center">
                <span className="text-base">🛵</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-slate-900/90 text-teal-300 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap border border-teal-500/30">
                {activeStep >= 4 ? 'Arrived!' : `${estimatedMinutes}m away`}
              </span>
            </motion.div>

            {/* Real-time Status Overlay pill */}
            <div className="absolute top-3 left-3 z-30 bg-slate-900/90 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-700 text-xs flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 font-semibold">Live GPS Active</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-emerald-400">{Math.round(scooterProgress)}% of route</span>
            </div>

            {/* Sim controls */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => {
                  setScooterProgress(100);
                  setActiveStep(4);
                  setEstimatedMinutes(0);
                }}
                className="px-2 py-1 text-[10px] font-semibold text-teal-300 hover:text-white bg-teal-950/60 rounded"
              >
                Fast-Forward Handover
              </button>
              <button
                onClick={() => {
                  setScooterProgress(20);
                  setActiveStep(3);
                  setEstimatedMinutes(14);
                }}
                className="p-1 text-slate-400 hover:text-white"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper details */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {trackingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  step.done
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {step.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                  )}
                  <span className="text-[10px] font-mono text-slate-500">{step.time}</span>
                </div>
                <p className="text-xs font-bold truncate">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Courier & OTP Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                MK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Marcus K.</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    ★ 4.98
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Certified Medical Courier · Clean Transport Verified
                </p>
              </div>
            </div>

            {/* Handover OTP */}
            <div className="bg-white rounded-xl px-4 py-2 border border-slate-200 shadow-sm flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Handover OTP
                </span>
                <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                  4892
                </span>
              </div>
              <a
                href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
                className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                title="Call Courier"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
