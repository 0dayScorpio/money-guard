import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Общи условия',
    text: 'NotaGuard се предоставя „както е", без каквито и да било гаранции от какъвто и да било вид. Разработчикът не гарантира, че приложението ще бъде без грешки или прекъсвания.',
  },
  {
    title: 'Използване на приложението',
    text: 'Използвайки това приложение, Вие се съгласявате, че го правите на свой собствен риск. Разработчикът не носи отговорност за каквито и да било щети, загуби или проблеми, произтичащи от използването на приложението.',
  },
  {
    title: 'Точност на анализа',
    text: 'NotaGuard използва изкуствен интелект за анализ на банкноти. Резултатите са информативни и не заместват професионалната оценка. Приложението не гарантира абсолютна точност при определянето на автентичността на банкнотите.',
  },
  {
    title: 'Промени и актуализации',
    text: 'Разработчикът може да актуализира, промени или преустанови приложението по всяко време без предварително уведомление.',
  },
];

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Условия за ползване</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-5 py-6 sm:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-glow-primary">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Условия за ползване</h2>
          <p className="text-sm text-muted-foreground/60">NotaGuard</p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
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

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40 mt-10">
          Последна актуализация: април 2026
        </p>
      </main>
    </div>
  );
};

export default TermsOfUse;
