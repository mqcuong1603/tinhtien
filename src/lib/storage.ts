import type { Customer, RetailProduct, ShiftEntry, ShiftSlot } from '../types';
import { shiftKey } from './pricing';
import { DEFAULT_RETAIL_PRODUCTS, DEFAULT_WHOLESALE_PRICES } from '../data/seeds';

const SHIFTS_KEY = 'tinhtien:shifts:v2';
const PRODUCTS_KEY = 'tinhtien:products:v2';
const CUSTOMERS_KEY = 'tinhtien:customers:v2';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Shifts ----------------------------------------------------------

type ShiftStore = Record<string, ShiftEntry>;

export function loadShift(date: string, slot: ShiftSlot): ShiftEntry | null {
  const store = readJSON<ShiftStore>(SHIFTS_KEY, {});
  return store[shiftKey(date, slot)] ?? null;
}

export function saveShift(entry: ShiftEntry) {
  const store = readJSON<ShiftStore>(SHIFTS_KEY, {});
  store[shiftKey(entry.date, entry.slot)] = { ...entry, updatedAt: Date.now() };
  writeJSON(SHIFTS_KEY, store);
}

export function listShifts(): ShiftEntry[] {
  const store = readJSON<ShiftStore>(SHIFTS_KEY, {});
  return Object.values(store).sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.slot === 'chieu' ? -1 : 1;
  });
}

// Retail products -------------------------------------------------

export function loadProducts(): RetailProduct[] {
  const stored = readJSON<RetailProduct[] | null>(PRODUCTS_KEY, null);
  if (stored && stored.length > 0) return stored;
  writeJSON(PRODUCTS_KEY, DEFAULT_RETAIL_PRODUCTS);
  return [...DEFAULT_RETAIL_PRODUCTS];
}

export function saveProducts(products: RetailProduct[]) {
  writeJSON(PRODUCTS_KEY, products);
}

// Customers -------------------------------------------------------

export function loadCustomers(): Customer[] {
  const raw = readJSON<Array<Partial<Customer> & { id: string; name: string }>>(
    CUSTOMERS_KEY,
    [],
  );
  return raw.map((c) => ({
    id: c.id,
    name: c.name,
    prices: c.prices ?? { ...DEFAULT_WHOLESALE_PRICES },
  }));
}

export function saveCustomers(customers: Customer[]) {
  writeJSON(CUSTOMERS_KEY, customers);
}

export function deleteShift(date: string, slot: ShiftSlot) {
  const store = readJSON<ShiftStore>(SHIFTS_KEY, {});
  delete store[shiftKey(date, slot)];
  writeJSON(SHIFTS_KEY, store);
}
