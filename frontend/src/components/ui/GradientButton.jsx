function GradientButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 font-semibold text-white transition hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default GradientButton