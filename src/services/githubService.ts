import { Entry, GitHubConfig } from '../types';

const STORAGE_CONFIG_KEY = 'ogulr_github_config';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  owner: 'ogulgnyy',
  repo: 'microblog',
  branch: 'main',
  path: 'entries.json',
  token: '',
  autoSync: true,
  syncInterval: 60
};

export const FALLBACK_ENTRIES: Entry[] = [
  {
    id: "entry-1",
    timestamp: "2026-10-24T10:40:00Z",
    content: "deneme",
    category: "dev"
  },
  {
    id: "entry-2",
    timestamp: "2026-09-21T22:41:00Z",
    content: "DSOTM'u tekrar dinlemeye başladığımdan beri albümün prodüksiyonuna sözlerden daha fazla takılmaya başladım.",
    category: "music"
  },
  {
    id: "entry-3",
    timestamp: "2026-09-21T19:12:00Z",
    content: "Bugün okuldan dönerken aynı şarkıyı üç kere üst üste dinledim.",
    category: "daily"
  },
  {
    id: "entry-4",
    timestamp: "2026-09-18T14:20:00Z",
    content: "Bir tasarımın bittiğini artık eklenecek bir şey kalmadığında değil, çıkarılacak hiçbir şey kalmadığında anlıyorsun.",
    category: "design"
  },
  {
    id: "entry-5",
    timestamp: "2025-09-21T11:05:00Z",
    content: "Yeni bir şey öğrenirken en zor kısım bilmediğini fark ettiğin anın yarattığı o ilk karmaşa hissi.",
    category: "thoughts"
  },
  {
    id: "entry-6",
    timestamp: "2025-08-15T17:30:00Z",
    content: "Terminalde vakit geçirmek bazen gerçek dünyadan kaçışın en saf yolu gibi geliyor.",
    category: "dev"
  },
  {
    id: "entry-7",
    timestamp: "2025-08-02T09:15:00Z",
    content: "Vite derleyicisi o kadar hızlı ki bazen dosyanın gerçekten güncellenip güncellenmediğini kontrol etmek zorunda kalıyorum.",
    category: "dev"
  },
  {
    id: "entry-8",
    timestamp: "2025-07-14T23:45:00Z",
    content: "Gece yarısı yazılan kodların sabah çalışmama olasılığı üzerine felsefi bir deneme yazılabilir.",
    category: "thoughts"
  },
  {
    id: "entry-9",
    timestamp: "2025-05-28T16:04:00Z",
    content: "Düşünceleri saklamak için karmaşık bir CMS'e ihtiyacın yok; tek bir JSON ve Git commit'i yeterli.",
    category: "dev"
  },
  {
    id: "entry-10",
    timestamp: "2025-04-10T12:00:00Z",
    content: "İlk girdi. Burası benim dijital karalama defterim.",
    category: "daily"
  }
];

export function getSavedGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GITHUB_CONFIG, ...parsed };
    }
  } catch {
    // ignore localStorage errors
  }
  return DEFAULT_GITHUB_CONFIG;
}

export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save GitHub config to localStorage', err);
  }
}

export function getGitHubRawUrl(config: GitHubConfig): string {
  const cleanPath = config.path.replace(/^\/+/, '');
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${cleanPath}`;
}

export function getGitHubEditUrl(config: GitHubConfig): string {
  const cleanPath = config.path.replace(/^\/+/, '');
  return `https://github.com/${config.owner}/${config.repo}/edit/${config.branch}/${cleanPath}`;
}

export function getGitHubRepoUrl(config: GitHubConfig): string {
  return `https://github.com/${config.owner}/${config.repo}`;
}

/**
 * Normalizes array of entries: ensures unique ids and sorted in reverse chronological order
 */
function normalizeEntries(entries: unknown[]): Entry[] {
  if (!Array.isArray(entries)) {
    throw new Error('Veri formatı bir JSON dizisi olmalıdır.');
  }

  const validEntries: Entry[] = entries
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item, index) => {
      const content = String(item.content || item.text || item.entry || '').trim();
      const rawDate = item.timestamp || item.date || item.created_at || new Date().toISOString();
      const id = String(item.id || `entry-${index}-${Date.now()}`);
      const category = item.category ? String(item.category) : undefined;

      return {
        id,
        timestamp: String(rawDate),
        content,
        category
      };
    })
    .filter(e => e.content.length > 0);

  // Sort descending by date (newest first)
  validEntries.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;
    return timeB - timeA;
  });

  return validEntries;
}

export async function fetchEntriesFromGitHub(config: GitHubConfig): Promise<{
  entries: Entry[];
  source: 'github' | 'local' | 'mock';
  message?: string;
}> {
  // If owner and repo are defined, attempt GitHub Raw API with cache-busting timestamp
  if (config.owner && config.repo && config.branch && config.path) {
    const rawUrl = `${getGitHubRawUrl(config)}?t=${Date.now()}`;
    const headers: HeadersInit = {
      'Accept': 'application/json, text/plain, */*'
    };

    if (config.token?.trim()) {
      headers['Authorization'] = `token ${config.token.trim()}`;
    }

    try {
      const response = await fetch(rawUrl, {
        method: 'GET',
        headers,
        cache: 'no-store'
      });

      if (response.ok) {
        const text = await response.text();
        const json = JSON.parse(text);
        const entries = normalizeEntries(json);
        return {
          entries,
          source: 'github',
          message: `${config.owner}/${config.repo} kaynağından başarıyla çekildi.`
        };
      } else if (response.status === 404) {
        console.warn(`GitHub dosyası bulunamadı (${response.status}): ${rawUrl}. Yerel örneğe geçiliyor.`);
      }
    } catch (err) {
      console.warn('GitHub Raw fetch hatası, yerel yedeğe dönülüyor:', err);
    }
  }

  // Fallback 1: Try public /entries.json bundled with the static site
  try {
    const localRes = await fetch(`/entries.json?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (localRes.ok) {
      const localJson = await localRes.json();
      return {
        entries: normalizeEntries(localJson),
        source: 'local',
        message: 'Yerel dosya (/entries.json) kaynağından gösteriliyor.'
      };
    }
  } catch (err) {
    console.warn('Yerel /entries.json okunamadı:', err);
  }

  // Fallback 2: Hardcoded mock data from screenshot
  return {
    entries: FALLBACK_ENTRIES,
    source: 'mock',
    message: 'Önceden yüklenmiş başlangıç verileri gösteriliyor.'
  };
}
