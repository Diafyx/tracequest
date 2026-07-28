import { motion } from 'framer-motion'
import { componentZonesByTool } from '../data/components'
import { phaseHex } from '../data/phaseTheme'
import type { Scenario } from '../types/simulation'

export default function ComponentMap({ scenario, currentStep }: { scenario: Scenario; currentStep: number }) {
  const activeStep = currentStep > 0 ? scenario.steps[currentStep - 1] : null
  const activeNode = activeStep?.activeNode ?? null
  const hex = activeStep ? phaseHex[activeStep.phase] : '#22d3ee'
  const componentZones = componentZonesByTool[scenario.toolId] ?? []

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-wrap gap-4">
        {componentZones.map((zone) => (
          <div key={zone.title} className="flex flex-col gap-1.5">
            <div className="text-[10px] uppercase tracking-wide text-slate-600">{zone.title}</div>
            <div className="flex gap-1.5">
              {zone.items.map((item) => {
                const active = item.id === activeNode
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.id}
                    animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                    transition={active ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.25 }}
                    className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
                    style={{
                      borderColor: active ? hex : '#1e293b',
                      background: active ? `${hex}1a` : 'rgba(15,23,42,0.4)',
                      boxShadow: active ? `0 0 16px 1px ${hex}55` : 'none',
                    }}
                  >
                    <Icon size={15} style={{ color: active ? hex : '#475569' }} />
                    <div className="leading-tight">
                      <div className={`text-xs font-medium ${active ? 'text-slate-100' : 'text-slate-500'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-600">{item.sublabel}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
