import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
  KeyRound,
  LogOut
} from 'lucide-react';
import { getLocalOrders, ShopOrderRecord } from '../lib/supabase';
import { PHARMACY_CONFIG } from '../data/pharmacyData';

export interface CustomerSession {
  phone: string;
  name: string;
  address?: string;
  loggedInAt: string;
}

const CUSTOMER_SESSION_KEY = 'bhagavati_customer_auth';

export function getCustomerSession(): CustomerSession | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomerSession(session: CustomerSession) {
  localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('bhagavati_customer_auth_changed', { detail: session }));
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('bhagavati_customer_auth_changed', { detail: null }));
}

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (items: any[]) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
  onReorder,
}) => {
  const [session, setSession] = useState<CustomerSession | null>(getCustomerSession());
  const [step, setStep] = useState<'phone' | 'otp' | 'history'>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [customerOrders, setCustomerOrders] = useState<ShopOrderRecord[]>([]);

  useEffect(() => {
    const current = getCustomerSession();
    setSession(current);
    if (current && current.phone) {
      setStep('history');
      loadOrdersForPhone(current.phone);
    } else {
      setStep('phone');
    }
  }, [isOpen]);

  const loadOrdersForPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const all = getLocalOrders();
    const matched = all.filter((o) => {
      const orderPhoneClean = (o.phone_number || '').replace(/\D/g, '');
      return orderPhoneClean.includes(cleanPhone) || cleanPhone.includes(orderPhoneClean);
    });
    setCustomerOrders(matched);
  };

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneInput.replace(/\D/g, '');
    if (clean.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpInput(code); // Pre-fill for instant frictionless demo verification
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setOtpError(true);
      return;
    }
    setOtpError(false);

    const newSession: CustomerSession = {
      phone: phoneInput.trim(),
      name: nameInput.trim() || 'Valued Customer',
      loggedInAt: new Date().toISOString(),
    };
    saveCustomerSession(newSession);
    setSession(newSession);
    loadOrdersForPhone(newSession.phone);
    setStep('history');
  };

  const handleLogout = () => {
    clearCustomerSession();
    setSession(null);
    setCustomerOrders([]);
    setStep('phone');
    setPhoneInput('');
    setNameInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {step === 'history' ? 'My Medicine Orders & History' : 'Customer Phone Login'}
              </h3>
              <p className="text-xs text-slate-400">
                BHAGAVATI MEDICAL STORE AND PHARMA · Dharwad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <button
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: PHONE NUMBER INPUT */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-900 text-base">Enter Your Mobile Number</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Access your past prescription orders, instant delivery status, and auto-fill your delivery address in Dharwad.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="8892450227"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-900 text-base">Verify OTP</h4>
              <p className="text-xs text-slate-500">
                Verification code sent to <strong className="font-mono text-slate-800">+91 {phoneInput}</strong>
              </p>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-mono mt-2">
                Simulated SMS OTP Code: <strong>{generatedOtp}</strong>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 4-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {otpError && (
                  <p className="text-xs text-rose-600 font-bold mt-1 text-center">
                    Incorrect code. Use {generatedOtp}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Confirm & View Orders
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER HISTORY LIST */}
        {step === 'history' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{session?.name || 'Customer'}</span>
                <span className="text-xs text-slate-500 font-mono">+91 {session?.phone}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                Active Session
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Past Orders & Transactions ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-700">No orders placed under this mobile number yet.</p>
                  <p className="text-slate-400">
                    When you order medicines with +91 {session?.phone}, they will automatically appear here.
                  </p>
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {ord.id}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(ord.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900">{ord.items_summary}</p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-800">
                          ₹{ord.total_amount.toFixed(2)}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-semibold">{ord.payment_method}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onTrackOrder && (
                          <button
                            onClick={() => {
                              onTrackOrder(ord.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                          >
                            Track
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
