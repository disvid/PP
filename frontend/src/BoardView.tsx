import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { Block, Board, Color } from './data/levels'

// flat, saturated tile colors: they have to hold their own next to thick borders
const HEX: Record<Color, string> = {
  blue: '#2f6bff',
  green: '#16d65a',
  red: '#ff3b3b',
  yellow: '#ffd60a',
  purple: '#a14dff',
}

/** Blocks glide to a new grid cell with spring physics when they swap places. */
const GLIDE = { type: 'spring', stiffness: 380, damping: 30, mass: 0.9 } as const

export interface Flash {
  cells: [number, number][]
  /** for a paint hint: the color to paint, shown as a swatch */
  color?: Color
}

/** lg: the board you play on; md: boards shown side by side (battles); sm: small reference boards */
export type BoardSize = 'lg' | 'md' | 'sm'

interface Props {
  board: Board
  /**
   * A stable id for every block, in the same shape as `board`. Blocks keep their id when a swap moves them,
   * which is what lets them glide instead of being redrawn. Without it, blocks are identified by position.
   */
  ids?: number[][]
  errorCells?: [number, number][]
  /** cells whose block is locked: drawn with a padlock, no command may touch them */
  locked?: [number, number][]
  size?: BoardSize
  /** translucent preview of blocks that a hovered line would change */
  ghost?: { x: number; y: number; after: Block }[]
  /** briefly highlighted cells (hints) */
  flash?: Flash | null
  onCellClick?: (x: number, y: number, e: React.MouseEvent) => void
  testPrefix?: string
  /** set false inside an element that is itself being animated (a modal): layout animations would be measured wrongly */
  glide?: boolean
}

/** The direction arrow, drawn at its final angle. On a rotate the whole tile spins (see CellView) and carries it there. */
function Arrow({ rot, size }: { rot: number; size: BoardSize }) {
  const dims = { lg: 'border-x-[9px] border-b-[16px]', md: 'border-x-[7px] border-b-[13px]', sm: 'border-x-[4px] border-b-[8px]' }[size]
  return (
    <div
      data-testid="arrow"
      className={`h-0 w-0 ${dims} border-x-transparent border-b-black`}
      style={{ transform: `rotate(${rot * 90}deg)` }}
    />
  )
}

interface CellProps {
  block: Block
  x: number
  y: number
  size: BoardSize
  isErr: boolean
  isLocked: boolean
  ghost?: Block
  flashed: boolean
  flashColor?: Color
  onClick?: (e: React.MouseEvent) => void
  testId: string
  glide: boolean
}

