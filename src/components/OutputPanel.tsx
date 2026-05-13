import type { ScenarioCanvas } from '../types'
import {
  confidenceQualityConflict,
  decisionReadinessBadge,
  decisionReadinessChecklist,
  evidenceCounts,
  evidenceQualitySummary,
  hasEvidenceDiversity,
  rangeChecks,
  recencyBuckets,
  roughExposure,
  scenarioClarityBadge,
  scenarioClarityChecklist,
  topResearchPriorities,
  toCurrency,
} from '../utils/calculations'
import { generateSummary, generateWorkingNotes } from '../utils/summaryGenerator'
import { DecisionSummary } from './DecisionSummary'
import { HelperTip } from './HelperTip'
import { SectionCard } from './SectionCard'

interface OutputPanelProps {
  canvas: ScenarioCanvas
  onManualSummaryOverrideChange: (value: string) => void
  onSummaryModeChange: (mode: 'executive' | 'working') => void
  showGuidance: boolean
}

export function OutputPanel({ canvas, onManualSummaryOverrideChange, onSummaryModeChange, showGuidance }: OutputPanelProps) {
  const exposures = roughExposure(canvas)
  const counts = evidenceCounts(canvas.evidenceSources)
  const generated = generateSummary(canvas)
  const workingNotes = generateWorkingNotes(canvas)
  const rangeState = rangeChecks(canvas)
  const recency = recencyBuckets(canvas.evidenceSources)
  const priorities = topResearchPriorities(canvas)
  const confidenceConflict =
    confidenceQualityConflict(canvas.frequencyRange.confidence, canvas.frequencyRange.dataQuality, canvas.frequencyRange.rationale) ??
    confidenceQualityConflict(canvas.magnitudeRange.confidence, canvas.magnitudeRange.dataQuality, canvas.magnitudeRange.rationale)
  const maxBar = Math.max(exposures.typical || 0, exposures.high || 0, ...canvas.treatmentOptions.map((item) => item.estimatedCost || 0), 1)

  return (
    <aside className="sticky top-3 h-fit space-y-4">
      <SectionCard title="Decision-Ready Output">
        {showGuidance ? <HelperTip
          title="How to read this panel"
          content="This panel communicates analysis quality and decision support readiness. It does not represent full simulation outputs."
        /> : null}
        <p className="text-sm text-slate-300">
          The heatmap rating is a label. The scenario canvas is the analysis.
        </p>
        <p className="mt-2 text-xs text-amber-200">
          This tool is a scenario-framing aid, not a full CRQ simulation engine.
        </p>
      </SectionCard>
      <SectionCard title="Badges">
        <p className="text-sm text-white">Scenario clarity: {scenarioClarityBadge(canvas)}</p>
        <p className="text-sm text-white">Evidence maturity: {evidenceQualitySummary(canvas.evidenceSources)}</p>
        <p className="text-sm text-white">Decision readiness: {decisionReadinessBadge(canvas)}</p>
      </SectionCard>
      <SectionCard title="Checklist transparency">
        {[...scenarioClarityChecklist(canvas), ...decisionReadinessChecklist(canvas)].map((item, index) => (
          <p key={`${index}-${item.label}`} className={`text-xs ${item.met ? 'text-emerald-300' : 'text-slate-400'}`}>
            {item.met ? '✓' : '○'} {item.label}
          </p>
        ))}
      </SectionCard>
      <SectionCard title="Quality Flags">
        <p className={`text-xs ${rangeState.frequencyOrdered ? 'text-emerald-300' : 'text-amber-300'}`}>
          Frequency range ordering: {rangeState.frequencyOrdered ? 'coherent' : 'needs correction'}
        </p>
        <p className={`text-xs ${rangeState.magnitudeOrdered ? 'text-emerald-300' : 'text-amber-300'}`}>
          Magnitude range ordering: {rangeState.magnitudeOrdered ? 'coherent' : 'needs correction'}
        </p>
        <p className={`text-xs ${hasEvidenceDiversity(canvas.evidenceSources) ? 'text-emerald-300' : 'text-amber-300'}`}>
          Evidence diversity (internal + external/SME): {hasEvidenceDiversity(canvas.evidenceSources) ? 'met' : 'not met'}
        </p>
        {confidenceConflict ? <p className="text-xs text-amber-300">{confidenceConflict}</p> : null}
      </SectionCard>
      <SectionCard title="Rough Exposure">
        <p className="text-sm text-slate-200">Low rough annual exposure: {toCurrency(exposures.low)}</p>
        <p className="text-sm text-slate-200">Typical rough annual exposure: {toCurrency(exposures.typical)}</p>
        <p className="text-sm text-slate-200">High rough annual exposure: {toCurrency(exposures.high)}</p>
        <p className="text-xs text-slate-400">
          Endpoint multiplication is a rough orientation only and does not replace Monte Carlo simulation.
        </p>
        <div className="space-y-2 pt-2">
          {[{ label: 'Typical rough exposure', value: exposures.typical || 0 }, { label: 'High rough exposure', value: exposures.high || 0 }, ...canvas.treatmentOptions.map((item) => ({ label: `${item.optionName || 'Treatment'} cost`, value: item.estimatedCost || 0 }))].map((bar, index) => (
            <div key={`${bar.label}-${index}`}>
              <p className="text-xs text-slate-300">{bar.label}</p>
              <div className="h-2 w-full rounded bg-white/10">
                <div className="h-2 rounded bg-cyan-400" style={{ width: `${(bar.value / maxBar) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Evidence Snapshot">
        <p className="text-sm text-slate-200">Internal: {counts.internal}</p>
        <p className="text-sm text-slate-200">External: {counts.external}</p>
        <p className="text-sm text-slate-200">SME: {counts.sme}</p>
        <p className="text-xs text-slate-400">
          Source recency: {recency.recent} in past 24 months, {recency.staleOrUnknown} stale/unknown
        </p>
      </SectionCard>
      <SectionCard title="Top Research Priorities">
        {priorities.length === 0 ? (
          <p className="text-xs text-slate-400">Add uncertainty items to generate prioritized research actions.</p>
        ) : (
          priorities.map((item) => (
            <p key={item.id} className="text-xs text-slate-200">
              {item.keyUncertainty || 'Unspecified uncertainty'} - {item.researchAction || 'Define research action'}
            </p>
          ))
        )}
      </SectionCard>
      <SectionCard title="Revision and Signoff">
        <p className="text-xs text-slate-300">Reviewer: {canvas.reviewer || 'Unassigned'}</p>
        <p className="text-xs text-slate-300">Review date: {canvas.reviewDate || 'Not scheduled'}</p>
        <p className="text-xs text-slate-400">{canvas.reviewSignoffNotes || 'No signoff notes yet.'}</p>
        <p className="pt-1 text-xs text-slate-400">
          Recent revisions tracked locally: {(canvas.revisionHistory ?? []).length}
        </p>
      </SectionCard>
      <SectionCard title="Executive Summary">
        <DecisionSummary
          generatedSummary={generated}
          workingNotes={workingNotes}
          mode={canvas.summaryMode ?? 'executive'}
          onModeChange={onSummaryModeChange}
          manualSummaryOverride={canvas.manualSummaryOverride}
          onManualSummaryOverrideChange={onManualSummaryOverrideChange}
          onCopy={() =>
            navigator.clipboard.writeText(canvas.manualSummaryOverride || (canvas.summaryMode === 'working' ? workingNotes : generated))
          }
        />
      </SectionCard>
    </aside>
  )
}
