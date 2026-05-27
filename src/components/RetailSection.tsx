import { useState } from 'react';
import type { RetailProduct } from '../types';
import { formatVND } from '../lib/pricing';
import { QuantityInput } from './QuantityInput';

interface Props {
  products: RetailProduct[];
  retail: Record<string, number>;
  subtotal: number;
  onQtyChange: (productId: string, qty: number) => void;
  onAddProduct: (name: string, price: number) => void;
  onDeleteProduct: (productId: string) => void;
}

export function RetailSection({
  products,
  retail,
  subtotal,
  onQtyChange,
  onAddProduct,
  onDeleteProduct,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const submit = () => {
    const trimmed = name.trim();
    const p = Number(price);
    if (!trimmed || !Number.isFinite(p) || p < 0) return;
    onAddProduct(trimmed, p);
    setName('');
    setPrice('');
    setAdding(false);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">🛒</span>
          Bán lẻ
        </h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-base font-bold tabular-nums text-brand-700">
          {formatVND(subtotal)}
        </span>
      </header>

      <div className="space-y-3">
        {products.map((p) => {
          const qty = retail[p.id] ?? 0;
          const line = qty * p.price;
          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-50 p-3"
            >
              <div className="min-w-[120px] flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-stone-800">
                    {p.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Xóa "${p.name}" khỏi danh sách?`)) {
                        onDeleteProduct(p.id);
                      }
                    }}
                    className="text-xs text-stone-400 hover:text-rose-600"
                    aria-label="Xóa sản phẩm"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm tabular-nums text-stone-500">
                  {formatVND(p.price)}
                </div>
              </div>
              <QuantityInput value={qty} onChange={(n) => onQtyChange(p.id, n)} />
              <div className="w-full text-right text-base font-bold tabular-nums text-stone-700 sm:w-24">
                {line > 0 ? formatVND(line) : '—'}
              </div>
            </div>
          );
        })}

        {products.length === 0 && !adding && (
          <p className="text-sm text-stone-500">
            Chưa có sản phẩm lẻ. Nhấn nút bên dưới để thêm.
          </p>
        )}

        {adding ? (
          <div className="space-y-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-3">
            <input
              type="text"
              placeholder="Tên sản phẩm (vd: Bánh kem)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Giá (vd: 15000)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base tabular-nums focus:border-brand-500 focus:outline-none"
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
                  setPrice('');
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
            + Thêm sản phẩm
          </button>
        )}
      </div>
    </section>
  );
}
