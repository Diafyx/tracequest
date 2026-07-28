import {
  Cpu,
  Database,
  HardDrive,
  Inbox,
  Layers,
  ListChecks,
  ListTree,
  Lock,
  Monitor,
  Repeat,
  Route,
  RotateCw,
  ScanText,
  ScrollText,
  SearchCode,
  Server,
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

const postgresZones: ComponentZone[] = [
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
    items: [{ id: 'bgwriter', label: 'Background Writer', sublabel: 'tidies up later', icon: RotateCw }],
  },
]

const cassandraZones: ComponentZone[] = [
  {
    title: 'Client',
    items: [{ id: 'cass_client', label: 'Client', sublabel: 'driver / cqlsh', icon: Monitor }],
  },
  {
    title: 'Query Processing',
    items: [{ id: 'query_processor', label: 'Query Processor', sublabel: 'parses CQL', icon: ScanText }],
  },
  {
    title: 'Coordinator',
    items: [{ id: 'coordinator', label: 'Coordinator', sublabel: 'StorageProxy', icon: Route }],
  },
  {
    title: 'Replicas (RF=3)',
    items: [
      { id: 'replica_a', label: 'Replica A', sublabel: 'one of 3 copies', icon: Server },
      { id: 'replica_b', label: 'Replica B', sublabel: 'one of 3 copies', icon: Server },
      { id: 'replica_c', label: 'Replica C', sublabel: 'currently offline', icon: Server },
    ],
  },
  {
    title: 'Per-Replica Storage',
    items: [
      { id: 'commit_log', label: 'Commit Log', sublabel: 'durability log, on disk', icon: ScrollText },
      { id: 'memtable', label: 'Memtable', sublabel: 'sorted data, in RAM', icon: Layers },
      { id: 'sstable', label: 'SSTable', sublabel: 'immutable file, on disk', icon: Database },
    ],
  },
  {
    title: 'Resilience',
    items: [{ id: 'hints_service', label: 'Hints Service', sublabel: 'IOUs for offline nodes', icon: Inbox }],
  },
  {
    title: 'Consensus',
    items: [{ id: 'paxos_log', label: 'Paxos Log', sublabel: 'system.paxos table', icon: ListChecks }],
  },
]

export const componentZonesByTool: Record<string, ComponentZone[]> = {
  postgres: postgresZones,
  cassandra: cassandraZones,
}
