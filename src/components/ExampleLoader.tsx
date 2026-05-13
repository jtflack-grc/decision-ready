import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ScenarioCanvas } from '../types'
import { exampleScenarios } from '../utils/exampleScenarios'

interface ExampleLoaderProps {
  onLoad: (canvas: ScenarioCanvas) => void
}

type PanelRect = { top: number; left: number; width: number }

export function ExampleLoader({ onLoad }: ExampleLoaderProps) {
  const listId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null)
  const [lastLoadedIndex, setLastLoadedIndex] = useState<number | null>(null)

  const updatePanelPosition = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPanelRect({ top: r.bottom + 4, left: r.left, width: r.width })
  }

  const closePanel = useCallback(() => {
    setOpen(false)
    setPanelRect(null)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    updatePanelPosition()
    const onScroll = () => updatePanelPosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', updatePanelPosition)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', updatePanelPosition)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return
      closePanel()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, closePanel])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closePanel])

  const pick = (example: ScenarioCanvas, index: number) => {
    onLoad(example)
    setLastLoadedIndex(index)
    closePanel()
  }

  const summary =
    lastLoadedIndex !== null
      ? (exampleScenarios[lastLoadedIndex]?.vagueRiskPhrase ?? 'Choose a preset example…')
      : 'Choose a preset example…'

  const listPanel =
    open && panelRect ? (
      <ul
        ref={panelRef}
        id={listId}
        role="listbox"
        aria-labelledby={`${listId}-trigger`}
        style={{
          position: 'fixed',
          top: panelRect.top,
          left: panelRect.left,
          width: panelRect.width,
          maxHeight: 'min(22rem, 55vh)',
        }}
        className="z-[45] overflow-auto rounded-xl border border-emerald-200/25 bg-[#07101a] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)] ring-1 ring-black/40 backdrop-blur-md"
      >
        {exampleScenarios.map((example, index) => (
          <li key={example.id} role="presentation" className="px-1">
            <button
              type="button"
              role="option"
              aria-selected={lastLoadedIndex === index}
              className="w-full rounded-lg border border-transparent px-2.5 py-2 text-left transition hover:border-emerald-300/20 hover:bg-emerald-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101a]"
              onClick={() => pick(example, index)}
            >
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300/85">
                Example {index + 1}
              </span>
              <span className="mt-0.5 block text-sm font-medium leading-snug text-slate-100">
                {example.vagueRiskPhrase}
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-amber-200/75">
                {example.exampleMaturity}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-slate-400">{example.exampleLesson}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : null

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-slate-400">
        Optional: load a filled scenario in one step, or ignore this and scroll to Section I with your own inputs. If
        you already started typing, you will be asked before anything is replaced.
      </p>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={`${listId}-trigger`}
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          className="flex w-full items-center gap-2 rounded-xl border border-emerald-300/35 bg-gradient-to-b from-emerald-500/[0.08] to-black/25 px-3 py-2.5 text-left text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-emerald-300/50 hover:from-emerald-500/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/35"
          onClick={() => (open ? closePanel() : setOpen(true))}
        >
          <span className="min-w-0 flex-1 truncate font-medium">{summary}</span>
          <span
            className={`pointer-events-none shrink-0 text-emerald-300/90 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <ChevronIcon className="h-4 w-4" />
          </span>
        </button>
      </div>
      {typeof document !== 'undefined' && listPanel ? createPortal(listPanel, document.body) : null}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}
