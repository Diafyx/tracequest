import type { Scenario, ScenarioProgress } from '../types/simulation'

export type AchievementCondition =
  | { type: 'first_step' }
  | { type: 'insight'; tag: string }
  | { type: 'scenario_complete'; scenarioId: string }
  | { type: 'all_complete' }

export interface AchievementDef {
  id: string
  title: string
  description: string
  condition: AchievementCondition
}

export const achievementDefs: AchievementDef[] = [
  {
    id: 'first_step',
    title: 'First Contact',
    description: 'Watched your first step of real PostgreSQL internals.',
    condition: { type: 'first_step' },
  },
  {
    id: 'wal_before_data',
    title: 'WAL-Before-Data',
    description: "Watched Postgres write its diary entry before the real data — the core durability rule.",
    condition: { type: 'insight', tag: 'wal_before_data' },
  },
  {
    id: 'durability_point',
    title: 'Crash-Safe',
    description: 'Reached the exact fsync instant where a change becomes permanently safe.',
    condition: { type: 'insight', tag: 'durability_point' },
  },
  {
    id: 'mvcc_visibility',
    title: 'Time Traveler',
    description: 'Saw Postgres decide, row by row, exactly what your snapshot is and isn’t allowed to see.',
    condition: { type: 'insight', tag: 'mvcc_visibility' },
  },
  {
    id: 'tombstone',
    title: 'Nothing Really Dies',
    description: 'Watched Postgres mark a row as gone without erasing a single byte of it.',
    condition: { type: 'insight', tag: 'tombstone' },
  },
  {
    id: 'index_descent',
    title: 'Tree Walker',
    description: 'Watched Postgres descend a B-tree index to find exactly where your data belongs.',
    condition: { type: 'insight', tag: 'index_descent' },
  },
  {
    id: 'complete_insert',
    title: 'Row Maker',
    description: 'Traced a full INSERT end to end.',
    condition: { type: 'scenario_complete', scenarioId: 'insert' },
  },
  {
    id: 'complete_insert_indexed',
    title: 'Index Keeper',
    description: 'Traced a full INSERT into an indexed table, including the B-tree update.',
    condition: { type: 'scenario_complete', scenarioId: 'insert_indexed' },
  },
  {
    id: 'complete_select',
    title: 'Row Finder',
    description: 'Traced a full SELECT end to end.',
    condition: { type: 'scenario_complete', scenarioId: 'select' },
  },
  {
    id: 'complete_update',
    title: 'Row Changer',
    description: 'Traced a full UPDATE end to end.',
    condition: { type: 'scenario_complete', scenarioId: 'update' },
  },
  {
    id: 'complete_delete',
    title: 'Row Remover',
    description: 'Traced a full DELETE end to end.',
    condition: { type: 'scenario_complete', scenarioId: 'delete' },
  },
  {
    id: 'all_complete',
    title: 'SQL Internals Master',
    description:
      'Completed every operation — INSERT, indexed INSERT, SELECT, UPDATE, and DELETE — from source code to disk.',
    condition: { type: 'all_complete' },
  },
]

export function evaluateAchievements(
  progress: Record<string, ScenarioProgress>,
  scenarios: Scenario[],
): string[] {
  const unlocked = new Set<string>()

  if (Object.values(progress).some((p) => p.maxStepReached >= 1)) unlocked.add('first_step')

  const seenInsights = new Set<string>()
  for (const scenario of scenarios) {
    const p = progress[scenario.id]
    if (!p) continue
    for (const step of scenario.steps) {
      if (step.id <= p.maxStepReached && step.insight) seenInsights.add(step.insight)
    }
  }

  for (const def of achievementDefs) {
    if (def.condition.type === 'insight' && seenInsights.has(def.condition.tag)) {
      unlocked.add(def.id)
    }
    if (def.condition.type === 'scenario_complete') {
      const scenarioId = def.condition.scenarioId
      const p = progress[scenarioId]
      const scenario = scenarios.find((s) => s.id === scenarioId)
      if (p && scenario && p.maxStepReached >= scenario.steps.length) unlocked.add(def.id)
    }
  }

  if (scenarios.every((s) => (progress[s.id]?.maxStepReached ?? 0) >= s.steps.length)) {
    unlocked.add('all_complete')
  }

  return Array.from(unlocked)
}
