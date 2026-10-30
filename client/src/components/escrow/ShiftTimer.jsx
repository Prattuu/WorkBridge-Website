import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useEscrow } from '../../context/EscrowContext';
import { Clock, IndianRupee, ShieldCheck, Play, CheckCircle, Navigation, AlertCircle } from 'lucide-react';

export const ShiftTimer = ({ onPunchIn, onPunchOut, gig, isWorker = true }) => {
  const { t } = useLanguage();
  const { token, shift, timer, loading } = useEscrow();

  const isHeld = token?.status === 'Held';
  const isReleased = token?.status === 'Released';
  const isCreated = token?.status === 'Created';

  const hourlyRate = gig?.hourly_rate || 240;

  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 shadow-xl border border-navy-700/80 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isHeld ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`} />
          <h4 className="text-sm font-bold tracking-wide uppercase">{t('shift_timer')}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            ₹{hourlyRate}/hr
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isHeld
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse'
              : isReleased
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
              : 'bg-slate-700 text-slate-300'
          }`}>
            {token?.status || 'Created'}
          </span>
        </div>
      </div>

      {/* Timer Display and Accrued Earnings */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Time Clock */}
        <div className="bg-navy-800/80 rounded-xl p-4 border border-navy-700/60 flex flex-col justify-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            {isHeld ? 'Elapsed Shift Time' : isReleased ? 'Total Shift Duration' : 'Awaiting Punch-In'}
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white">
            {timer?.elapsedFormatted || '00:00:00'}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Geo-distance: <strong>18.2 meters</strong> (Inside 5km Geofence)</span>
          </div>
        </div>

        {/* Accrued Live Earnings */}
        <div className="bg-navy-800/80 rounded-xl p-4 border border-navy-700/60 flex flex-col justify-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            {t('accrued_payout')}
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 flex items-center">
            <span className="text-2xl mr-1">₹</span>
            <span>{timer?.accruedPayout?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>Escrow Max Allocation: ₹{token?.amount || 960}</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="pt-2">
        {isCreated && (
          <button
            id="punch-in-trigger-btn"
            onClick={onPunchIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-900/40 transition transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            {t('punch_in_btn')}
          </button>
        )}

        {isHeld && (
          <button
            id="punch-out-trigger-btn"
            onClick={onPunchOut}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white shadow-lg shadow-amber-900/30 transition transform active:scale-98"
          >
            <CheckCircle className="w-4 h-4" />
            {t('punch_out_btn')}
          </button>
        )}

        {isReleased && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-4 h-4" /> Shift Settled & Escrow Disbursed
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              ₹{timer?.accruedPayout?.toFixed(2) || token?.amount} credited to worker UPI wallet instantaneously.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftTimer;
