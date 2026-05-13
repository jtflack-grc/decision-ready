import type { TreatmentOption } from '../types'

interface TreatmentOptionsProps {
  value: TreatmentOption[]
  onChange: (next: TreatmentOption[]) => void
}

const makeOption = (): TreatmentOption => ({
  id: crypto.randomUUID(),
  optionName: '',
  category: 'Mitigate',
  estimatedCost: null,
  expectedEffect: 'Reduces frequency',
  narrativeNotes: '',
  implementationDifficulty: 'medium',
  timeHorizon: '0-3 months',
  confidence: 'medium',
})

export function TreatmentOptions({ value, onChange }: TreatmentOptionsProps) {
  return (
    <div className="space-y-3">
      {value.map((option, index) => (
        <div key={option.id} className="rounded border border-white/10 bg-black/25 p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Option name" value={option.optionName} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, optionName: e.target.value } : v)))} />
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={option.category} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, category: e.target.value as TreatmentOption['category'] } : v)))}><option>Accept</option><option>Mitigate</option><option>Transfer</option><option>Avoid</option><option>Defer</option><option>Modernize</option><option>Monitor</option><option>Other</option></select>
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" type="number" placeholder="Estimated cost" value={option.estimatedCost ?? ''} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, estimatedCost: e.target.value === '' ? null : Number(e.target.value) } : v)))} />
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1 md:col-span-2" value={option.expectedEffect} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, expectedEffect: e.target.value as TreatmentOption['expectedEffect'] } : v)))}><option>Reduces frequency</option><option>Reduces magnitude</option><option>Reduces tail risk</option><option>Improves evidence</option><option>Improves recovery</option><option>Transfers financial loss</option><option>Does not materially reduce exposure</option></select>
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Narrative notes" value={option.narrativeNotes} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, narrativeNotes: e.target.value } : v)))} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={option.implementationDifficulty} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, implementationDifficulty: e.target.value as TreatmentOption['implementationDifficulty'] } : v)))}><option value="low">Difficulty: low</option><option value="medium">Difficulty: medium</option><option value="high">Difficulty: high</option></select>
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={option.timeHorizon} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, timeHorizon: e.target.value as TreatmentOption['timeHorizon'] } : v)))}><option>Immediate</option><option>0-3 months</option><option>3-6 months</option><option>6-12 months</option><option>12+ months</option></select>
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={option.confidence} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, confidence: e.target.value as TreatmentOption['confidence'] } : v)))}><option value="low">Confidence: low</option><option value="medium">Confidence: medium</option><option value="high">Confidence: high</option></select>
          </div>
          <button className="mt-2 rounded border border-red-300/30 px-2 py-1 text-xs text-red-200" type="button" onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove option</button>
        </div>
      ))}
      <button className="rounded border border-emerald-300/40 px-3 py-1 text-sm text-emerald-200" type="button" onClick={() => onChange([...value, makeOption()])}>
        Add treatment option
      </button>
    </div>
  )
}
