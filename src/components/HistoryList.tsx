import type { Channel, DailyEntry } from '../types';
import { formatVND, grandTotal } from '../lib/pricing';

interface Props {
  entries: DailyEntry[];
  channels: Channel[];
  currentDate: string;
  onPick: (date: string) => void;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function HistoryList({ entries, channels, currentDate, onPick }: Props) {
  if (entries.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-4 text-center text-sm text-stone-500 ring-1 ring-stone-200">
        Chưa có ngày nào được lưu.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
      {entries.slice(0, 14).map((e) => {
        const total = grandTotal(channels, e);
        const isCurrent = e.date === currentDate;
        return (
          <li key={e.date}>
            <button
              type="button"
              onClick={() => onPick(e.date)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left active:bg-stone-50 ${
                isCurrent ? 'bg-brand-50' : ''
              }`}
            >
              <span className="text-base font-semibold text-stone-800">
                {formatDate(e.date)}
              </span>
              <span className="text-base font-bold text-brand-700 tabular-nums">
                {formatVND(total)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
