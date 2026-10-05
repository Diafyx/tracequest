import { describe, expect, it } from 'vitest'
import type { Scenario, SimStep } from '../types/simulation'
import { globalTotalXp, globalXp, xpForStep } from './xp'

const step = (id: number, xp: number): SimStep => ({
  id,
  phase: 'execute',
  title: `step ${id}`,
  fn: 'fn()',
  file: 'file.c',
  description: 'description',
  activeNode: 'node',
  xp,
})

const scenario = (id: string, xps: number[]): Scenario => {
  const steps = xps.map((xp, i) => step(i + 1, xp))
  return {
    id,
    toolId: 'tool',
    tabLabel: id,
    title: id,
    subtitle: id,
    steps,
    stations: [{ phase: 'execute', title: 'all', range: [1, steps.length] }],
    criticalPathEnd: steps.length,
    totalXp: steps.reduce((sum, s) => sum + s.xp, 0),
  }
}

const a = scenario('a', [10, 20, 30])
const b = scenario('b', [5, 5])

describe('xpForStep', () => {
  it('is zero before the first step', () => {
    expect(xpForStep(a, 0)).toBe(0)
  })

  it('sums xp of every step up to and including the given one', () => {
    expect(xpForStep(a, 1)).toBe(10)
    expect(xpForStep(a, 2)).toBe(30)
    expect(xpForStep(a, 3)).toBe(60)
  })

  it('caps at the scenario total past the last step', () => {
    expect(xpForStep(a, 99)).toBe(a.totalXp)
  })
})

describe('globalXp', () => {
  it('is zero with no progress', () => {
    expect(globalXp([a, b], {})).toBe(0)
  })

  it('counts the furthest step reached, not the current one', () => {
    const progress = {
      a: { currentStep: 1, maxStepReached: 2 },
      b: { currentStep: 2, maxStepReached: 2 },
    }
    expect(globalXp([a, b], progress)).toBe(30 + 10)
  })
})

describe('globalTotalXp', () => {
  it('sums every scenario total', () => {
    expect(globalTotalXp([a, b])).toBe(70)
  })
})
