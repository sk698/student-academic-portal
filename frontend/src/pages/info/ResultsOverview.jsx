import GradientButton from '../../components/ui/GradientButton'
import { resultSummary, resultsBreakdown } from '../../data/mockData'

function ResultsOverview() {
  return (
    <>
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Academic Results</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Detailed view of your performance across all semesters.</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high" type="button">
            Filter
          </button>
          <GradientButton type="button">Download Report</GradientButton>
        </div>
      </header>

      <section className="mb-8 grid gap-6 md:grid-cols-3">
        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-7 text-white shadow-[0_12px_32px_-8px_rgba(0,63,135,0.2)] md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">Cumulative GPA</p>
          <h2 className="mt-2 font-headline text-6xl font-black tracking-tight">{resultSummary.cgpa} <span className="text-2xl font-medium text-blue-100">/ 4.0</span></h2>
          <p className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
            {resultSummary.ranking}
          </p>
          <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        </article>

        <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Quick Insights</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between"><dt className="text-on-surface-variant">Major GPA</dt><dd className="font-bold text-primary">{resultSummary.majorGpa}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-on-surface-variant">Dean's List</dt><dd className="rounded-full bg-secondary-container px-2 py-1 text-xs font-bold text-primary">{resultSummary.deansList}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-on-surface-variant">Standing</dt><dd className="font-bold text-emerald-600">{resultSummary.standing}</dd></div>
          </dl>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-primary">Course Breakdown</h2>
            <p className="text-sm text-on-surface-variant">Complete grade sheet by semester and subject.</p>
          </div>
          <select className="rounded-lg bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface outline-none ring-primary/20 focus:ring-2">
            <option>All Semesters</option>
            <option>Fall 2025</option>
            <option>Spring 2025</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="rounded-l-xl px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Course Code</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Course Name</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Semester</th>
                <th className="rounded-r-xl px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Grade</th>
              </tr>
            </thead>
            <tbody>
              {resultsBreakdown.map((row, index) => (
                <tr key={row.courseCode} className={index % 2 === 1 ? 'bg-surface-container-low/35' : ''}>
                  <td className="px-5 py-4 font-mono text-sm font-bold text-primary">{row.courseCode}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-on-surface">{row.courseName}</td>
                  <td className="px-5 py-4 text-sm text-on-surface-variant">{row.semester}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">{row.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default ResultsOverview