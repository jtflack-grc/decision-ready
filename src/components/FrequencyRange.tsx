import type { FrequencyRange as FrequencyRangeType } from '../types'
import { annualFrequencyFromYears } from '../utils/calculations'

interface FrequencyRangeProps {
  value: FrequencyRangeType
  onChange: (next: FrequencyRangeType) => void
  orderingWarning?: string | null
  spreadGuidance?: string | null
  confidenceWarning?: string | null
}

export function FrequencyRange({ value, onChange, orderingWarning, spreadGuidance, confidenceWarning }: FrequencyRangeProps) {
  const max = value.p95 && value.p95 > 0 ? value.p95 : 1
  const pos = (n: number | null) => (n == null ? 0 : Math.min(100, Math.max(0, (n / max) * 100)))

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-cyan-300/25 bg-cyan-500/5 p-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Uncertainty Shape (Frequency)</p>
        <div className="relative mt-2 h-3 rounded-full bg-white/10">
          {value.p5 != null && value.p95 != null ? (
            <div
              className="absolute top-0 h-3 rounded-full bg-cyan-400/50"
              style={{ left: `${pos(value.p5)}%`, width: `${Math.max(2, pos(value.p95) - pos(value.p5))}%` }}
            />
          ) : null}
          {value.p50 != null ? (
            <div className="absolute top-[-3px] h-5 w-[2px] bg-cyan-200" style={{ left: `${pos(value.p50)}%` }} />
          ) : null}
        </div>
        <div className="mt-2 grid grid-cols-3 text-[11px] text-slate-300">
          <p>P5: {value.p5 ?? 'N/A'}</p>
          <p className="text-center">P50: {value.p50 ?? 'N/A'}</p>
          <p className="text-right">P95: {value.p95 ?? 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {(['p5', 'p50', 'p95'] as const).map((key) => (
          <label key={key} className="text-sm text-slate-200">
            {key.toUpperCase()} per year
            <input
              className="mt-1 w-full rounded border border-white/20 bg-black/30 px-2 py-1"
              type="number"
              step="0.01"
              value={value[key] ?? ''}
              onChange={(e) => onChange({ ...value, [key]: e.target.value === '' ? null : Number(e.target.value) })}
            />
          </label>
        ))}
      </div>
      <p className="text-xs text-slate-400">Use annualized frequency. Once every 5 years = 0.20 per year.</p>
      <label className="text-sm text-slate-200">
        Helper calculator: once every __ years
        <input
          className="mt-1 w-full rounded border border-white/20 bg-black/30 px-2 py-1"
          type="number"
          min="0.01"
          onChange={(e) => {
            const frequency = annualFrequencyFromYears(Number(e.target.value))
            if (frequency != null) onChange({ ...value, p50: Number(frequency.toFixed(2)) })
          }}
        />
      </label>
      <textarea
        className="w-full rounded border border-white/20 bg-black/30 px-2 py-1 text-sm"
        rows={3}
        placeholder="Why is this range plausible?"
        value={value.rationale}
        onChange={(e) => onChange({ ...value, rationale: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          className="rounded border border-white/20 bg-black/30 px-2 py-1"
          value={value.confidence}
          onChange={(e) => onChange({ ...value, confidence: e.target.value as FrequencyRangeType['confidence'] })}
        >
          <option value="">Confidence</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="rounded border border-white/20 bg-black/30 px-2 py-1"
          value={value.dataQuality}
          onChange={(e) => onChange({ ...value, dataQuality: e.target.value as FrequencyRangeType['dataQuality'] })}
        >
          <option value="">Data quality</option>
          <option value="weak">Weak</option>
          <option value="moderate">Moderate</option>
          <option value="strong">Strong</option>
        </select>
      </div>
      {orderingWarning ? <p className="text-xs text-amber-300">{orderingWarning}</p> : null}
      {spreadGuidance ? <p className="text-xs text-cyan-300">{spreadGuidance}</p> : null}
      {confidenceWarning ? <p className="text-xs text-amber-300">{confidenceWarning}</p> : null}
    </div>
  )
}
