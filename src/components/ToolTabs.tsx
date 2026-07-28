import { Check } from 'lucide-react'
import { tools } from '../data/scenarios'
import { useSimulationStore } from '../store/simulationStore'

export default function ToolTabs() {
  const activeToolId = useSimulationStore((s) => s.activeToolId)
  const progress = useSimulationStore((s) => s.progress)
  const setActiveTool = useSimulationStore((s) => s.setActiveTool)

  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => {
        const active = tool.id === activeToolId
        const complete = tool.scenarios.every((s) => (progress[s.id]?.maxStepReached ?? 0) >= s.steps.length)
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              active
                ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {complete && <Check size={12} className="text-emerald-400" />}
            {tool.label}
          </button>
        )
      })}
    </div>
  )
}
