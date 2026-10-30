import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, Unlock, ShieldCheck, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const EscrowStatusBadge = ({ status = 'Held', amount = 960, txHash, tokenHash, onReset }) => {
  const { t } = useLanguage();

  const stages = [
    { key: 'Created', label: t('state_created'), desc: t('state_created_desc'), color: 'blue' },
    { key: 'Held', label: t('state_held'), desc: t('state_held_desc'), color: 'amber' },
    { key: 'Released', label: t('state_released'), desc: t('state_released_desc'), color: 'emerald' },
  ];

  const getStageIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'Created': return 0;
      case 'Held': return 1;
      case 'Released': return 2;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(status);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            status === 'Released'
              ? 'bg-emerald-100 text-emerald-700'
              : status === 'Held'
              ? 'bg-amber-100 text-amber-700 animate-pulse'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {status === 'Released' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : status === 'Held' ? (
              <Lock className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{t('escrow_title')}</h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Metro-Token Protocol
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{t('escrow_desc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Token Value</span>
            <span className="text-xl font-extrabold text-navy-800">₹{amount}</span>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-navy-800 hover:bg-slate-100 transition"
              title="Reset Demo Escrow"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3-State Metro Token Flow Graphic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
        {stages.map((stage, idx) => {
          const isCurrent = stage.key === status;
          const isPassed = currentIndex > idx;

          return (
            <div
              key={stage.key}
              className={`p-3.5 rounded-xl border transition-all duration-300 relative ${
                isCurrent
                  ? stage.key === 'Held'
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40'
                    : stage.key === 'Released'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/40'
                    : 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/40'
                  : isPassed
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-slate-50/50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  Step 0{idx + 1}
                </span>
                {isPassed ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                ) : isCurrent ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    stage.key === 'Held'
                      ? 'bg-amber-200 text-amber-800'
                      : stage.key === 'Released'
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Upcoming</span>
                )}
              </div>

              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                {stage.label}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{stage.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Transaction & Hash Details */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px] truncate max-w-full">
          <Zap className="w-3.5 h-3.5 text-navy-800 shrink-0" />
          <span className="font-bold text-slate-400">HASH:</span>
          <span className="truncate">{tokenHash || '0x9fa41c88c7b822ee40b90e15967dc21f456c7890'}</span>
        </div>
        {txHash && (
          <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] shrink-0 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DISBURSED VIA UPI</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowStatusBadge;
