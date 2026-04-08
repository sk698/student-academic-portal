import { useLocation } from 'react-router-dom'
import { portalUser } from '../../data/mockData'

const titleMap = {
  '/dashboard': 'Dashboard',
  '/results': 'Academic Results',
  '/timetable': 'Weekly Timetable',
  '/announcements': 'Notice Board',
  '/profile': 'Student Profile',
  '/admin': 'Administrative Center',
}

function TopHeader() {
  const location = useLocation()
  const title = titleMap[location.pathname] ?? 'ScholarSanctuary'

  return (
    <header className="sticky top-0 z-40 mb-6 flex w-full items-center justify-between rounded-2xl bg-white/80 px-6 py-4 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)] backdrop-blur-md">
      <div className="flex items-center gap-8">
        <div>
          <p className="font-headline text-xl font-bold tracking-tight text-primary">ScholarSanctuary</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-outline">{title}</p>
        </div>
        <label className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            className="w-72 rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm text-on-surface outline-none ring-primary/20 transition focus:ring-2"
            placeholder="Search resources..."
            type="search"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low" type="button">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
        </button>
        <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low" type="button">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="hidden h-8 w-px bg-outline-variant/60 sm:block" />
        <div className="hidden text-right sm:block">
          <p className="text-xs font-bold text-primary">{portalUser.name}</p>
          <p className="text-[10px] text-on-surface-variant">{portalUser.program} - {portalUser.year}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-container text-xs font-bold text-white">
          {portalUser.avatarInitials}
        </div>
      </div>
    </header>
  )
}

export default TopHeader