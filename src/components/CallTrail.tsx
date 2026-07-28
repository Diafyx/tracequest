import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import type { Scenario } from '../types/simulation'

const TRAIL_LENGTH = 6

export default function CallTrail({ scenario, currentStep }: { scenario: Scenario; currentStep: number }) {
  const start = Math.max(0, currentStep - TRAIL_LENGTH)
  const visible = [...scenario.steps.slice(start, currentStep)].reverse()

  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col min-h-0">
      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wide mb-3 shrink-0">
        <Terminal size={12} />
        Call trail
      </div>
      <div className="space-y-1.5 font-mono text-[12px] overflow-hidden">
        {visible.length === 0 && <div className="text-slate-700 italic text-xs">idle…</div>}
        <AnimatePresence initial={false}>
          {visible.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1 - i * 0.15, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`truncate ${i === 0 ? 'text-cyan-300 font-semibold' : 'text-slate-500'}`}
              title={step.fn}
            >
              <span className="text-slate-700 mr-1.5">{i === 0 ? '▸' : ' '}</span>
              {step.fn}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
