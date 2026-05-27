import { useState } from 'react';
import type { AdjustmentItem } from '../types';
import { adjustmentAmount, adjustmentsTotal, formatVND } from '../lib/pricing';

interface Props {
  title: string;
  emoji: string;
  variant: 'plus' | 'minus';
  items: AdjustmentItem[];
  onAdd: (name: string, qty: number, price: number) => void;
  onRemove: (id: string) => void;
}

export function AdjustmentsSection({
  title,
  emoji,
  variant,
  items,
  onAdd,
  onRemove,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');

  const total = adjustmentsTotal(items);

  const submit = () => {
    const trimmed = name.trim();
    const q = Number(qty.replace(',', '.'));
    const p = Number(price);
    if (!trimmed || !Number.isFinite(q) || q <= 0 || !Number.isFinite(p) || p < 0) return;
    onAdd(trimmed, q, p);
    setName('');
    setQty('1');
    setPrice('');
    setAdding(false);
  };

  const reset = () => {
    setAdding(false);
    setName('');
    setQty('1');
    setPrice('');
  };

  const totalColor = variant === 'plus' ? 'text-emerald-700' : 'text-rose-700';
  const totalBg = variant === 'plus' ? 'bg-emerald-50' : 'bg-rose-50';
  const sign = variant === 'plus' ? '+' : '−';

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">{emoji}</span>
          {title}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-base font-bold tabular-nums ${totalBg} ${totalColor}`}
        >
          {sign} {formatVND(total)}
        </span>
      </header>

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-semibold text-stone-800">
                {it.name}
              </div>
              <div className="text-xs tabular-nums text-stone-500">
                {it.qty} × {formatVND(it.price)}
              </div>
            </div>
            <div className="text-base font-bold tabular-nums text-stone-700">
              {formatVND(adjustmentAmount(it))}
            </div>
            <button
              type="button"
              onClick={() => onRemove(it.id)}
              className="text-stone-400 hover:text-rose-600"
              aria-label="Xóa"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && !adding && (
          <p className="text-sm text-stone-500">Chưa có khoản nào.</p>
        )}

        {adding ? (
          <div className="space-y-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-3">
            <input
              type="text"
              placeholder="Nội dung (vd: Ăn chiều, đồ chua...)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                placeholder="SL"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                className="w-20 rounded-lg border border-stone-300 bg-white px-3 py-2 text-center text-base tabular-nums focus:border-brand-500 focus:outline-none"
              />
              <span className="self-center text-stone-400">×</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Đơn giá"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-right text-base tabular-nums focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={submit}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white active:bg-brand-600"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-stone-200 px-4 py-2 font-semibold text-stone-700 active:bg-stone-300"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full rounded-xl border-2 border-dashed border-stone-300 py-3 text-sm font-semibold text-stone-600 active:bg-stone-50"
          >
            + Thêm khoản
          </button>
        )}
      </div>
    </section>
  );
}
