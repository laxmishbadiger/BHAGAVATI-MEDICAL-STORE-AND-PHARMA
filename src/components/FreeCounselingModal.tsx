import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  HeartHandshake,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  HelpCircle,
  Pill
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import { savePrescriptionOrderToSupabase } from '../lib/supabase';

interface FreeCounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeCounselingModal: React.FC<FreeCounselingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientPhone.trim()) {
      alert('Please enter your phone number so the pharmacist can call you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await savePrescriptionOrderToSupabase({
        patient_name: patientName.trim() || 'Patient Seeking Free Advice',
        phone_number: patientPhone.trim(),
        address: 'Dharwad Local Patient',
        prescription_file_name: 'free_counseling_query.txt',
        delivery_type: 'quick-dharwad',
        notes: `FREE COUNSELLING QUERY: "${question || 'Dosage / Consumption advice'}". Patient phone: ${patientPhone}.`,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                100% Free Service
              </span>
              <h3 className="text-base font-bold tracking-tight">
                Ask Pharmacist — Free Patient Counselling
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Exact User Requested Notice Banner */}
          <div className="p-4 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl space-y-2">
            <div className="flex items-start gap-2">
              <Pill className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                Ask Pharmacist if you need any free advice on what to consume and how much quantity and when, before or after or any other question related to drug.
              </p>
            </div>
            <p className="text-[11px] text-emerald-800 pl-7">
              Our registered pharmacist at Prabhu Complex, Opp. JSS Gate, Vidyagiri, Dharwad provides free dosage guidance, food interaction advice, and allergy checks.
            </p>
          </div>

          {/* Quick Direct Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 text-white rounded-2xl flex items-center justify-between gap-2 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300 block">
                    Direct Phone Advice:
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                    <a href={`tel:${PHARMACY_CONFIG.phoneRaw}`} className="hover:text-amber-300 underline">
                      {PHARMACY_CONFIG.phoneHighlight}
                    </a>
                    <span className="text-slate-400">/</span>
                    <a href={`tel:${PHARMACY_CONFIG.phoneRaw2}`} className="hover:text-amber-300 underline">
                      {PHARMACY_CONFIG.phoneHighlight2}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/918892450227?text=Hello%20Bhagavati%20Medical%20Store,%20I%20need%20free%20advice%20from%20the%20pharmacist%20about%20my%20medicine.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl flex items-center gap-3 shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-200 block">
                  WhatsApp Pharmacist
                </span>
                <span className="text-sm font-bold group-hover:underline">
                  Chat: 08892450227 / 8867089557
                </span>
              </div>
            </a>
          </div>

          {/* Request Callback Form */}
          <div className="border-t border-slate-200 pt-4">
            {submitted ? (
              <div className="text-center py-6 space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900">
                  Pharmacist Callback Requested!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Our licensed pharmacist at Prabhu Complex, Vidyagiri is reviewing your query and will call you on <strong className="font-mono text-slate-900">{patientPhone}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setQuestion('');
                  }}
                  className="text-xs text-emerald-700 font-bold underline mt-2"
                >
                  Ask Another Question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Or Request Free Callback:
                </h4>

                <div>
                  <textarea
                    rows={2}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. When should I take Telma 40? Before food or after breakfast? Any side effects?"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Mobile Number *"
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Request Pharmacist Free Advice'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3">
            <p>📍 {PHARMACY_CONFIG.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
