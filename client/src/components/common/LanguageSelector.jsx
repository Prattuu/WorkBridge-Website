import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
      <div className="pl-2 pr-1 text-slate-300">
        <Globe className="w-3.5 h-3.5 text-blue-300" />
      </div>
      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-white/30'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
              title={lang.label}
            >
              {lang.native}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
