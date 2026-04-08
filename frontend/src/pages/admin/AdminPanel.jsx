import GradientButton from '../../components/ui/GradientButton'
import { adminRecent } from '../../data/mockData'

function AdminPanel() {
  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Administrative Center</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Manage institutional records, result publishing, and announcement workflows.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-primary">Upload Results</h2>
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Semester 1 - 2026</span>
            </div>

            <div className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-10 text-center transition hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
              <p className="mt-2 text-sm font-semibold">Drag and drop your result CSV here</p>
              <p className="text-xs text-on-surface-variant">or click to browse local files (max 10MB)</p>
            </div>

            <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-outline">Or Manual Entry</p>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" placeholder="Student ID" />
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" placeholder="Course Code" />
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" placeholder="Grade / Score" />
              <GradientButton className="w-full" type="button">Submit Record</GradientButton>
            </form>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-xl bg-surface-container-low p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Total Uploads Today</p>
              <p className="mt-2 font-headline text-4xl font-black text-primary">1,284</p>
            </article>
            <article className="rounded-xl bg-surface-container-low p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">Pending Validation</p>
              <p className="mt-2 font-headline text-4xl font-black text-orange-700">42</p>
            </article>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <h2 className="mb-5 font-headline text-xl font-bold text-primary">Create Announcement</h2>
            <form className="space-y-4">
              <input className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" placeholder="Title" />
              <select className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm">
                <option>Standard</option>
                <option>High Priority</option>
                <option>Urgent / Mandatory</option>
              </select>
              <textarea className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" placeholder="Detailed announcement text..." rows="4" />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white" type="button">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Broadcast Announcement
              </button>
            </form>
          </article>

          <article className="rounded-2xl bg-surface-container-low p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline font-bold text-primary">Recently Posted</h3>
              <button className="text-xs font-bold text-primary" type="button">View All</button>
            </div>
            <div className="space-y-3">
              {adminRecent.map((item) => (
                <div className="flex gap-3 rounded-lg bg-surface-container-lowest p-4" key={item.title}>
                  <div className={`w-1 rounded-full ${item.priority.includes('High') ? 'bg-error' : 'bg-primary-container'}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-on-surface">{item.title}</p>
                      <span className="text-[10px] text-outline">{item.posted}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">{item.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default AdminPanel