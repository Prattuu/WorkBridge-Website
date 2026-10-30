import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX, Play, Square, Mic, Sparkles } from 'lucide-react';

export const VoiceAssistant = ({ customText, triggerLabel }) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getLanguageTag = (lang) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      default: return 'en-IN';
    }
  };

  const getDefaultGuidanceText = () => {
    if (customText) return customText;

    if (language === 'hi') {
      return "वर्कब्रिज में आपका स्वागत है। 5 किलोमीटर के दायरे में सुरक्षित काम और तुरंत भुगतान। पंच इन करने पर आपका फंड सुरक्षित लॉक हो जाता है और पंच आउट करते ही तुरंत बैंक में ट्रांसफर हो जाता है।";
    } else if (language === 'mr') {
      return "वर्कब्रिज वर आपले स्वागत आहे. ५ किमी परिसरात त्वरित काम आणि झटपट मानधन. पंच इन करताच रक्कम सुरक्षित लॉक होते आणि काम संपताच खात्यात जमा होते.";
    } else {
      return "Welcome to WorkBridge. Hyperlocal gig platform within 5 kilometers. Single-token escrow guarantees your payout: funds are locked upon punch-in and instantly disbursed to your UPI upon punch-out.";
    }
  };

  const handleSpeak = () => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = getDefaultGuidanceText();
    const utterance = new SpeechSynthesisUtterance(textToRead);

    utterance.lang = getLanguageTag(language);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (match) utterance.voice = match;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <button
        id="voice-assistant-toggle-btn"
        onClick={handleSpeak}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm ${
          isSpeaking
            ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-300'
            : 'bg-navy-900/80 hover:bg-navy-800 text-white border border-blue-400/30'
        }`}
        title={t('voice_listening')}
      >
        {isSpeaking ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{t('voice_stop')}</span>
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-blue-300" />
            <span>{triggerLabel || t('voice_play')}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </>
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;
