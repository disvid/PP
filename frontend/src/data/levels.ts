// Single source of truth for levels. Imported by the React app and by the backend evaluator,
// so keep this file dependency-free (types + data + tiny pure helpers only).

import { GENERATED_LEVELS } from './generatedLevels'

export type Color = 'blue' | 'green' | 'red' | 'yellow' | 'purple'
export const COLORS: Color[] = ['blue', 'green', 'red', 'yellow', 'purple']

/** rot is only present on directional (arrow) blocks: 0 = up, 1 = right, 2 = down, 3 = left. */
export interface Block {
  color: Color
  rot?: 0 | 1 | 2 | 3
}
export type Board = Block[][]

export interface Level {
  id: number
  title: string
  description: string
  gridSize: 3 | 4 | 5
  initialState: Board
  /** Win by matching this board exactly (colors and arrow directions)... */
  targetState?: Board
  /** ...and/or by satisfying this logical property (checked by Lean when available). */
  property?: Property
  /** Maximum allowed lines of code (blank lines and comments are free). */
  parLimit: number
  /**
   * Length of the shortest valid proof under the language rules (helper macros included). Scoring
   * compares the player's line count to this, not to the par limit.
   */
  optimalLines: number
  /** Base64url payload for user-made levels (see encodeCustom). Built-in levels leave this unset. */
  custom?: string
  /** Cells [x, y] whose block is locked: no command may swap, paint or rotate it. */
  locked?: [number, number][]
}

export const blocksEqual = (a: Block, b: Block) => a.color === b.color && a.rot === b.rot

export const boardMatches = (board: Board, target: Board) =>
  board.length === target.length &&
  board.every((row, y) => row.length === target[y].length && row.every((b, x) => blocksEqual(b, target[y][x])))

// ---- property-based targets -------------------------------------------------
export type Constraint =
  | { kind: 'noAdjacent'; color: Color }
  | { kind: 'count'; color: Color; n: number }
  | { kind: 'rowsUniform' }
  | { kind: 'symmetricH' }
export interface Property {
  constraints: Constraint[]
}

/** Number of violations of one constraint (0 = satisfied). Doubles as a distance for the hint solver. */
export function constraintViolations(b: Board, c: Constraint): number {
  const h = b.length
  const w = b[0].length
  let n = 0
  switch (c.kind) {
    case 'noAdjacent':
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          if (b[y][x].color !== c.color) continue
          if (x + 1 < w && b[y][x + 1].color === c.color) n++
          if (y + 1 < h && b[y + 1][x].color === c.color) n++
        }
      return n
    case 'count':
      return Math.abs(b.flat().filter((k) => k.color === c.color).length - c.n)
    case 'rowsUniform':
      for (const row of b) n += row.filter((k) => k.color !== row[0].color).length
      return n
    case 'symmetricH':
      for (const row of b) for (let x = 0; x < w >> 1; x++) if (row[x].color !== row[w - 1 - x].color) n++
      return n
  }
}

export const violations = (b: Board, p: Property) => p.constraints.reduce((s, c) => s + constraintViolations(b, c), 0)

export const isSolved = (level: Level, b: Board) =>
  (level.targetState ? boardMatches(b, level.targetState) : true) &&
  (level.property ? violations(b, level.property) === 0 : true)

const constraintLean = (c: Constraint): string => {
  switch (c.kind) {
    case 'noAdjacent':
      return `(∀ x y x' y', board[y][x].color = ${c.color} → adjacent (x, y) (x', y') → board[y'][x'].color ≠ ${c.color})`
    case 'count':
      return `(countColor board ${c.color} = ${c.n})`
    case 'rowsUniform':
      return '(∀ x y, board[y][x].color = board[y][0].color)'
    case 'symmetricH':
      return '(∀ x y, board[y][x].color = board[y][width - 1 - x].color)'
  }
}

/** The theorem statement shown in the UI when a level has no (or not only a) target picture. */
export const theoremText = (p: Property) =>
  `def isValid (board : Board) : Prop :=\n  ${p.constraints.map(constraintLean).join(' ∧\n  ')}\n\ntheorem solved : isValid (run proof initial) := by decide`

// ---- authoring helpers ------------------------------------------------------
// Rows are written top to bottom, blocks left to right. B G R Y P = blue green red yellow purple.
// A direction suffix makes a block directional: ^ up, > right, v down, < left (e.g. "Y^", "R>").
const LETTER: Record<string, Color> = { B: 'blue', G: 'green', R: 'red', Y: 'yellow', P: 'purple' }
const DIRS = '^>v<'

