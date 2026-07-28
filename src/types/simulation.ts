/** Component-map node id. Each tool defines its own set (see data/components.ts). */
export type NodeId = string

export type StepPhase =
  | 'parse'
  | 'plan'
  | 'execute'
  | 'scan'
  | 'heap'
  | 'index'
  | 'wal'
  | 'commit'
  | 'background'

export interface SimStep {
  id: number
  phase: StepPhase
  title: string
  fn: string
  file: string
  description: string
  activeNode: NodeId
  fromNode?: NodeId
  xp: number
  /** Tags a step as a teachable "aha" moment; used to unlock cross-scenario insight achievements. */
  insight?: string
}

export interface Station {
  phase: StepPhase
  title: string
  range: [number, number]
}

export interface Scenario {
  id: string
  toolId: string
  tabLabel: string
  title: string
  subtitle: string
  steps: SimStep[]
  stations: Station[]
  /** Last step number on the synchronous, client-visible critical path (before any background phase). */
  criticalPathEnd: number
  totalXp: number
}

export interface ScenarioProgress {
  currentStep: number
  maxStepReached: number
}

export interface Tool {
  id: string
  label: string
  title: string
  subtitle: string
  scenarios: Scenario[]
}
