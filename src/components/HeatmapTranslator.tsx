import type { ScenarioCanvas } from '../types'
import { evidenceQualitySummary, toCurrency } from '../utils/calculations'

interface HeatmapTranslatorProps {
  canvas: ScenarioCanvas
  onPatch: (next: Partial<ScenarioCanvas>) => void
}

const colorClasses = (rating: string): string => {
  const normalized = rating.toLowerCase()
  if (normalized.includes('critical') || normalized.includes('red') || normalized.includes('high')) {
    return 'border-red-300/50 bg-red-500/10 text-red-200'
  }
  if (normalized.includes('yellow') || normalized.includes('medium')) {
    return 'border-amber-300/50 bg-amber-500/10 text-amber-200'
  }
  if (normalized.includes('green') || normalized.includes('low')) {
    return 'border-emerald-300/50 bg-emerald-500/10 text-emerald-200'
  }
  return 'border-slate-300/40 bg-slate-500/10 text-slate-200'
}

export function HeatmapTranslator({ canvas, onPatch }: HeatmapTranslatorProps) {
  const concerns = ['frequency', 'magnitude', 'control uncertainty', 'unknown'] as const
  const gapList: string[] = []
  if (!canvas.asset.trim()) gapList.push('asset/process')
  if (!canvas.event.trim()) gapList.push('event')
  if (!canvas.effect.trim()) gapList.push('effect')
  if (!canvas.decisionQuestion.trim() && !canvas.heatmapDecisionContext?.trim()) gapList.push('decision question')
  if (canvas.frequencyRange.p5 == null || canvas.frequencyRange.p50 == null || canvas.frequencyRange.p95 == null) gapList.push('frequency range')
  if (canvas.magnitudeRange.p5 == null || canvas.magnitudeRange.p50 == null || canvas.magnitudeRange.p95 == null) gapList.push('magnitude range')

  const decisionText = canvas.heatmapDecisionContext?.trim() || canvas.decisionQuestion || 'Decision context not yet provided.'
  const translated = `Legacy rating: ${canvas.legacyHeatmapRating || 'Unspecified'} (${canvas.heatmapPrimaryConcern || 'unknown'} concern). Translation: Because ${canvas.event || '[event]'} affects ${canvas.asset || '[asset/process]'}, the organization may experience ${canvas.effect || '[effect]'}. Estimated frequency ranges ${canvas.frequencyRange.p5 ?? 'N/A'} to ${canvas.frequencyRange.p95 ?? 'N/A'} per year (typical ${canvas.frequencyRange.p50 ?? 'N/A'}), with per-event loss from ${toCurrency(canvas.magnitudeRange.p5)} to ${toCurrency(canvas.magnitudeRange.p95)} (typical ${toCurrency(canvas.magnitudeRange.p50)}). Evidence quality is ${evidenceQualitySummary(canvas.evidenceSources)} across ${canvas.evidenceSources.length} sources. Decision supported: ${decisionText}`

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-300/30 bg-[#020407]/90 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/15 bg-black/25 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Before</p>
          <div className={`mt-2 inline-block rounded-full border px-3 py-1 text-sm ${colorClasses(canvas.legacyHeatmapRating)}`}>
            {canvas.legacyHeatmapRating || 'No rating yet'}
          </div>
          <p className="mt-2 text-xs text-slate-300">Color label without scenario shape or decision framing.</p>
        </div>
        <div className="rounded-xl border border-emerald-200/30 bg-emerald-500/10 p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-300">After</p>
          <p className="mt-2 text-xs text-slate-100">Decision translation with scenario, ranges, evidence, and explicit decision context.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label className="text-xs text-slate-200">
          Primary concern behind this color
          <select
            className="mt-1 w-full rounded border border-white/20 bg-black/30 px-2 py-1"
            value={canvas.heatmapPrimaryConcern ?? 'unknown'}
            onChange={(e) => onPatch({ heatmapPrimaryConcern: e.target.value as ScenarioCanvas['heatmapPrimaryConcern'] })}
          >
            {concerns.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-200">
          Decision on the table (override)
          <input
            className="mt-1 w-full rounded border border-white/20 bg-black/30 px-2 py-1"
            placeholder="Optional translator-specific decision context"
            value={canvas.heatmapDecisionContext ?? ''}
            onChange={(e) => onPatch({ heatmapDecisionContext: e.target.value })}
          />
        </label>
      </div>

      {gapList.length > 0 ? (
        <p className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Translation is provisional. Fill: {gapList.join(', ')}.
        </p>
      ) : (
        <p className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          Translation quality check passed: scenario shape, ranges, and decision context are present.
        </p>
      )}

      <div className="rounded-xl border border-white/15 bg-black/35 p-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-amber-300">Decision-Ready Translation</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-100">{translated}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-amber-300/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-200"
          onClick={() => navigator.clipboard.writeText(translated)}
        >
          Copy translation
        </button>
        <p className="self-center text-xs text-slate-400">The heatmap rating is a label. This translation is the analysis.</p>
      </div>
    </div>
  )
}
