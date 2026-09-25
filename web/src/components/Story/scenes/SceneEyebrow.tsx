// The "NN — rule — label" eyebrow every scene opens with.

type Props = {
  idx: string
  label: string
  /** On the dark scenes the eyebrow uses the inverse palette. */
  dark?: boolean
  /** Adds the entrance reveal the design gives flow sections. */
  reveal?: boolean
  className?: string
}

const SceneEyebrow = ({
  idx,
  label,
  dark = false,
  reveal = false,
  className = '',
}: Props) => (
  <div
    data-reveal={reveal ? '1' : undefined}
    className={`flex items-center gap-[14px] font-mono text-[11px] uppercase tracking-[0.14em] ${
      dark ? 'text-[var(--violet-300)]' : 'text-[var(--c-muted)]'
    } ${className}`}
  >
    <span
      className={`font-medium ${dark ? 'text-[var(--accent)]' : 'text-[var(--c-vio)]'}`}
    >
      {idx}
    </span>
    <span
      className={`h-px w-10 ${dark ? 'bg-[var(--ink-600)]' : 'bg-[var(--c-line2)]'}`}
    />
    <span>{label}</span>
  </div>
)

export default SceneEyebrow
