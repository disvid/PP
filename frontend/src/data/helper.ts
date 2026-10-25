// The rules a helper (a `def` line) has to follow, and the text the helper builder generates from its form. Pure and
// dependency-free so the backend tests can run the generated source through the real parser (backend/engine.ts).

export type Op = 'swap' | 'paint' | 'rotate'

/** What each command takes. A slot is a coordinate or (paint's last one) a color. */
export const SLOTS: Record<Op, { label: string; color?: boolean }[]> = {
  swap: [{ label: 'x1' }, { label: 'y1' }, { label: 'x2' }, { label: 'y2' }],
  paint: [{ label: 'x' }, { label: 'y' }, { label: 'color', color: true }],
  rotate: [{ label: 'x' }, { label: 'y' }],
}

export const PARAMS = ['a', 'b', 'c', 'd', 'e', 'f'] // the language allows up to 6 parameters
export const MAX_COMMANDS = 4
const RESERVED = new Set(['swap', 'paint', 'rotate', 'def'])

export interface Row { op: Op; args: string[] }

export const PRESETS: { title: string; name: string; rows: Row[] }[] = [
  { title: 'Paint two blocks', name: 'two', rows: [{ op: 'paint', args: ['a', 'b', 'red'] }, { op: 'paint', args: ['c', 'd', 'red'] }] },
  { title: 'Paint one block, any color', name: 'dab', rows: [{ op: 'paint', args: ['a', 'b', 'c'] }] },
  { title: 'Turn an arrow twice', name: 'flip', rows: [{ op: 'rotate', args: ['a', 'b'] }, { op: 'rotate', args: ['a', 'b'] }] },
  { title: 'Swap two pairs', name: 'twin', rows: [{ op: 'swap', args: ['a', 'b', 'c', 'd'] }, { op: 'swap', args: ['e', 'f', 'a', 'b'] }] },
]

export const blankRow = (op: Op): Row => ({ op, args: SLOTS[op].map((s, i) => (s.color ? 'red' : PARAMS[i])) })

/** Parameter letters in the order the def line lists them, each with what it stands for. */
export function paramsOf(rows: Row[]): { name: string; kind: 'number' | 'color' | 'mixed' }[] {
  const kinds = new Map<string, Set<'number' | 'color'>>()
  rows.forEach((r) =>
    r.args.forEach((a, i) => {
      if (!PARAMS.includes(a)) return
      const set = kinds.get(a) ?? new Set()
      set.add(SLOTS[r.op][i].color ? 'color' : 'number')
      kinds.set(a, set)
    }),
  )
  return PARAMS.filter((p) => kinds.has(p)).map((p) => {
    const k = kinds.get(p)!
    return { name: p, kind: k.size > 1 ? 'mixed' : k.has('color') ? 'color' : 'number' }
  })
}

/** The helper as source text, plus what is wrong with it (empty when it is fine). Mirrors the rules in backend/engine.ts. */
export function buildHelper(name: string, rows: Row[]): { def: string; params: ReturnType<typeof paramsOf>; problem: string } {
  const params = paramsOf(rows)
  const body = rows.map((r) => `${r.op}(${r.args.join(', ')})`).join('; ')
  const def = `def ${name}(${params.map((p) => p.name).join(', ')}) := ${body}`
  let problem = ''
  if (!/^[A-Za-z_]\w*$/.test(name)) problem = 'The name must start with a letter and use only letters, digits or _.'
  else if (RESERVED.has(name)) problem = `\`${name}\` is already a command. Pick another name.`
  else if (rows.length === 0) problem = 'Add at least one command.'
  else if (rows.length > MAX_COMMANDS) problem = `A helper holds at most ${MAX_COMMANDS} commands.`
  else if (params.some((p) => p.kind === 'mixed')) problem = 'A parameter cannot be both a coordinate and a color.'
  else if (!params.length) problem = 'Use at least one parameter: coordinates cannot be written into a helper.'
  else if (rows.some((r) => r.args.some((a, i) => !SLOTS[r.op][i].color && !PARAMS.includes(a))))
    problem = 'Coordinates must be parameters (a to f), not numbers.'
  return { def, params, problem }
}
