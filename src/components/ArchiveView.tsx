import React, { useMemo, useState } from 'react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';
import { Calendar } from 'lucide-react';

interface ArchiveViewProps {
  entries: Entry[];
}

interface GroupedArchive {
  year: number;
  months: {
    monthName: string;
    monthIndex: number;
    entries: Entry[];
  }[];
}

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const ArchiveView: React.FC<ArchiveViewProps> = ({ entries }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const archiveGroups = useMemo(() => {
    const map = new Map<number, Map<number, Entry[]>>();

    entries.forEach((entry) => {
      const d = new Date(entry.timestamp);
      if (isNaN(d.getTime())) return;
      const year = d.getFullYear();
      const month = d.getMonth();

      if (!map.has(year)) {
        map.set(year, new Map());
      }
      const monthMap = map.get(year)!;
      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }
      monthMap.get(month)!.push(entry);
    });

    const result: GroupedArchive[] = [];
    const sortedYears = Array.from(map.keys()).sort((a, b) => b - a);

    sortedYears.forEach((year) => {
      const monthMap = map.get(year)!;
      const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b - a);
      result.push({
        year,
        months: sortedMonths.map((m) => ({
          monthName: MONTH_NAMES_TR[m],
          monthIndex: m,
          entries: monthMap.get(m)!
        }))
      });
    });

    return result;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!selectedPeriod) return null;
    const [yearStr, monthStr] = selectedPeriod.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    return entries.filter((e) => {
      const d = new Date(e.timestamp);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [entries, selectedPeriod]);

  return (
    <div>
      <div className="pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono-meta">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Kronolojik Arşiv
        </span>
        {selectedPeriod && (
          <button
            onClick={() => setSelectedPeriod(null)}
            className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline cursor-pointer"
          >
            Tüm arşivi göster
          </button>
        )}
      </div>

      {!selectedPeriod ? (
        <div className="space-y-6">
          {archiveGroups.map((group) => (
            <div key={group.year} className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight font-mono-meta">
                {group.year}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.months.map((m) => {
                  const key = `${group.year}-${m.monthIndex}`;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPeriod(key)}
                      className="p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-[#16181d] dark:hover:bg-[#1f2228] border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 text-left transition-all duration-150 flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-sm text-neutral-800 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white font-medium">
                        {m.monthName}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono-meta">
                        {m.entries.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
            {filteredEntries?.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
