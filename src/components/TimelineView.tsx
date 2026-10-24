import React from 'react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';

interface TimelineViewProps {
  entries: Entry[];
  isLoading: boolean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ entries, isLoading }) => {
  if (isLoading && entries.length === 0) {
    return (
      <div className="space-y-8 animate-pulse py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-6 border-b border-neutral-800/80">
            <div className="h-4 bg-neutral-800/70 rounded w-1/3 mb-4" />
            <div className="h-6 bg-neutral-800/50 rounded w-4/5 mb-2" />
            <div className="h-6 bg-neutral-800/30 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <p className="text-base mb-2">Henüz hiçbir girdi bulunamadı.</p>
        <p className="text-xs text-neutral-600 font-mono-meta">
          GitHub reponuzdaki entries.json dosyasına yeni girdiler ekleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-800/80">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
