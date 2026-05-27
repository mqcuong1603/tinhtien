import type { ShiftSlot } from '../types';
import { shiftLabel } from '../lib/pricing';

interface Props {
  date: string;
  slot: ShiftSlot;
  onDateChange: (d: string) => void;
  onSlotChange: (s: ShiftSlot) => void;
}

export function ShiftPicker({ date, slot, onDateChange, onSlotChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-sm font-medium focus:border-brand-500 focus:outline-none"
      />
      <div className="inline-flex overflow-hidden rounded-lg border border-stone-300">
        {(['sang', 'chieu'] as ShiftSlot[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSlotChange(s)}
            className={`px-3 py-1 text-sm font-semibold ${
              slot === s
                ? 'bg-brand-500 text-white'
                : 'bg-white text-stone-700 active:bg-stone-100'
            }`}
          >
            {shiftLabel(s)}
          </button>
        ))}
      </div>
    </div>
  );
}
