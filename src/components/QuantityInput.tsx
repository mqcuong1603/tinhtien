interface Props {
  value: number;
  onChange: (n: number) => void;
  step?: number;
}

export function QuantityInput({ value, onChange, step = 1 }: Props) {
  const dec = () => onChange(Math.max(0, value - step));
  const inc = () => onChange(value + step);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={dec}
        className="h-12 w-12 shrink-0 rounded-full bg-stone-200 text-2xl font-bold text-stone-700 active:bg-stone-300"
        aria-label="Giảm"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) && n >= 0 ? n : 0);
        }}
        onFocus={(e) => e.currentTarget.select()}
        className="h-12 w-20 rounded-lg border border-stone-300 bg-white text-center text-2xl font-semibold tabular-nums focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <button
        type="button"
        onClick={inc}
        className="h-12 w-12 shrink-0 rounded-full bg-brand-500 text-2xl font-bold text-white active:bg-brand-600"
        aria-label="Tăng"
      >
        +
      </button>
    </div>
  );
}
