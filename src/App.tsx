import { useEffect, useRef, useState } from 'react'
import JourneyPath from './components/JourneyPath'
import ComponentMap from './components/ComponentMap'
import CallTrail from './components/CallTrail'
import NowExecuting from './components/NowExecuting'
import StepLogPanel from './components/StepLogPanel'
import PlaybackControls from './components/PlaybackControls'
import GamificationBar from './components/GamificationBar'
import CompletionOverlay from './components/CompletionOverlay'
import ScenarioTabs from './components/ScenarioTabs'
import { useActiveProgress, useActiveScenario, useSimulationStore } from './store/simulationStore'

function App() {
  const scenario = useActiveScenario()
  const progress = useActiveProgress()
  const currentStep = progress.currentStep

  const isPlaying = useSimulationStore((s) => s.isPlaying)
  const speedMs = useSimulationStore((s) => s.speedMs)
  const tick = useSimulationStore((s) => s.tick)
  const play = useSimulationStore((s) => s.play)
  const pause = useSimulationStore((s) => s.pause)
  const stepForward = useSimulationStore((s) => s.stepForward)
  const stepBack = useSimulationStore((s) => s.stepBack)
  const reset = useSimulationStore((s) => s.reset)

  const [showCompletion, setShowCompletion] = useState(false)
  const prevRef = useRef({ scenarioId: scenario.id, step: currentStep })

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => tick(), speedMs)
    return () => clearInterval(id)
  }, [isPlaying, speedMs, tick])

  useEffect(() => {
    const prev = prevRef.current
    if (prev.scenarioId === scenario.id && prev.step < scenario.steps.length && currentStep === scenario.steps.length) {
      setShowCompletion(true)
    }
    prevRef.current = { scenarioId: scenario.id, step: currentStep }
  }, [scenario.id, scenario.steps.length, currentStep])

  useEffect(() => {
    setShowCompletion(false)
  }, [scenario.id])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        isPlaying ? pause() : play()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        stepForward()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        stepBack()
      } else if (e.key.toLowerCase() === 'r') {
        reset()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isPlaying, play, pause, stepForward, stepBack, reset])

  return (
    <div className="app-shell h-screen w-screen flex flex-col text-slate-100 overflow-hidden">
      <header className="px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <h1 className="text-lg font-bold tracking-tight shrink-0">
          <span className="text-cyan-400">TraceQuest</span>
          <span className="text-slate-500 font-medium"> — PostgreSQL Internals</span>
        </h1>
        <ScenarioTabs />
        <div className="text-xs text-slate-600 font-mono shrink-0 text-right">
          <div>PostgreSQL ~v16 internals</div>
          <div className="text-slate-700">space play/pause · ←/→ step · r reset</div>
        </div>
      </header>

      <div className="px-6 pt-3 shrink-0">
        <h2 className="text-sm font-semibold text-slate-200">{scenario.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{scenario.subtitle}</p>
      </div>

      <div className="px-6 pt-3 shrink-0 space-y-3">
        <JourneyPath scenario={scenario} currentStep={currentStep} />
        <ComponentMap scenario={scenario} currentStep={currentStep} />
      </div>

      <div className="flex-1 flex gap-4 px-6 pb-4 pt-3 min-h-0">
        <div className="w-56 shrink-0 hidden lg:block">
          <CallTrail scenario={scenario} currentStep={currentStep} />
        </div>

        <NowExecuting scenario={scenario} currentStep={currentStep} />

        <aside className="w-[320px] shrink-0 flex flex-col min-h-0 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="px-4 py-3 border-b border-slate-800 shrink-0">
            <GamificationBar />
          </div>
          <div className="flex-1 min-h-0 px-3 py-3">
            <StepLogPanel scenario={scenario} currentStep={currentStep} />
          </div>
        </aside>
      </div>

      <footer className="px-6 py-3 border-t border-slate-800 shrink-0">
        <PlaybackControls />
      </footer>

      <CompletionOverlay
        scenario={scenario}
        open={showCompletion}
        onClose={() => setShowCompletion(false)}
        onReplay={() => {
          setShowCompletion(false)
          play()
        }}
      />
    </div>
  )
}

export default App
