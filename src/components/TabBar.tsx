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
  return (
    <div className="bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-between px-2">
        {/* Tabs */}
        <div className="flex flex-1 justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center py-3 px-6 min-w-[80px]"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 -m-2 rounded-xl gradient-primary opacity-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-dot"
                    className="absolute top-1 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
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
