import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, History, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Camera,
      title: t('onboarding.slide1Title'),
      description: t('onboarding.slide1Desc'),
      color: 'from-primary to-blue-600',
    },
    {
      icon: Shield,
      title: t('onboarding.slide2Title'),
      description: t('onboarding.slide2Desc'),
      color: 'from-success to-emerald-600',
    },
    {
      icon: History,
      title: t('onboarding.slide3Title'),
      description: t('onboarding.slide3Desc'),
      color: 'from-warning to-amber-600',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col safe-area-top safe-area-bottom overflow-hidden">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          {t('common.skip')}
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center mb-6 sm:mb-8 shadow-xl`}
            >
              {(() => {
                const Icon = slides[currentSlide].icon;
                return <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />;
              })()}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            >
              {slides[currentSlide].title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground max-w-sm"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 sm:p-8 space-y-4 sm:space-y-6 flex-shrink-0">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full gradient-primary text-white font-semibold h-14 rounded-2xl shadow-lg"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              {t('common.next')}
              <ChevronRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            <>
              <Sparkles className="mr-2 w-5 h-5" />
              {t('common.start')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
