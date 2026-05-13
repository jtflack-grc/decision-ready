import { useState } from 'react'
import type { ScenarioCanvas } from '../types'
import { generateWorkingNotes } from '../utils/summaryGenerator'

interface ExportImportProps {
  canvas: ScenarioCanvas
  onImport: (canvas: ScenarioCanvas) => void
  onPrint: () => void
}

export function ExportImport({ canvas, onImport, onPrint }: ExportImportProps) {
  const [raw, setRaw] = useState('')

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(canvas, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'decision-ready-canvas.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAssumptionLog = () => {
    const blob = new Blob([generateWorkingNotes(canvas)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'decision-ready-assumption-log.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button className="rounded border border-emerald-300/40 px-3 py-1 text-sm text-emerald-200" type="button" onClick={exportJson}>
          Export JSON
        </button>
        <button
          className="rounded border border-blue-300/40 px-3 py-1 text-sm text-blue-200"
          type="button"
          onClick={() => {
            if (!raw.trim()) return
            onImport(JSON.parse(raw) as ScenarioCanvas)
          }}
        >
          Import from JSON text
        </button>
        <button className="rounded border border-amber-300/40 px-3 py-1 text-sm text-amber-200" type="button" onClick={onPrint}>
          Print
        </button>
        <button className="rounded border border-purple-300/40 px-3 py-1 text-sm text-purple-200" type="button" onClick={exportAssumptionLog}>
          Export Assumption Log
        </button>
      </div>
      <textarea
        className="w-full rounded border border-white/20 bg-black/30 px-2 py-1 text-sm"
        rows={4}
        placeholder="Paste JSON here to import"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
    </div>
  )
}
