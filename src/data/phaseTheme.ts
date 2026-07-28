import {
  Cpu,
  Layers,
  ListTree,
  RotateCw,
  Route,
  ScanSearch,
  ScanText,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { StepPhase } from '../types/simulation'

export const phaseColor: Record<StepPhase, string> = {
  parse: 'text-violet-300 border-violet-500/40 bg-violet-500/10',
  plan: 'text-blue-300 border-blue-500/40 bg-blue-500/10',
  execute: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  scan: 'text-orange-300 border-orange-500/40 bg-orange-500/10',
  heap: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  index: 'text-teal-300 border-teal-500/40 bg-teal-500/10',
  wal: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
  commit: 'text-pink-300 border-pink-500/40 bg-pink-500/10',
  background: 'text-slate-400 border-slate-500/40 bg-slate-500/10',
}

export const phaseHex: Record<StepPhase, string> = {
  parse: '#c4b5fd',
  plan: '#93c5fd',
  execute: '#fcd34d',
  scan: '#fdba74',
  heap: '#6ee7b7',
  index: '#5eead4',
  wal: '#67e8f9',
  commit: '#f9a8d4',
  background: '#94a3b8',
}

export const phaseIcon: Record<StepPhase, LucideIcon> = {
  parse: ScanText,
  plan: Route,
  execute: Cpu,
  scan: ScanSearch,
  heap: Layers,
  index: ListTree,
  wal: ScrollText,
  commit: ShieldCheck,
  background: RotateCw,
}
