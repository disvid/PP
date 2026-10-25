import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { announceAchievements } from './achievementBus'
import BoardView from './BoardView'
import { buildIds } from './Game'
import ProofEditor from './ProofEditor'
import { api } from './api'
import { parseGrid } from './data/levels'
import type { Board } from './data/levels'
import { countLines } from './data/scoring'
import { LESSONS } from './data/tutorial'
import type { Lesson } from './data/tutorial'
import { celebrate } from './effects'
import { playOp, unlockAudio } from './soundUtils'
import type { SoundOp } from './soundUtils'
import { markTutorialSeen } from './tutorialState'
import type { EvalError } from './types'

const STEP_MS = 600

const Code = ({ children }: { children: ReactNode }) => (
  <code className="border-2 border-ink bg-neon px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-[#0a0a0a]">{children}</code>
)

const clone = (b: Board): Board => b.map((r) => r.map((c) => ({ ...c })))

/** A before -> after pair of tiny boards. */
function Demo({ before, after, caption }: { before: string[]; after: string[]; caption: string }) {
  return (
    <div className="flex items-center gap-3">
      <BoardView board={parseGrid(before)} size="sm" testPrefix="demo-before" glide={false} />
      <span className="text-2xl font-black">→</span>
      <BoardView board={parseGrid(after)} size="sm" testPrefix="demo-after" glide={false} />
      <span className="font-mono text-xs font-medium">{caption}</span>
    </div>
  )
}

// ---- page 0: the idea --------------------------------------------------------------------------------------
function Intro() {
  return (
    <div className="space-y-3">
      <p>
        Every level hands you a board of colored blocks and a <b>target</b>. Make the board match the target by writing a tiny program: your <b>proof</b>.
      </p>
      <Demo before={['R B', 'B B']} after={['B B', 'B R']} caption="swap(0, 0, 1, 1)" />
      <ul className="list-disc space-y-1 pl-5">
        <li>You type one command per line in the editor, then press <b>Run</b>. The board replays your proof step by step.</li>
        <li>Coordinates start at <Code>(0, 0)</Code> in the top-left corner. <Code>x</Code> runs right, <Code>y</Code> runs down.</li>
        <li>Comments start with <Code>--</Code> and cost nothing.</li>
        <li>Levels cap your number of lines, so shorter proofs are the whole game.</li>
      </ul>
      <p className="font-semibold">
        Four quick lessons follow. Each one checks your proof as you type and as you run it, and you move on once it passes.
      </p>
    </div>
  )
}

// ---- pages 1-4: guided lessons --------------------------------------------------------------------------------
interface CheckResponse {
  steps: { line: number; board: Board; op?: SoundOp }[]
  error: EvalError | null
  solved: boolean
  passed: boolean
  message: string
}

type RunState =
  | { phase: 'idle' }
  | { phase: 'running' }
  | { phase: 'done'; error: EvalError | null; solved: boolean; passed: boolean; message: string }

const stripComments = (code: string) => code.split('\n').map((l) => l.split('--')[0]).join('\n')

/** Does the proof contain what the lesson teaches? Checked live, as the player types. */
const usesNeeded = (lesson: Lesson, code: string) => {
  const src = stripComments(code)
  return lesson.mustUse === 'def' ? /^[ \t]*def[ \t]/m.test(src) : new RegExp(`\\b${lesson.mustUse}\\s*\\(`).test(src)
}

function Mark({ state }: { state: 'ok' | 'bad' | 'todo' }) {
  const look = {
    ok: 'bg-emerald-500 text-[#0a0a0a]',
    bad: 'bg-magenta text-white',
    todo: 'bg-card text-ink',
  }[state]
  return (
    <span className={`mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center border-2 border-ink text-xs font-extrabold ${look}`} aria-hidden="true">
      {state === 'ok' ? '✓' : state === 'bad' ? '✕' : ''}
    </span>
  )
}

interface LessonProps {
  lesson: Lesson
  index: number
  initialCode: string
  onCode: (code: string) => void
  passed: boolean
  onPass: () => void
}

