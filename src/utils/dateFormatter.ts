const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Formats a timestamp into the format seen in the screenshot:
 * "24 OCT 2026 · 10:40 · 4h ago"
 */
export function formatEntryDate(dateInput: string | Date): {
  dateStr: string;
  timeStr: string;
  relativeStr: string;
  fullFormatted: string;
} {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Handle invalid dates gracefully
  if (isNaN(date.getTime())) {
    return {
      dateStr: 'DATE',
      timeStr: '00:00',
      relativeStr: 'recently',
      fullFormatted: 'RECENT ENTRY'
    };
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const dateStr = `${day} ${month} ${year}`;

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // Calculate relative time
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relativeStr = '';
  if (diffSec < 60) {
    relativeStr = 'just now';
  } else if (diffMin < 60) {
    relativeStr = `${diffMin}m ago`;
  } else if (diffHours < 24) {
    relativeStr = `${diffHours}h ago`;
  } else if (diffDays < 365) {
    relativeStr = `${diffDays}d ago`;
  } else {
    // Exact screenshot style: e.g. "398d ago" or "1y ago"
    relativeStr = `${diffDays}d ago`;
  }

  return {
    dateStr,
    timeStr,
    relativeStr,
    fullFormatted: `${dateStr} · ${timeStr} · ${relativeStr}`
  };
}
