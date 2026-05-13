interface DecisionSummaryProps {
  generatedSummary: string
  workingNotes: string
  mode: 'executive' | 'working'
  onModeChange: (mode: 'executive' | 'working') => void
  manualSummaryOverride: string
  onManualSummaryOverrideChange: (value: string) => void
  onCopy: () => void
}

export function DecisionSummary({
  generatedSummary,
  workingNotes,
  mode,
  onModeChange,
  manualSummaryOverride,
  onManualSummaryOverrideChange,
  onCopy,
}: DecisionSummaryProps) {
  const activeValue = mode === 'executive' ? generatedSummary : workingNotes
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          className={`rounded border px-3 py-1 text-xs ${mode === 'executive' ? 'border-cyan-300/60 text-cyan-200' : 'border-white/20 text-slate-300'}`}
          type="button"
          onClick={() => onModeChange('executive')}
        >
          Executive Brief
        </button>
        <button
          className={`rounded border px-3 py-1 text-xs ${mode === 'working' ? 'border-cyan-300/60 text-cyan-200' : 'border-white/20 text-slate-300'}`}
          type="button"
          onClick={() => onModeChange('working')}
        >
          Working Notes
        </button>
      </div>
      <textarea
        className="min-h-56 w-full rounded border border-white/20 bg-black/30 px-2 py-2 text-sm"
        value={manualSummaryOverride || activeValue}
        onChange={(e) => onManualSummaryOverrideChange(e.target.value)}
      />
      <button className="rounded border border-emerald-300/40 px-3 py-1 text-sm text-emerald-200" type="button" onClick={onCopy}>
        Copy Summary
      </button>
    </div>
  )
}
