// Stand-in for the design's <image-slot>: an ink-tinted frame with the
// slot's caption, until real project images are supplied.

type Props = { label?: string }

const PlaceholderFrame = ({ label = 'Drop project image' }: Props) => (
  <div className="flex h-full w-full items-center justify-center bg-[var(--ink-100)] font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-400)]">
    {label}
  </div>
)

export default PlaceholderFrame
