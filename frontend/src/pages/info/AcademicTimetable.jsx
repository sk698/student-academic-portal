import { timetableDays, timetableEvents, timetableInsights, timetableSlots } from '../../data/mockData'

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
  return (
    <>
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Weekly Timetable</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Semester 6 spring schedule optimized for focus and workload balance.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold" type="button">Print</button>
          <button className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-2 text-sm font-bold text-white" type="button">Download PDF</button>
        </div>
      </header>

      <section className="rounded-[1.8rem] bg-surface-container-lowest p-5 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="mb-3 grid grid-cols-[80px_repeat(6,1fr)] gap-1">
              <div />
              {timetableDays.map((day, idx) => (
                <div className="text-center" key={day.day}>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-outline">{day.day}</span>
                  <div className={`mx-auto mt-1 grid h-10 w-10 place-items-center rounded-full font-headline font-bold ${idx === 0 ? 'bg-primary/10 text-primary' : 'text-on-surface'}`}>
                    {day.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[80px_repeat(6,1fr)] rounded-xl bg-surface-container-low p-1">
              <div className="grid grid-rows-10 gap-1 pr-1">
                {timetableSlots.map((slot) => (
                  <div className="grid h-20 place-items-center text-[11px] font-bold text-outline" key={slot}>{slot}</div>
                ))}
              </div>

              <div className="relative col-span-6 grid grid-cols-6 grid-rows-10 gap-1">
                {Array.from({ length: 60 }).map((_, index) => (
                  <div className="rounded-sm bg-white" key={index} />
                ))}
                {timetableEvents.map((event) => (
                  <article
                    className={`absolute z-10 m-1 rounded-lg border-l-4 p-2 text-xs shadow-sm ${toneClasses[event.tone]}`}
                    key={event.id}
                    style={{
                      left: `${((event.day - 1) * 100) / 6}%`,
                      width: `${100 / 6}%`,
                      top: `${((event.start - 1) * 100) / 10}%`,
                      height: `${(event.duration * 100) / 10}%`,
                    }}
                  >
                    <p className="font-bold leading-tight">{event.title}</p>
                    <p className="mt-1 text-[10px]">{event.room}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {timetableInsights.map((item) => (
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