import { useState } from 'react'

interface HelperTipProps {
  title: string
  content: string
}

export function HelperTip({ title, content }: HelperTipProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-emerald-200"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`${title} helper`}
      >
        Help
      </button>
      {open ? (
        <div className="absolute left-0 z-10 mt-2 w-72 rounded-xl border border-white/20 bg-[#081019] p-3 text-xs text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
          <p className="font-semibold text-emerald-200">{title}</p>
          <p className="mt-1 leading-relaxed text-slate-300">{content}</p>
          <button
            type="button"
            className="mt-2 rounded border border-amber-300/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  )
}
