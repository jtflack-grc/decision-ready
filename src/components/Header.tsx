import logoImage from '../assets/iongrc-logo.png'

interface HeaderProps {
  onOpenIntro: () => void
}

export function Header({ onOpenIntro }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#020407]/90 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center gap-4">
          <img
            src={logoImage}
            alt="i on GRC"
            className="h-14 w-40 rounded-xl border border-emerald-300/20 object-cover shadow-[0_10px_30px_rgba(5,150,105,0.15)] md:h-16 md:w-48"
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300/90">Decision-Ready Governance</p>
            <p className="text-sm tracking-wide text-amber-100/85">Legacy systems. Modern governance.</p>
          </div>
        </div>
        <p className="hidden text-xs tracking-wide text-amber-100/80 lg:block">
          From color-coded concern to decision-grade exposure.
        </p>
        <button
          type="button"
          className="rounded border border-amber-300/35 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200"
          onClick={onOpenIntro}
        >
          Intro/Credits
        </button>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-emerald-300/75 via-amber-300/75 to-emerald-300/75" />
    </header>
  )
}
