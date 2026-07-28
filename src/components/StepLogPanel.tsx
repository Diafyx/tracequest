import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { phaseColor } from '../data/phaseTheme'
import type { Scenario } from '../types/simulation'

export default function StepLogPanel({ scenario, currentStep }: { scenario: Scenario; currentStep: number }) {
  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [currentStep])

  const visible = scenario.steps.slice(0, currentStep)

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-1">
      {visible.length === 0 && (
        <div className="text-slate-600 text-xs italic pt-1">History will appear here as steps run…</div>
      )}
      <AnimatePresence initial={false}>
        {visible.map((step) => {
          const isActive = step.id === currentStep
          return (
            <motion.div
              key={step.id}
              ref={isActive ? activeRef : undefined}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-lg border px-2.5 py-1.5 flex items-center gap-2 ${
                isActive
                  ? `${phaseColor[step.phase]} ring-1 ring-cyan-400/50`
                  : 'border-slate-800/60 bg-slate-900/30 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-mono opacity-60 w-5 shrink-0">
                {String(step.id).padStart(2, '0')}
              </span>
              <span className={`text-xs truncate ${isActive ? 'font-semibold' : ''}`}>{step.title}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
