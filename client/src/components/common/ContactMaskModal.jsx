import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, PhoneCall, MessageSquare, Lock, X, CheckCircle2, Clock } from 'lucide-react';

export const ContactMaskModal = ({ isOpen, onClose, gigTitle, employerName, workerName }) => {
  const { t } = useLanguage();
  const [callState, setCallState] = useState('idle'); // idle | connecting | connected
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: '🔒 Privacy Shield Relay Activated. Real phone numbers are hidden.', time: '10:02 AM' },
    { sender: 'Employer', text: 'Hello, please enter via Gate 3 of Kurla Commercial Center.', time: '10:05 AM' },
    { sender: 'Worker', text: 'Understood, I am at the gate and ready for punch-in.', time: '10:08 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallState('connecting');
    setTimeout(() => {
      setCallState('connected');
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState('idle');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'Worker',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Privacy Shield Badge */}
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">WorkBridge Privacy Shield</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30">
                  MASKED ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct phone number exchange is strictly blocked for worker and employer privacy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Virtual Bridge Number Info Box */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-navy-800" /> Dedicated Virtual Proxy Line
              </div>
              <div className="text-2xl font-mono font-bold text-navy-800 tracking-wider mt-1">
                +91 22 6900 4589
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Auto-expires when shift escrow closes
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {callState === 'idle' ? (
                <button
                  id="privacy-shield-call-btn"
                  onClick={handleStartCall}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
                >
                  <PhoneCall className="w-4 h-4" /> Start Masked Call
                </button>
              ) : callState === 'connecting' ? (
                <button
                  disabled
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold animate-pulse"
                >
                  Routing Bridge...
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  End Call (00:34)
                </button>
              )}
            </div>
          </div>

          {/* Caller Details Card */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-slate-500">Employer Line:</span>
              <div className="font-semibold text-slate-800">{employerName || 'Metro Logistics Hub'}</div>
              <span className="text-blue-700 font-mono font-bold">+91 98XXX-WB001</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-slate-500">Worker Line:</span>
              <div className="font-semibold text-slate-800">{workerName || 'Ramesh Patil (Partner)'}</div>
              <span className="text-emerald-700 font-mono font-bold">+91 91XXX-WB089</span>
            </div>
          </div>

          {/* Masked Relay Messaging Stream */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-navy-800" /> Encrypted Relay Channel
            </div>
            <div className="h-44 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'System'
                      ? 'items-center'
                      : msg.sender === 'Worker'
                      ? 'items-end'
                      : 'items-start'
                  }`}
                >
                  {msg.sender === 'System' ? (
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-md text-[11px] font-medium">
                      {msg.text}
                    </span>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 ${
                        msg.sender === 'Worker'
                          ? 'bg-navy-800 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="font-semibold text-[10px] opacity-75 mb-0.5">{msg.sender}</div>
                      <div>{msg.text}</div>
                      <div className="text-[9px] opacity-60 text-right mt-0.5">{msg.time}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type encrypted message (no contact numbers allowed)..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-navy-800 text-white text-xs font-semibold rounded-xl hover:bg-navy-900 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> End-to-End Privacy Protected
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-navy-800"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactMaskModal;
