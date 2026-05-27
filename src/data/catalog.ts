import type { Channel, Product } from '../types';

export const PRODUCTS: Product[] = [
  { id: 'banh-nho', name: 'Bánh nhỏ', unit: 'cái' },
  { id: 'banh-trung', name: 'Bánh trung', unit: 'cái' },
  { id: 'banh-lon', name: 'Bánh lớn', unit: 'cái' },
  { id: 'cha-bong', name: 'Hủ chà bông', unit: 'hủ' },
  { id: 'sandwich', name: 'Bánh sandwich', unit: 'cái' },
  { id: 'banh-bao', name: 'Bánh bao', unit: 'cái' },
];

export const CHANNELS: Channel[] = [
  {
    id: 'lo-banh-khong',
    name: 'Bán tại lò (bánh không + lẻ)',
    emoji: '🏪',
    mode: 'per-product',
    productIds: ['banh-nho', 'banh-trung', 'banh-lon', 'cha-bong', 'sandwich', 'banh-bao'],
    prices: {
      'banh-nho': 4000,
      'banh-trung': 8000,
      'banh-lon': 15000,
      'cha-bong': 40000,
      'sandwich': 20000,
      'banh-bao': 25000,
    },
  },
  {
    id: 'banh-mi-thit',
    name: 'Bánh mì thịt tại lò',
    emoji: '🥖',
    mode: 'per-product',
    productIds: ['banh-nho', 'banh-trung', 'banh-lon'],
    prices: {
      'banh-nho': 28000,
      'banh-trung': 56000,
      'banh-lon': 112000,
    },
  },
  {
    id: 'ban-hang',
    name: 'Giao bạn hàng (sỉ)',
    emoji: '🛵',
    mode: 'per-product',
    productIds: ['banh-nho', 'banh-trung', 'banh-lon'],
    prices: {
      'banh-nho': 3000,
      'banh-trung': 6000,
      'banh-lon': 12000,
    },
  },
  {
    id: 'grab',
    name: 'GrabFood',
    emoji: '🟢',
    mode: 'lump-sum',
    note: 'Nhập tổng doanh thu cuối ngày (đã trừ chiết khấu)',
    productIds: [],
    prices: {},
  },
  {
    id: 'shopee',
    name: 'ShopeeFood',
    emoji: '🟠',
    mode: 'lump-sum',
    note: 'Nhập tổng doanh thu cuối ngày (đã trừ chiết khấu)',
    productIds: [],
    prices: {},
  },
];

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);
