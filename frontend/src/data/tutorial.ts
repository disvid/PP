// The guided lessons of the interactive tutorial. Shared: the React app shows them, the backend checks proofs against
// the same boards (POST /api/tutorial/check), so a lesson can never be "passed" by editing the page.
import { parseGrid } from './levels'
import type { Level } from './levels'

export type Needed = 'swap' | 'paint' | 'rotate' | 'def'

export interface Lesson {
  id: string
  title: string
  /** one-line goal shown above the editor */
  goal: string
  /** short bullets that walk through the lesson */
  steps: string[]
  /** what a proof has to use to count, on top of solving the board */
  mustUse: Needed
  /** shown after a run that works but does not solve the lesson */
  nudge: string
  /** the reference proof, revealed on request */
  solution: string
  level: Level
}

const level = (id: number, title: string, initial: string[], target: string[], par: number, optimalLines: number): Level => ({
  id,
  title,
  description: title,
  gridSize: 3,
  initialState: parseGrid(initial),
  targetState: parseGrid(target),
  parLimit: par,
  optimalLines,
})

export const LESSONS: Lesson[] = [
  {
    id: 'paint',
    title: 'Paint a block',
    goal: 'Turn the middle block green.',
    steps: [
      'Coordinates start at (0, 0) in the top-left corner. x runs right, y runs down, so the middle block is (1, 1).',
      'paint(x, y, color) recolors one block. Colors: blue, green, red, yellow, purple.',
      'Type your command in the editor and press Run.',
    ],
    mustUse: 'paint',
    nudge: 'The proof ran, but the middle block is not green yet. The middle of a 3×3 board is x = 1, y = 1.',
    solution: 'paint(1, 1, green)',
    level: level(
      -1,
      'Paint a block',
      ['B B B', 'B B B', 'B B B'],
      ['B B B', 'B G B', 'B B B'],
      2,
      1,
    ),
  },
  {
    id: 'swap',
    title: 'Swap two blocks',
    goal: 'Make the red and green blocks trade places.',
    steps: [
      'swap(x1, y1, x2, y2) trades the blocks at two coordinates.',
      'Red sits at (0, 0) and green at (2, 0). Swap them and the board matches the target.',
    ],
    mustUse: 'swap',
    nudge: 'Close! The two blocks to swap are in the top row: (0, 0) and (2, 0).',
    solution: 'swap(0, 0, 2, 0)',
    level: level(
      -2,
      'Swap two blocks',
      ['R B G', 'B B B', 'B B B'],
      ['G B R', 'B B B', 'B B B'],
      2,
      1,
    ),
  },
  {
    id: 'rotate',
    title: 'Turn an arrow',
    goal: 'Make the yellow arrow point left.',
    steps: [
      'rotate(x, y) turns an arrow block a quarter turn clockwise: up, right, down, left.',
      'The arrow starts pointing up and has to end pointing left. How many quarter turns is that? You have 3 lines.',
    ],
    mustUse: 'rotate',
    nudge: 'Up → right → down → left: that is three quarter turns, so rotate(0, 0) three times.',
    solution: 'rotate(0, 0)\nrotate(0, 0)\nrotate(0, 0)',
    level: level(
      -3,
      'Turn an arrow',
      ['Y^ B B', 'B B B', 'B B B'],
      ['Y< B B', 'B B B', 'B B B'],
      3,
      3,
    ),
  },
  {
    id: 'helper',
    title: 'Write a helper',
    goal: 'Paint all four corners red using only 3 lines.',
    steps: [
      'Four paint commands would take 4 lines, and the limit is 3. A helper fixes that.',
      'A helper is one def line that holds up to 4 commands: def two(a, b, c, d) := paint(a, b, red); paint(c, d, red)',
      'Call it like a command, once per pair of corners. The def line counts as a line and so does each call: 1 + 2 = 3.',
    ],
    mustUse: 'def',
    nudge: 'Define a helper that paints two blocks, then call it twice: one call per pair of corners.',
    solution: 'def two(a, b, c, d) := paint(a, b, red); paint(c, d, red)\ntwo(0, 0, 2, 0)\ntwo(0, 2, 2, 2)',
    level: level(
      -4,
      'Write a helper',
      ['B B B', 'B B B', 'B B B'],
      ['R B R', 'B B B', 'R B R'],
      3,
      3,
    ),
  },
]
