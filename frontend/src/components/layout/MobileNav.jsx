import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: 'dashboard' },
  { to: '/results', label: 'Results', icon: 'assessment' },
  { to: '/timetable', label: 'Table', icon: 'calendar_month' },
  { to: '/announcements', label: 'Notices', icon: 'campaign' },
  { to: '/profile', label: 'Profile', icon: 'person' },
  { to: '/admin', label: 'Admin', icon: 'admin_panel_settings' },
]

function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-white/90 px-2 py-2 shadow-[0_-8px_30px_-16px_rgba(0,63,135,0.24)] backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-6 gap-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-1 py-1.5 text-[10px] font-semibold ${
                  isActive ? 'bg-secondary-container text-primary' : 'text-on-surface-variant'
                }`
              }
              to={item.to}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MobileNav