import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEscrow } from '../../context/EscrowContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import VoiceAssistant from './VoiceAssistant';
import {
  Briefcase,
  Users,
  Building2,
  ShieldAlert,
  Coins,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { role, switchRole, user } = useAuth();
  const { token } = useEscrow();
  const { t } = useLanguage();
  const location = useLocation();

  const getEscrowColor = (status) => {
    switch (status) {
      case 'Created': return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
      case 'Held': return 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse';
      case 'Released': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-400/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-800 text-white shadow-lg border-b border-navy-700/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md ring-2 ring-white/20 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">WorkBridge</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  5km Hyperlocal
                </span>
              </div>
              <p className="text-[10px] text-slate-300 tracking-tight hidden sm:block">
                Single-Token Escrow & Smart Workforce
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                location.pathname === '/' ? 'bg-navy-900 text-white shadow-inner' : 'text-slate-200 hover:text-white hover:bg-navy-700/60'
              }`}
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/employer"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                location.pathname === '/employer' ? 'bg-navy-900 text-white shadow-inner' : 'text-slate-200 hover:text-white hover:bg-navy-700/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              {t('nav_employer')}
            </Link>
            <Link
              to="/worker"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                location.pathname === '/worker' ? 'bg-navy-900 text-white shadow-inner' : 'text-slate-200 hover:text-white hover:bg-navy-700/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              {t('nav_worker')}
            </Link>
            <Link
              to="/role-selection"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                location.pathname === '/role-selection' ? 'bg-navy-900 text-white shadow-inner' : 'text-slate-200 hover:text-white hover:bg-navy-700/60'
              }`}
            >
              {t('nav_roles')}
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Active Escrow State Quick Pill */}
          {token && (
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getEscrowColor(token.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>METRO TOKEN: ₹{token.amount}</span>
              <span className="text-[10px] uppercase opacity-90">({token.status})</span>
            </div>
          )}

          {/* Role Toggle Pill */}
          <div className="bg-navy-900/90 p-0.5 rounded-full border border-navy-700 flex items-center">
            <button
              onClick={() => switchRole('employer')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition ${
                role === 'employer'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Employer
            </button>
            <button
              onClick={() => switchRole('worker')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition ${
                role === 'worker'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Worker
            </button>
          </div>

          {/* Voice Assistant */}
          <VoiceAssistant />

          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
