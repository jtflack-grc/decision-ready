import type { UncertaintyItem } from '../types'
import { deriveResearchPriority } from '../utils/calculations'

interface UncertaintyRegisterProps {
  value: UncertaintyItem[]
  onChange: (next: UncertaintyItem[]) => void
}

const makeItem = (): UncertaintyItem => ({
  id: crypto.randomUUID(),
  keyUncertainty: '',
  uncertaintyType: 'Data gap',
  reducibleByResearch: 'Maybe',
  wouldChangeDecision: 'Maybe',
  researchAction: '',
  owner: '',
  notes: '',
  decisionImpact: 'medium',
  researchEffort: 'medium',
})

export function UncertaintyRegister({ value, onChange }: UncertaintyRegisterProps) {
  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={item.id} className="rounded border border-white/10 bg-black/25 p-3">
          <textarea
            className="w-full rounded border border-white/20 bg-black/30 px-2 py-1"
            rows={2}
            placeholder="Key uncertainty"
            value={item.keyUncertainty}
            onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, keyUncertainty: e.target.value } : v)))}
          />
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <select
              className="rounded border border-white/20 bg-black/30 px-2 py-1"
              value={item.uncertaintyType}
              onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, uncertaintyType: e.target.value as UncertaintyItem['uncertaintyType'] } : v)))}
            >
              <option>Data gap</option><option>SME disagreement</option><option>Future-state change</option><option>Control effectiveness unknown</option>
              <option>Dependency unknown</option><option>Financial impact unknown</option><option>Regulatory uncertainty</option><option>Threat landscape uncertainty</option><option>Recovery assumption</option><option>Other</option>
            </select>
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={item.decisionImpact} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, decisionImpact: e.target.value as UncertaintyItem['decisionImpact'] } : v)))}><option value="low">Decision impact: low</option><option value="medium">Decision impact: medium</option><option value="high">Decision impact: high</option></select>
            <select className="rounded border border-white/20 bg-black/30 px-2 py-1" value={item.researchEffort} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, researchEffort: e.target.value as UncertaintyItem['researchEffort'] } : v)))}><option value="low">Research effort: low</option><option value="medium">Research effort: medium</option><option value="high">Research effort: high</option></select>
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Research action" value={item.researchAction} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, researchAction: e.target.value } : v)))} />
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Owner" value={item.owner} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, owner: e.target.value } : v)))} />
            <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Notes" value={item.notes} onChange={(e) => onChange(value.map((v, i) => (i === index ? { ...v, notes: e.target.value } : v)))} />
          </div>
          <p className="mt-2 inline-block rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-200">
            {deriveResearchPriority(item.decisionImpact, item.researchEffort)}
          </p>
          <button className="mt-2 block rounded border border-red-300/30 px-2 py-1 text-xs text-red-200" type="button" onClick={() => onChange(value.filter((_, i) => i !== index))}>
            Remove uncertainty item
          </button>
        </div>
      ))}
      <button className="rounded border border-emerald-300/40 px-3 py-1 text-sm text-emerald-200" type="button" onClick={() => onChange([...value, makeItem()])}>
        Add uncertainty item
      </button>
    </div>
  )
}
