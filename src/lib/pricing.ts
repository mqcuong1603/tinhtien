import type {
  BreadCount,
  BreadDef,
  BreadReconRow,
  Customer,
  RetailProduct,
  ShiftEntry,
  ShiftSlot,
} from '../types';

export function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function currentSlot(): ShiftSlot {
  return new Date().getHours() < 13 ? 'sang' : 'chieu';
}

export function shiftKey(date: string, slot: ShiftSlot): string {
  return `${date}|${slot}`;
}

export function shiftLabel(slot: ShiftSlot): string {
  return slot === 'sang' ? 'Sáng' : 'Chiều';
}

export function sumBreadCount(c: BreadCount): number {
  return (c['banh-nho'] ?? 0) + (c['banh-trung'] ?? 0) + (c['banh-lon'] ?? 0);
}

export function breadKhongRevenue(entry: ShiftEntry, breads: BreadDef[]): number {
  return breads.reduce(
    (sum, b) => sum + (entry.banhKhong[b.id] ?? 0) * b.priceBanhKhong,
    0,
  );
}

export function breadThitRevenue(entry: ShiftEntry, breads: BreadDef[]): number {
  return breads.reduce(
    (sum, b) => sum + (entry.banhThit[b.id] ?? 0) * b.priceBanhThit,
    0,
  );
}

export function retailRevenue(entry: ShiftEntry, products: RetailProduct[]): number {
  return products.reduce(
    (sum, p) => sum + (entry.retail[p.id] ?? 0) * p.price,
    0,
  );
}

export function deliveryRevenue(entry: ShiftEntry, breads: BreadDef[]): number {
  let total = 0;
  for (const counts of Object.values(entry.delivery)) {
    for (const b of breads) {
      total += (counts[b.id] ?? 0) * b.priceWholesale;
    }
  }
  return total;
}

export function customerSubtotal(counts: BreadCount, breads: BreadDef[]): number {
  return breads.reduce((sum, b) => sum + (counts[b.id] ?? 0) * b.priceWholesale, 0);
}

export function deliveredOf(entry: ShiftEntry, breadId: string): number {
  let total = 0;
  for (const counts of Object.values(entry.delivery)) {
    total += counts[breadId as keyof BreadCount] ?? 0;
  }
  return total;
}

export function reconciliation(entry: ShiftEntry, breads: BreadDef[]): BreadReconRow[] {
  return breads.map((bread) => {
    const produced = entry.production[bread.id] ?? 0;
    const sold =
      (entry.banhKhong[bread.id] ?? 0) +
      (entry.banhThit[bread.id] ?? 0) +
      deliveredOf(entry, bread.id);
    return { bread, produced, sold, diff: produced - sold };
  });
}

export function totalRevenue(
  entry: ShiftEntry,
  breads: BreadDef[],
  products: RetailProduct[],
): number {
  return (
    breadKhongRevenue(entry, breads) +
    breadThitRevenue(entry, breads) +
    retailRevenue(entry, products) +
    deliveryRevenue(entry, breads)
  );
}

export function emptyEntry(date: string, slot: ShiftSlot): ShiftEntry {
  return {
    date,
    slot,
    production: {},
    banhKhong: {},
    banhThit: {},
    retail: {},
    delivery: {},
    note: '',
    updatedAt: Date.now(),
  };
}

export function sortCustomers(customers: Customer[]): Customer[] {
  return [...customers].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}
