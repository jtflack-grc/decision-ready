import { useState } from 'react'

interface IntroModalProps {
  onStart: (guidanceOn: boolean, dontShowAgain: boolean) => void
  onClose: (dontShowAgain: boolean) => void
}

export function IntroModal({ onStart, onClose }: IntroModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-200/25 bg-[#07101a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <p className="text-xs tracking-[0.18em] text-emerald-300/90">i on GRC</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Welcome to the Decision-Ready Risk Scenario Canvas</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          If you&apos;ve ever sat in a risk meeting that felt tidy on paper but thin when someone had to actually choose,
          you&apos;re in the right place. It&apos;s here to help you turn vague register language into something a
          leader can reason about: what might happen, how often it might happen, what it could cost, what evidence
          supports that view, and what decision the business still owes itself.
        </p>
        <p className="mt-3 text-sm font-medium text-white">Audit-ready still isn&apos;t decision-ready.</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          You can bring strong documentation and still leave the room without a sharper trade-off, and that&apos;s more
          common than we&apos;d like. This tool nudges the conversation toward the parts that actually make
          decisions better: scenarios, ranges, loss drivers, evidence, honest uncertainty, and a clear next step.
        </p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          <p>
            <span className="font-medium text-emerald-300">What you&apos;ll do here:</span> Work left to right through the
            sections. Start with the phrase everyone&apos;s already using, then name the decision it should support. Build a
            plain-language scenario, add frequency and magnitude as ranges (not false precision), break magnitude into
            loss forms where it helps, and make your evidence and SME judgment visible so the story can be challenged
            fairly.
          </p>
          <p>
            <span className="font-medium text-emerald-300">What this isn&apos;t:</span> It&apos;s not a full cyber risk
            quantification engine, and it won&apos;t run Monte Carlo for you. Think of it as a serious framing companion:
            enough structure to improve a decision, without pretending the future is solved.
          </p>
          <div>
            <p className="font-medium text-amber-300">A simple pace:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-slate-500">
              <li className="pl-1">
                <span className="font-medium text-slate-200">Crawl:</span> by locking the decision and scenario shape.
              </li>
              <li className="pl-1">
                <span className="font-medium text-slate-200">Walk:</span> by filling ranges, loss forms, and evidence.
              </li>
              <li className="pl-1">
                <span className="font-medium text-slate-200">Run-prep:</span> by spelling out uncertainty, options, and
                what you&apos;d recommend if you had to choose today.
              </li>
            </ul>
            <p className="mt-3 text-slate-300">
              Help buttons are there if you want short explanations along the way. Turn them off anytime if you&apos;re
              already comfortable with this kind of work.
            </p>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            A label isn&apos;t a scenario. A heatmap rating isn&apos;t a decision. Ranges aren&apos;t indecision. They&apos;re an honest
            way to show what you know and what you&apos;re still carrying.
          </p>
        </div>
        <div className="mt-4 border-t border-emerald-200/25 pt-3">
          <p className="text-sm leading-snug">
            <span className="font-medium tracking-wide text-slate-200">Created by</span>{' '}
            <a
              href="https://www.linkedin.com/in/john-flack"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-100 underline decoration-amber-300/50 underline-offset-2 transition-colors hover:text-amber-50 hover:decoration-amber-200/80"
            >
              John Flack
            </a>
          </p>
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} />
          Don&apos;t show this again on this browser
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200"
            onClick={() => onStart(true, dontShowAgain)}
          >
            Start with beginner guidance
          </button>
          <button
            type="button"
            className="rounded border border-amber-300/35 bg-amber-500/10 px-3 py-1 text-sm text-amber-200"
            onClick={() => onStart(false, dontShowAgain)}
          >
            Start in analyst mode
          </button>
          <button
            type="button"
            className="rounded border border-white/20 bg-black/20 px-3 py-1 text-sm text-slate-300"
            onClick={() => onClose(dontShowAgain)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
