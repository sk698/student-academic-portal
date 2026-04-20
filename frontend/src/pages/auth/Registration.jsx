import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import GradientButton from '../../components/ui/GradientButton'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { registerUser } from '../../features/auth/authSlice'
import { selectAuthError, selectAuthStatus } from '../../features/auth/authSelectors'

function Registration() {
  const [formState, setFormState] = useState({
    name: '',
    username: '',
    email: '',
    department: 'COMPUTER_SCIENCE',
    password: '',
  })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const resultAction = await dispatch(registerUser(formState))
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login')
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <span className="material-symbols-outlined text-primary">school</span>
        <span className="font-headline text-xl font-extrabold tracking-tight text-primary">ScholarSanctuary</span>
      </div>

      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Create Account</h1>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">
          Enter your academic credentials to get started.
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Full Name</span>
          <input
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value, username: event.target.value.toLowerCase().replace(/\s+/g, '.') }))}
            placeholder="Enter your full name"
            type="text"
            value={formState.name}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Username</span>
          <input
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
            onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="julian.casablancas"
            type="text"
            value={formState.username}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Academic Email</span>
          <input
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="name@university.edu"
            type="email"
            value={formState.email}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Department</span>
          <select
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
            onChange={(event) => setFormState((prev) => ({ ...prev, department: event.target.value }))}
            value={formState.department}
          >
            <option value="COMPUTER_SCIENCE">Computer Science & Engineering</option>
            <option value="MATHEMATICS">Mathematics & Logic</option>
            <option value="PHYSICS">Physics & Astrophysics</option>
            <option value="HUMANITIES">Humanities & Social Sciences</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Password</span>
          <input
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Minimum 8 characters"
            type="password"
            value={formState.password}
          />
        </label>

        {error ? (
          <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-error">{error}</p>
        ) : null}

        <GradientButton className="mt-3 w-full py-3" type="submit">
          {status === 'loading' ? 'Creating Account...' : 'Complete Registration'}
          <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
        </GradientButton>
      </form>

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link className="font-semibold text-primary" to="/login">
          Log in
        </Link>
      </p>
    </>
  )
}

export default Registration