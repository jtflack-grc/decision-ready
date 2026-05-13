import type { ScenarioCanvas } from '../types'
import { confidenceQualityConflict, rangeChecks, rangeGuidance } from '../utils/calculations'
import { SectionCard } from './SectionCard'
import { FrequencyRange } from './FrequencyRange'
import { MagnitudeRange } from './MagnitudeRange'
import { LossForms } from './LossForms'
import { EvidenceSources } from './EvidenceSources'
import { UncertaintyRegister } from './UncertaintyRegister'
import { TreatmentOptions } from './TreatmentOptions'
import { ExampleLoader } from './ExampleLoader'
import { ExportImport } from './ExportImport'
import { HeatmapTranslator } from './HeatmapTranslator'
import { HelperTip } from './HelperTip'

interface CanvasFormProps {
  canvas: ScenarioCanvas
  setCanvas: (next: ScenarioCanvas) => void
  onReset: () => void
  showGuidance: boolean
}

const domains = ['Legacy systems', 'IBM i / midrange', 'Mainframe', 'Cloud', 'AI governance', 'Third party', 'Identity and access', 'Data governance', 'Resilience / continuity', 'Cybersecurity', 'Privacy', 'Other']
const decisionTypes = ['Fund / invest', 'Accept', 'Mitigate', 'Transfer / insure', 'Avoid', 'Defer', 'Modernize', 'Monitor', 'Escalate', 'Other']
const stakeholders = ['Customers / members', 'Patients', 'Employees', 'Operations', 'Finance', 'Legal / compliance', 'Regulators', 'Vendors', 'Executives', 'Other']
const implicationTemplates: Record<string, string> = {
  Accept:
    'Current evidence supports temporary acceptance with explicit uncertainty carry and review checkpoint.',
  Research:
    'Current evidence is not sufficient for a firm choice; prioritize targeted research before commitment.',
  Mitigate:
    'Exposure is material enough to justify mitigation investment with measurable reduction targets.',
  Escalate:
    'Tail-risk or uncertainty exceeds current tolerance; escalate to executive decision forum.',
}

