import type { DailyEntry } from '../types';

const KEY = 'tinhtien:entries:v1';

type Store = Record<string, DailyEntry>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function loadEntry(date: string): DailyEntry | null {
  const store = readStore();
  return store[date] ?? null;
}

export function saveEntry(entry: DailyEntry) {
  const store = readStore();
  store[entry.date] = { ...entry, updatedAt: Date.now() };
  writeStore(store);
}

export function deleteEntry(date: string) {
  const store = readStore();
  delete store[date];
  writeStore(store);
}

export function listEntries(): DailyEntry[] {
  const store = readStore();
  return Object.values(store).sort((a, b) => (a.date < b.date ? 1 : -1));
}