export const parseGrid = (rows: string[]): Board =>
  rows.map((row) =>
    row
      .trim()
      .split(/\s+/)
      .map((tok): Block => {
        const color = LETTER[tok[0]]
        const rot = tok.length > 1 ? DIRS.indexOf(tok[1]) : -1
        return rot >= 0 ? { color, rot: rot as 0 | 1 | 2 | 3 } : { color }
      }),
  )

const grid = parseGrid

export const boardToRows = (b: Board): string[] =>
  b.map((row) =>
    row.map((k) => Object.keys(LETTER).find((l) => LETTER[l] === k.color)! + (k.rot === undefined ? '' : DIRS[k.rot])).join(' '),
  )

const BLANK3 = ['B B B', 'B B B', 'B B B']
const BLANK4 = ['B B B B', 'B B B B', 'B B B B', 'B B B B']

const PAINT_TWO = 'def paintTwo(a, b, c, d) := paint(a, b, red); paint(c, d, red)'
const COORDS = 'Coordinates start at (0, 0) in the top-left corner; x grows to the right and y grows downward.'
const MACRO_TIP =
  'A helper is one line, can hold up to 4 swap/paint/rotate commands, and takes its coordinates as parameters.'

/** Levels 1-23: designed by hand, each with a proven shortest proof (see backend/verify-levels.ts). */
const HANDCRAFTED: Level[] = [
  // ---------------- Phase 1: the basics (3x3) ----------------
  {
    id: 1,
    title: 'First Brush',
    description: `Use paint(x, y, color) to turn the center block green. ${COORDS}`,
    gridSize: 3,
    initialState: grid(BLANK3),
    targetState: grid(['B B B', 'B G B', 'B B B']),
    parLimit: 2,
    optimalLines: 1,
  },
  {
    id: 2,
    title: 'Two Spots',
    description: 'Paint the top-left and bottom-right blocks red. Colors: blue, green, red, yellow, purple.',
    gridSize: 3,
    initialState: grid(BLANK3),
    targetState: grid(['R B B', 'B B B', 'B B R']),
    parLimit: 2,
    optimalLines: 2,
  },
  {
    id: 3,
    title: 'Make a Move',
    description: 'swap(x1, y1, x2, y2) exchanges two blocks. Move the red block into the bottom-right corner.',
    gridSize: 3,
    initialState: grid(['R B B', 'B B B', 'B B B']),
    targetState: grid(['B B B', 'B B B', 'B B R']),
    parLimit: 2,
    optimalLines: 1,
  },
  {
    id: 4,
    title: 'Face the Music',
    description:
      'Blocks with an arrow have a direction. rotate(x, y) turns one 90 degrees clockwise: up, right, down, left. Make the arrow point down.',
    gridSize: 3,
    initialState: grid(['B B B', 'B G^ B', 'B B B']),
    targetState: grid(['B B B', 'B Gv B', 'B B B']),
    parLimit: 3,
    optimalLines: 2,
  },
  {
    id: 5,
    title: 'Turn and Travel',
    description: 'Carry the yellow arrow to the right edge and make it point down. Swap, then rotate.',
    gridSize: 3,
    initialState: grid(['B B B', 'Y^ B B', 'B B B']),
    targetState: grid(['B B B', 'B B Yv', 'B B B']),
    parLimit: 4,
    optimalLines: 2,
  },

  // ---------------- Phase 2: combinations (3x3) ----------------
  {
    id: 6,
    title: 'Swap, Then Paint',
    description: 'Send the red block to the top-right corner, then paint the block it left behind next to it green.',
    gridSize: 3,
    initialState: grid(['R B B', 'B B B', 'B B B']),
    targetState: grid(['B G R', 'B B B', 'B B B']),
    parLimit: 3,
    optimalLines: 2,
  },
  {
    id: 7,
    title: 'Red Row',
    description: 'Gather the three red blocks into a row along the top. Swapping beats painting.',
    gridSize: 3,
    initialState: grid(['R B B', 'B R B', 'B B R']),
    targetState: grid(['R R R', 'B B B', 'B B B']),
    parLimit: 3,
    optimalLines: 2,
  },
  {
    id: 8,
    title: 'Blue Column',
    description: 'Make the middle column blue and the rest green. One swap saves you a line.',
    gridSize: 3,
    initialState: grid(['B G G', 'G G G', 'G G G']),
    targetState: grid(['G B G', 'G B G', 'G B G']),
    parLimit: 3,
    optimalLines: 2,
  },
  {
    id: 9,
    title: 'Diagonal Line',
    description: 'Line the red blocks up on the main diagonal, top-left to bottom-right.',
    gridSize: 3,
    initialState: grid(['B B R', 'R B B', 'B B B']),
    targetState: grid(['R B B', 'B R B', 'B B R']),
    parLimit: 4,
    optimalLines: 2,
  },
  {
    id: 10,
    title: 'Plus Sign',
    description: 'Turn the four yellow corners into a plus sign. Each swap fixes two blocks at once.',
    gridSize: 3,
    initialState: grid(['Y B Y', 'B B B', 'Y B Y']),
    targetState: grid(['B Y B', 'Y Y Y', 'B Y B']),
    parLimit: 5,
    optimalLines: 3,
  },

  // ---------------- Phase 3: macros (4x4) ----------------
  {
    id: 11,
    title: 'Four Corners',
    description: `Painting four corners one by one takes 4 lines, but the par is 3. Define a helper: ${PAINT_TWO}. Then call it, e.g. paintTwo(0, 0, 3, 0). ${COORDS}`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R B B R', 'B B B B', 'B B B B', 'R B B R']),
    parLimit: 3,
    optimalLines: 2,
  },
  {
    id: 12,
    title: 'Cross',
    description: `Draw a red cross along row 1 and column 1. Seven blocks need painting, so reuse your helper: ${PAINT_TWO}. Calling it with the same cell twice is fine.`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['B R B B', 'R R R R', 'B R B B', 'B R B B']),
    parLimit: 5,
    optimalLines: 3,
  },
  {
    id: 13,
    title: 'Top and Bottom',
    description: `Paint the whole top row and the whole bottom row red. Helper: ${PAINT_TWO}.`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R R R R', 'B B B B', 'B B B B', 'R R R R']),
    parLimit: 5,
    optimalLines: 3,
  },
  {
    id: 14,
    title: 'The X',
    description: `Paint both diagonals red. paintTwo would need 5 lines, but the par is 4. ${MACRO_TIP} A parameter may be used more than once, e.g. def four(a, b) := paint(a, a, red); paint(b, b, red); paint(a, b, red); paint(b, a, red).`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R B B R', 'B R R B', 'B R R B', 'R B B R']),
    parLimit: 4,
    optimalLines: 3,
  },
  {
    id: 15,
    title: 'Two Stripes',
    description:
      'Top row red, bottom row yellow. Give your helper a color parameter: def paintTwo(a, b, c, d, col) := paint(a, b, col); paint(c, d, col). Then call paintTwo(0, 0, 1, 0, red).',
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R R R R', 'B B B B', 'B B B B', 'Y Y Y Y']),
    parLimit: 5,
    optimalLines: 3,
  },

  // ---------------- Phase 4: advanced proofs (4x4) ----------------
  {
    id: 16,
    title: 'Checkerboard',
    description:
      'Make a blue and green checkerboard: green wherever x + y is odd, with (0, 1) green and (0, 0) blue. Your helper can paint green instead: def paintTwo(a, b, c, d) := paint(a, b, green); paint(c, d, green).',
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['B G B G', 'G B G B', 'B G B G', 'G B G B']),
    parLimit: 5,
    optimalLines: 3,
  },
  {
    id: 17,
    title: 'Hollow Border',
    description: `Paint the 12 border blocks red and leave the middle 2x2 blue. Helper: ${PAINT_TWO}.`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R R R R', 'R B B R', 'R B B R', 'R R R R']),
    parLimit: 7,
    optimalLines: 4,
  },
  {
    id: 18,
    title: 'Spiral',
    description: `Trace the red spiral: along the top, down the right side, back along the bottom to x = 1, up one block, then left to the edge. Helper: ${PAINT_TWO}.`,
    gridSize: 4,
    initialState: grid(BLANK4),
    targetState: grid(['R R R R', 'B B B R', 'R R B R', 'B R R R']),
    parLimit: 7,
    optimalLines: 4,
  },
  {
    id: 19,
    title: 'Courier',
    description:
      'Four yellow arrows are scattered around the board. Carry each one onto the main diagonal and paint it green. Try a helper that swaps and paints in one go: def mv(a, b, c, d) := swap(a, b, c, d); paint(c, d, green).',
    gridSize: 4,
    initialState: grid(['B Y^ B B', 'B B B Y^', 'Y^ B B B', 'B B Y^ B']),
    targetState: grid(['G^ B B B', 'B G^ B B', 'B B G^ B', 'B B B G^']),
    parLimit: 5,
    optimalLines: 3,
  },
  {
    id: 20,
    title: 'Grand Finale',
    description:
      'Chaos! Each yellow arrow must trade places with a purple block, then both blocks turn red, and the arrow must end up pointing right. One helper can swap, paint both blocks and rotate: def fix(a, b, c, d) := swap(a, b, c, d); paint(a, b, red); paint(c, d, red); rotate(c, d).',
    gridSize: 4,
    initialState: grid(['Y^ B P B', 'B P B Y^', 'Y^ B B P', 'B P Y^ B']),
    targetState: grid(['R B R> B', 'B R> B R', 'R B B R>', 'B R> R B']),
    parLimit: 6,
    optimalLines: 5,
  },

  // ---------------- Phase 5: property targets (no picture, just a theorem) ----------------
  {
    id: 21,
    title: 'Spread Out',
    description:
      'No picture this time: any board satisfying the theorem wins. Keep exactly four red blocks, but make sure no two reds touch (up, down, left or right).',
    gridSize: 4,
    initialState: grid(['R R B B', 'R R B B', 'B B B B', 'B B B B']),
    property: {
      constraints: [
        { kind: 'noAdjacent', color: 'red' },
        { kind: 'count', color: 'red', n: 4 },
      ],
    },
    parLimit: 2,
    optimalLines: 2,
  },
  {
    id: 22,
    title: 'Any Stripe',
    description: 'Make every row a single color while keeping exactly three red blocks. Which row you choose is up to you.',
    gridSize: 3,
    initialState: grid(['R B B', 'B R B', 'B B R']),
    property: {
      constraints: [
        { kind: 'rowsUniform' },
        { kind: 'count', color: 'red', n: 3 },
      ],
    },
    parLimit: 2,
    optimalLines: 2,
  },
  {
    id: 23,
    title: 'Mirror, Mirror',
    description: 'Make the board mirror-symmetric left to right with exactly four yellow blocks.',
    gridSize: 4,
    initialState: grid(['Y B B B', 'Y B B B', 'B B B B', 'B B B B']),
    property: {
      constraints: [
        { kind: 'symmetricH' },
        { kind: 'count', color: 'yellow', n: 4 },
      ],
    },
    parLimit: 2,
    optimalLines: 2,
  },
]

