import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ANIMATION_STAGES } from '../data/pharmacyData';

interface HeroAnimationProps {
  onOpenUploadModal?: () => void;
  onTrackOrder?: () => void;
}

export const HeroAnimation: React.FC<HeroAnimationProps> = ({
  onOpenUploadModal,
  onTrackOrder,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 0.5>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const stageDuration = 3600 / playbackSpeed;

  // Handle stage transition loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % ANIMATION_STAGES.length);
    }, stageDuration);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, currentStage, stageDuration]);

  // Subtle mouse movement parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const currentStageData = ANIMATION_STAGES[currentStage];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-white/95 via-slate-50/90 to-teal-50/30 border border-slate-200/80 shadow-2xl shadow-teal-900/5 backdrop-blur-xl p-5 sm:p-7 overflow-hidden transition-all duration-300"
    >
      {/* Subtle ambient medical glow background */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 25}px, ${-mousePos.y * 25}px)`,
        }}
      />

      {/* Header controls & live badge */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-700">
            Bhagavati Pharma Dispatch Pipeline
          </span>
          <span className="hidden sm:inline text-xs text-slate-600">· Dharwad Express</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-lg p-1 border border-slate-200/60">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause animation loop' : 'Play animation loop'}
            className="p-1.5 rounded-md hover:bg-white text-slate-700 hover:text-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500"
            title={isPlaying ? 'Pause' : 'Resume'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setCurrentStage(0)}
            aria-label="Restart animation from Capsule"
            className="p-1.5 rounded-md hover:bg-white text-slate-700 hover:text-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 0.5 : 1)}
            aria-label={`Toggle playback speed: currently ${playbackSpeed}x`}
            className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md hover:bg-white text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Speed toggle"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Main Visual Animation Display Frame */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-inner flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern inside viewport */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ambient pulse circle */}
        <div className="absolute w-64 h-64 rounded-full bg-teal-500/10 blur-2xl animate-pulse-glow" />

        {/* Animated Sequence Stages */}
        <AnimatePresence mode="wait">
          {currentStage === 0 && (
            <motion.div
              key="stage-capsule"
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.15, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Floating Molecule Orbit */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="w-56 h-56 rounded-full border border-teal-500/20 border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-44 h-44 rounded-full border border-sky-400/20"
                />
              </div>

              {/* 3D Precision Capsule Graphic */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotate: [-4, 4, -4],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-44 h-24 filter drop-shadow-[0_15px_30px_rgba(13,148,136,0.35)]"
              >
                <svg viewBox="0 0 200 90" className="w-full h-full">
                  <defs>
                    <linearGradient id="capTeal" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="40%" stopColor="#0d9488" />
                      <stop offset="100%" stopColor="#115e59" />
                    </linearGradient>
                    <linearGradient id="capCrystal" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="specularGlare" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Left Half (Active Compound - Emerald Teal) */}
                  <path
                    d="M 50 15 L 100 15 L 100 75 L 50 75 C 33.4 75 20 61.6 20 45 C 20 28.4 33.4 15 50 15 Z"
                    fill="url(#capTeal)"
                  />
                  {/* Left Half Glare */}
                  <path
                    d="M 46 22 L 98 22 C 98 25 96 28 92 28 L 48 28 C 36 28 30 34 26 40 C 26 31 34 22 46 22 Z"
                    fill="white"
                    opacity="0.45"
                  />

                  {/* Right Half (Translucent Ice with Micro Pellets) */}
                  <path
                    d="M 100 15 L 150 15 C 166.6 15 180 28.4 180 45 C 180 61.6 166.6 75 150 75 L 100 75 Z"
                    fill="url(#capCrystal)"
                  />

                  {/* Internal Micro Pellets */}
                  <circle cx="118" cy="36" r="4.5" fill="#0d9488" opacity="0.85" />
                  <circle cx="132" cy="48" r="4" fill="#38bdf8" opacity="0.9" />
                  <circle cx="148" cy="38" r="5" fill="#f59e0b" opacity="0.8" />
                  <circle cx="125" cy="58" r="3.5" fill="#10b981" opacity="0.9" />
                  <circle cx="160" cy="50" r="4" fill="#0ea5e9" opacity="0.85" />
                  <circle cx="140" cy="62" r="4.5" fill="#06b6d4" opacity="0.8" />
                  <circle cx="112" cy="48" r="3" fill="#14b8a6" opacity="0.75" />

                  {/* Central Band Sealing Ring */}
                  <line x1="100" y1="14" x2="100" y2="76" stroke="#042f2e" strokeWidth="2.5" />
                  <line x1="99" y1="14" x2="99" y2="76" stroke="#5eead4" strokeWidth="1" opacity="0.8" />

                  {/* Top Gloss Curve */}
                  <path
                    d="M 35 22 Q 100 16 165 22"
                    fill="none"
                    stroke="url(#specularGlare)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <div className="relative z-10 mt-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> Stage 1: Active Capsule Formulation
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Precision gastro-resistant delivery with micro-encapsulated active medicinal compound.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 1 && (
            <motion.div
              key="stage-tablet"
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative z-10 w-44 h-44 flex items-center justify-center">
                {/* 3D Compressed Clinical Tablet */}
                <motion.div
                  animate={{
                    rotate: [0, 8, 0, -8, 0],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-slate-200 via-white to-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-8px_16px_rgba(148,163,184,0.4)] flex items-center justify-center border-2 border-slate-100"
                >
                  {/* Embossed Score Line */}
                  <div className="absolute w-28 h-1 bg-gradient-to-b from-slate-400 via-slate-300 to-white shadow-[0_1px_1px_rgba(255,255,255,0.8)] rounded-full" />
                  
                  {/* Clinical Rx Cross Emboss */}
                  <div className="relative z-10 flex flex-col items-center justify-center opacity-70">
                    <span className="text-[13px] font-mono font-bold tracking-widest text-slate-600">
                      AM-625
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      USP GRADE
                    </span>
                  </div>

                  {/* Surface Bevel Ring */}
                  <div className="absolute inset-2 rounded-full border border-slate-300/60 pointer-events-none" />
                </motion.div>
              </div>

              <div className="relative z-10 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stage 2: Micro-Grooved Calibrated Tablet
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Direct compression with precision break-line ensuring exact split dosing and rapid dissolution.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 2 && (
            <motion.div
              key="stage-prescription"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Rx Digital Document */}
              <div className="relative z-10 w-56 bg-slate-50 rounded-xl p-4 shadow-2xl border border-slate-200 text-left overflow-hidden">
                {/* Laser scan line animation */}
                <motion.div
                  animate={{ y: [-10, 160, -10] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf]"
                />

                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-serif font-black text-teal-800">℞</span>
                    <span className="text-[10px] font-bold tracking-tight text-slate-800">
                      DIGITAL PRESCRIPTION
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Patient:</span>
                    <span className="font-semibold text-slate-800">E. Vance (NY-99)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Item:</span>
                    <span className="font-semibold text-slate-800">Amox-Clav 625mg</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Regimen:</span>
                    <span className="font-semibold text-slate-800">1 Tab · 12 Hourly</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Sign: Dr. M. Ross, MD</span>
                  <span className="font-mono text-teal-700 font-bold">#NY-4821</span>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stage 3: Board-Certified Pharmacist Check
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Full clinical check for drug interactions, dosage safety, and licensed doctor verification.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 3 && (
            <motion.div
              key="stage-package"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Amber Medicine Vial + Sealed Box */}
              <div className="relative z-10 flex items-end justify-center gap-4">
                {/* Amber Light-Protected Vial */}
                <div className="relative w-16 h-28 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-950 rounded-lg shadow-lg border border-amber-600/40 p-1 flex flex-col justify-between">
                  {/* White Child-Safe Cap */}
                  <div className="w-full h-5 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-t-md shadow-sm border border-slate-300 flex items-center justify-center">
                    <div className="w-10 h-0.5 bg-slate-300" />
                  </div>
                  {/* Label */}
                  <div className="my-1 p-1 bg-white/95 rounded text-[8px] text-slate-800 leading-tight">
                    <p className="font-bold text-teal-800">Bhagavati Rx</p>
                    <p className="text-[7px] text-slate-600">Amoxicillin 625</p>
                    <p className="text-[6px] font-mono text-emerald-700 font-bold">QTY: 10 TABS</p>
                  </div>
                  <div className="text-[7px] text-center text-amber-200/80 font-mono">2°C - 8°C</div>
                </div>

                {/* Sealed Pharmacy Dispensary Box */}
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="relative w-28 h-32 bg-gradient-to-b from-teal-700 via-teal-800 to-teal-950 rounded-xl p-2.5 text-left border border-teal-500/50 shadow-2xl flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-white tracking-wider uppercase">
                      Bhagavati
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Tamper Evident Barcode Seal */}
                  <div className="bg-slate-900/80 rounded p-1 border border-teal-500/30">
                    <div className="flex items-center justify-between text-[7px] text-teal-300 font-mono">
                      <span>SEAL #89421</span>
                      <span className="text-emerald-400">PASSED</span>
                    </div>
                    <div className="h-2 w-full mt-1 flex gap-0.5">
                      {[1, 2, 1, 3, 1, 2, 3, 1, 1, 2, 1].map((w, i) => (
                        <div key={i} className="h-full bg-white opacity-90" style={{ width: `${w * 2}px` }} />
                      ))}
                    </div>
                  </div>

                  <div className="text-[8px] text-teal-100 flex items-center justify-between">
                    <span>Sterile Packed</span>
                    <span className="font-mono text-emerald-300">100% OK</span>
                  </div>
                </motion.div>
              </div>

              <div className="relative z-10 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stage 4: Tamper-Evident Climate Packaging
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Light-protected amber bottles and sealed security boxes with cryptographic verification tags.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 4 && (
            <motion.div
              key="stage-delivery-bag"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Thermal Insulated Pharmacy Delivery Bag */}
              <div className="relative z-10 w-44 h-48 bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-950 rounded-2xl p-4 border border-teal-500/40 shadow-2xl flex flex-col justify-between">
                {/* Bag Handle Cutout */}
                <div className="w-16 h-3 mx-auto bg-slate-900 rounded-full border border-teal-500/30" />

                {/* Center Pharmacy Seal */}
                <div className="my-auto flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <span className="text-xl font-bold">+</span>
                  </div>
                  <span className="mt-2 text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
                    CLIMATE SECURED
                  </span>
                  <span className="text-[8px] text-teal-200/80 font-mono">
                    ACTIVE 4°C MONITORING
                  </span>
                </div>

                {/* Recipient Security Label */}
                <div className="bg-white/10 rounded-lg p-1.5 text-left text-[8px] text-white flex justify-between items-center border border-white/10">
                  <div>
                    <p className="font-semibold text-emerald-300">EXPRESS ROUTE</p>
                    <p className="text-slate-300">OTP Required at Door</p>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">18 MINS</span>
                </div>
              </div>

              <div className="relative z-10 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stage 5: Eco-Insulated Medical Courier Bag
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Thermal barrier technology keeping sensitive biologics and tablets within calibrated temperature thresholds.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 5 && (
            <motion.div
              key="stage-scooter"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Express Electric Scooter Artwork */}
              <div className="relative z-10 w-64 h-36 flex items-center justify-center">
                {/* Forward LED Light Cone */}
                <div className="absolute right-0 top-12 w-28 h-14 bg-gradient-to-r from-sky-400/40 via-sky-300/10 to-transparent clip-path-polygon pointer-events-none transform -skew-y-6" />

                <svg viewBox="0 0 240 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="scooterBody" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0f766e" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>

                  {/* Ground Road Line with Motion Streaks */}
                  <line x1="10" y1="105" x2="230" y2="105" stroke="#334155" strokeWidth="2.5" />
                  <motion.line
                    x1="40"
                    y1="105"
                    x2="90"
                    y2="105"
                    stroke="#2dd4bf"
                    strokeWidth="2.5"
                    animate={{ x: [-80, 80] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Rear Wheel (Spinning) */}
                  <g transform="translate(50, 95)">
                    <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                    <circle cx="0" cy="0" r="8" fill="#1e293b" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Front Wheel (Spinning) */}
                  <g transform="translate(180, 95)">
                    <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                    <circle cx="0" cy="0" r="8" fill="#1e293b" />
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                    >
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
                    </motion.g>
                  </g>

                  {/* Scooter Chassis & Deck */}
                  <path
                    d="M 50 95 L 85 92 L 135 92 L 168 55 L 180 95"
                    fill="none"
                    stroke="url(#scooterBody)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Courier Thermal Trunk Box on Rear */}
                  <rect
                    x="42"
                    y="48"
                    width="44"
                    height="38"
                    rx="6"
                    fill="#042f2e"
                    stroke="#14b8a6"
                    strokeWidth="2"
                  />
                  {/* Red / Green Cross on Courier Box */}
                  <rect x="62" y="58" width="4" height="14" fill="#34d399" rx="1" />
                  <rect x="57" y="63" width="14" height="4" fill="#34d399" rx="1" />

                  {/* Steering Stem & Handlebars */}
                  <line x1="168" y1="55" x2="162" y2="28" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="154" y1="28" x2="174" y2="28" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

                  {/* Headlight beam source */}
                  <circle cx="170" cy="38" r="4" fill="#38bdf8" />
                </svg>
              </div>

              <div className="relative z-10 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Clock className="w-3.5 h-3.5" /> Stage 6: Dedicated Medical Courier Dispatch
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Zero-emission e-scooter fleet carrying GPS telemetry and calibrated thermal delivery trunks.
                </p>
              </div>
            </motion.div>
          )}

          {currentStage === 6 && (
            <motion.div
              key="stage-location-pin"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Radar Wave Emission */}
              <div className="relative z-10 w-44 h-44 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-400 animate-radar pointer-events-none" />
                <div className="absolute w-36 h-36 rounded-full border border-teal-400 animate-radar [animation-delay:0.7s] pointer-events-none" />

                {/* 3D Location Pin */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-1 shadow-[0_12px_30px_rgba(16,185,129,0.5)] flex items-center justify-center border-2 border-white">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                      <span className="text-emerald-400 text-lg">✓</span>
                    </div>
                  </div>
                  {/* Pin Point Pointer */}
                  <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-emerald-600 -mt-1" />

                  {/* Pulsing Floor Shadow */}
                  <div className="w-16 h-3 bg-emerald-500/20 rounded-full blur-sm mt-1 animate-pulse" />
                </motion.div>
              </div>

              <div className="relative z-10 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Stage 7: Arrived at Doorstep in 18 Minutes
                </span>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Contactless delivery handover with secure OTP confirmation and pharmacist consultation available on demand.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live metric overlay tag */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-700/60 text-right shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            {currentStageData.metricLabel}
          </div>
          <div className="text-xs font-mono font-bold text-teal-300">
            {currentStageData.metricValue}
          </div>
        </div>

        {/* Stage counter tag */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md rounded-xl px-2.5 py-1.5 border border-slate-700/60 text-left shadow-lg">
          <div className="text-[10px] font-mono text-emerald-400 font-semibold">
            0{currentStage + 1} / 0{ANIMATION_STAGES.length}
          </div>
        </div>
      </div>

      {/* Interactive Stage Scrubbing Tabs */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-medium">
          <span>Continuous Journey Sequence</span>
          <span className="font-mono text-teal-800 font-semibold">{currentStageData.shortTitle}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {ANIMATION_STAGES.map((stage, idx) => {
            const isActive = currentStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setCurrentStage(idx);
                  setIsPlaying(false);
                }}
                className={`relative group flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 text-center ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 ring-1 ring-teal-800'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
                aria-label={`Jump to stage ${idx + 1}: ${stage.shortTitle}`}
              >
                <span className="text-[10px] font-mono font-bold leading-none mb-1">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-medium truncate max-w-full leading-tight hidden sm:block">
                  {stage.shortTitle}
                </span>

                {/* Progress bar inside active button */}
                {isActive && isPlaying && (
                  <motion.div
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-emerald-300 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: stageDuration / 1000, ease: 'linear' }}
                    style={{ originX: 0 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Interactive Actions */}
      <div className="mt-5 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 text-center sm:text-left">
          <span className="font-semibold text-slate-800">Target ETA:</span> ~20-30 Mins in Dharwad
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.98] rounded-xl transition-all shadow-sm shadow-teal-700/20 whitespace-nowrap"
            >
              Upload Prescription <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {onTrackOrder && (
            <button
              onClick={onTrackOrder}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" /> Live Tracker
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
