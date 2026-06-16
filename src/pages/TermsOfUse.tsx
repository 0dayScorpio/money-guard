import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const TermsOfUse = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    { title: t('terms.s1Title'), text: t('terms.s1Text') },
    { title: t('terms.s2Title'), text: t('terms.s2Text') },
    { title: t('terms.s3Title'), text: t('terms.s3Text') },
    { title: t('terms.s4Title'), text: t('terms.s4Text') },
    { title: t('terms.s5Title'), text: t('terms.s5Text') },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('terms.title')}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-glow-primary">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">{t('terms.title')}</h2>
          <p className="text-sm text-muted-foreground/60">{t('terms.subtitle')}</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * (i + 1) }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-sm font-semibold mb-2 text-foreground">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-10">
          {t('terms.lastUpdated')}
        </p>
      </main>
    </div>
  );
};

export default TermsOfUse;
