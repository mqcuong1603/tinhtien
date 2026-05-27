interface Props {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}

export function MoneyInput({ label, value, onChange, hint }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {hint && <span className="ml-1 text-xs text-stone-400">({hint})</span>}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value || ''}
          placeholder="0"
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) && n >= 0 ? n : 0);
          }}
          onFocus={(e) => e.currentTarget.select()}
          className="h-12 flex-1 rounded-lg border border-stone-300 bg-white px-3 text-right text-xl font-semibold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <span className="text-base font-semibold text-stone-500">đ</span>
      </div>
    </label>
  );
}
