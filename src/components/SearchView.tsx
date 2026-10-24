import React, { useState, useMemo } from 'react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchViewProps {
  entries: Entry[];
}

export const SearchView: React.FC<SearchViewProps> = ({ entries }) => {
  const [query, setQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return entries;
    const lower = query.toLowerCase().trim();
    return entries.filter(
      (entry) =>
        entry.content.toLowerCase().includes(lower) ||
        (entry.category && entry.category.toLowerCase().includes(lower))
    );
  }, [entries, query]);

  return (
    <div>
      {/* Search Input Box */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Düşünceler ve notlar arasında ara... (örn: DSOTM, müzik, kod)"
          autoFocus
          className="w-full pl-10 pr-10 py-3 bg-neutral-100 dark:bg-[#17191d] border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-600 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 cursor-pointer"
            title="Temizle"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono-meta">
        <span>{query ? `"${query}" için arama sonuçları` : 'Tüm girdiler'}</span>
        <span className="tabular-nums">{filteredEntries.length} eşleşme</span>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
          <p className="text-base mb-1">Aramanızla eşleşen girdi bulunamadı.</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-600 font-mono-meta">
            Farklı bir anahtar kelime aramayı deneyin.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} highlightText={query} />
          ))}
        </div>
      )}
    </div>
  );
};
