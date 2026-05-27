export type ProductId = string;
export type ChannelId = string;

export interface Product {
  id: ProductId;
  name: string;
  unit: string;
}

export type ChannelMode = 'per-product' | 'lump-sum';

export interface Channel {
  id: ChannelId;
  name: string;
  emoji: string;
  mode: ChannelMode;
  note?: string;
  productIds: ProductId[];
  prices: Record<ProductId, number>;
}

export interface DailyEntry {
  date: string;
  quantities: Record<ChannelId, Record<ProductId, number>>;
  lumpSums: Record<ChannelId, number>;
  note: string;
  updatedAt: number;
}
