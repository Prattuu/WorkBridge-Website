import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useEscrow } from '../context/EscrowContext';
import EscrowStatusBadge from '../components/escrow/EscrowStatusBadge';
import DynamicQRCode from '../components/escrow/DynamicQRCode';
import ShiftTimer from '../components/escrow/ShiftTimer';
import ArchitectureInspector from '../components/debug/ArchitectureInspector';
import ContactMaskModal from '../components/common/ContactMaskModal';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Coins,
  Cpu,
  Lock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Users,
  Building2,
  Scan
} from 'lucide-react';

export const LandingPage = () => {
  const { t } = useLanguage();
  const { token, handlePunchIn, handlePunchOut, resetDemoEscrow } = useEscrow();
  const [showArchInspector, setShowArchInspector] = useState(false);
  const [showMaskModal, setShowMaskModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section with Royal Navy Blue Depth & Glassmorphism */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Futuristic Background Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Hyperlocal Geofence Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('badge_geofence')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
              {t('brand_name')}
              <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300 mt-2">
                {t('tagline')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              {t('subtagline')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/employer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-900/40 hover:shadow-blue-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>{t('hero_cta_hire')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/worker"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{t('hero_cta_work')}</span>
              </Link>
            </div>

            {/* Architecture Telemetry Link */}
            <div className="pt-2">
              <button
                onClick={() => setShowArchInspector(true)}
                className="inline-flex items-center gap-1.5 text-xs text-blue-300/80 hover:text-white transition font-medium underline underline-offset-4"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Inspect AWS & Firebase Cloud Architecture Spec</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Single-Token Escrow Live Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 w-full mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 tracking-wider">
                  Live Interactive Demo
                </span>
                <span className="text-xs text-slate-500">• Metro-Token Financial Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Single-Token Dynamic Escrow Lifecycle
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMaskModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Test Privacy Shield</span>
              </button>
            </div>
          </div>

          {/* Escrow Status Badge */}
          <EscrowStatusBadge
            status={token?.status}
            amount={token?.amount || 960}
            tokenHash={token?.token_hash}
            txHash={token?.tx_hash}
            onReset={resetDemoEscrow}
          />

          {/* Interactive Shift Timer & Dynamic QR Code Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            <div className="lg:col-span-2">
              <ShiftTimer
                onPunchIn={() => handlePunchIn(token?.gig_id)}
                onPunchOut={() => handlePunchOut()}
                gig={{ hourly_rate: 240, total_amount: 960 }}
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
      </section>

      {/* 4 Pillars of WorkBridge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered for Informal Workforce Trust & Velocity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Addressing friction in hyperlocal informal labour: trust deficit, delayed payment, and identity safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Single-Token Escrow</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Metro-token state machine: funds are locked upon punch-in and instantly disbursed via UPI upon punch-out. Zero wage theft.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">AI Verification Engine</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automated multi-factor onboarding featuring mock OCR for Aadhaar / Voter ID and speech-to-text NLP for 30-sec candidate pitches.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Privacy Shield Proxy</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Complete contact masking preventing direct phone exchange. All voice calls and messages route through virtual relay numbers.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">5 km Hyperlocal Fence</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Strict Haversine geo-fencing ensures workers are within walking or short transit distance, guaranteeing swift 15-minute arrivals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-navy-950 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-navy-900 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Coins className="w-4 h-4 text-blue-400" />
            <span>WorkBridge Hyperlocal Platform</span>
          </div>
          <div>
            Built with React 18, Node.js, Express, Python FastAPI AI, PostgreSQL & Redis.
          </div>
          <button
            onClick={() => setShowArchInspector(true)}
            className="text-blue-400 hover:text-white transition font-semibold"
          >
            System Specs & Telemetry
          </button>
        </div>
      </footer>

      {/* Modals */}
      <ArchitectureInspector isOpen={showArchInspector} onClose={() => setShowArchInspector(false)} />
      <ContactMaskModal isOpen={showMaskModal} onClose={() => setShowMaskModal(false)} />
    </div>
  );
};

export default LandingPage;
