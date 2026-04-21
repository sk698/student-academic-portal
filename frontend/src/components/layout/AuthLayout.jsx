import { Link, Outlet, useLocation } from 'react-router-dom'

const authHeroMap = {
  '/login': {
    badge: 'Autumn Semester 2026',
    title: 'Education is the passport to the future.',
    subtitle: 'Join over 15,000 students using one elegant academic sanctuary.',
    statA: '48',
    statALabel: 'Active Courses Today',
    statB: '98%',
    statBLabel: 'Attendance Rate',
  },
  '/register': {
    badge: 'Intellectual Sanctuary',
    title: 'Your journey to academic excellence starts here.',
    subtitle: 'Create your account and join a collaborative, focused academic environment.',
    statA: '42K+',
    statALabel: 'Research Resources',
    statB: '91%',
    statBLabel: 'On-Time Submissions',
  },
}

function AuthLayout() {
  const location = useLocation()
  const hero = authHeroMap[location.pathname] ?? authHeroMap['/login']

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 md:p-8">
      <main className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-surface-container-lowest shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)] lg:grid-cols-12">
        <section className="p-8 md:p-12 lg:col-span-5 lg:p-14">
          <Outlet />
          <footer className="mt-10 border-t border-outline-variant/20 pt-6 text-center text-xs font-medium text-on-surface-variant">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link className="transition hover:text-primary" to="/login">Login</Link>
              <Link className="transition hover:text-primary" to="/register">Register</Link>
              <span>Support</span>
            </div>
          </footer>
        </section>

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-primary-container text-white lg:col-span-7 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.14),transparent_36%),radial-gradient(circle_at_10%_82%,rgba(216,226,252,0.2),transparent_40%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <p className="w-fit rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">{hero.badge}</p>
            <div className="space-y-6">
              <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tight">{hero.title}</h2>
              <p className="max-w-xl text-sm text-blue-100">{hero.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <article className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="font-headline text-2xl font-bold">{hero.statA}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-100">{hero.statALabel}</p>
              </article>
              <article className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="font-headline text-2xl font-bold">{hero.statB}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-100">{hero.statBLabel}</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AuthLayout