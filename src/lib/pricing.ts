import type { Channel, DailyEntry } from '../types';

export function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function channelSubtotal(channel: Channel, entry: DailyEntry): number {
  if (channel.mode === 'lump-sum') {
    return entry.lumpSums[channel.id] ?? 0;
  }
  const qtyByProduct = entry.quantities[channel.id] ?? {};
  let total = 0;
  for (const pid of channel.productIds) {
    const qty = qtyByProduct[pid] ?? 0;
    total += qty * (channel.prices[pid] ?? 0);
  }
  return total;
}

export function grandTotal(channels: Channel[], entry: DailyEntry): number {
  return channels.reduce((sum, ch) => sum + channelSubtotal(ch, entry), 0);
}

export function emptyEntry(date: string): DailyEntry {
  return {
    date,
    quantities: {},
    lumpSums: {},
    note: '',
    updatedAt: Date.now(),
  };
}
