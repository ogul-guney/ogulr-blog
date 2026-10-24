import React, { useState } from 'react';
import { Entry } from '../types';
import { formatEntryDate } from '../utils/dateFormatter';
import { Check, Copy } from 'lucide-react';

interface EntryCardProps {
  entry: Entry;
  highlightText?: string;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, highlightText }) => {
  const [copied, setCopied] = useState(false);
  const { fullFormatted } = formatEntryDate(entry.timestamp);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlightedContent = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-amber-300 dark:bg-amber-400/20 text-neutral-900 dark:text-amber-200 px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article className="group py-7 sm:py-8 border-b border-neutral-200 dark:border-neutral-800/80 last:border-b-0 transition-colors">
      {/* Date metadata line matching screenshot */}
      <div className="flex items-center justify-between mb-3 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-mono-meta tracking-wide">
        <time dateTime={entry.timestamp}>{fullFormatted}</time>
        <button
          onClick={handleCopy}
          title="Düşünceyi panoya kopyala"
          aria-label="Düşünceyi panoya kopyala"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800/60 focus:outline-none"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Entry content matching screenshot */}
      <p className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100 font-normal leading-relaxed whitespace-pre-wrap break-words">
        {renderHighlightedContent(entry.content, highlightText)}
      </p>
    </article>
  );
};
