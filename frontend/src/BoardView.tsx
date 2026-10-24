import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { Block, Board, Color } from './data/levels'

// flat, saturated tile colors: they have to hold their own next to thick black borders
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

/** The direction arrow. Its angle accumulates, so turning from "left" back to "up" keeps spinning clockwise. */
function Arrow({ rot, size, animated = true }: { rot: number; size: BoardSize; animated?: boolean }) {
  const st = useRef({ rot, angle: rot * 90 })
  if (st.current.rot !== rot) {
    const d = (rot - st.current.rot + 4) % 4
    st.current.angle += d === 3 ? -90 : d * 90
    st.current.rot = rot
  }
  const dims = { lg: 'border-x-[9px] border-b-[16px]', md: 'border-x-[7px] border-b-[13px]', sm: 'border-x-[4px] border-b-[8px]' }[size]
  return (
    <motion.div
      data-testid="arrow"
      className={`h-0 w-0 ${dims} border-x-transparent border-b-ink`}
      initial={false}
      animate={{ rotate: animated ? st.current.angle : rot * 90 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    />
  )
}

interface CellProps {
  block: Block
  x: number
  y: number
  size: BoardSize
  isErr: boolean
  ghost?: Block
  flashed: boolean
  flashColor?: Color
  onClick?: (e: React.MouseEvent) => void
  testId: string
  glide: boolean
}

function CellView({ block, x, y, size, isErr, ghost, flashed, flashColor, onClick, testId, glide }: CellProps) {
  const pulse = useAnimationControls()
  const prev = useRef(block.color)
  // paint: a quick scale pulse whenever the block's color changes
  useEffect(() => {
    if (prev.current === block.color) return
    prev.current = block.color
    void pulse.start({ scale: [1, 1.24, 1], transition: { duration: 0.45, ease: 'easeOut' } })
  }, [block.color, pulse])

  const dim = { lg: 'h-16 w-16', md: 'h-12 w-12', sm: 'h-8 w-8' }[size]
  return (
    <motion.div
      layout={glide}
      transition={{ layout: GLIDE }}
      style={{ gridColumn: x + 1, gridRow: y + 1 }}
      className={`${dim} relative ${onClick ? 'cursor-pointer' : ''}`}
      data-testid={testId}
      data-color={block.color}
      data-rot={block.rot ?? ''}
      data-flash={flashed ? 'true' : undefined}
      data-error={isErr ? 'true' : undefined}
      onClick={onClick}
    >
      <motion.div className="absolute inset-0" initial={false} animate={pulse}>
        <motion.div
          initial={false}
          animate={{ backgroundColor: HEX[block.color] }}
          transition={{ duration: 0.3 }}
          className={`tile ${size === 'sm' ? 'tile-sm' : size === 'md' ? 'tile-md' : ''} relative flex h-full w-full items-center justify-center ${
            isErr ? 'block-error' : ''
          } ${flashed ? 'animate-pulse tile-flash' : ''}`}
        >
          {block.rot !== undefined && <Arrow rot={block.rot} size={size} />}
        </motion.div>
      </motion.div>

      {ghost && (
        <div
          data-testid={`${testId.replace('-cell-', '-ghost-')}`}
          className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-dashed border-ink opacity-70"
          style={{ backgroundColor: HEX[ghost.color] }}
        >
          {ghost.rot !== undefined && <Arrow rot={ghost.rot} size={size} animated={false} />}
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

export default function BoardView({ board, ids, errorCells = [], size = 'lg', ghost = [], flash, onCellClick, testPrefix, glide = true }: Props) {
  const cols = board[0]?.length ?? 0
  const prefix = testPrefix ?? size
  const cells = board
    .flatMap((row, y) => row.map((block, x) => ({ block, x, y, id: ids?.[y]?.[x] ?? y * cols + x })))
    .sort((a, b) => a.id - b.id) // stable DOM order, so a moved block keeps its element
  return (
    <div
      className={`inline-grid bg-card border-ink ${
        { lg: 'gap-2 border-4 p-3 shadow-[6px_6px_0_#0a0a0a]', md: 'gap-1.5 border-4 p-2 shadow-[5px_5px_0_#0a0a0a]', sm: 'gap-1 border-[3px] p-1.5 shadow-[3px_3px_0_#0a0a0a]' }[size]
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
