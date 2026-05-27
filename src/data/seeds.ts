import type { BreadDef, BreadPriceMap, RetailProduct } from '../types';

export const DEFAULT_WHOLESALE_PRICES: BreadPriceMap = {
  'banh-nho': 3000,
  'banh-trung': 6000,
  'banh-lon': 12000,
};

export const BREADS: BreadDef[] = [
  {
    id: 'banh-nho',
    name: 'Bánh nhỏ',
    short: 'Nhỏ',
    priceBanhKhong: 4000,
    priceBanhThit: 28000,
    priceWholesale: 3000,
  },
  {
    id: 'banh-trung',
    name: 'Bánh trung',
    short: 'Trung',
    priceBanhKhong: 8000,
    priceBanhThit: 56000,
    priceWholesale: 6000,
  },
  {
    id: 'banh-lon',
    name: 'Bánh lớn',
    short: 'Lớn',
    priceBanhKhong: 15000,
    priceBanhThit: 112000,
    priceWholesale: 12000,
  },
];

export const DEFAULT_RETAIL_PRODUCTS: RetailProduct[] = [
  { id: 'cha-bong', name: 'Hủ chà bông', price: 40000 },
  { id: 'sandwich', name: 'Bánh sandwich', price: 20000 },
  { id: 'banh-bao', name: 'Bánh bao', price: 25000 },
];
