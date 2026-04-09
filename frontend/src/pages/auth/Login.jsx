import { Link } from 'react-router-dom'
import GradientButton from '../../components/ui/GradientButton'

function Login() {
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

      <form className="space-y-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Institutional Email</span>
          <span className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
            <input className="w-full rounded-xl bg-surface-container-high py-3 pl-11 pr-4 text-sm outline-none ring-primary/20 transition focus:ring-2" placeholder="student@university.edu" type="email" />
          </span>
        </label>

        <label className="grid gap-2">
          <span className="flex items-center justify-between text-sm font-semibold text-on-surface-variant">
            Password
            <button className="text-primary" type="button">Forgot Password?</button>
          </span>
          <span className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input className="w-full rounded-xl bg-surface-container-high py-3 pl-11 pr-10 text-sm outline-none ring-primary/20 transition focus:ring-2" placeholder="........" type="password" />
            <button className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline" type="button">visibility</button>
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
          <input className="h-4 w-4 accent-primary" type="checkbox" />
          Stay signed in for 30 days
        </label>

        <GradientButton className="w-full py-3" type="submit">
          Sign In
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