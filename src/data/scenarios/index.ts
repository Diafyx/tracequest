import type { Scenario, Tool } from '../../types/simulation'
import { insertScenario } from './insert'
import { insertIndexedScenario } from './insertIndexed'
import { selectScenario } from './select'
import { updateScenario } from './update'
import { deleteScenario } from './delete'
import { cassandraWriteScenario } from './cassandraWrite'
import { cassandraReadScenario } from './cassandraRead'

export const scenarios: Scenario[] = [
  insertScenario,
  insertIndexedScenario,
  selectScenario,
  updateScenario,
  deleteScenario,
  cassandraWriteScenario,
  cassandraReadScenario,
]

export const scenarioById: Record<string, Scenario> = Object.fromEntries(scenarios.map((s) => [s.id, s]))

export const tools: Tool[] = [
  {
    id: 'postgres',
    label: 'PostgreSQL',
    title: 'PostgreSQL Internals',
    subtitle: 'A real B-tree heap storage engine, one query at a time.',
    scenarios: [insertScenario, insertIndexedScenario, selectScenario, updateScenario, deleteScenario],
  },
  {
    id: 'cassandra',
    label: 'Cassandra',
    title: 'Cassandra Internals',
    subtitle: 'A distributed, replicated, eventually-consistent wide-column store.',
    scenarios: [cassandraWriteScenario, cassandraReadScenario],
  },
]

export const toolById: Record<string, Tool> = Object.fromEntries(tools.map((t) => [t.id, t]))
