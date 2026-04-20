import { useEffect } from 'react'
import BentoBox from '../../components/ui/BentoBox'
import ProgressBar from '../../components/ui/ProgressBar'
import StatusPill from '../../components/ui/StatusPill'
import { assignments, dashboardStats, recentResults, upcomingClasses } from '../../data/mockData'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchDashboard } from '../../features/dashboard/dashboardSlice'

function StudentDashboard() {
  const dispatch = useAppDispatch()
  const dashboardData = useAppSelector((state) => state.dashboard.data)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  const stats = dashboardData?.stats ?? dashboardStats
  const classes = dashboardData?.upcomingClasses ?? upcomingClasses
  const recent = dashboardData?.recentResults ?? recentResults
  const tasks = dashboardData?.assignments ?? assignments
  const welcomeName = dashboardData?.welcomeName ?? 'Julian'

  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Welcome back, {welcomeName}</h1>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">
          You have 3 classes today and your recent term results are now available.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <BentoBox className="group relative overflow-hidden md:col-span-4 lg:col-span-3">
          <div className="absolute right-2 top-2 opacity-10 transition group-hover:opacity-20">
            <span className="material-symbols-outlined text-8xl">auto_graph</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Cumulative GPA</p>
          <h2 className="mt-2 font-headline text-6xl font-black tracking-tight text-primary">{stats[0]?.value}</h2>
          <p className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-600">
            <span className="material-symbols-outlined text-base">trending_up</span>
            {stats[0]?.trend}
          </p>
        </BentoBox>

        <BentoBox className="md:col-span-8 lg:col-span-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold tracking-tight text-primary">Upcoming Classes</h3>
            <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Today
            </span>
          </div>
          <div className="space-y-3">
            {classes.map((item) => (
              <article key={item.course} className="flex items-center gap-4 rounded-xl bg-surface p-4 transition hover:bg-surface-container-low">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-primary">
                  <span className="text-[10px] font-bold uppercase">{item.time.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{item.course}</p>
                  <p className="text-xs text-on-surface-variant">{item.room} - {item.faculty}</p>
                </div>
                <StatusPill variant="neutral">{item.type}</StatusPill>
              </article>
            ))}
          </div>
        </BentoBox>

        <BentoBox className="bg-surface-container-low md:col-span-12 lg:col-span-4">
          <h3 className="mb-5 font-headline text-xl font-bold tracking-tight text-primary">Recent Results</h3>
          <div className="space-y-3">
            {recent.map((item) => (
              <article key={item.code} className="flex items-center justify-between rounded-xl bg-white p-4">
                <div>
                  <p className="text-sm font-bold text-on-surface">{item.course}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-secondary">{item.type}</p>
                </div>
                <span className="font-headline text-xl font-black text-primary">{item.grade}</span>
              </article>
            ))}
          </div>
        </BentoBox>

        <BentoBox className="overflow-hidden bg-linear-to-br from-primary to-primary-container text-white md:col-span-12 lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-100">Academic Snapshot</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-headline text-5xl font-black tracking-tight">{stats[2]?.value}</p>
              <p className="text-sm text-blue-100">Credits Earned</p>
            </div>
            <div>
              <p className="font-headline text-4xl font-black tracking-tight">{stats[1]?.value}</p>
              <p className="text-sm text-blue-100">Attendance</p>
            </div>
          </div>
        </BentoBox>

        <BentoBox className="md:col-span-12 lg:col-span-6">
          <h3 className="mb-5 font-headline text-xl font-bold tracking-tight">Active Assignments</h3>
          <div className="space-y-4">
            {tasks.map((item) => (
              <article key={item.title} className="rounded-xl bg-surface-container-low p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.title}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-outline">{item.due}</p>
                  </div>
                  <StatusPill variant={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</StatusPill>
                </div>
                <ProgressBar value={item.progress} />
              </article>
            ))}
          </div>
        </BentoBox>
      </section>
    </>
  )
}

export default StudentDashboard