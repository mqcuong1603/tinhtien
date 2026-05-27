import type { CashSummary } from '../lib/pricing';
import { formatVND } from '../lib/pricing';
import { MoneyInput } from './MoneyInput';

interface Props {
  summary: CashSummary;
  onChangeIn: (n: number) => void;
  onChangeOut: (n: number) => void;
  onBankTransfer: (n: number) => void;
  onCashTaken: (n: number) => void;
}

export function CashReconCard({
  summary,
  onChangeIn,
  onChangeOut,
  onBankTransfer,
  onCashTaken,
}: Props) {
  const { expected, actual, variance } = summary;
  const ok = variance === 0;
  const noData = expected === 0 && actual === 0;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <header className="mb-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-800">
          <span className="text-2xl">💰</span>
          Cân đối tiền cuối ca
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <MoneyInput
          label="Thối đầu ca"
          hint="nhận từ ca trước"
          value={summary.changeIn}
          onChange={onChangeIn}
        />
        <MoneyInput
          label="Để thối ca sau"
          hint="chừa lại trong két"
          value={summary.changeOut}
          onChange={onChangeOut}
        />
        <MoneyInput
          label="Chuyển khoản"
          hint="khách CK"
          value={summary.bankTransfer}
          onChange={onBankTransfer}
        />
        <MoneyInput
          label="Tiền đem về"
          hint="đếm tiền mặt"
          value={summary.cashTaken}
          onChange={onCashTaken}
        />
      </div>

      <div className="mt-4 space-y-1 rounded-xl bg-stone-50 p-3 text-sm">
        <Row label="Tổng tiền bánh" value={summary.bread} />
        {summary.changeIn > 0 && (
          <Row label="+ Thối đầu ca" value={summary.changeIn} />
        )}
        {summary.plus > 0 && <Row label="+ Cộng" value={summary.plus} />}
        {summary.minus > 0 && (
          <Row label="− Trừ" value={-summary.minus} />
        )}
        <Row label="= Tổng dự kiến" value={expected} bold />
      </div>

      <div className="mt-2 space-y-1 rounded-xl bg-stone-50 p-3 text-sm">
        <Row label="Tiền đem về" value={summary.cashTaken} />
        <Row label="+ Để thối" value={summary.changeOut} />
        <Row label="+ Chuyển khoản" value={summary.bankTransfer} />
        <Row label="= Tổng thực tế" value={actual} bold />
      </div>

      <div
        className={`mt-3 flex items-center justify-between rounded-xl p-3 ring-1 ${
          noData
            ? 'bg-stone-50 ring-stone-200'
            : ok
              ? 'bg-emerald-50 ring-emerald-200'
              : 'bg-rose-50 ring-rose-200'
        }`}
      >
        <span className="text-base font-bold text-stone-800">
          {variance > 0 ? 'Thất thoát' : variance < 0 ? 'Dư so với dự kiến' : 'Khớp'}
        </span>
        <span
          className={`text-xl font-bold tabular-nums ${
            noData
              ? 'text-stone-400'
              : ok
                ? 'text-emerald-700'
                : variance > 0
                  ? 'text-rose-700'
                  : 'text-amber-700'
          }`}
        >
          {noData ? '—' : variance === 0 ? '✓ 0đ' : formatVND(Math.abs(variance))}
        </span>
      </div>
    </section>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-bold text-stone-800' : 'text-stone-600'}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-bold text-stone-900' : 'text-stone-700'}`}
      >
        {formatVND(value)}
      </span>
    </div>
  );
}
