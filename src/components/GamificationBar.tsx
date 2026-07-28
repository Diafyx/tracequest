import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Zap } from 'lucide-react'
import { achievementDefs } from '../data/achievements'
import { scenarios } from '../data/scenarios'
import { globalTotalXp, globalXp } from '../lib/xp'
import { useSimulationStore } from '../store/simulationStore'

export default function GamificationBar() {
  const progress = useSimulationStore((s) => s.progress)
  const unlockedAchievementIds = useSimulationStore((s) => s.unlockedAchievementIds)
  const justUnlocked = useSimulationStore((s) => s.justUnlocked)
  const dismissAchievement = useSimulationStore((s) => s.dismissAchievement)

  const xp = globalXp(scenarios, progress)
  const totalXp = globalTotalXp(scenarios)
  const pct = Math.round((xp / totalXp) * 100)
  const unlockedInfo = justUnlocked ? achievementDefs.find((a) => a.id === justUnlocked) : null

  useEffect(() => {
    if (!justUnlocked) return
    const t = setTimeout(dismissAchievement, 2800)
    return () => clearTimeout(t)
  }, [justUnlocked, dismissAchievement])

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-amber-300 text-sm font-semibold">
          <Zap size={16} className="fill-amber-300" />
          {xp} XP
        </div>
        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <Trophy size={14} />
          {unlockedAchievementIds.length}/{achievementDefs.length}
        </div>
      </div>

      <AnimatePresence>
        {unlockedInfo && (
          <motion.div
            key={unlockedInfo.id}
            initial={{ opacity: 0, y: -12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 top-10 z-20 flex items-center gap-2 rounded-xl border border-amber-400/50 bg-slate-900/95 px-4 py-2 shadow-xl shadow-amber-500/20 w-max max-w-xs"
          >
            <Trophy size={18} className="text-amber-300 shrink-0" />
            <div>
              <div className="text-amber-300 text-sm font-bold leading-tight">
                Achievement unlocked: {unlockedInfo.title}
              </div>
              <div className="text-slate-400 text-xs leading-tight">{unlockedInfo.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
