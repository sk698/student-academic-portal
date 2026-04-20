import { useEffect } from 'react'
import { useMemo, useState } from 'react'
import { announcementFeatured, announcementHero, announcements } from '../../data/mockData'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchAnnouncements } from '../../features/info/announcementsSlice'

function Announcements() {
  const dispatch = useAppDispatch()
  const announcementData = useAppSelector((state) => state.announcements.data)

  useEffect(() => {
    dispatch(fetchAnnouncements())
  }, [dispatch])

  const hero = announcementData?.hero ?? announcementHero
  const featured = announcementData?.featured ?? announcementFeatured
  const list = announcementData?.items ?? announcements
  const [readIds, setReadIds] = useState([])

  const renderedList = useMemo(
    () => list.map((item) => ({ ...item, read: readIds.includes(item.id) })),
    [list, readIds],
  )

  const markAllAsRead = () => {
    setReadIds(list.map((item) => item.id))
  }

  return (
    <>
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Notice Board</h1>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Stay informed with campus updates, academic deadlines, and institutional announcements.
          </p>
        </div>
        <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-[0_8px_20px_-10px_rgba(0,63,135,0.35)]" onClick={markAllAsRead} type="button">Mark all as read</button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <article className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-7 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)] md:col-span-8">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-error to-orange-500" />
          <div className="mb-5 flex items-center justify-between gap-2">
            <span className="rounded-full bg-error-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-error">High Priority</span>
            <time className="text-xs font-medium text-outline">{hero.date}</time>
          </div>
          <h2 className="font-headline text-2xl font-bold tracking-tight text-primary">{hero.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{hero.content}</p>
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary" type="button">
            Read full notice
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </article>

        <article className="relative overflow-hidden rounded-2xl bg-primary p-7 text-white shadow-[0_12px_32px_-8px_rgba(0,63,135,0.22)] md:col-span-4">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">Institutional</span>
          <h3 className="mt-4 font-headline text-2xl font-bold leading-tight">{featured.title}</h3>
          <p className="mt-3 text-sm text-blue-100">{featured.content}</p>
          <button className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary" type="button">View Course Catalog</button>
        </article>

        <div className="grid grid-cols-1 gap-5 md:col-span-12 md:grid-cols-3">
          {renderedList.map((item) => (
            <article className={`rounded-2xl p-6 shadow-[0_10px_28px_-10px_rgba(0,63,135,0.12)] ${item.read ? 'bg-surface-container-low text-on-surface-variant/80' : 'bg-surface-container-lowest'}`} key={item.id}>
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${item.priority === 'High' ? 'bg-error-container text-error' : 'bg-secondary-container text-primary'}`}>
                  {item.priority}
                </span>
                <time className="text-[10px] font-medium text-outline">{item.date}</time>
              </div>
              <h4 className="font-headline text-lg font-bold tracking-tight text-on-surface">{item.title}</h4>
              <p className="mt-3 text-sm text-on-surface-variant">{item.body}</p>
              <div className="mt-5 border-t border-surface-container-low pt-3 text-xs font-semibold text-outline">{item.source}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Announcements