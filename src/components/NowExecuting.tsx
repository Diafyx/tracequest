import { motion, AnimatePresence } from 'framer-motion'
import { phaseColor, phaseIcon } from '../data/phaseTheme'
import { xpForStep } from '../lib/xp'
import type { Scenario } from '../types/simulation'

export default function NowExecuting({ scenario, currentStep }: { scenario: Scenario; currentStep: number }) {
  const step = currentStep > 0 ? scenario.steps[currentStep - 1] : null
  const totalSteps = scenario.steps.length

  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!step ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-slate-500 text-center"
          >
            Press <span className="text-cyan-400 font-semibold">Play</span> to trace {scenario.tabLabel} through
            real source code…
          </motion.div>
        ) : (
          <motion.div
            key={`${scenario.id}-${step.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide px-2 py-0.5 rounded border ${phaseColor[step.phase]}`}
              >
                {(() => {
                  const Icon = phaseIcon[step.phase]
                  return <Icon size={12} />
                })()}
                {step.phase}
              </span>
              <span className="text-[11px] font-mono text-slate-600">
                step {step.id}/{totalSteps} · +{step.xp} xp · {xpForStep(scenario, currentStep)}/{scenario.totalXp}{' '}
                in this run
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-3">{step.title}</h2>
            <div className="font-mono text-cyan-300 text-base mt-2">{step.fn}</div>
            <div className="font-mono text-xs text-slate-500 mt-1">{step.file}</div>
            <p className="text-slate-300 mt-4 leading-relaxed text-[15px]">{step.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