function CellView({ block, x, y, size, isErr, isLocked, ghost, flashed, flashColor, onClick, testId, glide }: CellProps) {
  const pulse = useAnimationControls()
  const prevColor = useRef(block.color)
  const prevRot = useRef(block.rot)
  // a new key restarts a CSS animation
  const [spin, setSpin] = useState({ n: 0, quarterTurns: 1 })
  const [splash, setSplash] = useState(0)
  const [sliding, setSliding] = useState(false)

  // paint: a scale pulse plus a white splash over the tile
  useEffect(() => {
    if (prevColor.current === block.color) return
    prevColor.current = block.color
    void pulse.start({ scale: [1, 1.24, 1], transition: { duration: 0.45, ease: 'easeOut' } })
    setSplash((n) => n + 1)
  }, [block.color, pulse])

  // rotate: the whole tile spins from its old angle to the new one
  useEffect(() => {
    const before = prevRot.current
    prevRot.current = block.rot
    if (before === undefined || block.rot === undefined || before === block.rot) return
    // 1 = a clockwise quarter turn, 2 = half turn, 3 = a quarter turn back
    setSpin((s) => ({ n: s.n + 1, quarterTurns: (block.rot! - before + 4) % 4 }))
  }, [block.rot])

  const dim = { lg: 'h-16 w-16', md: 'h-12 w-12', sm: 'h-8 w-8' }[size]
  return (
    <motion.div
      layout={glide}
      transition={{ layout: GLIDE }}
      onLayoutAnimationStart={() => setSliding(true)}
      onLayoutAnimationComplete={() => setSliding(false)}
      // a sliding tile passes over its neighbours instead of under them
      style={{ gridColumn: x + 1, gridRow: y + 1, zIndex: sliding ? 20 : 'auto' }}
      className={`${dim} relative ${onClick ? 'cursor-pointer' : ''}`}
      data-testid={testId}
      data-color={block.color}
      data-rot={block.rot ?? ''}
      data-flash={flashed ? 'true' : undefined}
      data-error={isErr ? 'true' : undefined}
      data-locked={isLocked ? 'true' : undefined}
      data-sliding={sliding ? 'true' : undefined}
      onClick={onClick}
    >
      <motion.div className="absolute inset-0" initial={false} animate={pulse}>
        <div key={spin.n} data-testid="spinner" className={`absolute inset-0 ${spin.n ? `tile-spin-${spin.quarterTurns}` : ''}`}>
          <motion.div
            initial={false}
            animate={{ backgroundColor: HEX[block.color] }}
            transition={{ duration: 0.3 }}
            className={`tile ${size === 'sm' ? 'tile-sm' : size === 'md' ? 'tile-md' : ''} relative flex h-full w-full items-center justify-center ${
              sliding ? 'tile-lifted' : ''
            } ${isErr ? 'block-error' : ''} ${flashed ? 'animate-pulse tile-flash' : ''}`}
          >
            {block.rot !== undefined && <Arrow rot={block.rot} size={size} />}
            {isLocked && (
              <span className={`tile-lock ${size === 'sm' ? 'tile-lock-sm' : ''}`} data-testid="lock" title="Locked: no command can touch this block" aria-label="locked">
                🔒
              </span>
            )}
          </motion.div>
        </div>
        {splash > 0 && <div key={splash} data-testid="splash" className="paint-splash absolute inset-0" />}
      </motion.div>

      {ghost && (
        <div
          data-testid={`${testId.replace('-cell-', '-ghost-')}`}
          className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-dashed border-ink opacity-70"
          style={{ backgroundColor: HEX[ghost.color] }}
        >
          {ghost.rot !== undefined && <Arrow rot={ghost.rot} size={size} />}
        </div>
      )}
      {flashed && flashColor && (
        <div
          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink"
          style={{ backgroundColor: HEX[flashColor] }}
        />
      )}
    </motion.div>
  )
}

export default function BoardView({ board, ids, errorCells = [], locked = [], size = 'lg', ghost = [], flash, onCellClick, testPrefix, glide = true }: Props) {
  const cols = board[0]?.length ?? 0
  const prefix = testPrefix ?? size
  const cells = board
    .flatMap((row, y) => row.map((block, x) => ({ block, x, y, id: ids?.[y]?.[x] ?? y * cols + x })))
    .sort((a, b) => a.id - b.id) // stable DOM order, so a moved block keeps its element
  return (
    <div
      className={`inline-grid bg-card border-ink ${
        {
          lg: 'gap-2 border-4 p-3 shadow-[6px_6px_0_var(--shade)]',
          md: 'gap-1.5 border-4 p-2 shadow-[5px_5px_0_var(--shade)]',
          sm: 'gap-1 border-[3px] p-1.5 shadow-[3px_3px_0_var(--shade)]',
        }[size]
      }`}
      style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}
    >
      {cells.map(({ block, x, y, id }) => (
        <CellView
          key={id}
          block={block}
          x={x}
          y={y}
          size={size}
          isErr={errorCells.some(([ex, ey]) => ex === x && ey === y)}
          isLocked={locked.some(([lx, ly]) => lx === x && ly === y)}
          ghost={ghost.find((c) => c.x === x && c.y === y)?.after}
          flashed={!!flash?.cells.some(([fx, fy]) => fx === x && fy === y)}
          flashColor={flash?.color}
          onClick={onCellClick ? (e) => onCellClick(x, y, e) : undefined}
          testId={`${prefix}-cell-${x}-${y}`}
          glide={glide}
        />
      ))}
    </div>
  )
}
