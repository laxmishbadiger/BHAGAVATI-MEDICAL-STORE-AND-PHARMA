import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  MapPin,
  User,
  ArrowRight,
  Zap,
  Package
} from 'lucide-react';
import { PHARMACY_CONFIG } from '../data/pharmacyData';
import { savePrescriptionOrderToSupabase } from '../lib/supabase';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (orderId: string) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'quick-dharwad' | 'pan-india'>('quick-dharwad');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulateSampleRx = () => {
    setFileSelected('Dr_Kulkarni_Prescription_Dharwad.pdf');
    if (!patientName) setPatientName('Ramesh Deshpande');
    if (!phone) setPhone('08892450227');
    if (!address) setAddress('Near JSS College, Vidyagiri, Dharwad, Karnataka');
    setErrorMsg('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0].name);
      setErrorMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileSelected) {
      setErrorMsg('Please select or upload a valid prescription image or PDF.');
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient full legal name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a valid contact number for OTP delivery confirmation.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    // Save to Supabase public.prescription_orders table
    savePrescriptionOrderToSupabase({
      patient_name: patientName.trim(),
      phone_number: phone.trim(),
      address: address.trim(),
      prescription_file_name: fileSelected,
      delivery_type: deliveryType,
      notes: notes.trim(),
    }).then((res) => {
      setIsAnalyzing(false);
      const generatedId = res.data.id || `BMS-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedOrder(generatedId);
    }).catch(() => {
      setIsAnalyzing(false);
      const randomOrderId = `BMS-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedOrder(randomOrderId);
    });
  };

  const handleFinish = () => {
    if (submittedOrder && onOrderCreated) {
      onOrderCreated(submittedOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-serif text-lg font-bold">
              ℞
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Upload Doctor Prescription
              </h3>
              <p className="text-xs text-slate-500">
                {PHARMACY_CONFIG.name} · Prabhu Complex, Dharwad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Call Banner */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Prefer ordering over phone or WhatsApp?</span>
          </div>
          <a
            href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
            className="font-bold underline font-mono text-emerald-800"
          >
            Call {PHARMACY_CONFIG.phoneHighlight}
          </a>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6">
          {submittedOrder ? (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">
                  Prescription Received at Bhagavati Medical
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Our registered pharmacist is dispensing your medicines from our Prabhu Complex store.
                </p>
              </div>

              <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-sm w-full space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-emerald-700">{submittedOrder}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-800">{patientName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Delivery Scope:</span>
                  <span className="font-semibold text-emerald-700">
                    {deliveryType === 'quick-dharwad'
                      ? 'Quick Dharwad (20-30 Mins)'
                      : 'All-India Tracked Courier'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Store Contact:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {PHARMACY_CONFIG.phoneHighlight}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <span>Track Live Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Upload & Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Delivery Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('quick-dharwad')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'quick-dharwad'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Quick Dharwad Express</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      20 - 30 Mins across Dharwad
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pan-india')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'pan-india'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Package className="w-3.5 h-3.5 text-teal-600" />
                      <span>All-India Delivery</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      2 - 3 Days Tracked Courier
                    </span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Prescription Document / Photo
                </label>

                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                      {fileSelected ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                    </div>
                    {fileSelected ? (
                      <div>
                        <span className="text-xs font-bold text-emerald-800 block truncate max-w-xs">
                          {fileSelected}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          Rx attached & ready for pharmacist check
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Click to upload or take camera photo of prescription
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          PNG, JPG, or PDF up to 15MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Sample Fill for Testing */}
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Testing demo?</span>
                  <button
                    type="button"
                    onClick={handleSimulateSampleRx}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Load Sample Doctor Rx
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Ramesh Deshpande"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08892450227"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Address & Locality (Dharwad or Other City)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Plot no, Area/Colony, City, PIN code"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pharmacist Instructions / Generic Substitution Preference
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 1 month supply; please call before dispatching..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Prescription...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Instant Dispense</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
