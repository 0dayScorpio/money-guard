import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Onboarding } from '@/components/Onboarding';
import { CameraTab } from '@/components/CameraTab';
import { SecurityTab } from '@/components/SecurityTab';
import { HistoryTab } from '@/components/HistoryTab';
import { TabBar } from '@/components/TabBar';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { useScanHistory } from '@/hooks/useScanHistory';
import { ScanHistory } from '@/types';

type TabType = 'camera' | 'security' | 'history';

const Index = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('banknote-onboarding', false);
  const [activeTab, setActiveTab] = useState<TabType>('camera');
  const { history: scanHistory, addScan, clearHistory } = useScanHistory();
  const { theme, toggleTheme } = useTheme();

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
  };

  const handleScanComplete = (scan: ScanHistory) => {
    addScan(scan);
  };

  const handleClearHistory = () => {
    clearHistory();
  };
  if (!hasSeenOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  return <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      <LanguageSwitcher />
      {/* Header */}
      <header className="bg-card border-b border-border safe-area-top">
        
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'camera' && <motion.div key="camera" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} className="h-full">
              <CameraTab onScanComplete={handleScanComplete} />
            </motion.div>}
          
          {activeTab === 'security' && <motion.div key="security" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} className="h-full">
              <SecurityTab />
            </motion.div>}
          
          {activeTab === 'history' && <motion.div key="history" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} className="h-full">
              <HistoryTab history={scanHistory} onClearHistory={handleClearHistory} />
            </motion.div>}
        </AnimatePresence>
      </main>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} isDark={theme === 'dark'} onThemeToggle={toggleTheme} />
    </div>;
};
export default Index;