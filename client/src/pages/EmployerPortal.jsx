import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEscrow } from '../context/EscrowContext';
import { useLanguage } from '../context/LanguageContext';
import EscrowStatusBadge from '../components/escrow/EscrowStatusBadge';
import DynamicQRCode from '../components/escrow/DynamicQRCode';
import ShiftTimer from '../components/escrow/ShiftTimer';
import ContactMaskModal from '../components/common/ContactMaskModal';
import {
  Building2,
  PlusCircle,
  Coins,
  MapPin,
  Clock,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Video,
  FileCheck
} from 'lucide-react';

export const EmployerPortal = () => {
  const { user, profile } = useAuth();
  const { token, shift, timer, handlePunchIn, handlePunchOut, resetDemoEscrow } = useEscrow();
  const { t } = useLanguage();

  const [gigs, setGigs] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showMaskModal, setShowMaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('live_shift'); // 'live_shift' | 'candidates' | 'postings'

  // New Gig Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Logistics & Warehousing');
  const [newHourlyRate, setNewHourlyRate] = useState(250);
  const [newHours, setNewHours] = useState(4);
  const [postingGig, setPostingGig] = useState(false);

  // Fetch gigs on load
  const loadGigs = async () => {
    try {
      const res = await fetch('/api/gigs/hyperlocal');
      if (res.ok) {
        const data = await res.json();
        setGigs(data.gigs || []);
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    loadGigs();
  }, []);

  const handleCreateGig = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    setPostingGig(true);
    try {
      const res = await fetch('/api/gigs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          hourly_rate: Number(newHourlyRate),
          estimated_hours: Number(newHours),
          geo_radius_km: 5.0
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowPostModal(false);
        setNewTitle('');
        await loadGigs();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPostingGig(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Employer Enterprise Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-800 to-indigo-700 text-white flex items-center justify-center shadow-md ring-4 ring-navy-800/10">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{profile?.company_name || 'Metro Logistics Center'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  GST Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-navy-800" />
                <span>{profile?.address || 'Plot 42, Kurla West Commercial Estate, Mumbai 400070'}</span>
                <span className="font-bold text-navy-800">• 5km Anchor</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="bg-blue-50/80 px-4 py-2.5 rounded-2xl border border-blue-200 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Virtual Escrow Pool</span>
              <span className="text-xl font-extrabold text-navy-800">₹24,500.00</span>
            </div>

            <button
              id="post-new-gig-btn"
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-300" />
              <span>{t('post_gig_title')}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('live_shift')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'live_shift'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Live Shift & Escrow Monitor
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'candidates'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            AI Verified Worker Queue
          </button>
          <button
            onClick={() => setActiveTab('postings')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'postings'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Published Shifts ({gigs.length})
          </button>
        </div>

        {/* TAB 1: Live Shift & Escrow Monitor */}
        {activeTab === 'live_shift' && (
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
                  isWorker={false}
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

        {/* TAB 2: AI Verified Worker Queue */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Applicant Verification Queue</h3>
                  <p className="text-xs text-slate-500">
                    Pre-screened candidates via WorkBridge Python AI Engine (OCR + 30-sec pitch NLP).
                  </p>
                </div>
                <button
                  onClick={() => setShowMaskModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Privacy Shield Proxy Line</span>
                </button>
              </div>

              {/* Worker Card 1: Ramesh Patil */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      RP
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">Ramesh Patil</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          AI SCORE 97/100
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>⭐ 4.95 (68 Gigs)</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-blue-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5" /> 1.2 km away
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowMaskModal(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-navy-800" />
                      <span>Masked Call</span>
                    </button>
                    <button
                      onClick={() => handlePunchIn(token?.gig_id)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition"
                    >
                      <span>Accept & Punch-In</span>
                    </button>
                  </div>
                </div>

                {/* AI Verification Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Mock OCR Document Scan: Aadhaar (UIDAI)</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Name: <strong>RAMESH DNYANESHWAR PATIL</strong> (Match 98.4%)</div>
                      <div>UID: XXXX-XXXX-9421 • Tamper Risk: <strong className="text-emerald-600">LOW (0.012)</strong></div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>30-Second Video Pitch NLP Summary</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Punctuality Intent: <strong className="text-emerald-600">HIGH COMMITMENT</strong></div>
                      <div>Skills Extracted: Heavy Loading, Pallet Stacking, Inventory Audit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Card 2: Sunita Sharma */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      SS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">Sunita Sharma</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300">
                          AI SCORE 95/100
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>⭐ 4.80 (31 Gigs)</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-blue-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5" /> 2.1 km away
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowMaskModal(true)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-navy-800" />
                      <span>Masked Call</span>
                    </button>
                    <button
                      onClick={() => handlePunchIn(token?.gig_id)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition"
                    >
                      <span>Match Worker</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Mock OCR Document Scan: Voter ID</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      EPIC: MH/04/082/98214 • Match Confidence: <strong>96.2%</strong>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>Pitch NLP Analysis</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Electrical Wiring, Panel Diagnostic, Certified Safety Technician.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Published Shifts */}
        {activeTab === 'postings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gigs.map((g) => (
                <div key={g.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {g.category}
                      </span>
                      <span className="font-bold text-slate-400 font-mono">₹{g.hourly_rate}/hr</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{g.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{g.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Escrow Budget</span>
                      <span className="font-bold text-navy-800 text-sm">₹{g.total_amount}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      g.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : g.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Gig Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-navy-800" />
                <h3 className="text-lg font-bold text-slate-900">{t('post_gig_title')}</h3>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGig} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('gig_title')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Express Pallet Dispatch & Loading"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('gig_category')}</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                >
                  <option>Logistics & Warehousing</option>
                  <option>Retail & Supermarket Assistance</option>
                  <option>Technical & Electrical Diagnostic</option>
                  <option>Facility Deep Clean</option>
                  <option>Packaging & Assembly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('gig_rate')}</label>
                  <input
                    type="number"
                    min="150"
                    max="1000"
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('gig_hours')}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-800 text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Escrow Lock Calculation */}
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-900 block">Single-Token Escrow Lock</span>
                  <span className="text-lg font-black text-navy-800">₹{(Number(newHourlyRate) * Number(newHours)).toFixed(2)}</span>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <span>Geo-Radius: <strong>5.0 km</strong></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={postingGig}
                className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {postingGig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4 text-blue-300" />}
                <span>{postingGig ? 'Locking Escrow...' : t('gig_publish')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Masking Modal */}
      <ContactMaskModal
        isOpen={showMaskModal}
        onClose={() => setShowMaskModal(false)}
        employerName={profile?.company_name}
        workerName="Ramesh Patil"
      />
    </div>
  );
};

export default EmployerPortal;
