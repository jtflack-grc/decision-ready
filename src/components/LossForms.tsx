import { lossFormCatalog } from '../utils/exampleScenarios'
import type { LossFormEntry } from '../types'

interface LossFormsProps {
  value: LossFormEntry[]
  mostImportantLossDriver: string
  tailRiskDriver: string
  onChange: (next: LossFormEntry[]) => void
  onDriverChange: (kind: 'mostImportantLossDriver' | 'tailRiskDriver', value: string) => void
}

export function LossForms({ value, mostImportantLossDriver, tailRiskDriver, onChange, onDriverChange }: LossFormsProps) {
  return (
    <div className="space-y-3">
      {tailRiskDriver ? (
        <div className="rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-fuchsia-200">Tail Driver Spotlight</p>
          <p className="mt-1 text-sm text-slate-100">
            Severe outcomes are currently driven by: <span className="font-semibold text-fuchsia-200">{tailRiskDriver}</span>
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Use treatment options to test whether this driver is reduced or merely re-labeled.
          </p>
        </div>
      ) : null}
      {value.map((entry, index) => (
        <div
          key={entry.id}
          className={`rounded border p-3 ${
            tailRiskDriver === entry.type
              ? 'border-fuchsia-300/50 bg-fuchsia-500/10 shadow-[0_0_24px_rgba(217,70,239,0.16)]'
              : 'border-white/10 bg-black/25'
          }`}
        >
          <label className="flex items-center gap-2 text-slate-200">
            <input
              type="checkbox"
              checked={entry.selected}
              onChange={(e) => onChange(value.map((item, i) => (i === index ? { ...item, selected: e.target.checked } : item)))}
            />
            <span className="font-medium">{entry.type}</span>
          </label>
          <p className="mt-1 text-xs text-slate-400">{lossFormCatalog.find((item) => item.type === entry.type)?.description}</p>
          {entry.selected ? (
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {(['low', 'typical', 'high'] as const).map((k) => (
                <input
                  key={k}
                  className="rounded border border-white/20 bg-black/30 px-2 py-1"
                  type="number"
                  placeholder={`${k} estimate`}
                  value={entry[k] ?? ''}
                  onChange={(e) =>
                    onChange(
                      value.map((item, i) =>
                        i === index ? { ...item, [k]: e.target.value === '' ? null : Number(e.target.value) } : item,
                      ),
                    )
                  }
                />
              ))}
              <input
                className="rounded border border-white/20 bg-black/30 px-2 py-1"
                placeholder="Evidence source"
                value={entry.evidenceSource}
                onChange={(e) => onChange(value.map((item, i) => (i === index ? { ...item, evidenceSource: e.target.value } : item)))}
              />
              <textarea
                className="rounded border border-white/20 bg-black/30 px-2 py-1"
                placeholder="Notes / rationale"
                value={entry.notes}
                onChange={(e) => onChange(value.map((item, i) => (i === index ? { ...item, notes: e.target.value } : item)))}
              />
            </div>
          ) : null}
        </div>
      ))}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <select
          className="rounded border border-white/20 bg-black/30 px-2 py-1"
          value={mostImportantLossDriver}
          onChange={(e) => onDriverChange('mostImportantLossDriver', e.target.value)}
        >
          <option value="">Most important loss driver</option>
          {value.filter((item) => item.selected).map((item) => <option key={item.id}>{item.type}</option>)}
        </select>
        <select
          className="rounded border border-white/20 bg-black/30 px-2 py-1"
          value={tailRiskDriver}
          onChange={(e) => onDriverChange('tailRiskDriver', e.target.value)}
        >
          <option value="">Tail-risk driver</option>
          {value.filter((item) => item.selected).map((item) => <option key={item.id}>{item.type}</option>)}
        </select>
      </div>
    </div>
  )
}