/**
 * Levels 24-67: procedurally generated scrambles, sorted by difficulty (3x3, then 4x4, then 5x5, each tier with
 * longer and longer shortest proofs). The loop only turns the generated rows into levels; the generation itself
 * (and the search for each level's shortest proof) is backend/scripts/generate-levels.ts, whose output is checked in.
 */
const GENERATED: Level[] = GENERATED_LEVELS.map((g) => ({
  id: g.id,
  title: g.title,
  description: g.description,
  gridSize: g.size,
  initialState: parseGrid(g.initial),
  targetState: parseGrid(g.target),
  parLimit: g.par,
  optimalLines: g.optimal,
}))

export const LEVELS: Level[] = [...HANDCRAFTED, ...GENERATED]

// ---- user-made levels (Level Builder) ---------------------------------------
export interface CustomPayload {
  title: string
  size: 3 | 4
  initial: string[]
  target?: string[]
  property?: Property
  par: number
  /** The creator's best known solution length (defaults to par). */
  optimal: number
  /** Locked cells [x, y], see Level.locked. */
  locked?: [number, number][]
}

export const MAX_LOCKED = 4

const TOKEN = /^[BGRYP][\^>v<]?$/

function validRows(rows: unknown, size: number, what: string): string[] {
  if (!Array.isArray(rows) || rows.length !== size) throw new Error(`${what}: expected ${size} rows`)
  return rows.map((r) => {
    const toks = typeof r === 'string' ? r.trim().split(/\s+/) : []
    if (toks.length !== size || !toks.every((t) => TOKEN.test(t))) throw new Error(`${what}: bad row`)
    return toks.join(' ')
  })
}

