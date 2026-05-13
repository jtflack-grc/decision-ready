import type { PropsWithChildren } from 'react'

interface SectionCardProps extends PropsWithChildren {
  title: string
  subtitle?: string
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-emerald-200/15 bg-[#020407]/90 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <div className="mt-2 h-px w-20 bg-gradient-to-r from-emerald-300/60 via-amber-300/60 to-transparent" />
      {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}
