import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { smoothPath, type Pt } from '../lib/smoothPath'
import { phaseHex, phaseIcon } from '../data/phaseTheme'
import type { Scenario } from '../types/simulation'

const VB_W = 1400
const VB_H = 320
const MARGIN_X = 90

type StationState = 'done' | 'current' | 'upcoming'

function stationState(currentStep: number, range: [number, number]): StationState {
  if (currentStep > range[1]) return 'done'
  if (currentStep >= range[0] && currentStep <= range[1]) return 'current'
  return 'upcoming'
}

function layoutMainPoints(count: number, reserveForAsync: boolean): Pt[] {
  if (count <= 1) return [{ x: MARGIN_X, y: 160 }]
  const span = VB_W - MARGIN_X * 2 - (reserveForAsync ? 100 : 0)
  return Array.from({ length: count }, (_, i) => ({
    x: MARGIN_X + (span / (count - 1)) * i,
    y: i % 2 === 0 ? 220 : 90,
  }))
}

export default function JourneyPath({ scenario, currentStep }: { scenario: Scenario; currentStep: number }) {
  const mainPathRef = useRef<SVGPathElement>(null)
  const asyncPathRef = useRef<SVGPathElement>(null)
  const [mainLen, setMainLen] = useState(0)
  const [asyncLen, setAsyncLen] = useState(0)

  const hasAsync = scenario.stations[scenario.stations.length - 1]?.phase === 'background'
  const mainStations = hasAsync ? scenario.stations.slice(0, -1) : scenario.stations
  const asyncStation = hasAsync ? scenario.stations[scenario.stations.length - 1] : null

  const mainPoints = useMemo(
    () => layoutMainPoints(mainStations.length, hasAsync),
    [mainStations.length, hasAsync],
  )
  const asyncPoint: Pt = useMemo(
    () => ({ x: mainPoints[mainPoints.length - 1].x + 100, y: 250 }),
    [mainPoints],
  )

  const mainD = useMemo(() => smoothPath(mainPoints), [mainPoints])
  const asyncD = useMemo(
    () => (hasAsync ? smoothPath([mainPoints[mainPoints.length - 1], asyncPoint]) : ''),
    [mainPoints, asyncPoint, hasAsync],
  )

  useLayoutEffect(() => {
    if (mainPathRef.current) setMainLen(mainPathRef.current.getTotalLength())
    if (asyncPathRef.current) setAsyncLen(asyncPathRef.current.getTotalLength())
  }, [mainD, asyncD])

  const totalSteps = scenario.steps.length
  const activeStep = currentStep > 0 ? scenario.steps[currentStep - 1] : null
  const inBackground = (activeStep?.phase ?? null) === 'background'

  const mainProgress = Math.min(currentStep, scenario.criticalPathEnd) / scenario.criticalPathEnd
  const asyncProgress =
    hasAsync && currentStep > scenario.criticalPathEnd
      ? (currentStep - scenario.criticalPathEnd) / (totalSteps - scenario.criticalPathEnd)
      : 0

  const mainMarker =
    currentStep > 0 && mainPathRef.current ? mainPathRef.current.getPointAtLength(mainLen * mainProgress) : null
  const asyncMarker =
    hasAsync && currentStep > scenario.criticalPathEnd && asyncPathRef.current
      ? asyncPathRef.current.getPointAtLength(asyncLen * asyncProgress)
      : null

  return (
    <div className="relative w-full" style={{ height: 260 }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="mainGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="35%" stopColor="#fcd34d" />
            <stop offset="65%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>
        </defs>

        <path d={mainD} stroke="#1e293b" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path
          ref={mainPathRef}
          d={mainD}
          stroke="url(#mainGrad)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={mainLen}
          strokeDashoffset={mainLen - mainLen * mainProgress}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />

        {hasAsync && (
          <>
            <path d={asyncD} stroke="#1e293b" strokeWidth={4} strokeDasharray="2 10" fill="none" strokeLinecap="round" />
            <path
              ref={asyncPathRef}
              d={asyncD}
              stroke="#94a3b8"
              strokeWidth={4}
              strokeDasharray={asyncLen}
              strokeDashoffset={asyncLen - asyncLen * asyncProgress}
              fill="none"
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </>
        )}

        {mainMarker && (
          <motion.circle
            r={9}
            fill="#22d3ee"
            animate={{ cx: mainMarker.x, cy: mainMarker.y }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
          />
        )}
        {asyncMarker && (
          <motion.circle
            r={7}
            fill="#94a3b8"
            animate={{ cx: asyncMarker.x, cy: asyncMarker.y }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 6px #94a3b8)' }}
          />
        )}
      </svg>

      {mainStations.map((st, i) => {
        const state = stationState(currentStep, st.range)
        const Icon = phaseIcon[st.phase]
        const hex = phaseHex[st.phase]
        const pt = mainPoints[i]
        return (
          <motion.div
            key={st.phase}
            style={{ left: `${(pt.x / VB_W) * 100}%`, top: `${(pt.y / VB_H) * 100}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-24"
            animate={state === 'current' ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={state === 'current' ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
          >
            <div
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
              style={{
                borderColor: state === 'upcoming' ? '#334155' : hex,
                background: state === 'upcoming' ? 'rgba(15,23,42,0.6)' : `${hex}22`,
                boxShadow: state === 'current' ? `0 0 28px 4px ${hex}88` : 'none',
                color: state === 'upcoming' ? '#475569' : hex,
              }}
            >
              <Icon size={22} />
            </div>
            <div
              className={`text-[11px] font-medium text-center leading-tight ${
                state === 'upcoming' ? 'text-slate-600' : 'text-slate-200'
              }`}
            >
              {st.title}
            </div>
          </motion.div>
        )
      })}

      {asyncStation && (
        <motion.div
          key={asyncStation.phase}
          style={{ left: `${(asyncPoint.x / VB_W) * 100}%`, top: `${(asyncPoint.y / VB_H) * 100}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 w-24"
          animate={
            stationState(currentStep, asyncStation.range) === 'current' ? { scale: [1, 1.12, 1] } : { scale: 1 }
          }
          transition={
            stationState(currentStep, asyncStation.range) === 'current'
              ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        >
          {(() => {
            const state = stationState(currentStep, asyncStation.range)
            const Icon = phaseIcon[asyncStation.phase]
            const hex = phaseHex[asyncStation.phase]
            return (
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
                style={{
                  borderColor: state === 'upcoming' ? '#334155' : hex,
                  background: state === 'upcoming' ? 'rgba(15,23,42,0.6)' : `${hex}22`,
                  boxShadow: state === 'current' ? `0 0 28px 4px ${hex}88` : 'none',
                  color: state === 'upcoming' ? '#475569' : hex,
                }}
              >
                <Icon size={22} />
              </div>
            )
          })()}
          <div
            className={`text-[11px] font-medium text-center leading-tight ${
              stationState(currentStep, asyncStation.range) === 'upcoming' ? 'text-slate-600' : 'text-slate-200'
            }`}
          >
            {asyncStation.title}
            <span className="block text-[9px] text-slate-500">(async)</span>
          </div>
        </motion.div>
      )}

      {!inBackground && currentStep > 0 && (
        <div className="absolute bottom-1 right-3 text-[10px] font-mono text-slate-600">
          critical path {Math.min(currentStep, scenario.criticalPathEnd)}/{scenario.criticalPathEnd}
        </div>
      )}
    </div>
  )
}
