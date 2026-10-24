import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import BoardView from './BoardView'
import { parseGrid } from './data/levels'

const Code = ({ children }: { children: ReactNode }) => (
  <code className="border-2 border-ink bg-neon px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-ink">{children}</code>
)

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

const STEPS: { title: string; body: ReactNode }[] = [
  {
    title: 'The goal',
    body: (
      <>
        <p>
          Every level hands you a board of colored blocks and a <b>target</b>. Make the board match the target by writing a tiny
          program: your <b>proof</b>.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Type commands in the editor, one per line, then smash <b>Run Proof</b>. The board replays your proof step by step.</li>
          <li>Some levels show a <b>theorem</b> instead of a picture: any board that satisfies it wins.</li>
          <li>Coordinates start at <Code>(0, 0)</Code> in the top-left corner. <Code>x</Code> runs right, <Code>y</Code> runs down.</li>
          <li>Comments start with <Code>--</Code> and cost nothing.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'The three commands',
    body: (
      <div className="space-y-4">
        <div>
          <p className="mb-2"><Code>swap(x1, y1, x2, y2)</Code> trades two blocks.</p>
          <Demo before={['R B', 'B B']} after={['B B', 'B R']} caption="swap(0, 0, 1, 1)" />
        </div>
        <div>
          <p className="mb-2"><Code>paint(x, y, color)</Code> recolors a block: blue, green, red, yellow or purple.</p>
          <Demo before={['B B', 'B B']} after={['B G', 'B B']} caption="paint(1, 0, green)" />
        </div>
        <div>
          <p className="mb-2"><Code>rotate(x, y)</Code> turns an arrow block a quarter turn clockwise (blocks without an arrow just shrug).</p>
          <Demo before={['B B', 'Y^ B']} after={['B B', 'Y> B']} caption="rotate(0, 1)" />
        </div>
      </div>
    ),
  },
  {
    title: 'Helpers: shorter proofs',
    body: (
      <>
        <p>Levels cap your line count. Beat the cap by defining a <b>helper</b> once and calling it again and again:</p>
        <pre className="overflow-x-auto border-4 border-ink bg-ink p-3 font-mono text-xs text-neon">{`def paintTwo(a, b, c, d) := paint(a, b, red); paint(c, d, red)
paintTwo(0, 0, 3, 0)
paintTwo(0, 3, 3, 3)`}</pre>
        <ul className="list-disc space-y-1 pl-5">
          <li>A helper is one <Code>def</Code> line holding up to 4 commands and up to 6 parameters.</li>
          <li>Coordinates must come from parameters (no number literals in the body), and helpers can&apos;t call other helpers.</li>
          <li>The <Code>def</Code> line and every call each count as a line. Top-level lines hold one command each.</li>
          <li>Blow the limit and you get “Proof too long. Use a helper macro.”</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Timer and score',
    body: (
      <>
        <p>A level stays locked until you hit <b>Start Level</b>. The timer counts up from there, and pauses whenever you leave the Game page.</p>
        <p>Your score appears once you solve the level:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><b>500</b> just for finishing.</li>
          <li><b>Optimality</b>, up to 1000: <Code>1000 × optimal lines ÷ your lines</Code>. Match the shortest possible proof for full marks.</li>
          <li><b>Speed</b>, up to 500, draining to zero over five minutes.</li>
          <li><b>Hints</b> cost 150 points and 30 seconds each. Pride not included.</li>
        </ul>
        <p className="font-semibold">A perfect, optimal-length solve sets off the confetti.</p>
      </>
    ),
  },
  {
    title: 'Tools and modes',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Ghost preview:</b> hover a line of code to see a see-through preview of what it would change.</li>
        <li><b>Hint:</b> flashes the next useful move on the board without writing the code for you.</li>
        <li><b>Time travel:</b> drag the slider under the board (or press Replay) to scrub through your proof. Every step makes a sound; 🔊 shushes it.</li>
        <li><b>Daily:</b> one freshly generated puzzle a day, the same for everyone, with a shareable result.</li>
        <li><b>Battle:</b> race another player on a brand-new puzzle made just for the match, and watch their board live. No clock: first correct proof wins.</li>
        <li><b>Level Builder:</b> cook up your own level and share it with a link.</li>
        <li><b>Leaderboard:</b> compare points globally or with friends.</li>
      </ul>
    ),
  },
]

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, STEPS.length - 1))
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 p-4"
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
        className="panel-heavy flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden"
        initial={{ y: 24, rotate: -1.5 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-6 py-4 text-paper">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neon">
              how to play · {step + 1}/{STEPS.length}
            </p>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight" data-testid="howto-title">{STEPS[step].title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" data-testid="howto-close" className="btn-magenta px-3 py-1 text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-6 py-5 text-[0.95rem] leading-relaxed" data-testid="howto-body">
          {STEPS[step].body}
        </div>

        <div className="flex items-center justify-between border-t-4 border-ink bg-paper px-6 py-4">
          <div className="flex gap-2.5">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStep(i)}
                aria-label={`Go to ${s.title}`}
                className={`dot ${i === step ? 'dot-on' : ''}`}
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
              <button onClick={() => setStep(step + 1)} className="btn-aqua px-6 py-2 text-sm" data-testid="howto-next">
                Next
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
 * The "How to Play" button for the top bar plus its overlay. The overlay is plain state, not a route: opening or
 * closing it never navigates, so whatever is underneath (a battle in progress with its socket, today's daily, a
 * half-written proof) keeps running. "Play!" simply closes it.
 */
export default function HowToPlay({ open, onOpen, onClose }: Props) {
  return (
    <>
      <button onClick={onOpen} data-testid="nav-howto" className="btn-magenta px-3 py-1 text-sm">
        ? How to Play
      </button>
      {/* in a portal, so no styled ancestor can become the containing block of the fixed overlay */}
      {createPortal(<AnimatePresence>{open && <HowToPlayModal onClose={onClose} />}</AnimatePresence>, document.body)}
    </>
  )
}
