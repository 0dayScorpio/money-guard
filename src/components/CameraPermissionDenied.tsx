import { motion } from "framer-motion";
import { CameraOff, Settings, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPermissionDeniedProps {
  onRetry: () => void;
  onOpenSettings: () => void;
  errorMessage?: string;
}

export const CameraPermissionDenied = ({ onRetry, onOpenSettings, errorMessage }: CameraPermissionDeniedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mb-6"
      >
        <CameraOff className="w-12 h-12 text-destructive" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white text-center mb-2"
      >
        Няма достъп до камерата
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/70 text-center max-w-xs mb-8"
      >
        За да сканирате банкноти, моля разрешете достъп до камерата в настройките на устройството
      </motion.p>

      {errorMessage && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-destructive/20 border border-destructive/30 rounded-xl p-4 mb-6 flex items-start gap-3 max-w-xs"
        >
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/80">{errorMessage}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3 w-full max-w-xs"
      >
        <Button
          onClick={onOpenSettings}
          className="w-full h-14 rounded-2xl gradient-primary text-white font-semibold shadow-lg flex items-center justify-center"
        >
          <Settings className="w-5 h-5 mr-2" />
          Отвори настройки
        </Button>

        <Button
          onClick={onRetry}
          className="w-full h-12 rounded-xl bg-white dark:bg-card border border-purple-500/30 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-800 transition-colors flex items-center justify-center"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 stroke-[url(#icon-gradient)]" style={{ stroke: 'url(#icon-gradient)' }} />
            Опитай отново
          </span>
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/50 text-xs text-center max-w-xs mt-8"
      >
        {!!(window as any).Capacitor?.isNativePlatform?.()
          ? 'Стъпки: Настройки → NotaGuard → Камера → Разреши'
          : 'Стъпки: Настройки → Приложения → NotaGuard → Разрешения → Камера → Разреши'}
      </motion.p>
    </motion.div>
  );
};
