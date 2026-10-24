/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Entry, ActiveTab, GitHubConfig, SyncStatus } from './types';
import {
  getSavedGitHubConfig,
  saveGitHubConfig,
  fetchEntriesFromGitHub
} from './services/githubService';
import { Navbar } from './components/Navbar';
import { TimelineView } from './components/TimelineView';
import { DevLogView } from './components/DevLogView';
import { SearchView } from './components/SearchView';
import { ArchiveView } from './components/ArchiveView';
import { RandomView } from './components/RandomView';
import { SettingsModal } from './components/SettingsModal';
import { NetlifyBadge } from './components/NetlifyBadge';

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ogulr_theme');
    return saved !== null ? saved === 'dark' : true;
  });
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(getSavedGitHubConfig);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    state: 'idle',
    source: 'mock'
  });

  // Theme synchronization with HTML / Body
  useEffect(() => {
    localStorage.setItem('ogulr_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.className =
        'bg-[#121316] text-[#e4e6eb] antialiased selection:bg-neutral-700 selection:text-white min-h-screen';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className =
        'bg-[#f9fafb] text-[#111827] antialiased selection:bg-neutral-300 selection:text-black min-h-screen';
    }
  }, [isDarkMode]);

  // Fetch entries from GitHub or fallback
  const syncEntries = useCallback(async () => {
    setSyncStatus((prev) => ({ ...prev, state: 'syncing', errorMessage: undefined }));

    try {
      const result = await fetchEntriesFromGitHub(gitHubConfig);
      setEntries(result.entries);
      setSyncStatus({
        state: 'success',
        lastSyncedAt: new Date(),
        source: result.source
      });
    } catch (err) {
      console.error('Fetch entries error:', err);
      setSyncStatus((prev) => ({
        ...prev,
        state: 'error',
        errorMessage: err instanceof Error ? err.message : 'Bağlantı hatası oluştu.'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [gitHubConfig]);

  // Initial load
  useEffect(() => {
    syncEntries();
  }, [syncEntries]);

  // Auto-sync polling timer
  useEffect(() => {
    if (!gitHubConfig.autoSync || gitHubConfig.syncInterval <= 0) return;

    const intervalMs = Math.max(gitHubConfig.syncInterval, 15) * 1000;
    const interval = setInterval(() => {
      syncEntries();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [gitHubConfig.autoSync, gitHubConfig.syncInterval, syncEntries]);

  // Global keyboard shortcuts (⌘K for Search, Escape for Settings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('search');
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveConfig = (newConfig: GitHubConfig) => {
    setGitHubConfig(newConfig);
    saveGitHubConfig(newConfig);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-neutral-700 selection:text-white transition-colors duration-200">
      <div className="w-full">
        {/* Navigation Bar */}
        <Navbar
          entriesCount={entries.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSync={syncEntries}
          syncStatus={syncStatus}
        />

        {/* Main Feed Content Container matching screenshot width */}
        <main className="w-full max-w-3xl mx-auto px-6 pb-24">
          {activeTab === 'timeline' && (
            <TimelineView entries={entries} isLoading={isLoading} />
          )}

          {activeTab === 'devlog' && <DevLogView entries={entries} />}

          {activeTab === 'search' && <SearchView entries={entries} />}

          {activeTab === 'archive' && <ArchiveView entries={entries} />}

          {activeTab === 'random' && <RandomView entries={entries} />}
        </main>
      </div>

      {/* GitHub Setup and Connection Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={gitHubConfig}
        onSaveConfig={handleSaveConfig}
        onTestConnection={syncEntries}
        syncStatus={syncStatus}
      />

      {/* Official Powered by Netlify Badge matching screenshot */}
      <NetlifyBadge />
    </div>
  );
}
