import { useEffect, useState } from 'react'
import GradientButton from '../../components/ui/GradientButton'
import { adminRecent } from '../../data/mockData'
import {
  createAnnouncement,
  createSection,
  getSections,
  getSectionTimetable,
  saveSectionTimetable,
  updateStudentSection,
  uploadSectionTimetableCsv,
  uploadResult,
  uploadResultCsv,
} from '../../services/api'

function AdminPanel() {
  const [resultForm, setResultForm] = useState({ studentId: '', courseCode: '', grade: '' })
  const [announcementForm, setAnnouncementForm] = useState({ title: '', priority: 'Standard', message: '' })
  const [sectionForm, setSectionForm] = useState({ code: '', name: '', department: 'COMPUTER_SCIENCE' })
  const [sectionEventForm, setSectionEventForm] = useState({
    courseCode: '',
    title: '',
    room: '',
    tone: 'blue',
    day: 'Mon',
    dayIndex: '1',
    dayDate: '12',
    startSlot: '1',
    duration: '2',
  })
  const [sections, setSections] = useState([])
  const [selectedSectionCode, setSelectedSectionCode] = useState('')
  const [sectionEvents, setSectionEvents] = useState([])
  const [studentSectionForm, setStudentSectionForm] = useState({ studentId: '' })
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [selectedTimetableFile, setSelectedTimetableFile] = useState(null)
  const [selectedTimetableFileName, setSelectedTimetableFileName] = useState('')

  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await getSections()
        const rows = response?.data ?? []
        setSections(rows)
        if (rows.length > 0) {
          setSelectedSectionCode(rows[0].code)
          await loadSectionTimetable(rows[0].code)
        }
      } catch (error) {
        setStatusMessage(error.message)
      }
    }

    loadSections()
  }, [])

  const loadSectionTimetable = async (sectionCode) => {
    if (!sectionCode) {
      setSectionEvents([])
      return
    }
    const response = await getSectionTimetable(sectionCode)
    setSectionEvents(response?.data?.events ?? [])
  }

  const handleResultSubmit = async (event) => {
    event.preventDefault()
    try {
      await uploadResult(resultForm)
      setStatusMessage('Result submitted successfully.')
      setResultForm({ studentId: '', courseCode: '', grade: '' })
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleAnnouncementSubmit = async (event) => {
    event.preventDefault()
    try {
      await createAnnouncement(announcementForm)
      setStatusMessage('Announcement broadcasted successfully.')
      setAnnouncementForm({ title: '', priority: 'Standard', message: '' })
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleCsvChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setSelectedFileName(file.name)
    try {
      const response = await uploadResultCsv(file)
      const count = response?.data?.rowsImported ?? 0
      setStatusMessage(`Uploaded ${count} result records from CSV.`)
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleCreateSection = async (event) => {
    event.preventDefault()
    try {
      await createSection(sectionForm)
      const refreshed = await getSections()
      const rows = refreshed?.data ?? []
      setSections(rows)
      const createdCode = sectionForm.code.trim().toUpperCase()
      setSelectedSectionCode(createdCode)
      await loadSectionTimetable(createdCode)
      setSectionForm({ code: '', name: '', department: 'COMPUTER_SCIENCE' })
      setStatusMessage('Section created successfully.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleSectionChange = async (event) => {
    const sectionCode = event.target.value
    setSelectedSectionCode(sectionCode)
    try {
      await loadSectionTimetable(sectionCode)
      setStatusMessage('Section timetable loaded.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleAddSectionEvent = (event) => {
    event.preventDefault()
    const row = {
      courseCode: sectionEventForm.courseCode.trim() || null,
      title: sectionEventForm.title.trim(),
      room: sectionEventForm.room.trim(),
      tone: sectionEventForm.tone.trim() || 'blue',
      day: sectionEventForm.day.trim(),
      dayIndex: Number(sectionEventForm.dayIndex),
      dayDate: Number(sectionEventForm.dayDate),
      startSlot: Number(sectionEventForm.startSlot),
      duration: Number(sectionEventForm.duration),
    }

    if (!row.title || !row.room || !row.day) {
      setStatusMessage('Please fill title, room, and day for timetable entry.')
      return
    }

    setSectionEvents((prev) => [...prev, row])
    setSectionEventForm((prev) => ({ ...prev, title: '', room: '', courseCode: '' }))
  }

  const handleDeleteSectionEvent = (index) => {
    setSectionEvents((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
  }

  const handleSaveSectionTimetable = async () => {
    if (!selectedSectionCode) {
      setStatusMessage('Please select a section first.')
      return
    }
    try {
      await saveSectionTimetable(selectedSectionCode, sectionEvents)
      await loadSectionTimetable(selectedSectionCode)
      setStatusMessage('Section timetable saved successfully.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleSectionTimetableCsvChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setSelectedTimetableFile(file)
    setSelectedTimetableFileName(file.name)
    setStatusMessage('Timetable CSV selected. Click Update Timetable from CSV to import.')
  }

  const handleUpdateSectionTimetableCsv = async () => {
    if (!selectedSectionCode) {
      setStatusMessage('Please select a section before uploading timetable CSV.')
      return
    }
    if (!selectedTimetableFile) {
      setStatusMessage('Please choose a timetable CSV file first.')
      return
    }

    try {
      const response = await uploadSectionTimetableCsv(selectedSectionCode, selectedTimetableFile)
      const count = response?.data?.rowsImported ?? 0
      await loadSectionTimetable(selectedSectionCode)
      setStatusMessage(`Uploaded ${count} timetable rows from CSV.`)
      setSelectedTimetableFile(null)
      setSelectedTimetableFileName('')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  const handleAssignStudentSection = async (event) => {
    event.preventDefault()

    if (!studentSectionForm.studentId.trim()) {
      setStatusMessage('Please enter a student ID.')
      return
    }

    if (!selectedSectionCode) {
      setStatusMessage('Please select a section first.')
      return
    }

    try {
      await updateStudentSection(studentSectionForm.studentId.trim(), selectedSectionCode)
      const refreshed = await getSections()
      setSections(refreshed?.data ?? [])
      setStatusMessage(`Student ${studentSectionForm.studentId.trim()} assigned to ${selectedSectionCode}.`)
      setStudentSectionForm({ studentId: '' })
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

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

            <label className="mb-6 block cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-10 text-center transition hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
              <p className="mt-2 text-sm font-semibold">Drag and drop your result CSV here</p>
              <p className="text-xs text-on-surface-variant">or click to browse local files (max 10MB)</p>
              <input accept=".csv,text/csv" className="hidden" onChange={handleCsvChange} type="file" />
              {selectedFileName ? <p className="mt-2 text-xs font-semibold text-primary">{selectedFileName}</p> : null}
            </label>

            <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-outline">Or Manual Entry</p>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleResultSubmit}>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setResultForm((prev) => ({ ...prev, studentId: event.target.value }))} placeholder="Student ID" value={resultForm.studentId} />
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setResultForm((prev) => ({ ...prev, courseCode: event.target.value }))} placeholder="Course Code" value={resultForm.courseCode} />
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setResultForm((prev) => ({ ...prev, grade: event.target.value }))} placeholder="Grade / Score" value={resultForm.grade} />
              <GradientButton className="w-full" type="submit">Submit Record</GradientButton>
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

          <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <h2 className="mb-5 font-headline text-xl font-bold text-primary">Section Timetable Management</h2>

            <form className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleCreateSection}>
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionForm((prev) => ({ ...prev, code: event.target.value }))}
                placeholder="Section Code (e.g. CSE-6A)"
                value={sectionForm.code}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm md:col-span-2"
                onChange={(event) => setSectionForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Section Name"
                value={sectionForm.name}
              />
              <select
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionForm((prev) => ({ ...prev, department: event.target.value }))}
                value={sectionForm.department}
              >
                <option value="COMPUTER_SCIENCE">Computer Science</option>
                <option value="MATHEMATICS">Mathematics</option>
                <option value="PHYSICS">Physics</option>
                <option value="HUMANITIES">Humanities</option>
              </select>
              <GradientButton className="md:col-span-4" type="submit">Create Section</GradientButton>
            </form>

            <div className="mb-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Active Section</label>
              <select className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={handleSectionChange} value={selectedSectionCode}>
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section.code} value={section.code}>
                    {section.code} - {section.name}
                  </option>
                ))}
              </select>
            </div>

            <form className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3" onSubmit={handleAssignStudentSection}>
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm md:col-span-2"
                onChange={(event) => setStudentSectionForm({ studentId: event.target.value })}
                placeholder="Student ID (e.g. ST-2024-8849)"
                value={studentSectionForm.studentId}
              />
              <button className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white" type="submit">
                Assign Student To Section
              </button>
            </form>

            <label className="mb-6 block cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-6 text-center transition hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
              <p className="mt-2 text-sm font-semibold">Upload Section Timetable CSV</p>
              <p className="text-xs text-on-surface-variant">Required columns: title, room, day, dayIndex, dayDate, startSlot, duration. Optional: courseCode, tone.</p>
              <input accept=".csv,text/csv" className="hidden" onChange={handleSectionTimetableCsvChange} type="file" />
              {selectedTimetableFileName ? <p className="mt-2 text-xs font-semibold text-primary">{selectedTimetableFileName}</p> : null}
            </label>
            <button
              className="mb-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant"
              onClick={handleUpdateSectionTimetableCsv}
              type="button"
              disabled={!selectedTimetableFile}
            >
              Update Timetable from CSV
            </button>

            <form className="grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handleAddSectionEvent}>
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, courseCode: event.target.value }))}
                placeholder="Course Code"
                value={sectionEventForm.courseCode}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm md:col-span-2"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Class Title"
                value={sectionEventForm.title}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, room: event.target.value }))}
                placeholder="Room"
                value={sectionEventForm.room}
              />

              <select className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setSectionEventForm((prev) => ({ ...prev, day: event.target.value }))} value={sectionEventForm.day}>
                <option>Mon</option>
                <option>Tue</option>
                <option>Wed</option>
                <option>Thu</option>
                <option>Fri</option>
                <option>Sat</option>
                <option>Sun</option>
              </select>
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, dayIndex: event.target.value }))}
                placeholder="Day Index"
                type="number"
                value={sectionEventForm.dayIndex}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, startSlot: event.target.value }))}
                placeholder="Start Slot"
                type="number"
                value={sectionEventForm.startSlot}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, duration: event.target.value }))}
                placeholder="Duration"
                type="number"
                value={sectionEventForm.duration}
              />

              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, dayDate: event.target.value }))}
                placeholder="Date"
                type="number"
                value={sectionEventForm.dayDate}
              />
              <input
                className="rounded-lg bg-surface-container-high px-4 py-3 text-sm"
                onChange={(event) => setSectionEventForm((prev) => ({ ...prev, tone: event.target.value }))}
                placeholder="Tone"
                value={sectionEventForm.tone}
              />
              <button className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white md:col-span-2" type="submit">
                Add Timetable Row
              </button>
            </form>

            <div className="mt-6 space-y-2">
              {sectionEvents.map((event, index) => (
                <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3" key={`${event.day}-${event.startSlot}-${index}`}>
                  <p className="text-sm font-semibold text-on-surface">
                    {event.day} | Slot {event.startSlot} | {event.title} ({event.room})
                  </p>
                  <button className="text-xs font-bold text-error" onClick={() => handleDeleteSectionEvent(index)} type="button">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white" onClick={handleSaveSectionTimetable} type="button">
              Save Section Timetable
            </button>
          </article>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <h2 className="mb-5 font-headline text-xl font-bold text-primary">Create Announcement</h2>
            <form className="space-y-4" onSubmit={handleAnnouncementSubmit}>
              <input className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" value={announcementForm.title} />
              <select className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, priority: event.target.value }))} value={announcementForm.priority}>
                <option>Standard</option>
                <option>High Priority</option>
                <option>Urgent / Mandatory</option>
              </select>
              <textarea className="w-full rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Detailed announcement text..." rows="4" value={announcementForm.message} />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white" type="submit">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Broadcast Announcement
              </button>
            </form>
            {statusMessage ? <p className="mt-4 rounded-lg bg-surface-container-low px-3 py-2 text-sm font-medium text-primary">{statusMessage}</p> : null}
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