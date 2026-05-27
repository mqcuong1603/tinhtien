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

export type BreadPriceMap = Record<BreadId, number>;

export interface Customer {
  id: string;
  name: string;
  prices: BreadPriceMap;
}

export type BreadCount = Partial<Record<BreadId, number>>;

export interface AdjustmentItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface ShiftEntry {
  date: string;
  slot: ShiftSlot;
  production: BreadCount;
  banhKhong: BreadCount;
  banhThit: BreadCount;
  retail: Record<string, number>;
  delivery: Record<string, BreadCount>;
  adjustmentsPlus: AdjustmentItem[];
  adjustmentsMinus: AdjustmentItem[];
  changeIn: number;
  changeOut: number;
  bankTransfer: number;
  cashTaken: number;
  note: string;
  updatedAt: number;
}

export interface BreadReconRow {
  bread: BreadDef;
  produced: number;
  sold: number;
  diff: number;
}
