import type { Channel, DailyEntry } from '../types';
import { PRODUCT_MAP } from '../data/catalog';
import { channelSubtotal, formatVND } from '../lib/pricing';
import { QuantityInput } from './QuantityInput';

interface Props {
  channel: Channel;
  entry: DailyEntry;
  onQuantityChange: (channelId: string, productId: string, qty: number) => void;
  onLumpSumChange: (channelId: string, amount: number) => void;
}

export function ChannelSection({ channel, entry, onQuantityChange, onLumpSumChange }: Props) {
  const subtotal = channelSubtotal(channel, entry);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">{channel.emoji}</span>
          {channel.name}
        </h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-base font-bold text-brand-700 tabular-nums">
          {formatVND(subtotal)}
        </span>
      </header>

      {channel.note && (
        <p className="mb-3 text-sm text-stone-500">{channel.note}</p>
      )}

      {channel.mode === 'lump-sum' ? (
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={entry.lumpSums[channel.id] || ''}
            placeholder="0"
            onChange={(e) => {
              const n = Number(e.target.value);
              onLumpSumChange(channel.id, Number.isFinite(n) && n >= 0 ? n : 0);
            }}
            onFocus={(e) => e.currentTarget.select()}
            className="h-14 flex-1 rounded-lg border border-stone-300 bg-white px-4 text-right text-2xl font-semibold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <span className="text-xl font-semibold text-stone-500">đ</span>
        </div>
      ) : (
        <div className="space-y-3">
          {channel.productIds.map((pid) => {
            const product = PRODUCT_MAP[pid];
            const price = channel.prices[pid] ?? 0;
            const qty = entry.quantities[channel.id]?.[pid] ?? 0;
            const lineTotal = qty * price;
            return (
              <div
                key={pid}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-50 p-3"
              >
                <div className="min-w-[140px] flex-1">
                  <div className="text-base font-semibold text-stone-800">
                    {product.name}
                  </div>
                  <div className="text-sm text-stone-500 tabular-nums">
                    {formatVND(price)} / {product.unit}
                  </div>
                </div>
                <QuantityInput
                  value={qty}
                  onChange={(n) => onQuantityChange(channel.id, pid, n)}
                />
                <div className="w-full text-right text-base font-bold text-stone-700 tabular-nums sm:w-24">
                  {lineTotal > 0 ? formatVND(lineTotal) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
