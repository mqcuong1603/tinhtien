import { useEffect, useMemo, useState } from 'react';
import { BREADS, DEFAULT_WHOLESALE_PRICES } from './data/seeds';
import type {
  AdjustmentItem,
  BreadId,
  Customer,
  RetailProduct,
  ShiftEntry,
  ShiftSlot,
} from './types';
import {
  breadKhongRevenue,
  breadThitRevenue,
  cashSummary,
  currentSlot,
  deliveryRevenue,
  emptyEntry,
  formatVND,
  reconciliation,
  retailRevenue,
  shiftLabel,
  sortCustomers,
  todayISO,
} from './lib/pricing';
import {
  deleteShift,
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
import { AdjustmentsSection } from './components/AdjustmentsSection';
import { CashReconCard } from './components/CashReconCard';
import { ConfirmModal, type ConfirmOptions } from './components/ConfirmModal';

interface PendingConfirm extends ConfirmOptions {
  onConfirm: () => void;
}

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
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  useEffect(() => {
    const loaded = loadShift(date, slot);
    setEntry(loaded ?? emptyEntry(date, slot));
    setSavedAt(loaded?.updatedAt ?? null);
  }, [date, slot]);

  const recon = useMemo(() => reconciliation(entry, BREADS, customers), [entry, customers]);
  const banhKhongSub = useMemo(() => breadKhongRevenue(entry, BREADS), [entry]);
  const banhThitSub = useMemo(() => breadThitRevenue(entry, BREADS), [entry]);
  const retailSub = useMemo(() => retailRevenue(entry, products), [entry, products]);
  const deliverySub = useMemo(() => deliveryRevenue(entry, customers), [entry, customers]);
  const cash = useMemo(
    () => cashSummary(entry, BREADS, products, customers),
    [entry, products, customers],
  );

  const ask = (opts: ConfirmOptions, onConfirm: () => void) =>
    setPending({ ...opts, onConfirm });

  const updateProduction = (breadId: BreadId, qty: number) =>
    setEntry((p) => ({ ...p, production: { ...p.production, [breadId]: qty } }));
  const updateBanhKhong = (breadId: BreadId, qty: number) =>
    setEntry((p) => ({ ...p, banhKhong: { ...p.banhKhong, [breadId]: qty } }));
  const updateBanhThit = (breadId: BreadId, qty: number) =>
    setEntry((p) => ({ ...p, banhThit: { ...p.banhThit, [breadId]: qty } }));
  const updateRetail = (productId: string, qty: number) =>
    setEntry((p) => ({ ...p, retail: { ...p.retail, [productId]: qty } }));
  const updateDelivery = (customerId: string, breadId: BreadId, qty: number) =>
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
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    ask(
      {
        title: 'Xóa sản phẩm',
        message: `Xóa "${product.name}" khỏi danh sách sản phẩm lẻ?`,
        confirmLabel: 'Xóa',
        danger: true,
      },
      () => {
        const next = products.filter((p) => p.id !== productId);
        setProducts(next);
        saveProducts(next);
        setEntry((p) => {
          if (!(productId in p.retail)) return p;
          const { [productId]: _removed, ...rest } = p.retail;
          return { ...p, retail: rest };
        });
      },
    );
  };

  const addCustomer = (name: string) => {
    const next = sortCustomers([
      ...customers,
      { id: newId('c'), name, prices: { ...DEFAULT_WHOLESALE_PRICES } },
    ]);
    setCustomers(next);
    saveCustomers(next);
  };
  const deleteCustomer = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    ask(
      {
        title: 'Xóa bạn hàng',
        message: `Xóa "${customer.name}" khỏi danh sách bạn hàng?`,
        confirmLabel: 'Xóa',
        danger: true,
      },
      () => {
        const next = customers.filter((c) => c.id !== customerId);
        setCustomers(next);
        saveCustomers(next);
        setEntry((p) => {
          if (!(customerId in p.delivery)) return p;
          const { [customerId]: _removed, ...rest } = p.delivery;
          return { ...p, delivery: rest };
        });
      },
    );
  };
  const updateCustomerPrice = (customerId: string, breadId: BreadId, price: number) => {
    const next = customers.map((c) =>
      c.id === customerId ? { ...c, prices: { ...c.prices, [breadId]: price } } : c,
    );
    setCustomers(next);
    saveCustomers(next);
  };

  const addAdjustment = (
    field: 'adjustmentsPlus' | 'adjustmentsMinus',
    name: string,
    qty: number,
    price: number,
  ) => {
    const item: AdjustmentItem = { id: newId('a'), name, qty, price };
    setEntry((p) => ({ ...p, [field]: [...p[field], item] }));
  };
  const removeAdjustment = (
    field: 'adjustmentsPlus' | 'adjustmentsMinus',
    id: string,
  ) => {
    setEntry((p) => ({ ...p, [field]: p[field].filter((it) => it.id !== id) }));
  };

  const handleSave = () => {
    saveShift(entry);
    setSavedAt(Date.now());
  };

  const handleResetShift = () =>
    ask(
      {
        title: 'Reset ca hiện tại',
        message: `Xóa hết số liệu ca ${shiftLabel(slot)} ngày ${date} về mặc định?\nDanh sách sản phẩm và bạn hàng giữ nguyên.`,
        confirmLabel: 'Reset',
        danger: true,
      },
      () => {
        deleteShift(date, slot);
        setEntry(emptyEntry(date, slot));
        setSavedAt(null);
      },
    );

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col pb-32">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-stone-900">🥖 Tính tiền lò bánh mì</h1>
          <div className="flex items-center gap-2">
            <ShiftPicker
              date={date}
              slot={slot}
              onDateChange={setDate}
              onSlotChange={setSlot}
            />
            <button
              type="button"
              onClick={handleResetShift}
              className="rounded-lg bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700 active:bg-stone-200"
              title="Reset ca hiện tại"
            >
              ↺ Reset
            </button>
          </div>
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
          onCustomerPriceChange={updateCustomerPrice}
        />

        <AdjustmentsSection
          title="Cộng thêm"
          emoji="➕"
          variant="plus"
          items={entry.adjustmentsPlus}
          onAdd={(name, qty, price) => addAdjustment('adjustmentsPlus', name, qty, price)}
          onRemove={(id) => removeAdjustment('adjustmentsPlus', id)}
        />

        <AdjustmentsSection
          title="Trừ ra"
          emoji="➖"
          variant="minus"
          items={entry.adjustmentsMinus}
          onAdd={(name, qty, price) => addAdjustment('adjustmentsMinus', name, qty, price)}
          onRemove={(id) => removeAdjustment('adjustmentsMinus', id)}
        />

        <CashReconCard
          summary={cash}
          onChangeIn={(n) => setEntry((p) => ({ ...p, changeIn: n }))}
          onChangeOut={(n) => setEntry((p) => ({ ...p, changeOut: n }))}
          onBankTransfer={(n) => setEntry((p) => ({ ...p, bankTransfer: n }))}
          onCashTaken={(n) => setEntry((p) => ({ ...p, cashTaken: n }))}
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
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Tổng dự kiến ca {shiftLabel(slot)}
            </div>
            <div className="text-2xl font-bold tabular-nums text-brand-700">
              {formatVND(cash.expected)}
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

      <ConfirmModal
        open={pending !== null}
        title={pending?.title ?? ''}
        message={pending?.message ?? ''}
        confirmLabel={pending?.confirmLabel}
        cancelLabel={pending?.cancelLabel}
        danger={pending?.danger}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          pending?.onConfirm();
          setPending(null);
        }}
      />
    </div>
  );
}
