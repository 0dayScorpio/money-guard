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
  const tabWidth = 100 / 3; // percentage width of each tab
  
  return (
    <div className="backdrop-blur-xl bg-card/70 border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-between px-2">
        {/* Tabs container */}
        <div className="relative flex flex-1">
          {/* Floating frosted-glass circle indicator */}
          <motion.div
            className="absolute top-1/2 left-0 w-14 h-14 -translate-y-1/2 rounded-full backdrop-blur-md bg-primary/15 border border-white/20 shadow-lg"
            initial={false}
            animate={{
              x: `calc(${activeIndex * tabWidth}% + ${tabWidth / 2}% - 28px)`,
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
                className="relative z-10 flex flex-1 flex-col items-center justify-center py-2 min-h-[60px]"
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
