import type { BreadDef } from '../types';
import { formatVND } from '../lib/pricing';
import { QuantityInput } from './QuantityInput';

interface Props {
  bread: BreadDef;
  qty: number;
  price?: number;
  onChange: (n: number) => void;
}

export function BreadRow({ bread, qty, price, onChange }: Props) {
  const lineTotal = price != null ? qty * price : 0;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-stone-50 p-3">
      <div className="min-w-[120px] flex-1">
        <div className="text-base font-semibold text-stone-800">{bread.name}</div>
        {price != null && (
          <div className="text-sm tabular-nums text-stone-500">
            {formatVND(price)} / cái
          </div>
        )}
      </div>
      <QuantityInput value={qty} onChange={onChange} />
      {price != null && (
        <div className="w-full text-right text-base font-bold tabular-nums text-stone-700 sm:w-24">
          {lineTotal > 0 ? formatVND(lineTotal) : '—'}
        </div>
      )}
    </div>
  );
}
