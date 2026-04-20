import { useEffect, useState } from 'react'
import GradientButton from '../../components/ui/GradientButton'
import { studentProfile } from '../../data/mockData'
import { getProfile, updateProfile } from '../../services/api'

function MyProfile() {
  const [profile, setProfile] = useState(studentProfile)
  const [draftProfile, setDraftProfile] = useState(studentProfile)
  const [savedMessage, setSavedMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    getProfile()
      .then((response) => {
        if (isMounted && response?.data) {
          setProfile(response.data)
          setDraftProfile(response.data)
        }
      })
      .catch(() => {
        // Keep stitched fallback data if API is unavailable.
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        name: draftProfile.name,
        email: draftProfile.email,
        phone: draftProfile.phone,
        department: draftProfile.department,
        program: draftProfile.program,
        semester: draftProfile.semester,
        dob: draftProfile.dob,
        address: draftProfile.address,
      }
      const response = await updateProfile(payload)
      if (response?.data) {
        setProfile(response.data)
        setDraftProfile(response.data)
      }
      setSavedMessage('Profile updated successfully.')
    } catch (error) {
      setSavedMessage(error.message)
    } finally {
      setIsSaving(false)
      window.setTimeout(() => setSavedMessage(''), 2500)
    }
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">Student Profile</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Manage your personal information and academic identity.</p>
      </header>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <article className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10" />
            <div className="relative text-center">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-container font-headline text-3xl font-black text-white">
                {profile.avatarInitials}
              </div>
              <h3 className="mt-5 font-headline text-2xl font-bold">{profile.name}</h3>
              <p className="text-sm text-on-surface-variant">Undergraduate Student</p>
              <span className="mt-4 inline-flex rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                {profile.status}
              </span>
            </div>
          </article>

          <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)]">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-outline">Academic Progress</h4>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold">
                <span>Credits Earned</span>
                <span className="text-primary">84 / 120</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                <span className="block h-full w-[70%] bg-gradient-to-r from-primary to-primary-container" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-100 text-orange-800">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Cumulative GPA</p>
                <p className="font-bold">9.04 / 10</p>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_-8px_rgba(0,63,135,0.08)] lg:col-span-8">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold tracking-tight">Personal Information</h2>
            <GradientButton onClick={handleSave} type="button">{isSaving ? 'Saving...' : 'Save Changes'}</GradientButton>
          </div>
          {savedMessage ? <p className="mb-4 text-sm font-semibold text-emerald-700">{savedMessage}</p> : null}

          <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Student ID</span>
              <input className="rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant" readOnly value={draftProfile.studentId} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Department</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, department: event.target.value }))} value={draftProfile.department} />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Full Name</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, name: event.target.value }))} value={draftProfile.name} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Email</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, email: event.target.value }))} value={draftProfile.email} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Phone</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, phone: event.target.value }))} value={draftProfile.phone} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Date of Birth</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, dob: event.target.value }))} value={draftProfile.dob} />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Semester</span>
              <input className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, semester: event.target.value }))} value={draftProfile.semester} />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-outline">Address</span>
              <textarea className="rounded-lg bg-surface-container-high px-4 py-3 text-sm" onChange={(event) => setDraftProfile((prev) => ({ ...prev, address: event.target.value }))} rows="3" value={draftProfile.address} />
            </label>
          </form>
        </article>
      </section>
    </>
  )
}

export default MyProfile