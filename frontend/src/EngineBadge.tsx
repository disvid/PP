interface Props {
  engine: string
  /** the proof was solved and Lean's kernel accepted the certificate */
  verified: boolean
  className?: string
}

/** Says who judged a run: Lean's kernel (with a certificate), Lean without a win, or the built-in TypeScript engine. */
export default function EngineBadge({ engine, verified, className = '' }: Props) {
  if (!engine) return null
  const look = verified
    ? 'bg-emerald-400 text-[#0a0a0a]'
    : engine === 'lean'
      ? 'bg-aqua text-[#0a0a0a]'
      : 'bg-card text-ink'
  const label = verified ? '✓ Verified by Lean 4 kernel' : engine === 'lean' ? 'Judged by Lean 4' : 'Checked by the built-in engine'
  const title = verified
    ? "Lean's kernel accepted a theorem that this proof reaches the target (decide +kernel), using only standard axioms."
    : engine === 'lean'
      ? 'Lean 4 replayed the proof. It earns a kernel certificate once it solves the level.'
      : 'Lean is not running on this server, so the TypeScript copy of the rules judged this proof.'
  return (
    <span
      data-testid="engine-badge"
      data-engine={engine}
      data-verified={verified ? 'true' : 'false'}
      title={title}
      className={`inline-block border-[3px] border-ink px-2 py-0.5 font-mono text-xs font-bold ${look} ${className}`}
    >
      {label}
    </span>
  )
}
