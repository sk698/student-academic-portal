import { useEffect } from 'react'
import { timetableDays, timetableEvents, timetableInsights, timetableSlots } from '../../data/mockData'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchTimetable } from '../../features/info/timetableSlice'

const toneClasses = {
  blue: 'bg-blue-100 border-blue-600 text-blue-900',
  emerald: 'bg-emerald-100 border-emerald-600 text-emerald-900',
  indigo: 'bg-indigo-100 border-indigo-600 text-indigo-900',
  amber: 'bg-amber-100 border-amber-600 text-amber-900',
  cyan: 'bg-cyan-100 border-cyan-600 text-cyan-900',
  violet: 'bg-violet-100 border-violet-600 text-violet-900',
  rose: 'bg-rose-100 border-rose-600 text-rose-900',
}

function AcademicTimetable() {
  const dispatch = useAppDispatch()
  const timetableData = useAppSelector((state) => state.timetable.data)

  useEffect(() => {
    dispatch(fetchTimetable())
  }, [dispatch])

  const days = timetableData?.days ?? timetableDays
  const slots = timetableData?.slots ?? timetableSlots
  const events = (timetableData?.events ?? timetableEvents).map((event, index) => ({
    id: event.id ?? `event-${index}`,
    day: Number(event.day ?? event.dayIndex ?? 1),
    start: Number(event.start ?? event.startSlot ?? 1),
    duration: Number(event.duration ?? 1),
    title: event.title,
    room: event.room,
    tone: event.tone ?? 'blue',
  }))
  const insights = timetableData?.insights ?? timetableInsights
  const dayCount = Math.max(days.length, 1)
  const slotCount = Math.max(slots.length, 1)
  const leftColumnWidth = 120
  const slotRowHeight = 98
  const dayColumnTemplate = days
    .map((day) => {
      const label = String(day.day ?? '').trim().toLowerCase()
      return label === 'sat' || label === 'sun' ? 'minmax(72px, 0.42fr)' : 'minmax(138px, 1fr)'
    })
    .join(' ')

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const payload = {
      days,
      slots,
      events,
      insights,
      generatedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'weekly-timetable.json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Weekly Timetable</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Semester 6 spring schedule optimized for focus and workload balance.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold" onClick={handlePrint} type="button">Print</button>
          <button className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-2 text-sm font-bold text-white" onClick={handleDownload} type="button">Download PDF</button>
        </div>
      </header>

      <section className="rounded-[1.8rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
        <div className="overflow-x-auto">
          <div className="min-w-[1180px]">
            <div className="mb-3 grid gap-2" style={{ gridTemplateColumns: `${leftColumnWidth}px ${dayColumnTemplate}` }}>
              <div />
              {days.map((day) => (
                <div className="text-center" key={day.day}>
                  <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-outline">{day.day}</span>
                </div>
              ))}
            </div>

            <div className="grid rounded-2xl bg-surface-container-low p-2" style={{ gridTemplateColumns: `${leftColumnWidth}px ${dayColumnTemplate}` }}>
              <div className="grid gap-2 pr-2" style={{ gridTemplateRows: `repeat(${slotCount}, ${slotRowHeight}px)` }}>
                {slots.map((slot) => (
                  <div className="grid place-items-center rounded-lg bg-surface-container-lowest px-2 text-left text-[15px] font-bold leading-tight text-outline" key={slot}>{slot}</div>
                ))}
              </div>

              <div
                className="relative grid gap-2"
                style={{
                  gridColumn: `span ${dayCount}`,
                  gridTemplateColumns: dayColumnTemplate,
                  gridTemplateRows: `repeat(${slotCount}, ${slotRowHeight}px)`,
                }}
              >
                {Array.from({ length: dayCount * slotCount }).map((_, index) => (
                  <div className="rounded-md bg-white" key={index} />
                ))}
                {events.map((event) => (
                  <article
                    className={`z-10 overflow-hidden rounded-xl border-l-4 px-3 py-2 shadow-sm ${toneClasses[event.tone] ?? toneClasses.blue}`}
                    key={event.id}
                    style={{
                      gridColumn: event.day,
                      gridRow: `${event.start} / span ${event.duration}`,
                    }}
                  >
                    <p className="line-clamp-2 text-[18px] font-extrabold leading-tight">{event.title}</p>
                    <p className="mt-1 text-[14px] font-semibold leading-tight opacity-90">{event.room}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.map((item) => (
          <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]" key={item.label}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">{item.label}</p>
            <p className="mt-2 font-headline text-4xl font-black text-primary">{item.value}</p>
            <p className="mt-2 text-sm text-on-surface-variant">{item.note}</p>
          </article>
        ))}
      </section>
    </>
  )
}

export default AcademicTimetable