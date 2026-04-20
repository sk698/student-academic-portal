import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import GradientButton from '../../components/ui/GradientButton'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { loginUser } from '../../features/auth/authSlice'
import { selectAuthError, selectAuthStatus } from '../../features/auth/authSelectors'

function Login() {
  const [formState, setFormState] = useState({ username: '', password: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(selectAuthStatus)
  const error = useAppSelector(selectAuthError)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const resultAction = await dispatch(loginUser(formState))
    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload.role
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-linear-to-br from-primary to-primary-container text-white">
          <span className="material-symbols-outlined">school</span>
        </div>
        <span className="font-headline text-2xl font-extrabold tracking-tight text-primary">ScholarSanctuary</span>
      </div>

      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Welcome Back</h1>
        <p className="mt-2 text-sm font-medium text-on-surface-variant">
          Continue your academic journey with focus and clarity.
        </p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Username</span>
          <span className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
            <input
              className="w-full rounded-xl bg-surface-container-high py-3 pl-11 pr-4 text-sm outline-none ring-primary/20 transition focus:ring-2"
              onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
              placeholder="student"
              type="text"
              value={formState.username}
            />
          </span>
        </label>

        <label className="grid gap-2">
          <span className="flex items-center justify-between text-sm font-semibold text-on-surface-variant">
            Password
            <button className="text-primary" type="button">Forgot Password?</button>
          </span>
          <span className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input
              className="w-full rounded-xl bg-surface-container-high py-3 pl-11 pr-10 text-sm outline-none ring-primary/20 transition focus:ring-2"
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="........"
              type="password"
              value={formState.password}
            />
            <button className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline" type="button">visibility</button>
          </span>
        </label>

        {error ? (
          <p className="rounded-lg bg-error-container px-3 py-2 text-sm text-error">{error}</p>
        ) : null}

        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
          <input className="h-4 w-4 accent-primary" type="checkbox" />
          Stay signed in for 30 days
        </label>

        <GradientButton className="w-full py-3" type="submit">
          {status === 'loading' ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
        </GradientButton>
      </form>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant/50" />
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-outline">Or access via</span>
        <div className="h-px flex-1 bg-outline-variant/50" />
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-surface-container-high" type="button">
        <span className="material-symbols-outlined text-[18px]">cloud</span>
        University SSO
      </button>

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        New to ScholarSanctuary?{' '}
        <Link className="font-headline font-bold text-primary" to="/register">
          Register Student Account
        </Link>
      </p>
    </>
  )
}

export default Login