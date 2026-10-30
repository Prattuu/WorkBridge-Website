import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEscrow } from '../context/EscrowContext';
import { useLanguage } from '../context/LanguageContext';
import EscrowStatusBadge from '../components/escrow/EscrowStatusBadge';
import DynamicQRCode from '../components/escrow/DynamicQRCode';
import ShiftTimer from '../components/escrow/ShiftTimer';
import ContactMaskModal from '../components/common/ContactMaskModal';
import {
  Users,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Video,
  Play,
  Upload,
  RefreshCw,
  PhoneCall,
  Navigation,
  ArrowRight,
  Sparkles,
  Zap,
  Wallet
} from 'lucide-react';

export const WorkerPortal = () => {
  const { user, profile, updateProfileKyc } = useAuth();
  const { token, shift, timer, handlePunchIn, handlePunchOut, resetDemoEscrow } = useEscrow();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'active_shift' | 'verification' | 'wallet'
  const [gigs, setGigs] = useState([]);
  const [showMaskModal, setShowMaskModal] = useState(false);

  // AI Verification State
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrResult, setOcrResult] = useState(profile?.ocr_data || null);
  const [docType, setDocType] = useState('aadhaar');

  const [pitchRunning, setPitchRunning] = useState(false);
  const [pitchTranscript, setPitchTranscript] = useState(
    "Namaste! My name is Ramesh Patil. I have 4 years experience in warehouse pallet loading, heavy carton dispatch, and barcode inventory scanning. I am always punctual, reliable, and live within 2 km of the logistics hub. Ready for immediate shifts."
  );
  const [pitchResult, setPitchResult] = useState(profile?.video_pitch_analysis || null);

  // Fetch nearby gigs
  const fetchNearbyGigs = async () => {
    try {
      const res = await fetch('/api/gigs/hyperlocal?lat=19.0760&lng=72.8777&radius=5.0');
      if (res.ok) {
        const data = await res.json();
        setGigs(data.gigs || []);
      }
    } catch (e) {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchNearbyGigs();
  }, []);

  // Run Mock OCR
  const handleRunOcr = async () => {
    setOcrRunning(true);
    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: docType })
      });
      const data = await res.json();
      setOcrResult(data);
      updateProfileKyc(data, pitchResult);
    } catch (e) {
      console.error(e);
    } finally {
      setOcrRunning(false);
    }
  };

  // Run Speech-to-Text & NLP Pitch Analysis
  const handleRunPitchAnalysis = async () => {
    setPitchRunning(true);
    try {
      const res = await fetch('/api/ai/pitch-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioTranscript: pitchTranscript,
          videoDurationSeconds: 28,
          candidateName: 'Ramesh Patil'
        })
      });
      const data = await res.json();
      setPitchResult(data);
      updateProfileKyc(ocrResult, data);
    } catch (e) {
      console.error(e);
    } finally {
      setPitchRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Worker Hero Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-emerald-600/10">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Ramesh Patil'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AI VERIFIED (97/100)
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>⭐ 4.95 Rating (68 Shifts)</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5" /> Live in Kurla West (5km Hub)
                </span>
                <span>•</span>
                <span className="text-blue-700 font-mono font-bold">UPI: ramesh.patil@okaxis</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-200 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Released Payouts</span>
              <span className="text-xl font-extrabold text-emerald-800">₹14,880.00</span>
            </div>

            <button
              onClick={() => setShowMaskModal(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Privacy Shield Line</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'feed'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Nearby Gigs (&lt;5km)
          </button>
          <button
            onClick={() => setActiveTab('active_shift')}
            className={`px-4 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'active_shift'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Shift & QR</span>
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Verification (OCR & Pitch)</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'wallet'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Metro Escrow Wallet</span>
          </button>
        </div>

        {/* TAB 1: Nearby Hyperlocal Feed (<5km) */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{t('open_gigs_near_you')}</h3>
                <p className="text-xs text-slate-500">
                  Sorted by live Haversine geo-distance. All shifts guarantee Single-Token Escrow.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                5km Geofence Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px]">
                        {g.category}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <Navigation className="w-3 h-3" />
                        <span>{g.distance_km || 0.8} km away</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">{g.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{g.description}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
                        <span className="font-black text-slate-900 font-mono">₹{g.hourly_rate}/hr</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                        <span className="font-black text-slate-900">{g.estimated_hours} hrs</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Escrow</span>
                        <span className="font-black text-emerald-700 font-mono">₹{g.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handlePunchIn(g.id);
                      setActiveTab('active_shift');
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition transform active:scale-98"
                  >
                    <span>{t('apply_now')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Active Shift & Punch-In */}
        {activeTab === 'active_shift' && (
          <div className="space-y-6">
            <EscrowStatusBadge
              status={token?.status}
              amount={token?.amount || 960}
              tokenHash={token?.token_hash}
              txHash={token?.tx_hash}
              onReset={resetDemoEscrow}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ShiftTimer
                  onPunchIn={() => handlePunchIn(token?.gig_id)}
                  onPunchOut={() => handlePunchOut()}
                  gig={{ hourly_rate: 240, total_amount: 960 }}
                  isWorker={true}
                />
              </div>

              <div>
                <DynamicQRCode
                  gigId={token?.gig_id}
                  isHeld={token?.status === 'Held'}
                  onScanSuccess={() => handlePunchIn(token?.gig_id)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Automated AI Verification (OCR & 30-Sec Video Pitch) */}
        {activeTab === 'verification' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900">{t('kyc_title')}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Python FastAPI microservice parsing Aadhaar/Voter ID mock OCR and candidate audio pitch NLP.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. OCR Document Verification Box */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">{t('kyc_ocr')}</h4>
                    </div>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="aadhaar">Aadhaar (UIDAI)</option>
                      <option value="voter_id">Voter ID (Election Commission)</option>
                    </select>
                  </div>

                  <p className="text-xs text-slate-500">
                    Extracts ID number, name, date of birth, and checks computer vision hologram & tamper score.
                  </p>

                  <button
                    onClick={handleRunOcr}
                    disabled={ocrRunning}
                    className="w-full py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    {ocrRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{ocrRunning ? 'Extracting via Neural OCR...' : 'Run Automated Document OCR'}</span>
                  </button>

                  {ocrResult && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between font-bold text-navy-800 text-[11px] pb-1 border-b border-slate-100">
                        <span>{ocrResult.document_type}</span>
                        <span className="text-emerald-600">CONFIDENCE: {ocrResult.security_analysis?.overall_confidence_percentage || '98.4'}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>ID Number: <strong>{ocrResult.extracted_fields?.id_number || '8942 1083 4921'}</strong></div>
                        <div>Name: <strong>{ocrResult.extracted_fields?.full_name || 'RAMESH PATIL'}</strong></div>
                        <div>DOB: <strong>{ocrResult.extracted_fields?.dob || '14/05/1992'}</strong></div>
                        <div>Tamper Risk: <strong className="text-emerald-600">LOW (PASS)</strong></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. 30-Second Video Pitch NLP Box */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-slate-900 text-sm">{t('kyc_pitch')}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Whisper + NLP Mock
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Candidate 30-Sec Pitch Transcript:
                    </label>
                    <textarea
                      rows={3}
                      value={pitchTranscript}
                      onChange={(e) => setPitchTranscript(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800"
                    />
                  </div>

                  <button
                    onClick={handleRunPitchAnalysis}
                    disabled={pitchRunning}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    {pitchRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{pitchRunning ? 'Analyzing NLP Sentiment & Skills...' : 'Analyze Candidate Pitch'}</span>
                  </button>

                  {pitchResult && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between font-bold text-purple-900 text-[11px] pb-1 border-b border-slate-100">
                        <span>NLP Analysis Completed</span>
                        <span className="text-emerald-600">RELIABILITY: {pitchResult.nlp_metrics?.reliability_score || 96}/100</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Punctuality Intent: <strong className="text-emerald-600">{pitchResult.nlp_metrics?.punctuality_intent || 'HIGH'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Skills Detected:</span>
                        <div className="flex flex-wrap gap-1">
                          {(pitchResult.nlp_metrics?.extracted_skills || ['Heavy Loading', 'Pallet Stacking', 'Punctual']).map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Wallet & Metro Escrow Settlements */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Metro-Token Instant Escrow Wallet</h3>
                  <p className="text-xs text-slate-500">
                    Settlements disburse instantly via UPI rail upon punch-out. No weekly wait times.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Balance</span>
                  <span className="text-2xl font-black text-emerald-700">₹14,880.00</span>
                </div>
              </div>

              {/* Settlement History */}
              <div className="space-y-3">
                {[
                  { title: 'Express Warehouse Dispatch', date: 'Today, 2:30 PM', hours: 4, amount: 960, tx: '0x4f128ab67cde8910fedcba98' },
                  { title: 'Supermarket Grocery Stacking', date: 'Yesterday, 8:00 PM', hours: 5, amount: 1000, tx: '0x99a01c8751bf823810ff' },
                  { title: 'Electrical Panel Maintenance', date: '28 Oct 2026', hours: 3, amount: 1050, tx: '0x33b821097fa6154871e2' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.date} • {item.hours} hrs worked</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">TX: {item.tx}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 text-base font-mono block">+₹{item.amount}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        UPI SETTLED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Mask Modal */}
      <ContactMaskModal
        isOpen={showMaskModal}
        onClose={() => setShowMaskModal(false)}
        employerName="Metro Logistics Distribution Center"
        workerName={user?.name || 'Ramesh Patil'}
      />
    </div>
  );
};

export default WorkerPortal;
