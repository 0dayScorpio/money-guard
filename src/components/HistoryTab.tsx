import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { History, CheckCircle2, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ScanHistory, ScanResult } from '@/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { bg, enUS, es, de } from 'date-fns/locale';

interface HistoryTabProps {
  history: ScanHistory[];
  onClearHistory: () => void;
}

export const HistoryTab = ({ history, onClearHistory }: HistoryTabProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const dateLocale =
    i18n.language?.startsWith('en') ? enUS :
    i18n.language?.startsWith('es') ? es :
    i18n.language?.startsWith('de') ? de : bg;

  const getResultConfig = (result: ScanResult) => {
    switch (result) {
      case 'authentic':
        return { icon: CheckCircle2, label: t('history.authentic'), bgClass: 'bg-success/10', textClass: 'text-success' };
      case 'suspicious':
        return { icon: AlertTriangle, label: t('history.suspicious'), bgClass: 'bg-warning/10', textClass: 'text-warning' };
      case 'fake':
        return { icon: XCircle, label: t('history.fake'), bgClass: 'bg-destructive/10', textClass: 'text-destructive' };
      default:
        return null;
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <History className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('history.empty')}</h3>
          <p className="text-muted-foreground max-w-xs">{t('history.emptyDesc')}</p>
        </div>
        <button
          onClick={() => navigate('/terms')}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-6"
        >
          {t('common.terms')}
        </button>
      </div>
    );
  }

  const countLabel = history.length === 1
    ? t('history.scansOne', { count: history.length })
    : t('history.scansOther', { count: history.length });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-card border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t('history.title')}</h2>
          <p className="text-sm text-muted-foreground">{countLabel}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="w-4 h-4 mr-2" />
          {t('history.clear')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0">
        {history.map((scan, index) => {
          const config = getResultConfig(scan.result);
          if (!config) return null;
          const Icon = config.icon;
          return (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${config.bgClass}`}>
                  <Icon className={`w-6 h-6 ${config.textClass}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {scan.denomination} {scan.currency}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{format(new Date(scan.timestamp), 'dd MMM yyyy, HH:mm', { locale: dateLocale })}</span>
                    <span>•</span>
                    <span>{t('history.confidenceShort', { value: scan.confidence.toFixed(0) })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-4 py-6 flex justify-center">
        <button
          onClick={() => navigate('/terms')}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {t('common.terms')}
        </button>
      </div>
    </div>
  );
};
