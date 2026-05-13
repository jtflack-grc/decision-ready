export type OptionLevel = 'low' | 'medium' | 'high'
export type QualityLevel = 'weak' | 'moderate' | 'strong'
export type SourceKind = 'internal' | 'external' | 'sme'

export interface FrequencyRange {
  p5: number | null
  p50: number | null
  p95: number | null
  rationale: string
  confidence: OptionLevel | ''
  dataQuality: QualityLevel | ''
}

export interface MagnitudeRange {
  p5: number | null
  p50: number | null
  p95: number | null
  rationale: string
  confidence: OptionLevel | ''
  dataQuality: QualityLevel | ''
  unknownDollarValues: boolean
}

export interface LossFormEntry {
  id: string
  type: string
  selected: boolean
  low: number | null
  typical: number | null
  high: number | null
  notes: string
  evidenceSource: string
}

export interface EvidenceItem {
  id: string
  sourceType: SourceKind
  sourceName: string
  sourceDate?: string
  smeRole?: string
  basisOfEstimate?: string
  supports:
    | 'frequency'
    | 'magnitude'
    | 'control condition'
    | 'scenario plausibility'
    | 'treatment option'
  quality: QualityLevel
  notes: string
}

export interface UncertaintyItem {
  id: string
  keyUncertainty: string
  uncertaintyType:
    | 'Data gap'
    | 'SME disagreement'
    | 'Future-state change'
    | 'Control effectiveness unknown'
    | 'Dependency unknown'
    | 'Financial impact unknown'
    | 'Regulatory uncertainty'
    | 'Threat landscape uncertainty'
    | 'Recovery assumption'
    | 'Other'
  reducibleByResearch: 'Yes' | 'No' | 'Maybe'
  wouldChangeDecision: 'Yes' | 'No' | 'Maybe'
  researchAction: string
  owner: string
  notes: string
  decisionImpact: OptionLevel
  researchEffort: OptionLevel
}

export interface TreatmentOption {
  id: string
  optionName: string
  category:
    | 'Accept'
    | 'Mitigate'
    | 'Transfer'
    | 'Avoid'
    | 'Defer'
    | 'Modernize'
    | 'Monitor'
    | 'Other'
  estimatedCost: number | null
  expectedEffect:
    | 'Reduces frequency'
    | 'Reduces magnitude'
    | 'Reduces tail risk'
    | 'Improves evidence'
    | 'Improves recovery'
    | 'Transfers financial loss'
    | 'Does not materially reduce exposure'
  narrativeNotes: string
  implementationDifficulty: OptionLevel
  timeHorizon: 'Immediate' | '0-3 months' | '3-6 months' | '6-12 months' | '12+ months'
  confidence: OptionLevel
}

export interface ScenarioCanvas {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  vagueRiskPhrase: string
  insufficientBecause: string
  domain: string
  decisionType: string
  decisionQuestion: string
  decisionOwner: string
  decisionDeadline: string
  businessObjective: string
  asset: string
  event: string
  effect: string
  stakeholders: string[]
  scenarioStatement: string
  frequencyRange: FrequencyRange
  magnitudeRange: MagnitudeRange
  lossForms: LossFormEntry[]
  mostImportantLossDriver: string
  tailRiskDriver: string
  evidenceSources: EvidenceItem[]
  uncertaintyItems: UncertaintyItem[]
  treatmentOptions: TreatmentOption[]
  legacyHeatmapRating: string
  heatmapPrimaryConcern?: 'frequency' | 'magnitude' | 'control uncertainty' | 'unknown'
  heatmapDecisionContext?: string
  recommendation: string
  manualSummaryOverride: string
  summaryMode?: 'executive' | 'working'
  reviewer?: string
  reviewDate?: string
  reviewSignoffNotes?: string
  revisionHistory?: Array<{
    timestamp: string
    changedFields: string[]
  }>
  exampleMaturity?: 'early framing' | 'moderate evidence' | 'decision-ready draft'
  exampleLesson?: string
}
