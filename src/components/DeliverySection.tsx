import { useState } from 'react';
import type { BreadCount, BreadDef, BreadId, Customer } from '../types';
import { customerSubtotal, formatVND } from '../lib/pricing';
import { QuantityInput } from './QuantityInput';

interface Props {
  breads: BreadDef[];
  customers: Customer[];
  delivery: Record<string, BreadCount>;
  subtotal: number;
  onCustomerQtyChange: (customerId: string, breadId: BreadId, qty: number) => void;
  onAddCustomer: (name: string) => void;
  onDeleteCustomer: (customerId: string) => void;
  onCustomerPriceChange: (customerId: string, breadId: BreadId, price: number) => void;
}

export function DeliverySection({
  breads,
  customers,
  delivery,
  subtotal,
  onCustomerQtyChange,
  onAddCustomer,
  onDeleteCustomer,
  onCustomerPriceChange,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [editingPrices, setEditingPrices] = useState<string | null>(null);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddCustomer(trimmed);
    setName('');
    setAdding(false);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">🛵</span>
          Giao bạn hàng (sỉ)
        </h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-base font-bold tabular-nums text-brand-700">
          {formatVND(subtotal)}
        </span>
      </header>

      <div className="space-y-4">
        {customers.map((c) => {
          const counts = delivery[c.id] ?? {};
          const sub = customerSubtotal(counts, c.prices);
          const isEditing = editingPrices === c.id;
          return (
            <div key={c.id} className="rounded-xl bg-stone-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-800">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => setEditingPrices(isEditing ? null : c.id)}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    {isEditing ? 'Xong' : 'Sửa giá'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCustomer(c.id)}
                    className="text-xs text-stone-400 hover:text-rose-600"
                    aria-label="Xóa bạn hàng"
                  >
                    ✕
                  </button>
                </div>
                <span className="text-sm font-bold tabular-nums text-brand-700">
                  {sub > 0 ? formatVND(sub) : '—'}
                </span>
              </div>

              {isEditing && (
                <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-white p-2 ring-1 ring-stone-200">
                  {breads.map((b) => (
                    <label key={b.id} className="block">
                      <span className="text-xs font-semibold text-stone-500">
                        {b.short}
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={c.prices[b.id] || ''}
                        placeholder="0"
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          onCustomerPriceChange(
                            c.id,
                            b.id,
                            Number.isFinite(n) && n >= 0 ? n : 0,
                          );
                        }}
                        onFocus={(e) => e.currentTarget.select()}
                        className="mt-1 w-full rounded border border-stone-300 px-2 py-1 text-right text-sm tabular-nums focus:border-brand-500 focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {breads.map((b) => {
                  const qty = counts[b.id] ?? 0;
                  const price = c.prices[b.id];
                  const line = qty * price;
                  return (
                    <div
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-2"
                    >
                      <div className="min-w-[100px] flex-1">
                        <div className="text-base font-semibold text-stone-800">
                          {b.name}
                        </div>
                        <div className="text-sm tabular-nums text-stone-500">
                          {formatVND(price)} / cái
                        </div>
                      </div>
                      <QuantityInput
                        value={qty}
                        onChange={(n) => onCustomerQtyChange(c.id, b.id, n)}
                      />
                      <div className="w-full text-right text-base font-bold tabular-nums text-stone-700 sm:w-24">
                        {line > 0 ? formatVND(line) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {customers.length === 0 && !adding && (
          <p className="text-sm text-stone-500">
            Chưa có bạn hàng nào. Nhấn nút bên dưới để thêm.
          </p>
        )}

        {adding ? (
          <div className="space-y-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-3">
            <input
              type="text"
              placeholder="Tên bạn hàng (vd: A Mai, T Dũng...)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none"
            />
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
                onClick={() => {
                  setAdding(false);
                  setName('');
                }}
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
            + Thêm bạn hàng
          </button>
        )}
      </div>
    </section>
  );
}
