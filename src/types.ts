export type BreadId = 'banh-nho' | 'banh-trung' | 'banh-lon';
export type ShiftSlot = 'sang' | 'chieu';

export interface BreadDef {
  id: BreadId;
  name: string;
  short: string;
  priceBanhKhong: number;
  priceBanhThit: number;
  priceWholesale: number;
}

export interface RetailProduct {
  id: string;
  name: string;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
}

export type BreadCount = Partial<Record<BreadId, number>>;

export interface ShiftEntry {
  date: string;
  slot: ShiftSlot;
  production: BreadCount;
  banhKhong: BreadCount;
  banhThit: BreadCount;
  retail: Record<string, number>;
  delivery: Record<string, BreadCount>;
  note: string;
  updatedAt: number;
}

export interface BreadReconRow {
  bread: BreadDef;
  produced: number;
  sold: number;
  diff: number;
}
