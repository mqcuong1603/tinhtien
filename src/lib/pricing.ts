import type {
  AdjustmentItem,
  BreadCount,
  BreadDef,
  BreadId,
  BreadPriceMap,
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

export function customerSubtotal(counts: BreadCount, prices: BreadPriceMap): number {
  return (
    (counts['banh-nho'] ?? 0) * prices['banh-nho'] +
    (counts['banh-trung'] ?? 0) * prices['banh-trung'] +
    (counts['banh-lon'] ?? 0) * prices['banh-lon']
  );
}

export function deliveryRevenue(entry: ShiftEntry, customers: Customer[]): number {
  let total = 0;
  for (const c of customers) {
    const counts = entry.delivery[c.id];
    if (!counts) continue;
    total += customerSubtotal(counts, c.prices);
  }
  return total;
}

export function deliveredOf(
  entry: ShiftEntry,
  breadId: BreadId,
  customers: Customer[],
): number {
  let total = 0;
  for (const c of customers) {
    const counts = entry.delivery[c.id];
    if (!counts) continue;
    total += counts[breadId] ?? 0;
  }
  return total;
}

export function reconciliation(
  entry: ShiftEntry,
  breads: BreadDef[],
  customers: Customer[],
): BreadReconRow[] {
  return breads.map((bread) => {
    const produced = entry.production[bread.id] ?? 0;
    const sold =
      (entry.banhKhong[bread.id] ?? 0) +
      (entry.banhThit[bread.id] ?? 0) +
      deliveredOf(entry, bread.id, customers);
    return { bread, produced, sold, diff: produced - sold };
  });
}

export function adjustmentAmount(item: AdjustmentItem): number {
  return item.qty * item.price;
}

export function adjustmentsTotal(items: AdjustmentItem[]): number {
  return items.reduce((sum, it) => sum + adjustmentAmount(it), 0);
}

export function totalBreadRevenue(
  entry: ShiftEntry,
  breads: BreadDef[],
  products: RetailProduct[],
  customers: Customer[],
): number {
  return (
    breadKhongRevenue(entry, breads) +
    breadThitRevenue(entry, breads) +
    retailRevenue(entry, products) +
    deliveryRevenue(entry, customers)
  );
}

export interface CashSummary {
  bread: number;
  plus: number;
  minus: number;
  changeIn: number;
  changeOut: number;
  bankTransfer: number;
  cashTaken: number;
  expected: number;
  actual: number;
  variance: number;
}

export function cashSummary(
  entry: ShiftEntry,
  breads: BreadDef[],
  products: RetailProduct[],
  customers: Customer[],
): CashSummary {
  const bread = totalBreadRevenue(entry, breads, products, customers);
  const plus = adjustmentsTotal(entry.adjustmentsPlus);
  const minus = adjustmentsTotal(entry.adjustmentsMinus);
  const expected = bread + entry.changeIn + plus - minus;
  const actual = entry.cashTaken + entry.changeOut + entry.bankTransfer;
  return {
    bread,
    plus,
    minus,
    changeIn: entry.changeIn,
    changeOut: entry.changeOut,
    bankTransfer: entry.bankTransfer,
    cashTaken: entry.cashTaken,
    expected,
    actual,
    variance: expected - actual,
  };
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
    adjustmentsPlus: [],
    adjustmentsMinus: [],
    changeIn: 0,
    changeOut: 0,
    bankTransfer: 0,
    cashTaken: 0,
    note: '',
    updatedAt: Date.now(),
  };
}

export function sortCustomers(customers: Customer[]): Customer[] {
  return [...customers].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}
