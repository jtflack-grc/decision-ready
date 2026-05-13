export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-7">
      <h2 className="hero-terminal-title w-full max-w-full whitespace-nowrap font-normal normal-case overflow-x-auto">
        Decision-Ready Risk Scenario Canvas
      </h2>
      <div
        className="mt-3 h-1 max-w-xs rounded-sm bg-gradient-to-r from-amber-300/90 via-amber-200/70 to-transparent"
        aria-hidden
      />
      <p className="mt-2 max-w-4xl text-base tracking-[0.01em] text-slate-300">
        Convert vague GRC language into a scenario leaders can actually decide on.
      </p>
      <p className="mt-3 max-w-5xl text-sm leading-relaxed tracking-[0.015em] text-slate-400">
        Start with the phrase people put in the risk register. End with a decision-ready scenario: what could happen,
        how often, how bad it could get, what evidence supports the estimate, and what choice the business needs to
        make.
      </p>
    </section>
  )
}
