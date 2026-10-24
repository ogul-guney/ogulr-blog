import React, { useState, useEffect } from 'react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';
import { Shuffle } from 'lucide-react';

interface RandomViewProps {
  entries: Entry[];
}

export const RandomView: React.FC<RandomViewProps> = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const pickRandom = () => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    setSelectedEntry(entries[randomIndex]);
  };

  useEffect(() => {
    pickRandom();
  }, [entries]);

  if (!selectedEntry) {
    return (
      <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
        <p>Henüz gösterilecek bir girdi yok.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono-meta">
        <span>Rastgele Seçilmiş Düşünce</span>
        <button
          onClick={pickRandom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Başka bir tane göster</span>
        </button>
      </div>

      <div className="bg-neutral-100/70 dark:bg-[#16181d]/50 p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
        <EntryCard entry={selectedEntry} />
      </div>
    </div>
  );
};
