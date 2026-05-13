import type { MagnitudeRange as MagnitudeRangeType } from '../types'
import { toCurrency } from '../utils/calculations'

interface MagnitudeRangeProps {
  value: MagnitudeRangeType
  onChange: (next: MagnitudeRangeType) => void
  orderingWarning?: string | null
  spreadGuidance?: string | null
  confidenceWarning?: string | null
}

export function MagnitudeRange({
  value,
  onChange,
  orderingWarning,
  spreadGuidance,
  confidenceWarning,
}: MagnitudeRangeProps) {
  const max = value.p95 && value.p95 > 0 ? value.p95 : 1
  const pos = (n: number | null) => (n == null ? 0 : Math.min(100, Math.max(0, (n / max) * 100)))

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-blue-300/25 bg-blue-500/5 p-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-blue-300">Uncertainty Shape (Magnitude)</p>
        <div className="relative mt-2 h-3 rounded-full bg-white/10">
          {value.p5 != null && value.p95 != null ? (
            <div
              className="absolute top-0 h-3 rounded-full bg-blue-400/50"
              style={{ left: `${pos(value.p5)}%`, width: `${Math.max(2, pos(value.p95) - pos(value.p5))}%` }}
            />
          ) : null}
          {value.p50 != null ? (
            <div className="absolute top-[-3px] h-5 w-[2px] bg-blue-200" style={{ left: `${pos(value.p50)}%` }} />
          ) : null}
        </div>
        <div className="mt-2 grid grid-cols-3 text-[11px] text-slate-300">
          <p>P5: {toCurrency(value.p5)}</p>
          <p className="text-center">P50: {toCurrency(value.p50)}</p>
          <p className="text-right">P95: {toCurrency(value.p95)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {(['p5', 'p50', 'p95'] as const).map((key) => (
          <label key={key} className="text-sm text-slate-200">
            {key.toUpperCase()} loss
            <input
              className="mt-1 w-full rounded border border-white/20 bg-black/30 px-2 py-1"
              type="number"
              step="1000"
              value={value[key] ?? ''}
              onChange={(e) => onChange({ ...value, [key]: e.target.value === '' ? null : Number(e.target.value) })}
            />
            <span className="mt-1 block text-xs text-slate-400">{toCurrency(value[key])}</span>
          </label>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={value.unknownDollarValues}
          onChange={(e) => onChange({ ...value, unknownDollarValues: e.target.checked })}
        />
        I do not have dollar values yet
      </label>
      {value.unknownDollarValues ? (
        <p className="text-xs text-slate-400">
          Estimate drivers first: downtime hours, response labor, replacement cost, penalties, customer impact, lost
          revenue, and vendor cost.
        </p>
      ) : null}
      <textarea
        className="w-full rounded border border-white/20 bg-black/30 px-2 py-1 text-sm"
        rows={3}
        placeholder="Magnitude rationale"
        value={value.rationale}
        onChange={(e) => onChange({ ...value, rationale: e.target.value })}
      />
      {orderingWarning ? <p className="text-xs text-amber-300">{orderingWarning}</p> : null}
      {spreadGuidance ? <p className="text-xs text-cyan-300">{spreadGuidance}</p> : null}
      {confidenceWarning ? <p className="text-xs text-amber-300">{confidenceWarning}</p> : null}
    </div>
  )
}