function LessonPane({ lesson, index, initialCode, onCode, passed, onPass }: LessonProps) {
  const [code, setCode] = useState(initialCode)
  const [resets, setResets] = useState(0)
  const [boards, setBoards] = useState<Board[]>(() => [clone(lesson.level.initialState)])
  const [ops, setOps] = useState<(SoundOp | null)[]>([])
  const [stepLines, setStepLines] = useState<number[]>([])
  const [view, setView] = useState(0)
  const [run, setRun] = useState<RunState>({ phase: 'idle' })
  const [fails, setFails] = useState(0)
  const timers = useRef<number[]>([])
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  // every step of the replay makes its sound
  useEffect(() => {
    if (view > 0) {
      const op = ops[view - 1]
      if (op) playOp(op)
    }
  }, [view, ops])

  const idGrids = useMemo(() => buildIds(lesson.level.initialState, ops), [lesson, ops])
  const shown = boards[Math.min(view, boards.length - 1)]
  const shownIds = idGrids[Math.min(view, idGrids.length - 1)]

  const edit = (v: string) => {
    setCode(v)
    onCode(v)
  }

  const start = async () => {
    if (run.phase === 'running') return
    unlockAudio()
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setView(0)
    setBoards([clone(lesson.level.initialState)])
    setOps([])
    setRun({ phase: 'running' })

    let res: CheckResponse
    try {
      const r = await api<CheckResponse>('/api/tutorial/check', { lesson: lesson.id, code })
      if (!r.data.steps) throw new Error('bad response')
      res = r.data
    } catch {
      setRun({ phase: 'done', error: null, solved: false, passed: false, message: 'Could not reach the server. Is the backend running?' })
      return
    }

    setBoards([clone(lesson.level.initialState), ...res.steps.map((s) => s.board)])
    setOps(res.steps.map((s) => s.op ?? null))
    setStepLines(res.steps.map((s) => s.line))
    const finish = () => {
      setRun({ phase: 'done', error: res.error, solved: res.solved, passed: res.passed, message: res.message })
      if (res.passed) {
        onPass()
        celebrate(boardRef.current)
      } else {
        setFails((f) => f + 1)
      }
    }
    res.steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setView(i + 1), (i + 1) * STEP_MS)))
    timers.current.push(window.setTimeout(finish, (res.steps.length + 1) * STEP_MS))
  }

  const reset = (to: string) => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setRun({ phase: 'idle' })
    setBoards([clone(lesson.level.initialState)])
    setOps([])
    setView(0)
    edit(to)
    setResets((n) => n + 1)
  }

  const nLines = countLines(code)
  const par = lesson.level.parLimit
  const has = usesNeeded(lesson, code)
  const done = run.phase === 'done' ? run : null
  const error = done?.error ?? null
  const atEnd = view >= boards.length - 1

  const checklist: { label: string; state: 'ok' | 'bad' | 'todo' }[] = [
    { label: lesson.mustUse === 'def' ? 'Defines a helper (def …)' : `Uses ${lesson.mustUse}(…)`, state: has ? 'ok' : 'todo' },
    { label: `Within ${par} lines (you have ${nLines})`, state: nLines > par ? 'bad' : nLines > 0 ? 'ok' : 'todo' },
    { label: 'Runs without errors', state: done ? (error ? 'bad' : 'ok') : 'todo' },
    { label: 'Board matches the target', state: done ? (done.solved ? 'ok' : 'bad') : 'todo' },
  ]

  return (
    <div className="space-y-4" data-testid={`lesson-${lesson.id}`}>
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-magenta dark:text-neon">
          Lesson {index + 1} of {LESSONS.length}
        </p>
        <p className="text-xl font-extrabold" data-testid="lesson-goal">
          {lesson.goal}
        </p>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {lesson.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div>
          <ProofEditor
            value={code}
            resetKey={`tut-${lesson.id}-${resets}`}
            readOnly={false}
            onChange={edit}
            activeLine={run.phase === 'running' && view > 0 ? (stepLines[view - 1] ?? null) : null}
            errorLine={error && atEnd ? error.line : null}
            errorText={error?.message ?? ''}
            onHover={async () => null}
            onMouseLine={() => {}}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button data-testid="lesson-run" onClick={start} disabled={run.phase === 'running'} className="btn-neon px-5 py-2">
              Run
            </button>
            <button onClick={() => reset(initialStarter(lesson))} className="btn-paper px-4 py-2" data-testid="lesson-reset">
              Reset
            </button>
            <button
              onClick={() => reset(lesson.solution)}
              disabled={fails < 2 && !passed}
              className="btn-magenta px-4 py-2"
              data-testid="lesson-solution"
              title={fails < 2 && !passed ? 'Unlocks after two runs that did not pass' : 'Put the reference proof in the editor'}
            >
              Show solution
            </button>
          </div>
          <p
            data-testid="lesson-status"
            className={`mt-3 min-h-6 font-mono text-sm font-bold ${
              passed ? 'text-emerald-700 dark:text-emerald-400' : error ? 'text-magenta dark:text-[#ff6bb5]' : ''
            }`}
          >
            {run.phase === 'running'
              ? 'Watching it unfold…'
              : done
                ? error
                  ? `Line ${error.line}: ${error.message}`
                  : done.message
                : passed
                  ? 'Lesson complete!'
                  : 'Type your proof, then press Run.'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-4">
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-widest">Your board</p>
              <div ref={boardRef} data-testid="lesson-board">
                <BoardView board={shown} ids={shownIds} size="md" testPrefix="lesson" errorCells={error && atEnd ? error.cells : undefined} />
              </div>
            </div>
            <div>
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-widest">Target</p>
              <BoardView board={lesson.level.targetState!} size="sm" testPrefix="lesson-target" glide={false} />
            </div>
          </div>
          <ul className="space-y-1.5 text-sm font-semibold" data-testid="lesson-checklist">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center" data-state={c.state}>
                <Mark state={c.state} />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const initialStarter = (lesson: Lesson) => `-- ${lesson.goal}\n`

// ---- last page ---------------------------------------------------------------------------------------------
function Finale({ allPassed }: { allPassed: boolean }) {
  // once per visit to this page, and only for a player who really did the lessons
  const sent = useRef(false)
  useEffect(() => {
    if (!allPassed || sent.current) return
    sent.current = true
    api<{ achievements?: string[] }>('/api/tutorial/complete', {})
      .then((r) => r.ok && announceAchievements(r.data.achievements))
      .catch(() => {})
  }, [allPassed])

  return (
    <div className="space-y-4" data-testid="tutorial-finale">
      {allPassed ? (
        <p className="border-4 border-ink bg-neon px-3 py-2 text-lg font-extrabold text-[#0a0a0a]">🎓 Tutorial complete. You know all four moves.</p>
      ) : (
        <p className="border-4 border-ink bg-card px-3 py-2 font-bold">
          You skipped a lesson or two. Use the dots below to go back and pass them all to earn the Graduate badge.
        </p>
      )}
      <div>
        <p className="mb-1 font-extrabold uppercase">Timer and score</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>A level stays locked until you hit <b>Start Level</b>. The timer pauses whenever you leave the Game page.</li>
          <li><b>500</b> for finishing, up to <b>1000</b> for optimality (<Code>1000 × optimal lines ÷ your lines</Code>), up to <b>500</b> for speed.</li>
          <li><b>Hints</b> cost 150 points and 30 seconds each. A perfect, optimal-length solve sets off the confetti.</li>
        </ul>
      </div>
      <div>
        <p className="mb-1 font-extrabold uppercase">Where to go next</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li><b>Game:</b> 67 levels (open the 🗺 Map to jump around). Hover a line of code for a ghost preview, drag the slider to time-travel through your proof, and build helpers with the 🧩 form.</li>
          <li><b>Locked blocks 🔒</b> show up in daily, battle and custom puzzles: no command can touch them, and trying is an illegal move.</li>
          <li><b>Daily:</b> one fresh puzzle a day, the same for everyone. Solve it every day to build a 🔥 streak and fill the calendar, then share your emoji card.</li>
          <li><b>Battle:</b> race another player on a brand-new puzzle and watch their board live.</li>
          <li><b>Level Builder:</b> cook up your own level and share it with a link.</li>
          <li><b>Achievements (🏅) and Leaderboard (🏆):</b> badges for clever solves, points for everything else.</li>
        </ul>
      </div>
    </div>
  )
}

// ---- the modal ------------------------------------------------------------------------------------------------
type Page = { kind: 'intro' } | { kind: 'lesson'; lesson: Lesson; index: number } | { kind: 'finale' }

const PAGES: Page[] = [{ kind: 'intro' }, ...LESSONS.map((lesson, index): Page => ({ kind: 'lesson', lesson, index })), { kind: 'finale' }]

function pageTitle(p: Page) {
  return p.kind === 'intro' ? 'The goal' : p.kind === 'lesson' ? p.lesson.title : 'You’re ready'
}

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [passed, setPassed] = useState<Set<string>>(new Set())
  const codes = useRef<Record<string, string>>({})
  const page = PAGES[step]
  const last = step === PAGES.length - 1
  const allPassed = passed.size === LESSONS.length
  const lessonPassed = page.kind === 'lesson' && passed.has(page.lesson.id)

  useEffect(() => markTutorialSeen(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Escape inside the editor belongs to the editor (closing its suggestions)
      if (e.key === 'Escape' && !(e.target as HTMLElement | null)?.closest?.('[data-testid="editor"]')) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const next = () => setStep((s) => Math.min(s + 1, PAGES.length - 1))
  const blocked = page.kind === 'lesson' && !lessonPassed

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-abyss/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid="howto-modal"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
        className="panel-heavy flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden"
        initial={{ y: 24, rotate: -1.5 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-4 border-ink bg-abyss px-6 py-4 text-bone">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neon">
              tutorial · {step + 1}/{PAGES.length}
            </p>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight" data-testid="howto-title">{pageTitle(page)}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" data-testid="howto-close" className="btn-magenta px-3 py-1 text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-6 py-5 text-[0.95rem] leading-relaxed" data-testid="howto-body">
          {page.kind === 'intro' && <Intro />}
          {page.kind === 'lesson' && (
            <LessonPane
              key={page.lesson.id}
              lesson={page.lesson}
              index={page.index}
              initialCode={codes.current[page.lesson.id] ?? initialStarter(page.lesson)}
              onCode={(c) => (codes.current[page.lesson.id] = c)}
              passed={lessonPassed}
              onPass={() => setPassed((p) => new Set(p).add(page.lesson.id))}
            />
          )}
          {page.kind === 'finale' && <Finale allPassed={allPassed} />}
        </div>

        <div className="flex items-center justify-between border-t-4 border-ink bg-paper px-6 py-4">
          <div className="flex gap-2.5">
            {PAGES.map((p, i) => (
              <button
                key={pageTitle(p)}
                onClick={() => setStep(i)}
                aria-label={`Go to ${pageTitle(p)}`}
                title={pageTitle(p)}
                className={`dot ${i === step ? 'dot-on' : ''} ${p.kind === 'lesson' && passed.has(p.lesson.id) ? '!bg-emerald-500' : ''}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-paper px-4 py-2 text-sm" data-testid="howto-back">
                Back
              </button>
            )}
            {last ? (
              <button onClick={onClose} className="btn-neon px-6 py-2 text-sm" data-testid="howto-play">
                Play!
              </button>
            ) : (
              <button
                onClick={next}
                disabled={blocked}
                className={`${lessonPassed ? 'btn-neon' : 'btn-aqua'} px-6 py-2 text-sm`}
                data-testid="howto-next"
                title={blocked ? 'Pass the lesson first' : undefined}
              >
                {page.kind === 'lesson' && lessonPassed ? 'Next ✓' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface Props {
  /** `isHowToPlayOpen`, owned by the app (see App.tsx) */
  open: boolean
  onOpen: () => void
  onClose: () => void
}

/**
 * The "?" button for the top bar plus the interactive tutorial overlay: an intro, four guided lessons that each check
 * the proof against the real engine, and a closing page. The overlay is plain state, not a route: opening or closing it
 * never navigates, so whatever is underneath (a battle in progress with its socket, today's daily, a half-written
 * proof) keeps running. "Play!" simply closes it.
 */
export default function HowToPlay({ open, onOpen, onClose }: Props) {
  return (
    <>
      <button
        onClick={onOpen}
        data-testid="nav-howto"
        aria-label="How to play"
        title="How to play"
        className="btn-magenta btn-icon text-base font-extrabold"
      >
        ?
      </button>
      {/* in a portal, so no styled ancestor can become the containing block of the fixed overlay */}
      {createPortal(<AnimatePresence>{open && <HowToPlayModal onClose={onClose} />}</AnimatePresence>, document.body)}
    </>
  )
}
