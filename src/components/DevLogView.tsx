import React from 'react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';

interface DevLogViewProps {
  entries: Entry[];
}

export const DevLogView: React.FC<DevLogViewProps> = ({ entries }) => {
  const devEntries = entries.filter((entry) => {
    if (entry.category === 'dev') return true;
    const lower = entry.content.toLowerCase();
    return (
      lower.includes('kod') ||
      lower.includes('code') ||
      lower.includes('git') ||
      lower.includes('vite') ||
      lower.includes('terminal') ||
      lower.includes('bug') ||
      lower.includes('deploy') ||
      lower.includes('deneme')
    );
  });

  return (
    <div>
      <div className="pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono-meta">
        <span>Yazılım & Mühendislik Notları</span>
        <span className="tabular-nums">{devEntries.length} kayıt</span>
      </div>

      {devEntries.length === 0 ? (
        <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
          <p className="text-base mb-2">Dev Log kategorisinde girdi bulunamadı.</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-600 font-mono-meta">
            entries.json dosyasında "category": "dev" belirterek ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
          {devEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};
