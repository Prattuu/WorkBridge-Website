import React, { useState, useEffect } from 'react';
import { QrCode, Scan, ShieldCheck, RefreshCw, MapPin, CheckCircle2 } from 'lucide-react';

export const DynamicQRCode = ({
  gigId = 'gig_101',
  workerId = 'wrk_prf_001',
  coords = { lat: 19.0728, lng: 72.8795 },
  onScanSuccess,
  isHeld = false
}) => {
  const [tokenNonce, setTokenNonce] = useState('0x7e8b91a2f4c3');
  const [countdown, setCountdown] = useState(30);
  const [isScanning, setIsScanning] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);

  // Dynamic token rotation every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTokenNonce('0x' + Math.random().toString(16).slice(2, 14));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanVerified(true);
      if (onScanSuccess) {
        onScanSuccess();
      }
      setTimeout(() => setScanVerified(false), 3000);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <div className="flex items-center justify-between w-full mb-3 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
          <QrCode className="w-4 h-4 text-navy-800" /> Dynamic Geo-QR
        </span>
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> {countdown}s
        </span>
      </div>

      {/* QR Code Container with High-Tech Scanning Laser */}
      <div className="relative p-4 bg-slate-900 rounded-2xl shadow-inner my-2 group">
        {/* Holographic Laser Animation */}
        {isScanning && (
          <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] z-20 animate-bounce" />
        )}

        {/* High-Contrast SVG QR Graphic */}
        <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center relative overflow-hidden">
          <svg className="w-full h-full text-navy-950" viewBox="0 0 100 100" fill="currentColor">
            {/* Corner Markers */}
            <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6"/>
            <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor"/>

            <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6"/>
            <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor"/>

            <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6"/>
            <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor"/>

            {/* Matrix Data Points */}
            <rect x="40" y="8" width="6" height="6" rx="1"/>
            <rect x="50" y="8" width="8" height="6" rx="1"/>
            <rect x="42" y="20" width="8" height="8" rx="1"/>
            <rect x="54" y="24" width="6" height="6" rx="1"/>

            <rect x="8" y="42" width="6" height="6" rx="1"/>
            <rect x="18" y="42" width="8" height="8" rx="1"/>
            <rect x="28" y="44" width="6" height="6" rx="1"/>

            {/* Center Dynamic Seed */}
            <rect x="38" y="38" width="24" height="24" rx="3" fill="#1E3A8A"/>
            <circle cx="50" cy="50" r="5" fill="#38BDF8"/>

            <rect x="70" y="42" width="8" height="6" rx="1"/>
            <rect x="82" y="46" width="6" height="8" rx="1"/>

            <rect x="40" y="70" width="8" height="8" rx="1"/>
            <rect x="52" y="76" width="6" height="6" rx="1"/>
            <rect x="68" y="70" width="12" height="6" rx="1"/>
            <rect x="82" y="80" width="8" height="8" rx="1"/>
          </svg>

          {scanVerified && (
            <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-white mb-1" />
              <span className="text-xs font-bold">QR VERIFIED</span>
              <span className="text-[10px] opacity-90">Within 18m Geofence</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Token Details */}
      <div className="w-full mt-2 text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded-lg">
          <span className="text-slate-400">NONCE:</span>
          <span className="font-bold text-navy-800">{tokenNonce}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Kurla Hub Center
          </span>
          <span className="font-semibold text-emerald-600">Geo-Locked</span>
        </div>
      </div>

      {/* Simulation Button */}
      <button
        onClick={handleSimulateScan}
        disabled={isScanning}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-sm ${
          isHeld
            ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
            : isScanning
            ? 'bg-amber-500 text-white animate-pulse'
            : 'bg-navy-800 hover:bg-navy-900 text-white'
        }`}
      >
        <Scan className="w-4 h-4" />
        {isScanning ? 'Validating Geo-Punch...' : isHeld ? 'Token Already Held' : 'Scan to Punch-In Shift'}
      </button>
    </div>
  );
};

export default DynamicQRCode;
