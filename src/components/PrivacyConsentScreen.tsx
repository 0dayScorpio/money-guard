import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Camera, Eye, Lock, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PrivacyConsentScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsentScreen = ({ onAccept, onDecline }: PrivacyConsentScreenProps) => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToCamera, setAgreedToCamera] = useState(false);

  const canProceed = agreedToPrivacy && agreedToCamera;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="safe-area-top px-6 pt-8 pb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-primary flex items-center justify-center shadow-xl"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-foreground"
        >
          Поверителност и достъп
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground mt-2"
        >
          За да използвате сканирането, трябва да ни дадете достъп до камерата
        </motion.p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4 max-w-md mx-auto">
          {/* Privacy features */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-4 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Локална обработка</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Изображенията се обработват временно и не се съхраняват на сървъри
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl p-4 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Криптирана връзка</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Всички данни се предават през защитена криптирана връзка
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-card rounded-2xl p-4 border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Достъп до камерата</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Камерата се използва само за сканиране на банкноти в реално време
                </p>
              </div>
            </div>
          </motion.div>

          {/* Consent checkboxes */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4 pt-4"
          >
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                Съгласен/а съм с политиката за поверителност и условията за ползване на приложението
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={agreedToCamera}
                onCheckedChange={(checked) => setAgreedToCamera(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                Разрешавам достъп до камерата за сканиране на банкноти
              </span>
            </label>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="safe-area-bottom px-6 pb-6 pt-4 space-y-3"
      >
        <Button
          onClick={onAccept}
          disabled={!canProceed}
          className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold text-lg shadow-lg disabled:opacity-50"
        >
          {canProceed ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Продължи
            </>
          ) : (
            'Маркирайте и двете опции'
          )}
          {canProceed && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>
        
        <Button
          onClick={onDecline}
          variant="ghost"
          className="w-full h-12 rounded-xl text-muted-foreground"
        >
          Откажи
        </Button>
      </motion.div>
    </motion.div>
  );
};
