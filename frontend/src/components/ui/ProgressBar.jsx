function ProgressBar({ value }) {
  return (
    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
      <span
        className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default ProgressBar