/** Validate untrusted input (builder form or decoded URL) and return a normalised payload. */
export function validateCustom(raw: unknown): CustomPayload {
  const p = raw as Partial<CustomPayload> | null
  if (!p || typeof p !== 'object') throw new Error('Bad level')
  const title = typeof p.title === 'string' ? p.title.trim().slice(0, 40) : ''
  if (!title) throw new Error('Title required')
  if (p.size !== 3 && p.size !== 4) throw new Error('Grid size must be 3 or 4')
  if (!Number.isInteger(p.par) || p.par! < 1 || p.par! > 30) throw new Error('Par must be 1-30')
  const initial = validRows(p.initial, p.size, 'Initial state')
  const target = p.target === undefined ? undefined : validRows(p.target, p.size, 'Target state')
  let property: Property | undefined
  if (p.property !== undefined) {
    const cs = p.property?.constraints
    if (!Array.isArray(cs) || cs.length < 1 || cs.length > 4) throw new Error('Property needs 1-4 constraints')
    property = {
      constraints: cs.map((c): Constraint => {
        if (c?.kind === 'rowsUniform' || c?.kind === 'symmetricH') return { kind: c.kind }
        if (c?.kind === 'noAdjacent' && COLORS.includes(c.color)) return { kind: 'noAdjacent', color: c.color }
        if (c?.kind === 'count' && COLORS.includes(c.color) && Number.isInteger(c.n) && c.n >= 0 && c.n <= 16)
          return { kind: 'count', color: c.color, n: c.n }
        throw new Error('Bad constraint')
      }),
    }
  }
  if (!target && !property) throw new Error('Level needs a target board or a property')
  const locked = validLocked(p.locked, p.size, initial, target)
  const optimal = p.optimal === undefined ? p.par! : p.optimal
  if (!Number.isInteger(optimal) || optimal < 1 || optimal > p.par!) throw new Error('Optimal lines must be between 1 and par')
  // paint never creates arrows and swap only moves them, so the arrow counts must agree
  const arrows = (rows: string[]) => rows.join(' ').split(' ').filter((t) => t.length > 1).length
  if (target && arrows(initial) !== arrows(target)) throw new Error('Initial and target must have the same number of arrow blocks')
  return { title, size: p.size, initial, ...(target && { target }), ...(property && { property }), par: p.par!, optimal, ...(locked.length > 0 && { locked }) }
}

