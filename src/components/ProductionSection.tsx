import type { BreadCount, BreadDef, BreadId } from '../types';
import { BreadRow } from './BreadRow';

interface Props {
  breads: BreadDef[];
  production: BreadCount;
  onChange: (breadId: BreadId, qty: number) => void;
}

export function ProductionSection({ breads, production, onChange }: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">🍞</span>
          Sản xuất ca này
        </h2>
        <p className="text-sm text-stone-500">
          Số bánh ra lò trong ca, dùng để đối soát với bán + giao.
        </p>
      </header>
      <div className="space-y-3">
        {breads.map((b) => (
          <BreadRow
            key={b.id}
            bread={b}
            qty={production[b.id] ?? 0}
            onChange={(n) => onChange(b.id, n)}
          />
        ))}
      </div>
    </section>
  );
}