export function CanvasForm({ canvas, setCanvas, onReset, showGuidance }: CanvasFormProps) {
  const patch = (next: Partial<ScenarioCanvas>) => setCanvas({ ...canvas, ...next, updatedAt: new Date().toISOString() })
  const generatedScenario = `Because ${canvas.event || '[event]'} affects ${canvas.asset || '[asset/process]'}, the organization may experience ${canvas.effect || '[effect]'}, requiring a decision about ${canvas.decisionQuestion || '[decision question]'}.`
  const checks = rangeChecks(canvas)
  const frequencySpread = rangeGuidance(canvas.frequencyRange.p5, canvas.frequencyRange.p95)
  const magnitudeSpread = rangeGuidance(canvas.magnitudeRange.p5, canvas.magnitudeRange.p95)
  const frequencyConfidenceWarning = confidenceQualityConflict(
    canvas.frequencyRange.confidence,
    canvas.frequencyRange.dataQuality,
    canvas.frequencyRange.rationale,
  )
  const magnitudeConfidenceWarning = confidenceQualityConflict(
    canvas.magnitudeRange.confidence,
    canvas.magnitudeRange.dataQuality,
    canvas.magnitudeRange.rationale,
  )

  return (
    <div className="space-y-4">
      <SectionCard
        title="Scope Guardrails"
        subtitle="You can complete every section on your own. Presets below are optional teaching loads, not a prerequisite."
      >
        <p className="text-sm text-slate-200">
          This artifact is a disciplined scenario-framing canvas for decision support. It is not a full CRQ simulation
          engine.
        </p>
        <p className="text-xs text-slate-400">
          Use this to frame scenario, ranges, loss forms, evidence, SME judgment, and communication before advanced
          simulation work.
        </p>
      </SectionCard>
      <SectionCard
        title="Preset Examples"
        subtitle="Skip this block anytime and start in Section I with wording straight from your register or workshop notes."
      >
        <ExampleLoader
          onLoad={(example) => {
            if (canvas.vagueRiskPhrase && !confirm('Load example and replace current inputs?')) return
            setCanvas({ ...example, id: crypto.randomUUID(), updatedAt: new Date().toISOString() })
          }}
        />
      </SectionCard>
      <SectionCard title="Section I: Vague Risk Phrase">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Crawl: Start with vague language"
            content="Use the phrase your organization already uses. Then identify what that phrase hides so you can move from generic concern to a concrete scenario."
          />
        </div> : null}
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={3} placeholder="Legacy platform risk remains elevated." value={canvas.vagueRiskPhrase} onChange={(e) => patch({ vagueRiskPhrase: e.target.value })} />
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={3} placeholder="What does this phrase hide?" value={canvas.insufficientBecause} onChange={(e) => patch({ insufficientBecause: e.target.value })} />
        <select className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" value={canvas.domain} onChange={(e) => patch({ domain: e.target.value })}>
          <option value="">Risk domain</option>{domains.map((domain) => <option key={domain}>{domain}</option>)}
        </select>
      </SectionCard>
      <SectionCard title="Section II: Decision on the Table">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Crawl to walk: Name the decision"
            content="A risk statement is useful only if it supports a real choice. If no decision is named, you are likely documenting motion rather than enabling action."
          />
        </div> : null}
        <select className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" value={canvas.decisionType} onChange={(e) => patch({ decisionType: e.target.value })}>
          <option value="">Decision type</option>{decisionTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={2} placeholder="Decision question" value={canvas.decisionQuestion} onChange={(e) => patch({ decisionQuestion: e.target.value })} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input className="rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Decision owner" value={canvas.decisionOwner} onChange={(e) => patch({ decisionOwner: e.target.value })} />
          <input className="rounded border border-white/20 bg-black/30 px-2 py-1" type="date" value={canvas.decisionDeadline} onChange={(e) => patch({ decisionDeadline: e.target.value })} />
        </div>
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={2} placeholder="Business objective supported" value={canvas.businessObjective} onChange={(e) => patch({ businessObjective: e.target.value })} />
      </SectionCard>
      <SectionCard title="Section III: Scenario Statement Builder">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Walk: Build scenario shape"
            content="Strong scenario framing names the asset, event, and business effect. This is where labels become analyzable exposure."
          />
        </div> : null}
        <input className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Asset / process / capability affected" value={canvas.asset} onChange={(e) => patch({ asset: e.target.value })} />
        <input className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Threat or event" value={canvas.event} onChange={(e) => patch({ event: e.target.value })} />
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={2} placeholder="Effect / business consequence" value={canvas.effect} onChange={(e) => patch({ effect: e.target.value })} />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {stakeholders.map((item) => (
            <label key={item} className="text-xs text-slate-200"><input className="mr-1" type="checkbox" checked={canvas.stakeholders.includes(item)} onChange={(e) => patch({ stakeholders: e.target.checked ? [...canvas.stakeholders, item] : canvas.stakeholders.filter((v) => v !== item) })} />{item}</label>
          ))}
        </div>
        <textarea className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" rows={3} value={canvas.scenarioStatement || generatedScenario} onChange={(e) => patch({ scenarioStatement: e.target.value })} />
      </SectionCard>
      <SectionCard title="Section IV: Frequency Range">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Walk: Frequency as a range"
            content="Use low, typical, and high annual frequencies to represent uncertainty. Avoid a single point estimate unless evidence is very strong."
          />
        </div> : null}
        <FrequencyRange
          value={canvas.frequencyRange}
          onChange={(value) => patch({ frequencyRange: value })}
          orderingWarning={!checks.frequencyOrdered ? 'Frequency must satisfy P5 ≤ P50 ≤ P95.' : null}
          spreadGuidance={frequencySpread}
          confidenceWarning={frequencyConfidenceWarning}
        />
      </SectionCard>
      <SectionCard title="Section V: Magnitude Range">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Walk: Magnitude as a range"
            content="Capture plausible per-event loss bounds. Ranges make assumptions visible and improve decision quality before advanced simulation."
          />
        </div> : null}
        <MagnitudeRange
          value={canvas.magnitudeRange}
          onChange={(value) => patch({ magnitudeRange: value })}
          orderingWarning={!checks.magnitudeOrdered ? 'Magnitude must satisfy P5 ≤ P50 ≤ P95.' : null}
          spreadGuidance={magnitudeSpread}
          confidenceWarning={magnitudeConfidenceWarning}
        />
      </SectionCard>
      <SectionCard title="Section VI: Six Forms of Loss">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Walk: Decompose loss drivers"
            content="Loss forms help avoid underestimating impact. Decomposition also reveals which treatment options reduce likely loss versus tail loss."
          />
        </div> : null}
        <LossForms value={canvas.lossForms} onChange={(value) => patch({ lossForms: value })} mostImportantLossDriver={canvas.mostImportantLossDriver} tailRiskDriver={canvas.tailRiskDriver} onDriverChange={(kind, value) => patch({ [kind]: value })} />
      </SectionCard>
      <SectionCard title="Section VII: Evidence Sources">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Walk: Evidence transparency"
            content="Track internal, external, and SME evidence. Decision-ready analysis should show where estimates come from and how reliable each source is."
          />
        </div> : null}
        <EvidenceSources value={canvas.evidenceSources} onChange={(value) => patch({ evidenceSources: value })} />
      </SectionCard>
      <SectionCard title="Section VIII: Uncertainty Register">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Run prep: Govern uncertainty"
            content="Uncertainty is not failure. Capture what is unknown, whether research can reduce it, and whether resolving it would change the decision."
          />
        </div> : null}
        <UncertaintyRegister value={canvas.uncertaintyItems} onChange={(value) => patch({ uncertaintyItems: value })} />
      </SectionCard>
      <SectionCard title="Section IX: Treatment Options">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Run prep: Compare choices"
            content="The goal is not to prove one control is good. The goal is to compare options and explain which choice best changes exposure for this decision."
          />
        </div> : null}
        <TreatmentOptions value={canvas.treatmentOptions} onChange={(value) => patch({ treatmentOptions: value })} />
      </SectionCard>
      <SectionCard title="Section X: Decision Implication Templates">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {Object.entries(implicationTemplates).map(([label, text]) => (
            <button
              key={label}
              className="rounded border border-white/20 bg-black/30 px-3 py-2 text-left text-sm text-slate-200"
              type="button"
              onClick={() => patch({ recommendation: text })}
            >
              <span className="block text-xs uppercase tracking-[0.15em] text-cyan-300">{label}</span>
              <span className="mt-1 block">{text}</span>
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded border border-white/20 bg-black/30 px-2 py-1"
          rows={3}
          placeholder="Recommended next step"
          value={canvas.recommendation}
          onChange={(e) => patch({ recommendation: e.target.value })}
        />
      </SectionCard>
      <SectionCard title="Section XI: Heatmap Translation, but Better">
        {showGuidance ? <div className="flex items-center gap-2">
          <HelperTip
            title="Visual hook: move past colors"
            content="Use this translator to convert a legacy heatmap label into scenario-based decision language with ranges and evidence."
          />
        </div> : null}
        <input className="w-full rounded border border-white/20 bg-black/30 px-2 py-1" placeholder="Existing heatmap rating" value={canvas.legacyHeatmapRating} onChange={(e) => patch({ legacyHeatmapRating: e.target.value })} />
        <HeatmapTranslator canvas={canvas} onPatch={patch} />
      </SectionCard>
      <SectionCard title="Actions">
        <ExportImport canvas={canvas} onImport={setCanvas} onPrint={() => window.print()} />
        <button className="rounded border border-red-300/40 px-3 py-1 text-sm text-red-200" type="button" onClick={onReset}>Reset canvas</button>
      </SectionCard>
      <SectionCard title="Review Signoff">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            className="rounded border border-white/20 bg-black/30 px-2 py-1"
            placeholder="Reviewer"
            value={canvas.reviewer ?? ''}
            onChange={(e) => patch({ reviewer: e.target.value })}
          />
          <input
            className="rounded border border-white/20 bg-black/30 px-2 py-1"
            type="date"
            value={canvas.reviewDate ?? ''}
            onChange={(e) => patch({ reviewDate: e.target.value })}
          />
        </div>
        <textarea
          className="w-full rounded border border-white/20 bg-black/30 px-2 py-1"
          rows={2}
          placeholder="Signoff notes and unresolved high-impact uncertainties"
          value={canvas.reviewSignoffNotes ?? ''}
          onChange={(e) => patch({ reviewSignoffNotes: e.target.value })}
        />
      </SectionCard>
    </div>
  )
}
