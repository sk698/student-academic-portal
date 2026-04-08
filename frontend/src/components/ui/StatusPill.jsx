function StatusPill({ children, variant = 'neutral' }) {
  const variantClass =
    variant === 'success'
      ? 'bg-emerald-100 text-emerald-700'
      : variant === 'active'
        ? 'bg-secondary-container text-primary'
        : variant === 'warning'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-surface-container-low text-on-surface-variant'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${variantClass}`}
    >
      {children}
    </span>
  )
}

export default StatusPill