/** Locked cells: distinct, on the board, and (when there is a target) holding the same block before and after, since nothing can change them. */
function validLocked(raw: unknown, size: number, initial: string[], target?: string[]): [number, number][] {
  if (raw === undefined) return []
  if (!Array.isArray(raw) || raw.length > MAX_LOCKED) throw new Error(`At most ${MAX_LOCKED} locked blocks`)
  const seen = new Set<string>()
  const cells = raw.map((c): [number, number] => {
    const ok = Array.isArray(c) && c.length === 2 && c.every((n) => Number.isInteger(n) && n >= 0 && n < size)
    if (!ok) throw new Error('Bad locked block')
    const [x, y] = c as [number, number]
    if (seen.has(`${x},${y}`)) throw new Error('Duplicate locked block')
    seen.add(`${x},${y}`)
    if (target && initial[y].split(' ')[x] !== target[y].split(' ')[x]) throw new Error(`Locked block (${x}, ${y}) must be the same in the initial and target boards`)
    return [x, y]
  })
  return cells
}

export function encodeCustom(p: CustomPayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(p))
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeCustom(b64: string): CustomPayload {
  let raw: unknown
  try {
    const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
    raw = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))))
  } catch {
    throw new Error('Invalid level link')
  }
  return validateCustom(raw)
}

export function customToLevel(p: CustomPayload): Level {
  return {
    id: 0,
    title: p.title,
    description: p.property
      ? 'Custom level: make the board satisfy the theorem.'
      : 'Custom level: make the board match the target.',
    gridSize: p.size,
    initialState: parseGrid(p.initial),
    targetState: p.target ? parseGrid(p.target) : undefined,
    property: p.property,
    parLimit: p.par,
    optimalLines: p.optimal,
    custom: encodeCustom(p),
    ...(p.locked && { locked: p.locked }),
  }
}

/** Stable identifier used for scoring and timing sessions: "1".."23" or "c_<hash>". */
export function levelKey(l: Level): string {
  if (!l.custom) return String(l.id)
  let a = 0x811c9dc5
  let b = 0x01000193
  for (let i = 0; i < l.custom.length; i++) {
    a = Math.imul(a ^ l.custom.charCodeAt(i), 0x01000193) >>> 0
    b = Math.imul(b + l.custom.charCodeAt(i), 0x85ebca6b) >>> 0
  }
  return 'c_' + a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0')
}
