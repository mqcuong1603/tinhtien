import { useEffect, useMemo, useState } from 'react';
import { BREADS } from './data/seeds';
import type { Customer, RetailProduct, ShiftEntry, ShiftSlot } from './types';
import {
  breadKhongRevenue,
  breadThitRevenue,
  currentSlot,
  deliveryRevenue,
  emptyEntry,
  formatVND,
  reconciliation,
  retailRevenue,
  shiftLabel,
  sortCustomers,
  todayISO,
  totalRevenue,
} from './lib/pricing';
import {
  loadCustomers,
  loadProducts,
  loadShift,
  saveCustomers,
  saveProducts,
  saveShift,
} from './lib/storage';
import { newId } from './lib/id';
import { ShiftPicker } from './components/ShiftPicker';
import { ReconciliationCard } from './components/ReconciliationCard';
import { ProductionSection } from './components/ProductionSection';
import { BreadSalesSection } from './components/BreadSalesSection';
import { RetailSection } from './components/RetailSection';
import { DeliverySection } from './components/DeliverySection';

export default function App() {
  const [date, setDate] = useState<string>(todayISO());
  const [slot, setSlot] = useState<ShiftSlot>(currentSlot());
  const [products, setProducts] = useState<RetailProduct[]>(() => loadProducts());
  const [customers, setCustomers] = useState<Customer[]>(() =>
    sortCustomers(loadCustomers()),
  );
  const [entry, setEntry] = useState<ShiftEntry>(
    () => loadShift(todayISO(), currentSlot()) ?? emptyEntry(todayISO(), currentSlot()),
  );
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const loaded = loadShift(date, slot);
    setEntry(loaded ?? emptyEntry(date, slot));
    setSavedAt(loaded?.updatedAt ?? null);
  }, [date, slot]);

  const recon = useMemo(() => reconciliation(entry, BREADS), [entry]);
  const banhKhongSub = useMemo(() => breadKhongRevenue(entry, BREADS), [entry]);
  const banhThitSub = useMemo(() => breadThitRevenue(entry, BREADS), [entry]);
  const retailSub = useMemo(() => retailRevenue(entry, products), [entry, products]);
  const deliverySub = useMemo(() => deliveryRevenue(entry, BREADS), [entry]);
  const total = useMemo(
    () => totalRevenue(entry, BREADS, products),
    [entry, products],
  );

  const updateProduction = (breadId: string, qty: number) =>
    setEntry((p) => ({ ...p, production: { ...p.production, [breadId]: qty } }));
  const updateBanhKhong = (breadId: string, qty: number) =>
    setEntry((p) => ({ ...p, banhKhong: { ...p.banhKhong, [breadId]: qty } }));
  const updateBanhThit = (breadId: string, qty: number) =>
    setEntry((p) => ({ ...p, banhThit: { ...p.banhThit, [breadId]: qty } }));
  const updateRetail = (productId: string, qty: number) =>
    setEntry((p) => ({ ...p, retail: { ...p.retail, [productId]: qty } }));
  const updateDelivery = (customerId: string, breadId: string, qty: number) =>
    setEntry((p) => ({
      ...p,
      delivery: {
        ...p.delivery,
        [customerId]: { ...(p.delivery[customerId] ?? {}), [breadId]: qty },
      },
    }));

  const addProduct = (name: string, price: number) => {
    const next = [...products, { id: newId('p'), name, price }];
    setProducts(next);
    saveProducts(next);
  };
  const deleteProduct = (productId: string) => {
    const next = products.filter((p) => p.id !== productId);
    setProducts(next);
    saveProducts(next);
  };

  const addCustomer = (name: string) => {
    const next = sortCustomers([...customers, { id: newId('c'), name }]);
    setCustomers(next);
    saveCustomers(next);
  };
  const deleteCustomer = (customerId: string) => {
    const next = customers.filter((c) => c.id !== customerId);
    setCustomers(next);
    saveCustomers(next);
  };

  const handleSave = () => {
    saveShift(entry);
    setSavedAt(Date.now());
  };

  const handleReset = () => {
    if (!confirm(`Xóa hết số liệu ca ${shiftLabel(slot)} ngày ${date}?`)) return;
    setEntry(emptyEntry(date, slot));
  };

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col pb-32">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-stone-900">🥖 Tính tiền lò bánh mì</h1>
          <ShiftPicker
            date={date}
            slot={slot}
            onDateChange={setDate}
            onSlotChange={setSlot}
          />
        </div>
      </header>

      <main className="space-y-4 px-4 py-4">
        <ReconciliationCard rows={recon} />

        <ProductionSection
          breads={BREADS}
          production={entry.production}
          onChange={updateProduction}
        />

        <BreadSalesSection
          title="Bánh không tại lò"
          emoji="🥖"
          breads={BREADS}
          counts={entry.banhKhong}
          priceFor={(b) => b.priceBanhKhong}
          subtotal={banhKhongSub}
          onChange={updateBanhKhong}
        />

        <BreadSalesSection
          title="Bánh mì thịt tại lò"
          emoji="🥪"
          breads={BREADS}
          counts={entry.banhThit}
          priceFor={(b) => b.priceBanhThit}
          subtotal={banhThitSub}
          onChange={updateBanhThit}
        />

        <RetailSection
          products={products}
          retail={entry.retail}
          subtotal={retailSub}
          onQtyChange={updateRetail}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
        />

        <DeliverySection
          breads={BREADS}
          customers={customers}
          delivery={entry.delivery}
          subtotal={deliverySub}
          onCustomerQtyChange={updateDelivery}
          onAddCustomer={addCustomer}
          onDeleteCustomer={deleteCustomer}
        />

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
          <label className="mb-2 block text-sm font-semibold text-stone-600">
            Ghi chú ca này
          </label>
          <textarea
            value={entry.note}
            onChange={(e) => setEntry((p) => ({ ...p, note: e.target.value }))}
            placeholder="Vd: trời mưa, ít khách..."
            className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            rows={2}
          />
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 text-sm font-medium text-stone-500 underline-offset-2 hover:underline"
          >
            Xóa số liệu ca này
          </button>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Tổng ca {shiftLabel(slot)}
            </div>
            <div className="text-2xl font-bold tabular-nums text-brand-700">
              {formatVND(total)}
            </div>
            {savedAt && (
              <div className="text-[11px] text-stone-400">
                Đã lưu lúc {new Date(savedAt).toLocaleTimeString('vi-VN')}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="h-14 rounded-xl bg-brand-500 px-6 text-lg font-bold text-white shadow-sm active:bg-brand-600"
          >
            Lưu ca này
          </button>
        </div>
      </footer>
    </div>
  );
}
