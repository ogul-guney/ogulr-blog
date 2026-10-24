import React from 'react';
import { Sun, Moon, RotateCw, Github } from 'lucide-react';
import { ActiveTab, SyncStatus } from '../types';

interface NavbarProps {
  entriesCount: number;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onSync: () => void;
  syncStatus: SyncStatus;
}

export const Navbar: React.FC<NavbarProps> = ({
  entriesCount,
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleTheme,
  onOpenSettings,
  onSync,
  syncStatus
}) => {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'devlog', label: 'Dev Log' },
    { id: 'search', label: 'Search' },
    { id: 'archive', label: 'Archive' },
    { id: 'random', label: 'Random' },
  ];

  return (
    <header className="w-full max-w-3xl mx-auto pt-10 pb-12 px-6 flex items-center justify-between">
      {/* Brand & Count */}
      <div className="flex items-baseline gap-3">
        <button
          onClick={() => onTabChange('timeline')}
          className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
        >
          Oğulr
        </button>
        <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono-meta tabular-nums select-none">
          {entriesCount} {entriesCount === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Nav Tabs & Controls */}
      <div className="flex items-center gap-5 sm:gap-7">
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-300 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
          {/* Sync / Refresh Button */}
          <button
            onClick={onSync}
            disabled={syncStatus.state === 'syncing'}
            title="GitHub'dan şimdi senkronize et"
            aria-label="GitHub'dan senkronize et"
            className="p-1.5 rounded hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${
                syncStatus.state === 'syncing' ? 'animate-spin text-emerald-500' : ''
              }`}
            />
          </button>

          {/* GitHub Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            title="GitHub ve Netlify Bağlantı Ayarları"
            aria-label="GitHub ve Netlify Bağlantı Ayarları"
            className="p-1.5 rounded hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition-colors focus:outline-none cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            aria-label="Tema değiştir"
            className="p-1.5 rounded hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800/60 transition-colors focus:outline-none cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
