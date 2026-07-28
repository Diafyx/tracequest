import {
  Cpu,
  Database,
  HardDrive,
  Layers,
  ListTree,
  Lock,
  Monitor,
  Repeat,
  Route,
  RotateCw,
  ScanText,
  ScrollText,
  SearchCode,
  type LucideIcon,
} from 'lucide-react'
import type { NodeId } from '../types/simulation'

export interface ComponentInfo {
  id: NodeId
  label: string
  sublabel: string
  icon: LucideIcon
}

export interface ComponentZone {
  title: string
  items: ComponentInfo[]
}

export const componentZones: ComponentZone[] = [
  {
    title: 'Client',
    items: [{ id: 'client', label: 'Client', sublabel: 'psql / your app', icon: Monitor }],
  },
  {
    title: 'Query Processing',
    items: [
      { id: 'parser', label: 'Parser', sublabel: 'reads the SQL text', icon: ScanText },
      { id: 'analyzer', label: 'Analyzer', sublabel: 'checks it makes sense', icon: SearchCode },
      { id: 'rewriter', label: 'Rewriter', sublabel: 'applies table rules', icon: Repeat },
      { id: 'planner', label: 'Planner', sublabel: 'decides how to run it', icon: Route },
    ],
  },
  {
    title: 'Executor & Locks',
    items: [
      { id: 'executor', label: 'Executor', sublabel: 'does the actual work', icon: Cpu },
      { id: 'lock_manager', label: 'Lock Manager', sublabel: 'reserves the table', icon: Lock },
    ],
  },
  {
    title: 'Index',
    items: [{ id: 'index', label: 'B-tree Index', sublabel: 'fast lookup structure', icon: ListTree }],
  },
  {
    title: 'Memory',
    items: [
      { id: 'shared_buffers', label: 'Shared Buffers', sublabel: 'table pages in RAM', icon: Layers },
      { id: 'wal_buffers', label: 'WAL Buffers', sublabel: 'the diary, in RAM', icon: ScrollText },
    ],
  },
  {
    title: 'Disk',
    items: [
      { id: 'heap_file', label: 'Heap File', sublabel: 'the table, on disk', icon: Database },
      { id: 'wal_disk', label: 'pg_wal', sublabel: 'the diary, on disk', icon: HardDrive },
    ],
  },
  {
    title: 'Maintenance',
    items: [
      { id: 'bgwriter', label: 'Background Writer', sublabel: 'tidies up later', icon: RotateCw },
    ],
  },
]
