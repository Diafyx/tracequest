import { create } from 'zustand'
import { scenarios, scenarioById, tools, toolById } from '../data/scenarios'
import { evaluateAchievements } from '../data/achievements'
import type { ScenarioProgress } from '../types/simulation'

interface SimulationState {
  activeToolId: string
  activeScenarioId: string
  progress: Record<string, ScenarioProgress>
  isPlaying: boolean
  speedMs: number
  unlockedAchievementIds: string[]
  justUnlocked: string | null

  setActiveTool: (id: string) => void
  setActiveScenario: (id: string) => void
  play: () => void
  pause: () => void
  stepForward: () => void
  stepBack: () => void
  reset: () => void
  jumpTo: (step: number) => void
  setSpeed: (ms: number) => void
  dismissAchievement: () => void
  tick: () => void
}

function initialProgress(): Record<string, ScenarioProgress> {
  const p: Record<string, ScenarioProgress> = {}
  for (const s of scenarios) p[s.id] = { currentStep: 0, maxStepReached: 0 }
  return p
}

function checkAchievements(progress: Record<string, ScenarioProgress>, prevUnlocked: string[]) {
  const nowUnlocked = evaluateAchievements(progress, scenarios)
  const newOne = nowUnlocked.find((id) => !prevUnlocked.includes(id)) ?? null
  return { nowUnlocked, newOne }
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  activeToolId: tools[0].id,
  activeScenarioId: tools[0].scenarios[0].id,
  progress: initialProgress(),
  isPlaying: false,
  speedMs: 1400,
  unlockedAchievementIds: [],
  justUnlocked: null,

  setActiveTool: (id) => {
    const tool = toolById[id]
    if (!tool) return
    set({ activeToolId: id, activeScenarioId: tool.scenarios[0].id, isPlaying: false })
  },

  setActiveScenario: (id) => {
    const scenario = scenarioById[id]
    if (!scenario) return
    set({ activeToolId: scenario.toolId, activeScenarioId: id, isPlaying: false })
  },

  play: () => {
    const { activeScenarioId, progress } = get()
    const scenario = scenarioById[activeScenarioId]
    const p = progress[activeScenarioId]
    if (p.currentStep >= scenario.steps.length) {
      set((s) => ({
        progress: { ...s.progress, [activeScenarioId]: { currentStep: 0, maxStepReached: p.maxStepReached } },
      }))
    }
    set({ isPlaying: true })
  },

  pause: () => set({ isPlaying: false }),

  stepForward: () => {
    const { activeScenarioId, progress, unlockedAchievementIds } = get()
    const scenario = scenarioById[activeScenarioId]
    const p = progress[activeScenarioId]
    if (p.currentStep >= scenario.steps.length) {
      set({ isPlaying: false })
      return
    }
    const nextStep = p.currentStep + 1
    const newMax = Math.max(p.maxStepReached, nextStep)
    const newProgress = { ...progress, [activeScenarioId]: { currentStep: nextStep, maxStepReached: newMax } }
    const { nowUnlocked, newOne } = checkAchievements(newProgress, unlockedAchievementIds)
    set((s) => ({
      progress: newProgress,
      unlockedAchievementIds: nowUnlocked,
      justUnlocked: newOne ?? s.justUnlocked,
      isPlaying: nextStep >= scenario.steps.length ? false : s.isPlaying,
    }))
  },

  stepBack: () => {
    const { activeScenarioId, progress } = get()
    const p = progress[activeScenarioId]
    set({
      progress: { ...progress, [activeScenarioId]: { ...p, currentStep: Math.max(0, p.currentStep - 1) } },
      isPlaying: false,
    })
  },

  reset: () => {
    const { activeScenarioId, progress } = get()
    const p = progress[activeScenarioId]
    set({
      progress: { ...progress, [activeScenarioId]: { currentStep: 0, maxStepReached: p.maxStepReached } },
      isPlaying: false,
    })
  },

  jumpTo: (step) => {
    const { activeScenarioId, progress, unlockedAchievementIds } = get()
    const scenario = scenarioById[activeScenarioId]
    const p = progress[activeScenarioId]
    const clamped = Math.max(0, Math.min(scenario.steps.length, step))
    const newMax = Math.max(p.maxStepReached, clamped)
    const newProgress = { ...progress, [activeScenarioId]: { currentStep: clamped, maxStepReached: newMax } }
    const { nowUnlocked, newOne } = checkAchievements(newProgress, unlockedAchievementIds)
    set((s) => ({
      progress: newProgress,
      unlockedAchievementIds: nowUnlocked,
      justUnlocked: newOne ?? s.justUnlocked,
      isPlaying: false,
    }))
  },

  setSpeed: (ms) => set({ speedMs: ms }),

  dismissAchievement: () => set({ justUnlocked: null }),

  tick: () => {
    if (get().isPlaying) get().stepForward()
  },
}))

export function useActiveScenario() {
  return useSimulationStore((s) => scenarioById[s.activeScenarioId])
}

export function useActiveTool() {
  return useSimulationStore((s) => toolById[s.activeToolId])
}

export function useActiveProgress() {
  return useSimulationStore((s) => s.progress[s.activeScenarioId])
}
