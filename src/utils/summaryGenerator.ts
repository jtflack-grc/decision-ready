import type { ScenarioCanvas } from '../types'
import { evidenceCounts, evidenceQualitySummary } from './calculations'

const formatNum = (value: number | null) => (value == null ? 'N/A' : value.toLocaleString())
const formatMoney = (value: number | null) =>
  value == null ? 'N/A' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export const generateSummary = (canvas: ScenarioCanvas): string => {
  if (canvas.manualSummaryOverride.trim()) return canvas.manualSummaryOverride

  const counts = evidenceCounts(canvas.evidenceSources)
  const quality = evidenceQualitySummary(canvas.evidenceSources)
  const selectedLosses = canvas.lossForms.filter((item) => item.selected).map((item) => item.type)
  const implication = canvas.recommendation.trim()
    ? canvas.recommendation
    : canvas.treatmentOptions.length > 0
      ? 'Current evidence indicates decision options are actionable; select the option aligned to business objective and implementation constraints.'
      : 'Current evidence is directional; add treatment options or targeted research before final approval.'

  return `Starting phrase: ${canvas.vagueRiskPhrase || 'N/A'}

Decision supported: ${canvas.decisionQuestion || 'N/A'}

Scenario: ${canvas.scenarioStatement || 'N/A'}

Current exposure: Based on available evidence, this scenario is estimated to occur between ${formatNum(canvas.frequencyRange.p5)} and ${formatNum(canvas.frequencyRange.p95)} times per year, with a typical estimate of ${formatNum(canvas.frequencyRange.p50)}. If it occurs, plausible per-event loss ranges from ${formatMoney(canvas.magnitudeRange.p5)} to ${formatMoney(canvas.magnitudeRange.p95)}, with a typical estimate of ${formatMoney(canvas.magnitudeRange.p50)}.

Primary loss drivers: ${selectedLosses.length ? selectedLosses.join(', ') : 'N/A'}

Evidence base: This estimate is supported by ${counts.internal} internal sources, ${counts.external} external sources, and ${counts.sme} SME inputs. Evidence quality is currently ${quality}.

Decision implication: ${implication}

Recommended next step: ${canvas.recommendation || 'Select a treatment option or assign a targeted research action.'}`
}

export const generateWorkingNotes = (canvas: ScenarioCanvas): string => {
  const counts = evidenceCounts(canvas.evidenceSources)
  const quality = evidenceQualitySummary(canvas.evidenceSources)
  const uncertainties = canvas.uncertaintyItems.map((item, idx) => `${idx + 1}. ${item.keyUncertainty || 'Unspecified'} (${item.uncertaintyType})`).join('\n')
  const assumptions = canvas.evidenceSources
    .map((item, idx) => `${idx + 1}. ${item.sourceName || 'Unnamed source'} - basis: ${item.basisOfEstimate || 'Not provided'}`)
    .join('\n')

  return `Working Notes

Decision question: ${canvas.decisionQuestion || 'N/A'}
Scenario statement: ${canvas.scenarioStatement || 'N/A'}

Assumption log:
${assumptions || 'No assumptions recorded yet.'}

Uncertainty register:
${uncertainties || 'No uncertainty items documented yet.'}

Evidence mix: internal=${counts.internal}, external=${counts.external}, sme=${counts.sme}
Evidence quality: ${quality}

Recommended action track: ${canvas.recommendation || 'Not yet set'}
`
}
