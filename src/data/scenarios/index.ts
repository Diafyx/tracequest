import type { Scenario } from '../../types/simulation'
import { insertScenario } from './insert'
import { insertIndexedScenario } from './insertIndexed'
import { selectScenario } from './select'
import { updateScenario } from './update'
import { deleteScenario } from './delete'

export const scenarios: Scenario[] = [
  insertScenario,
  insertIndexedScenario,
  selectScenario,
  updateScenario,
  deleteScenario,
]

export const scenarioById: Record<string, Scenario> = Object.fromEntries(scenarios.map((s) => [s.id, s]))
