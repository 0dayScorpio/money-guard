import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LANGUAGES, type Language, setLanguage } from '@/i18n';

// Circle-cropped SVG flags for each supported language.
const FlagBG = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <rect width="3" height="2" fill="#fff" />
    <rect width="3" height="1.333" y="0.667" fill="#00966E" />
    <rect width="3" height="0.667" y="1.333" fill="#D62612" />
  </svg>
);
const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <clipPath id="t"><path d="M0,0v30h60v-30z" /></clipPath>
    <path d="M0,0v30h60v-30z" fill="#012169" />
    <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#t)" />
    <path d="M30,0v30 M0,15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0v30 M0,15h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);
const FlagES = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <rect width="3" height="2" fill="#C60B1E" />
    <rect width="3" height="1" y="0.5" fill="#FFC400" />
  </svg>
);
const FlagDE = () => (
  <svg viewBox="0 0 3 2" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <rect width="3" height="2" fill="#000" />
    <rect width="3" height="1.333" y="0.667" fill="#DD0000" />
    <rect width="3" height="0.667" y="1.333" fill="#FFCE00" />
  </svg>
);

const flagFor: Record<Language, () => JSX.Element> = {
  bg: FlagBG,
  en: FlagGB,
  es: FlagES,
  de: FlagDE,
};

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const current = (i18n.language?.split('-')[0] ?? 'bg') as Language;

  return (
    <div
      className="fixed z-40 flex items-center gap-1.5"
      style={{
        top: 'max(env(safe-area-inset-top, 0px), 8px)',
        right: 'max(env(safe-area-inset-right, 0px), 10px)',
      }}
      aria-label={t('langSwitcher.label')}
    >
      {LANGUAGES.map((lang) => {
        const Flag = flagFor[lang];
        const active = lang === current;
        return (
          <motion.button
            key={lang}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setLanguage(lang)}
            aria-label={t(`langSwitcher.${lang}`)}
            aria-pressed={active}
            className={`relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/30 shadow-md backdrop-blur-sm transition-all ${
              active ? 'ring-2 ring-primary scale-110' : 'opacity-80 hover:opacity-100'
            }`}
          >
            <Flag />
          </motion.button>
        );
      })}
    </div>
  );
};
