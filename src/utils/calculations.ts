import type { EvidenceItem, ScenarioCanvas } from '../types'

export const annualFrequencyFromYears = (years: number): number | null => {
  if (!Number.isFinite(years) || years <= 0) {
    return null
  }
  return 1 / years
}

export const toCurrency = (value: number | null | undefined): string =>
  value == null || Number.isNaN(value)
    ? 'N/A'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export const roughExposure = (canvas: ScenarioCanvas) => ({
  low:
    canvas.frequencyRange.p5 != null && canvas.magnitudeRange.p5 != null
      ? canvas.frequencyRange.p5 * canvas.magnitudeRange.p5
      : null,
  typical:
    canvas.frequencyRange.p50 != null && canvas.magnitudeRange.p50 != null
      ? canvas.frequencyRange.p50 * canvas.magnitudeRange.p50
      : null,
  high:
    canvas.frequencyRange.p95 != null && canvas.magnitudeRange.p95 != null
      ? canvas.frequencyRange.p95 * canvas.magnitudeRange.p95
      : null,
})

export const deriveResearchPriority = (decisionImpact: string, researchEffort: string): string => {
  if (decisionImpact === 'high' && researchEffort === 'low') return 'Research now'
  if (decisionImpact === 'high' && researchEffort === 'high') return 'Consider targeted research'
  return 'Carry uncertainty'
}

export const evidenceCounts = (items: EvidenceItem[]) => ({
  internal: items.filter((item) => item.sourceType === 'internal').length,
  external: items.filter((item) => item.sourceType === 'external').length,
  sme: items.filter((item) => item.sourceType === 'sme').length,
})

export const hasEvidenceDiversity = (items: EvidenceItem[]): boolean => {
  const counts = evidenceCounts(items)
  return counts.internal >= 1 && (counts.external >= 1 || counts.sme >= 1)
}

export const recencyBuckets = (items: EvidenceItem[]) => {
  const now = new Date()
  const recent = items.filter((item) => {
    if (!item.sourceDate) return false
    const sourceDate = new Date(item.sourceDate)
    const months = (now.getFullYear() - sourceDate.getFullYear()) * 12 + now.getMonth() - sourceDate.getMonth()
    return months <= 24
  }).length
  return { recent, staleOrUnknown: items.length - recent }
}

export const evidenceQualitySummary = (items: EvidenceItem[]): 'weak' | 'moderate' | 'strong' => {
  if (items.length < 2) return 'weak'
  const scores = items.map((item) => (item.quality === 'strong' ? 3 : item.quality === 'moderate' ? 2 : 1))
  const average = scores.reduce((total, current) => total + current, 0) / scores.length
  if (average >= 2.4 && items.length >= 4) return 'strong'
  if (average >= 1.7) return 'moderate'
  return 'weak'
}

export const scenarioClarityChecklist = (canvas: ScenarioCanvas) => [
  { label: 'Asset/process defined', met: Boolean(canvas.asset.trim()) },
  { label: 'Threat/event defined', met: Boolean(canvas.event.trim()) },
  { label: 'Business effect defined', met: Boolean(canvas.effect.trim()) },
  { label: 'Decision question exists', met: Boolean(canvas.decisionQuestion.trim()) },
]

export const decisionReadinessChecklist = (canvas: ScenarioCanvas) => [
  { label: 'Decision question exists', met: Boolean(canvas.decisionQuestion.trim()) },
  { label: 'Scenario statement exists', met: Boolean(canvas.scenarioStatement.trim()) },
  { label: 'Frequency range exists', met: canvas.frequencyRange.p5 != null && canvas.frequencyRange.p50 != null && canvas.frequencyRange.p95 != null },
  { label: 'Magnitude range exists', met: canvas.magnitudeRange.p5 != null && canvas.magnitudeRange.p50 != null && canvas.magnitudeRange.p95 != null },
  { label: 'Range ordering is coherent', met: rangeChecks(canvas).frequencyOrdered && rangeChecks(canvas).magnitudeOrdered },
  { label: 'At least one loss form selected', met: canvas.lossForms.some((item) => item.selected) },
  { label: 'At least two evidence sources entered', met: canvas.evidenceSources.length >= 2 },
  { label: 'Evidence includes internal + external/SME perspective', met: hasEvidenceDiversity(canvas.evidenceSources) },
  { label: 'At least one uncertainty item documented', met: canvas.uncertaintyItems.length >= 1 },
  { label: 'At least one treatment option entered', met: canvas.treatmentOptions.length >= 1 },
]

export const rangeChecks = (canvas: ScenarioCanvas) => {
  const { p5: fp5, p50: fp50, p95: fp95 } = canvas.frequencyRange
  const { p5: mp5, p50: mp50, p95: mp95 } = canvas.magnitudeRange
  const frequencyOrdered = fp5 == null || fp50 == null || fp95 == null ? true : fp5 <= fp50 && fp50 <= fp95
  const magnitudeOrdered = mp5 == null || mp50 == null || mp95 == null ? true : mp5 <= mp50 && mp50 <= mp95
  return { frequencyOrdered, magnitudeOrdered }
}

export const rangeGuidance = (p5: number | null, p95: number | null): string | null => {
  if (p5 == null || p95 == null || p5 <= 0) return null
  const ratio = p95 / p5
  if (ratio < 1.5) return 'Range appears narrow. Confirm you are not introducing false precision.'
  if (ratio > 30) return 'Range is very wide. Call out the key data gap causing spread.'
  return null
}

export const confidenceQualityConflict = (
  confidence: 'low' | 'medium' | 'high' | '',
  dataQuality: 'weak' | 'moderate' | 'strong' | '',
  rationale: string,
): string | null => {
  if (confidence === 'high' && dataQuality === 'weak' && rationale.trim().length < 40) {
    return 'High confidence with weak data quality should include explicit rationale.'
  }
  return null
}

export const topResearchPriorities = (canvas: ScenarioCanvas) =>
  canvas.uncertaintyItems
    .map((item) => ({
      ...item,
      score: (item.decisionImpact === 'high' ? 3 : item.decisionImpact === 'medium' ? 2 : 1) * 10 -
        (item.researchEffort === 'low' ? 1 : item.researchEffort === 'medium' ? 2 : 3),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

const badgeFromChecks = <T extends string>(
  checks: Array<{ met: boolean }>,
  low: number,
  high: number,
  labels: [T, T, T],
): T => {
  const score = checks.filter((check) => check.met).length
  if (score >= high) return labels[2]
  if (score >= low) return labels[1]
  return labels[0]
}

export const scenarioClarityBadge = (canvas: ScenarioCanvas): 'Low' | 'Moderate' | 'High' =>
  badgeFromChecks(scenarioClarityChecklist(canvas), 2, 4, ['Low', 'Moderate', 'High'])

export const decisionReadinessBadge = (canvas: ScenarioCanvas): 'Not ready' | 'Emerging' | 'Decision-ready' =>
  badgeFromChecks(decisionReadinessChecklist(canvas), 5, 10, ['Not ready', 'Emerging', 'Decision-ready'])
