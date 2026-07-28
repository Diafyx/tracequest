import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, RotateCcw, X } from 'lucide-react'
import ConfettiBurst from './ConfettiBurst'
import { achievementDefs } from '../data/achievements'
import { useSimulationStore } from '../store/simulationStore'
import type { Scenario } from '../types/simulation'

export default function CompletionOverlay({
  scenario,
  open,
  onClose,
  onReplay,
}: {
  scenario: Scenario
  open: boolean
  onClose: () => void
  onReplay: () => void
}) {
  const unlockedAchievementIds = useSimulationStore((s) => s.unlockedAchievementIds)
  const allComplete = unlockedAchievementIds.includes('all_complete')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <ConfettiBurst count={allComplete ? 120 : 70} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 max-w-md w-[90%] rounded-2xl border border-cyan-500/40 bg-slate-900 p-7 text-center shadow-2xl shadow-cyan-500/20"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-300"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-cyan-300 mb-4">
              <PartyPopper size={26} />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {allComplete ? 'You mastered SQL internals' : `You traced the whole ${scenario.tabLabel}`}
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              {allComplete
                ? 'INSERT, indexed INSERT, SELECT, UPDATE, and DELETE — every operation, every real function, from source code to disk.'
                : `${scenario.steps.length} real PostgreSQL functions, in the exact order they actually run.`}
            </p>
            <div className="flex justify-center gap-8 mt-5">
              <div>
                <div className="text-2xl font-bold text-amber-300">{scenario.totalXp}</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">XP this run</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-300">
                  {unlockedAchievementIds.length}/{achievementDefs.length}
                </div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">Achievements</div>
              </div>
            </div>
            <button
              onClick={onReplay}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
            >
              <RotateCcw size={16} />
              Run it again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
