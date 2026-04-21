function PlaceholderPage({ title }) {
  return (
    <section className="rounded-3xl bg-surface-container-lowest p-8 text-center shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
      <h2 className="font-headline text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-on-surface-variant">This page shell is routed and ready for full UI implementation.</p>
    </section>
  )
}

export default PlaceholderPage