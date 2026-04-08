function Card({ className, as: Comp = 'article', children }) {
  return (
    <Comp
      className={`rounded-3xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)] ${className ?? ''}`}
    >
      {children}
    </Comp>
  )
}

export default Card
