import React from 'react';
import { Zap, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Hero() {
  const { t } = useLanguage();

  const scrollToFAQ = () => {
    const faqDiv = document.getElementById("faq");
    if (faqDiv) {
      faqDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="cyber-hero-title">
          <span className="block">{t('home.title1')}</span>
          <span className="block text-cyber-accent cyber-text-glow">
            {t('home.title2')}
          </span>
        </h1>
        <p className="mt-8 max-w-3xl mx-auto text-xl text-cyber-muted cyber-text-shadow">
          {t('home.subtitle')}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => {
              // Raise event or action might go here, but original had setShowAuthModal true in App.
              // That logic will remain in App, so this button should get that callback as prop if needed.
              // For now, use window event (or better to lift state in full refactoring).
            }}
            className="cyber-btn-hero"
          >
            <Zap className="w-5 h-5 mr-2" />
            {t('home.getStarted')}
          </button>
          <button
            className="cyber-btn-secondary"
            onClick={scrollToFAQ}
          >
            <Globe className="w-5 h-5 mr-2" />
            {t("home.learnMore")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
