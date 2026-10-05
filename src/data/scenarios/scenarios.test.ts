import { describe, expect, it } from 'vitest'
import { componentZonesByTool } from '../components'
import { scenarioById, scenarios, toolById, tools } from './index'

describe.each(scenarios.map((s) => [s.id, s] as const))('scenario %s', (_id, scenario) => {
  const nodeIds = new Set(
    (componentZonesByTool[scenario.toolId] ?? []).flatMap((zone) => zone.items.map((item) => item.id)),
  )

  it('belongs to a registered tool with a component map', () => {
    expect(toolById[scenario.toolId]).toBeDefined()
    expect(nodeIds.size).toBeGreaterThan(0)
  })

  it('numbers its steps 1..n in order', () => {
    expect(scenario.steps.length).toBeGreaterThan(0)
    expect(scenario.steps.map((s) => s.id)).toEqual(scenario.steps.map((_, i) => i + 1))
  })

  it('fills in every step field', () => {
    for (const step of scenario.steps) {
      expect(step.title.trim(), `step ${step.id} title`).not.toBe('')
      expect(step.fn.trim(), `step ${step.id} fn`).not.toBe('')
      expect(step.file.trim(), `step ${step.id} file`).not.toBe('')
      expect(step.description.trim(), `step ${step.id} description`).not.toBe('')
    }
  })

  it('only references components on its own tool map', () => {
    for (const step of scenario.steps) {
      expect(nodeIds, `step ${step.id} activeNode`).toContain(step.activeNode)
      if (step.fromNode) expect(nodeIds, `step ${step.id} fromNode`).toContain(step.fromNode)
    }
  })

  it('awards positive xp per step and totals it correctly', () => {
    for (const step of scenario.steps) expect(step.xp, `step ${step.id} xp`).toBeGreaterThan(0)
    expect(scenario.totalXp).toBe(scenario.steps.reduce((sum, s) => sum + s.xp, 0))
  })

  it('has stations that cover every step exactly once, in order', () => {
    expect(scenario.stations.length).toBeGreaterThan(0)
    let expectedStart = 1
    for (const station of scenario.stations) {
      const [start, end] = station.range
      expect(start, `station "${station.title}" start`).toBe(expectedStart)
      expect(end, `station "${station.title}" end`).toBeGreaterThanOrEqual(start)
      expectedStart = end + 1
    }
    expect(expectedStart - 1).toBe(scenario.steps.length)
  })

  it('ends its critical path inside the step range', () => {
    expect(scenario.criticalPathEnd).toBeGreaterThanOrEqual(1)
    expect(scenario.criticalPathEnd).toBeLessThanOrEqual(scenario.steps.length)
  })
})

describe('tool registry', () => {
  it('uses unique scenario ids', () => {
    const ids = scenarios.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses unique tool ids', () => {
    const ids = tools.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists every scenario under exactly one tool that matches its toolId', () => {
    for (const scenario of scenarios) {
      const owners = tools.filter((t) => t.scenarios.includes(scenario))
      expect(owners.map((t) => t.id), scenario.id).toEqual([scenario.toolId])
    }
  })

  it('does not list scenarios under a tool that are missing from the scenario list', () => {
    for (const tool of tools) {
      for (const scenario of tool.scenarios) expect(scenarios, `${tool.id}/${scenario.id}`).toContain(scenario)
    }
  })

  it('indexes every scenario by id', () => {
    for (const scenario of scenarios) expect(scenarioById[scenario.id]).toBe(scenario)
  })
})
