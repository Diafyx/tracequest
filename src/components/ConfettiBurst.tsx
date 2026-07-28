import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#22d3ee', '#34d399', '#fcd34d', '#f9a8d4', '#c4b5fd', '#fb923c']

interface Piece {
  id: number
  left: number
  color: string
  delay: number
  duration: number
  rotate: number
  drift: number
}

export default function ConfettiBurst({ count = 70 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.5,
        duration: 2.4 + Math.random() * 1.6,
        rotate: 180 + Math.random() * 540,
        drift: (Math.random() - 0.5) * 160,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: `${p.left}vw`, y: '-6vh', rotate: 0, opacity: 1 }}
          animate={{ y: '106vh', x: `calc(${p.left}vw + ${p.drift}px)`, rotate: p.rotate, opacity: [1, 1, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute top-0 left-0 w-2 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  )
}
