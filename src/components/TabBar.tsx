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
  
  return (
    <div className="backdrop-blur-xl bg-card/70 border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-between px-2">
        {/* Tabs container */}
        <div className="relative flex flex-1">
          {/* Floating frosted-glass pill indicator */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-12 rounded-2xl backdrop-blur-md bg-primary/15 border border-white/20 shadow-lg"
            style={{
              width: `calc(100% / 3 - 8px)`,
            }}
            initial={false}
            animate={{
              x: `calc(${activeIndex} * (100% + 8px) + 4px)`,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
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
                className="relative z-10 flex flex-1 flex-col items-center justify-center py-3 min-h-[60px]"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

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
