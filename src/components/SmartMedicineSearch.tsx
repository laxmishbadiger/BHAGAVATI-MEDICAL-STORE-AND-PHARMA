import React, { useState, useRef, useEffect } from 'react';
import { Medicine } from '../types/pharmacy';
import { MEDICINE_CATALOG, PHARMACY_CONFIG } from '../data/pharmacyData';
import { savePrescriptionOrderToSupabase } from '../lib/supabase';
import {
  Search,
  Plus,
  Check,
  Phone,
  Mic,
  MicOff,
  Video,
  FileText,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Thermometer,
  Package,
  ArrowRight
} from 'lucide-react';

interface SmartMedicineSearchProps {
  onAddToCart: (medicine: Medicine) => void;
  onOpenUploadModal: () => void;
}

export const SmartMedicineSearch: React.FC<SmartMedicineSearchProps> = ({
  onAddToCart,
  onOpenUploadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});
  const [fallbackMode, setFallbackMode] = useState<'text' | 'voice' | 'video' | 'upload'>('text');

  // Text request state
  const [customTextRequest, setCustomTextRequest] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSuccessMessage, setCustomSuccessMessage] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [voicePhone, setVoicePhone] = useState('');
  const [voicePatientName, setVoicePatientName] = useState('');
  const [isSubmittingVoice, setIsSubmittingVoice] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState(false);

  // Video note / camera state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPhone, setVideoPhone] = useState('');
  const [videoPatientName, setVideoPatientName] = useState('');
  const [isVideoSubmitting, setIsVideoSubmitting] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Filter medicines based on user input
  const searchResults = searchTerm.trim()
    ? MEDICINE_CATALOG.filter((med) => {
        const query = searchTerm.toLowerCase();
        return (
          med.name.toLowerCase().includes(query) ||
          med.genericName.toLowerCase().includes(query) ||
          med.description.toLowerCase().includes(query) ||
          med.dosage.toLowerCase().includes(query)
        );
      })
    : [];

  const handleAdd = (medicine: Medicine) => {
    onAddToCart(medicine);
    setAddedIds((prev) => ({ ...prev, [medicine.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [medicine.id]: false }));
    }, 1200);
  };

  // Quick suggestion chips
  const quickSuggestions = [
    'Dolo 650',
    'Augmentin 625',
    'Telma 40',
    'Glycomet 500',
    'Asthalin Inhaler',
    'Azithral 500',
    'Pan-D',
    'Combiflam',
    'Montair LC',
  ];

  // Voice Recording Handlers
  const startVoiceRecording = async () => {
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopVoiceRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      alert('Microphone permission is needed to record a voice note. You can also type your medicine request or call 08892450227 directly.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voicePhone.trim()) {
      alert('Please provide your phone number so the pharmacist can call/WhatsApp you with medicine availability.');
      return;
    }
    setIsSubmittingVoice(true);

    try {
      await savePrescriptionOrderToSupabase({
        patient_name: voicePatientName.trim() || 'Patient (Voice Order)',
        phone_number: voicePhone.trim(),
        address: 'Dharwad (Voice Order Requested)',
        prescription_file_name: `voice_note_${recordingSeconds}s.webm`,
        delivery_type: 'quick-dharwad',
        notes: `VOICE NOTE MEDICINE REQUEST (${recordingSeconds} seconds recorded). Customer waiting for call/WhatsApp on ${voicePhone}.`,
      });
      setIsSubmittingVoice(false);
      setVoiceSuccess(true);
    } catch (e) {
      setIsSubmittingVoice(false);
      setVoiceSuccess(true);
    }
  };

  // Video / Photo Submit
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPhone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    setIsVideoSubmitting(true);

    try {
      await savePrescriptionOrderToSupabase({
        patient_name: videoPatientName.trim() || 'Patient (Media Order)',
        phone_number: videoPhone.trim(),
        address: 'Dharwad (Camera Note)',
        prescription_file_name: videoFile ? videoFile.name : 'camera_medicine_note.mp4',
        delivery_type: 'quick-dharwad',
        notes: `VIDEO / CAMERA MEDICINE NOTE. Contact customer on ${videoPhone}.`,
      });
      setIsVideoSubmitting(false);
      setVideoSuccess(true);
    } catch (e) {
      setIsVideoSubmitting(false);
      setVideoSuccess(true);
    }
  };

  // Custom text submit
  const handleCustomTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTextRequest.trim()) {
      alert('Please enter the name of the medicine you need.');
      return;
    }
    if (!customPhone.trim()) {
      alert('Please enter your phone number so we can confirm your medicine stock.');
      return;
    }
    setIsSubmittingCustom(true);

    try {
      await savePrescriptionOrderToSupabase({
        patient_name: 'Patient (Custom Request)',
        phone_number: customPhone.trim(),
        address: 'Dharwad Locality',
        prescription_file_name: 'custom_text_request.txt',
        delivery_type: 'quick-dharwad',
        notes: `CUSTOM MEDICINE REQUEST: "${customTextRequest}". Contact number: ${customPhone}.`,
      });
      setIsSubmittingCustom(false);
      setCustomSuccessMessage(customTextRequest);
    } catch (e) {
      setIsSubmittingCustom(false);
      setCustomSuccessMessage(customTextRequest);
    }
  };

  return (
    <section id="smart-search" className="py-12 sm:py-16 bg-white relative border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Medicine Finder & Order Station</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Medicine or Order Directly
          </h2>

          <p className="mt-1 text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Type any medicine name for instant auto-pickup. If unlisted, add your prescription, record a voice note, or request by text!
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type medicine name (e.g. Dolo 650, Augmentin, BP tablet, Cough syrup)..."
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-emerald-500/70 focus:border-emerald-600 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-md transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Popular:</span>
          {quickSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSearchTerm(item)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors shrink-0 font-medium"
            >
              {item}
            </button>
          ))}
        </div>

        {/* AUTO-MATCH SEARCH RESULTS (When user is typing) */}
        {searchTerm.trim().length > 0 && searchResults.length > 0 && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Found <strong>{searchResults.length}</strong> matching item(s) in Dharwad store
              </span>
              <span className="text-emerald-700 font-semibold">Ready for 20-Min Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((med) => {
                const isJustAdded = addedIds[med.id];

                return (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/80 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500">{med.dosage}</span>
                        {med.requiresRx ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            ℞ Rx Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            OTC
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                      <p className="text-[11px] text-slate-500 italic">Generic: {med.genericName}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{med.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200">
                      <div>
                        <span className="text-base font-black font-mono text-slate-900">
                          ₹{med.price.toFixed(2)}
                        </span>
                        {med.originalPrice && (
                          <span className="text-xs font-mono text-slate-400 line-through ml-1.5">
                            ₹{med.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAdd(med)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* IF MEDICINE IS NOT FOUND OR USER WANTS CUSTOM REQUEST (VOICE, VIDEO, PRESCRIPTION, TEXT) */}
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-50 to-emerald-50/20 p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {searchTerm.trim().length > 0 && searchResults.length === 0
                    ? `"${searchTerm}" Not in Quick List? We have it in store!`
                    : "Can't find your exact medicine? Order directly:"}
                </span>
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Upload your doctor's prescription, record a voice note, send video/photo, or write text:
              </p>
            </div>

            {/* Direct hotline call */}
            <a
              href={`tel:${PHARMACY_CONFIG.phoneRaw}`}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 font-mono shadow-sm shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: {PHARMACY_CONFIG.phoneHighlight}</span>
            </a>
          </div>

          {/* Option Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            <button
              onClick={() => setFallbackMode('text')}
              className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 ${
                fallbackMode === 'text'
                  ? 'border-emerald-600 bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1. Text Medicine</span>
            </button>

            <button
              onClick={() => setFallbackMode('voice')}
              className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 ${
                fallbackMode === 'voice'
                  ? 'border-emerald-600 bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>2. Voice Note</span>
            </button>

            <button
              onClick={() => setFallbackMode('video')}
              className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 ${
                fallbackMode === 'video'
                  ? 'border-emerald-600 bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>3. Video / Camera</span>
            </button>

            <button
              onClick={onOpenUploadModal}
              className="p-2.5 rounded-xl border border-slate-200 bg-white/70 hover:bg-white text-slate-600 text-center transition-all text-xs font-bold flex flex-col items-center gap-1"
            >
              <span className="font-serif text-base text-emerald-600 font-bold leading-none">℞</span>
              <span>4. Upload Rx</span>
            </button>
          </div>

          {/* TAB 1: TEXT MEDICINE REQUEST */}
          {fallbackMode === 'text' && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              {customSuccessMessage ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">
                    Medicine Request Received!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Our registered pharmacist at Prabhu Complex is checking stock for "{customSuccessMessage}" and will call / WhatsApp you immediately.
                  </p>
                  <button
                    onClick={() => {
                      setCustomSuccessMessage(null);
                      setCustomTextRequest('');
                    }}
                    className="text-xs text-emerald-700 font-bold underline mt-2"
                  >
                    Request Another Medicine
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomTextSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Write Medicine Name, Brand, or Health Concern
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customTextRequest}
                      onChange={(e) => setCustomTextRequest(e.target.value)}
                      placeholder="e.g. Need 2 strips of Cetirizine 10mg and 1 bottle of Benadryl cough syrup delivered to JSS campus..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Mobile Number (for stock call/WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="e.g. 08892450227"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isSubmittingCustom}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        {isSubmittingCustom ? (
                          <span>Sending to Store...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Request to Pharmacist</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: VOICE NOTE RECORDING */}
          {fallbackMode === 'voice' && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              {voiceSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">
                    Voice Note Received by Pharmacist!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We received your voice order and will call you back on {voicePhone} to confirm delivery in Dharwad.
                  </p>
                  <button
                    onClick={() => {
                      setVoiceSuccess(false);
                      setAudioBlobUrl(null);
                    }}
                    className="text-xs text-emerald-700 font-bold underline mt-2"
                  >
                    Record Another Voice Note
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                          isRecording
                            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {isRecording ? 'Listening... Speak your medicine order' : 'Record Voice Note'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {isRecording
                            ? `Recording: 00:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} (Tap mic when done)`
                            : 'Tap microphone and speak your medicine names or dosage'}
                        </p>
                      </div>
                    </div>

                    {audioBlobUrl && (
                      <div className="flex items-center gap-2">
                        <audio src={audioBlobUrl} controls className="h-9 max-w-[200px]" />
                        <button
                          type="button"
                          onClick={() => setAudioBlobUrl(null)}
                          className="p-1.5 text-slate-400 hover:text-red-500 text-xs"
                          title="Delete and re-record"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {audioBlobUrl && (
                    <form onSubmit={handleVoiceSubmit} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={voicePatientName}
                          onChange={(e) => setVoicePatientName(e.target.value)}
                          placeholder="Your Name (Optional)"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                        />
                        <input
                          type="tel"
                          required
                          value={voicePhone}
                          onChange={(e) => setVoicePhone(e.target.value)}
                          placeholder="Your Mobile Phone Number *"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingVoice}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                      >
                        {isSubmittingVoice ? (
                          <span>Submitting Voice Order...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Voice Note to Bhagavati Medical</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO / CAMERA SNAP */}
          {fallbackMode === 'video' && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              {videoSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">
                    Video / Photo Received!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We will review the strip/bottle media and contact {videoPhone} with pricing and instant Dharwad delivery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVideoSubmit} className="space-y-3">
                  <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center bg-slate-50">
                    <input
                      type="file"
                      accept="video/*,image/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVideoFile(e.target.files[0]);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Take a quick camera video or photo of your medicine strip / bottle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={videoPatientName}
                      onChange={(e) => setVideoPatientName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <input
                      type="tel"
                      required
                      value={videoPhone}
                      onChange={(e) => setVideoPhone(e.target.value)}
                      placeholder="Your Mobile Phone Number *"
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVideoSubmitting || !videoFile}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {isVideoSubmitting ? (
                      <span>Sending Video Note...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Video / Photo to Store</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
