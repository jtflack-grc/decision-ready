import type { EvidenceItem } from '../types'

interface EvidenceSourcesProps {
  value: EvidenceItem[]
  onChange: (next: EvidenceItem[]) => void
}

const newEvidence = (): EvidenceItem => ({
  id: crypto.randomUUID(),
  sourceType: 'internal',
  sourceName: '',
  supports: 'frequency',
  quality: 'moderate',
  notes: '',
  sourceDate: '',
  basisOfEstimate: '',
  smeRole: '',
})

export function EvidenceSources({ value, onChange }: EvidenceSourcesProps) {
  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={item.id} className="rounded border border-white/10 bg-black/25 p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <select
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              value={item.sourceType}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, sourceType: e.target.value as EvidenceItem['sourceType'] } : v)))}
            >
              <option value="internal">Internal data</option>
              <option value="external">External data</option>
              <option value="sme">SME judgment</option>
            </select>
            <input
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              placeholder="Source name"
              value={item.sourceName}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, sourceName: e.target.value } : v)))}
            />
            <select
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              value={item.supports}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, supports: e.target.value as EvidenceItem['supports'] } : v)))}
            >
              <option>frequency</option>
              <option>magnitude</option>
              <option>control condition</option>
              <option>scenario plausibility</option>
              <option>treatment option</option>
            </select>
            <select
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              value={item.quality}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, quality: e.target.value as EvidenceItem['quality'] } : v)))}
            >
              <option value="weak">Weak</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
            <input
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              type="date"
              value={item.sourceDate ?? ''}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, sourceDate: e.target.value } : v)))}
            />
            <input
              className="rounded border border-white/20 bg-black/30 px-2 py-1 md:col-span-2"
              placeholder="Notes"
              value={item.notes}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, notes: e.target.value } : v)))}
            />
            <input
              className="rounded border border-white/20 bg-black/30 px-2 py-1 md:col-span-2"
              placeholder="Basis of estimate"
              value={item.basisOfEstimate ?? ''}
              onChange={(e) =>
                onChange(value.map((v, i) => (i === index ? { ...v, basisOfEstimate: e.target.value } : v)))
              }
            />
            {item.sourceType === 'sme' ? (
              <input
                className="rounded border border-white/20 bg-black/30 px-2 py-1"
                placeholder="SME role"
                value={item.smeRole ?? ''}
                onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, smeRole: e.target.value } : v)))}
              />
            ) : null}
          </div>
          <button
            className="mt-2 rounded border border-red-300/30 px-2 py-1 text-xs text-red-200"
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            Remove evidence item
          </button>
        </div>
      ))}
      <button className="rounded border border-emerald-300/40 px-3 py-1 text-sm text-emerald-200" type="button" onClick={() => onChange([...value, newEvidence()])}>
        Add evidence item
      </button>
    </div>
  )
}
