import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/results', label: 'Results', icon: 'assessment' },
  { to: '/timetable', label: 'Timetable', icon: 'calendar_month' },
  { to: '/announcements', label: 'Announcements', icon: 'campaign' },
  { to: '/profile', label: 'Profile', icon: 'person' },
  { to: '/admin', label: 'Admin', icon: 'admin_panel_settings' },
]

function Sidebar({ onLogout }) {
  return (
    <aside className="hidden h-screen bg-slate-50 py-6 lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="mb-8 px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h1 className="font-headline text-lg font-black tracking-tight text-primary">ScholarSanctuary</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">University Excellence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mx-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'translate-x-1 bg-secondary-container text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4">
        <button
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-error-container/20 hover:text-error"
          onClick={onLogout}
          type="button"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar