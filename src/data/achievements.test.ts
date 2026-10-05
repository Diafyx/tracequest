import { describe, expect, it } from 'vitest'
import type { ScenarioProgress } from '../types/simulation'
import { achievementDefs, evaluateAchievements } from './achievements'
import { scenarioById, scenarios } from './scenarios'

const completed = (stepCount: number): ScenarioProgress => ({ currentStep: stepCount, maxStepReached: stepCount })

describe('achievement definitions', () => {
  it('use unique ids', () => {
    const ids = achievementDefs.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only reference scenarios that exist', () => {
    for (const def of achievementDefs) {
      if (def.condition.type === 'scenario_complete') {
        expect(scenarioById[def.condition.scenarioId], def.id).toBeDefined()
      }
    }
  })

  it('give every scenario a completion achievement', () => {
    const covered = new Set(
      achievementDefs.flatMap((a) => (a.condition.type === 'scenario_complete' ? [a.condition.scenarioId] : [])),
    )
    for (const scenario of scenarios) expect(covered, scenario.id).toContain(scenario.id)
  })

  it('only use insight tags that some step can unlock', () => {
    const stepTags = new Set(scenarios.flatMap((s) => s.steps.flatMap((step) => (step.insight ? [step.insight] : []))))
    for (const def of achievementDefs) {
      if (def.condition.type === 'insight') expect(stepTags, def.id).toContain(def.condition.tag)
    }
  })

  it('reward every insight tag used by a step', () => {
    const achievementTags = new Set(
      achievementDefs.flatMap((a) => (a.condition.type === 'insight' ? [a.condition.tag] : [])),
    )
    for (const scenario of scenarios) {
      for (const step of scenario.steps) {
        if (step.insight) expect(achievementTags, `${scenario.id} step ${step.id}`).toContain(step.insight)
      }
    }
  })
})

describe('evaluateAchievements', () => {
  it('unlocks nothing before any progress', () => {
    expect(evaluateAchievements({}, scenarios)).toEqual([])
  })

  it('unlocks first_step after the first step of any scenario', () => {
    const [first] = scenarios
    const unlocked = evaluateAchievements({ [first.id]: { currentStep: 1, maxStepReached: 1 } }, scenarios)
    expect(unlocked).toContain('first_step')
  })

  it('unlocks an insight once the step that carries it is reached', () => {
    const scenario = scenarios.find((s) => s.steps.some((step) => step.insight))!
    const step = scenario.steps.find((s) => s.insight)!
    const def = achievementDefs.find((a) => a.condition.type === 'insight' && a.condition.tag === step.insight)!

    const before = evaluateAchievements({ [scenario.id]: { currentStep: step.id - 1, maxStepReached: step.id - 1 } }, scenarios)
    const after = evaluateAchievements({ [scenario.id]: { currentStep: step.id, maxStepReached: step.id } }, scenarios)

    expect(before).not.toContain(def.id)
    expect(after).toContain(def.id)
  })

  it('unlocks a scenario completion only at its final step', () => {
    const scenario = scenarios[0]
    const def = achievementDefs.find((a) => a.condition.type === 'scenario_complete' && a.condition.scenarioId === scenario.id)!
    const last = scenario.steps.length

    const almost = evaluateAchievements({ [scenario.id]: { currentStep: last - 1, maxStepReached: last - 1 } }, scenarios)
    const done = evaluateAchievements({ [scenario.id]: completed(last) }, scenarios)

    expect(almost).not.toContain(def.id)
    expect(done).toContain(def.id)
  })

  it('unlocks every achievement when every scenario is complete', () => {
    const progress = Object.fromEntries(scenarios.map((s) => [s.id, completed(s.steps.length)]))
    const unlocked = evaluateAchievements(progress, scenarios)
    expect([...unlocked].sort()).toEqual(achievementDefs.map((a) => a.id).sort())
  })

  it('does not unlock all_complete while any scenario is unfinished', () => {
    const progress = Object.fromEntries(scenarios.slice(1).map((s) => [s.id, completed(s.steps.length)]))
    expect(evaluateAchievements(progress, scenarios)).not.toContain('all_complete')
  })
})
