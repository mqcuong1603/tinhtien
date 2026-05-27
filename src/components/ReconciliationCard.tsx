import type { BreadReconRow } from '../types';

interface Props {
  rows: BreadReconRow[];
}

export function ReconciliationCard({ rows }: Props) {
  const hasAny = rows.some((r) => r.produced > 0 || r.sold > 0);
  const allOk = rows.every((r) => r.diff === 0);

  return (
    <section
      className={`rounded-2xl p-4 shadow-sm ring-1 ${
        !hasAny
          ? 'bg-white ring-stone-200'
          : allOk
            ? 'bg-emerald-50 ring-emerald-200'
            : 'bg-amber-50 ring-amber-300'
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-800">
          🧮 Đối soát số bánh
        </h2>
        {hasAny && (
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              allOk ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {allOk ? '✓ Khớp' : '⚠ Lệch'}
          </span>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2">
        {rows.map(({ bread, produced, sold, diff }) => {
          const ok = diff === 0;
          return (
            <div
              key={bread.id}
              className="rounded-xl bg-white/70 p-2 text-center ring-1 ring-stone-200"
            >
              <div className="text-xs font-semibold text-stone-500">
                {bread.short}
              </div>
              <div className="mt-1 text-xs tabular-nums text-stone-600">
                SX <span className="font-bold text-stone-800">{produced}</span>
              </div>
              <div className="text-xs tabular-nums text-stone-600">
                Bán <span className="font-bold text-stone-800">{sold}</span>
              </div>
              <div
                className={`mt-1 text-sm font-bold tabular-nums ${
                  ok
                    ? 'text-stone-400'
                    : diff > 0
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }`}
              >
                {ok ? '—' : diff > 0 ? `Dư ${diff}` : `Thiếu ${-diff}`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
