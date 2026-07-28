import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import { useActiveProgress, useActiveScenario, useSimulationStore } from '../store/simulationStore'

const speeds = [
  { label: '0.5x', ms: 2400 },
  { label: '1x', ms: 1400 },
  { label: '2x', ms: 700 },
  { label: '4x', ms: 320 },
]

export default function PlaybackControls() {
  const scenario = useActiveScenario()
  const { currentStep } = useActiveProgress()
  const isPlaying = useSimulationStore((s) => s.isPlaying)
  const speedMs = useSimulationStore((s) => s.speedMs)
  const play = useSimulationStore((s) => s.play)
  const pause = useSimulationStore((s) => s.pause)
  const stepForward = useSimulationStore((s) => s.stepForward)
  const stepBack = useSimulationStore((s) => s.stepBack)
  const reset = useSimulationStore((s) => s.reset)
  const jumpTo = useSimulationStore((s) => s.jumpTo)
  const setSpeed = useSimulationStore((s) => s.setSpeed)

  const totalSteps = scenario.steps.length
  const done = currentStep >= totalSteps

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={reset}
        title="Reset"
        className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
      >
        <RotateCcw size={16} />
      </button>
      <button
        onClick={stepBack}
        disabled={currentStep === 0}
        title="Step back"
        className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <SkipBack size={16} />
      </button>
      <button
        onClick={() => (isPlaying ? pause() : play())}
        className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
        title={isPlaying ? 'Pause' : done ? 'Replay' : 'Play'}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button
        onClick={stepForward}
        disabled={done}
        title="Step forward"
        className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <SkipForward size={16} />
      </button>

      <input
        type="range"
        min={0}
        max={totalSteps}
        value={currentStep}
        onChange={(e) => jumpTo(Number(e.target.value))}
        className="flex-1 min-w-[140px] accent-cyan-400"
      />
      <span className="text-xs font-mono text-slate-400 w-16 text-right">
        {currentStep}/{totalSteps}
      </span>

      <div className="flex gap-1">
        {speeds.map((s) => (
          <button
            key={s.label}
            onClick={() => setSpeed(s.ms)}
            className={`px-2 py-1 text-xs rounded-md border ${
              speedMs === s.ms
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
