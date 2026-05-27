import type { BreadCount, BreadDef, BreadId } from '../types';
import { formatVND } from '../lib/pricing';
import { BreadRow } from './BreadRow';

interface Props {
  title: string;
  emoji: string;
  breads: BreadDef[];
  counts: BreadCount;
  priceFor: (b: BreadDef) => number;
  subtotal: number;
  onChange: (breadId: BreadId, qty: number) => void;
}

export function BreadSalesSection({
  title,
  emoji,
  breads,
  counts,
  priceFor,
  subtotal,
  onChange,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">{emoji}</span>
          {title}
        </h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-base font-bold tabular-nums text-brand-700">
          {formatVND(subtotal)}
        </span>
      </header>
      <div className="space-y-3">
        {breads.map((b) => (
          <BreadRow
            key={b.id}
            bread={b}
            qty={counts[b.id] ?? 0}
            price={priceFor(b)}
            onChange={(n) => onChange(b.id, n)}
          />
        ))}
      </div>
    </section>
  );
}
