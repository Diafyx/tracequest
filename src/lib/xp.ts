import type { Scenario, ScenarioProgress } from '../types/simulation'

export function xpForStep(scenario: Scenario, stepNumber: number): number {
  return scenario.steps.slice(0, stepNumber).reduce((sum, s) => sum + s.xp, 0)
}

export function globalXp(scenarios: Scenario[], progress: Record<string, ScenarioProgress>): number {
  return scenarios.reduce((sum, s) => sum + xpForStep(s, progress[s.id]?.maxStepReached ?? 0), 0)
}

export function globalTotalXp(scenarios: Scenario[]): number {
  return scenarios.reduce((sum, s) => sum + s.totalXp, 0)
}
