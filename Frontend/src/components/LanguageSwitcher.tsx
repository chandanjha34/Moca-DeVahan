import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'ਪੰਜਾਬੀ' }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="relative group">
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light border border-metallic/20 hover:border-gold transition-colors"
        >
          <Globe className="w-5 h-5 text-gold" />
        </button>
        
        <div className="absolute bottom-full left-0 mb-2 transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-bottom-left">
          <div className="bg-primary-light rounded-lg shadow-lg border border-metallic/20 p-2 w-32">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  language === lang.code ? 'bg-gold/20 text-gold' : 'text-metallic hover:text-white'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;