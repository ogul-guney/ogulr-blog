export interface Entry {
  id: string;
  timestamp: string; // ISO 8601 or parseable date string
  content: string;
  category?: 'dev' | 'music' | 'daily' | 'design' | 'thoughts' | string;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token?: string;
  autoSync: boolean;
  syncInterval: number; // in seconds
}

export type ActiveTab = 'timeline' | 'devlog' | 'search' | 'archive' | 'random';

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncedAt?: Date;
  errorMessage?: string;
  source: 'github' | 'local' | 'mock';
}
