function Avatar({ initials }) {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-container font-headline text-lg font-bold text-white">
      {initials}
    </div>
  )
}

export default Avatar