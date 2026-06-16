import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Camera, Eye, Lock, Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PrivacyConsentScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsentScreen = ({ onAccept, onDecline }: PrivacyConsentScreenProps) => {
  const { t } = useTranslation();
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToCamera, setAgreedToCamera] = useState(false);

  const canProceed = agreedToPrivacy && agreedToCamera;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden"
    >
      <div className="safe-area-top px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 flex-shrink-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl gradient-primary flex items-center justify-center shadow-xl"
        >
          <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center text-foreground"
        >
          {t('privacy.title')}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground mt-2"
        >
          {t('privacy.subtitle')}
        </motion.p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 min-h-0">
        <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
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
                <h3 className="font-semibold text-foreground">{t('privacy.localTitle')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('privacy.localDesc')}
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
                <h3 className="font-semibold text-foreground">{t('privacy.encryptedTitle')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('privacy.encryptedDesc')}
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
                <h3 className="font-semibold text-foreground">{t('privacy.cameraTitle')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('privacy.cameraDesc')}
                </p>
              </div>
            </div>
          </motion.div>

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
                {t('privacy.agreePrivacy')}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={agreedToCamera}
                onCheckedChange={(checked) => setAgreedToCamera(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {t('privacy.agreeCamera')}
              </span>
            </label>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="safe-area-bottom px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 space-y-2 sm:space-y-3 flex-shrink-0"
      >
        <Button
          onClick={onAccept}
          disabled={!canProceed}
          className="w-full h-12 sm:h-14 rounded-2xl gradient-primary text-white font-semibold text-base sm:text-lg shadow-lg disabled:opacity-50"
        >
          {canProceed ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              {t('privacy.continue')}
            </>
          ) : (
            t('privacy.markBoth')
          )}
          {canProceed && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>
        
        <Button
          onClick={onDecline}
          variant="ghost"
          className="w-full h-12 rounded-xl text-muted-foreground"
        >
          {t('common.cancel')}
        </Button>
      </motion.div>
    </motion.div>
  );
};
