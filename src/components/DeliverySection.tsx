import { useState } from 'react';
import type { BreadCount, BreadDef, Customer } from '../types';
import { customerSubtotal, formatVND } from '../lib/pricing';
import { BreadRow } from './BreadRow';

interface Props {
  breads: BreadDef[];
  customers: Customer[];
  delivery: Record<string, BreadCount>;
  subtotal: number;
  onCustomerQtyChange: (customerId: string, breadId: string, qty: number) => void;
  onAddCustomer: (name: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export function DeliverySection({
  breads,
  customers,
  delivery,
  subtotal,
  onCustomerQtyChange,
  onAddCustomer,
  onDeleteCustomer,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

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
          const sub = customerSubtotal(counts, breads);
          return (
            <div key={c.id} className="rounded-xl bg-stone-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-stone-800">
                    {c.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Xóa bạn hàng "${c.name}"?`)) {
                        onDeleteCustomer(c.id);
                      }
                    }}
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
              <div className="space-y-2">
                {breads.map((b) => (
                  <BreadRow
                    key={b.id}
                    bread={b}
                    qty={counts[b.id] ?? 0}
                    price={b.priceWholesale}
                    onChange={(n) => onCustomerQtyChange(c.id, b.id, n)}
                  />
                ))}
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
              placeholder="Tên bạn hàng (vd: Cô Tư chợ Bà Chiểu)"
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
