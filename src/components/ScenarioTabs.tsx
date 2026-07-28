import { Check } from 'lucide-react'
import { scenarios } from '../data/scenarios'
import { useSimulationStore } from '../store/simulationStore'

export default function ScenarioTabs() {
  const activeScenarioId = useSimulationStore((s) => s.activeScenarioId)
  const progress = useSimulationStore((s) => s.progress)
  const setActiveScenario = useSimulationStore((s) => s.setActiveScenario)

  return (
    <div className="flex flex-wrap gap-2">
      {scenarios.map((scenario) => {
        const active = scenario.id === activeScenarioId
        const p = progress[scenario.id]
        const complete = p && p.maxStepReached >= scenario.steps.length
        return (
          <button
            key={scenario.id}
            onClick={() => setActiveScenario(scenario.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              active
                ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {complete && <Check size={12} className="text-emerald-400" />}
            {scenario.tabLabel}
          </button>
        )
      })}
    </div>
  )
}
