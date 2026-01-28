import { motion } from 'framer-motion';
import { Camera, Shield, History, Moon, Sun } from 'lucide-react';

interface TabBarProps {
  activeTab: 'camera' | 'security' | 'history';
  onTabChange: (tab: 'camera' | 'security' | 'history') => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const tabs = [
  { id: 'camera' as const, icon: Camera, label: 'Сканирай' },
  { id: 'security' as const, icon: Shield, label: 'Защити' },
  { id: 'history' as const, icon: History, label: 'История' },
];

export const TabBar = ({ activeTab, onTabChange, isDark, onThemeToggle }: TabBarProps) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const tabCount = tabs.length;
  
  // Pill width is 80% of one tab's width
  const pillWidthPercent = 80 / tabCount;
  // Margin on each side inside the tab = (100/tabCount - pillWidth) / 2
  const marginPercent = (100 / tabCount - pillWidthPercent) / 2;
  // translateX position = activeIndex * tabWidth + margin
  const translateX = activeIndex * (100 / tabCount) + marginPercent;
  
  return (
    <div className="backdrop-blur-xl bg-card/70 border-t border-white/10 pb-[max(env(safe-area-inset-bottom,20px),12px)]">
      <div className="flex items-center justify-between px-3 pt-2 pb-2">
        {/* Tabs container - relative anchor for the pill */}
        <nav className="relative flex flex-1 py-1">
          {/* Frosted-glass pill indicator - absolute within nav */}
          <motion.div
            className="absolute top-1/2 h-[42px] rounded-2xl backdrop-blur-md bg-primary/12 border border-white/15 shadow-md pointer-events-none"
            style={{
              width: `${pillWidthPercent}%`,
              transform: 'translateY(-50%)',
            }}
            initial={false}
            animate={{
              left: `${translateX}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 32,
              mass: 0.9,
            }}
          />
          
          {/* Tab buttons */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative z-10 flex flex-1 flex-col items-center justify-center py-2 min-h-[52px]"
              >
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-[10px] mt-0.5 transition-colors duration-200 ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="p-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
