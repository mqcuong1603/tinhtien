import { useEffect, useMemo, useState } from 'react';
import { CHANNELS } from './data/catalog';
import type { DailyEntry } from './types';
import { emptyEntry, formatVND, grandTotal, todayISO } from './lib/pricing';
import { listEntries, loadEntry, saveEntry } from './lib/storage';
import { ChannelSection } from './components/ChannelSection';
import { HistoryList } from './components/HistoryList';

export default function App() {
  const [date, setDate] = useState<string>(todayISO());
  const [entry, setEntry] = useState<DailyEntry>(() => loadEntry(todayISO()) ?? emptyEntry(todayISO()));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [history, setHistory] = useState<DailyEntry[]>(() => listEntries());

  useEffect(() => {
    const loaded = loadEntry(date);
    setEntry(loaded ?? emptyEntry(date));
    setSavedAt(loaded?.updatedAt ?? null);
  }, [date]);

  const total = useMemo(() => grandTotal(CHANNELS, entry), [entry]);

  const updateQty = (channelId: string, productId: string, qty: number) => {
    setEntry((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [channelId]: { ...(prev.quantities[channelId] ?? {}), [productId]: qty },
      },
    }));
  };

  const updateLump = (channelId: string, amount: number) => {
    setEntry((prev) => ({
      ...prev,
      lumpSums: { ...prev.lumpSums, [channelId]: amount },
    }));
  };

  const handleSave = () => {
    saveEntry(entry);
    setSavedAt(Date.now());
    setHistory(listEntries());
  };

  const handleReset = () => {
    if (!confirm('Xóa hết số liệu của ngày này?')) return;
    setEntry(emptyEntry(date));
  };

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col pb-32">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-stone-900">
            🥖 Tính tiền lò bánh mì
          </h1>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-sm font-medium focus:border-brand-500 focus:outline-none"
          />
        </div>
      </header>

      <main className="space-y-4 px-4 py-4">
        {CHANNELS.map((ch) => (
          <ChannelSection
            key={ch.id}
            channel={ch}
            entry={entry}
            onQuantityChange={updateQty}
            onLumpSumChange={updateLump}
          />
        ))}

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
          <label className="mb-2 block text-sm font-semibold text-stone-600">
            Ghi chú
          </label>
          <textarea
            value={entry.note}
            onChange={(e) => setEntry((prev) => ({ ...prev, note: e.target.value }))}
            placeholder="Ví dụ: trời mưa, ít khách..."
            className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            rows={2}
          />
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 text-sm font-medium text-stone-500 underline-offset-2 hover:underline"
          >
            Xóa số liệu ngày này
          </button>
        </section>

        <section>
          <h2 className="mb-2 px-1 text-base font-bold text-stone-700">
            Lịch sử gần đây
          </h2>
          <HistoryList
            entries={history}
            channels={CHANNELS}
            currentDate={date}
            onPick={setDate}
          />
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Tổng doanh thu
            </div>
            <div className="text-2xl font-bold text-brand-700 tabular-nums">
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
            Lưu ngày này
          </button>
        </div>
      </footer>
    </div>
  );
}
