import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Users, ArrowRight, ShieldCheck, Coins, CheckCircle2, MapPin } from 'lucide-react';

export const RoleSelection = () => {
  const { role, switchRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (selectedRole) => {
    switchRole(selectedRole);
    if (selectedRole === 'employer') {
      navigate('/employer');
    } else {
      navigate('/worker');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <Coins className="w-3.5 h-3.5" />
          <span>Select Your WorkBridge Experience</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How will you use WorkBridge today?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
          Choose your perspective to experience the hyperlocal workforce platform, single-token escrow, and automated AI verification.
        </p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Employer Card */}
        <div
          onClick={() => handleSelect('employer')}
          className={`cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between ${
            role === 'employer' ? 'border-navy-800 ring-4 ring-navy-800/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-navy-800 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Employer Portal</h3>
                {role === 'employer' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                    Current Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                For Local Businesses, Warehouses, Retailers & Homeowners.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Post on-demand shifts within a 5 km geo-fence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fund Single-Token Escrow in "Created" state</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Review AI verification & 30-sec video pitch scores</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Validate worker punch-in via dynamic QR token</span>
              </li>
            </ul>
          </div>

          <button className="mt-8 w-full py-3 px-6 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition">
            <span>Enter as Employer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Card */}
        <div
          onClick={() => handleSelect('worker')}
          className={`cursor-pointer bg-white rounded-3xl p-8 border-2 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between ${
            role === 'worker' ? 'border-emerald-600 ring-4 ring-emerald-600/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Users className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900">Worker Portal</h3>
                {role === 'worker' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                    Current Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                For Hourly Informal & Semi-Skilled Gig Partners.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Browse nearby open gigs sorted by exact walking distance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated KYC: Mock OCR & 30-sec pitch NLP verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Punch in with Dynamic QR to lock escrow (HELD state)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant automated UPI payout upon punch-out (RELEASED)</span>
              </li>
            </ul>
          </div>

          <button className="mt-8 w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition">
            <span>Enter as Gig Partner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
