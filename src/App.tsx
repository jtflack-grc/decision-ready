import { useEffect, useState } from 'react'
import './App.css'
import { CanvasForm } from './components/CanvasForm'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { IntroModal } from './components/IntroModal'
import { OutputPanel } from './components/OutputPanel'
import type { ScenarioCanvas } from './types'
import { createEmptyCanvas } from './utils/exampleScenarios'
import { clearCanvas, loadCanvas, saveCanvas } from './utils/storage'

function App() {
  const INTRO_DISMISSED_KEY = 'decision-ready-canvas-intro-dismissed'
  const hydrateCanvas = (input: ScenarioCanvas | null): ScenarioCanvas => {
    const base = createEmptyCanvas()
    if (!input) return base
    return {
      ...base,
      ...input,
      frequencyRange: { ...base.frequencyRange, ...input.frequencyRange },
      magnitudeRange: { ...base.magnitudeRange, ...input.magnitudeRange },
      revisionHistory: input.revisionHistory ?? [],
    }
  }
  const [canvas, setCanvas] = useState<ScenarioCanvas>(() => hydrateCanvas(loadCanvas()))
  const [showGuidance, setShowGuidance] = useState(true)
  const [showIntro, setShowIntro] = useState(() => localStorage.getItem(INTRO_DISMISSED_KEY) !== 'true')

  const setTrackedCanvas = (next: ScenarioCanvas) => {
    const changedFields = Object.keys(next).filter((key) => {
      if (['updatedAt', 'revisionHistory'].includes(key)) return false
      return JSON.stringify(canvas[key as keyof ScenarioCanvas]) !== JSON.stringify(next[key as keyof ScenarioCanvas])
    })

    setCanvas({
      ...next,
      revisionHistory: changedFields.length
        ? [...(canvas.revisionHistory ?? []), { timestamp: new Date().toISOString(), changedFields }].slice(-25)
        : canvas.revisionHistory,
    })
  }

  useEffect(() => {
    saveCanvas(canvas)
  }, [canvas])
  const savedMessage = canvas.updatedAt
    ? `Saved locally at ${new Date(canvas.updatedAt).toLocaleTimeString()}`
    : 'Saved locally'

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <Header onOpenIntro={() => setShowIntro(true)} />
      {showIntro ? (
        <IntroModal
          onStart={(guidanceOn, dontShowAgain) => {
            setShowGuidance(guidanceOn)
            setShowIntro(false)
            if (dontShowAgain) localStorage.setItem(INTRO_DISMISSED_KEY, 'true')
          }}
          onClose={(dontShowAgain) => {
            setShowIntro(false)
            if (dontShowAgain) localStorage.setItem(INTRO_DISMISSED_KEY, 'true')
          }}
        />
      ) : null}
      <Hero />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 pb-2">
        <button
          type="button"
          className="rounded border border-emerald-300/35 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
          onClick={() => setShowGuidance((value) => !value)}
        >
          Beginner guidance: {showGuidance ? 'On' : 'Off'}
        </button>
      </div>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 pb-10 lg:grid-cols-[minmax(0,1fr)_430px]">
        <CanvasForm
          canvas={canvas}
          setCanvas={setTrackedCanvas}
          showGuidance={showGuidance}
          onReset={() => {
            if (!confirm('Reset the canvas and clear local data?')) return
            clearCanvas()
            setTrackedCanvas(createEmptyCanvas())
          }}
        />
        <OutputPanel
          canvas={canvas}
          onManualSummaryOverrideChange={(value) => setTrackedCanvas({ ...canvas, manualSummaryOverride: value })}
          onSummaryModeChange={(mode) => setTrackedCanvas({ ...canvas, summaryMode: mode, manualSummaryOverride: '' })}
          showGuidance={showGuidance}
        />
      </main>
      <footer className="border-t border-emerald-200/15 bg-black/25 px-4 py-4 text-xs tracking-[0.02em] text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p>i on GRC - Decision-ready governance for messy systems.</p>
          <p>{savedMessage}</p>
        </div>
        <p className="mx-auto mt-2 max-w-7xl">
          This tool supports risk framing and decision support. It does not replace professional judgment, formal FAIR
          analysis, legal review, or organization-specific methodology.
        </p>
      </footer>
    </div>
  )
}

export default App
