import { Link } from 'react-router-dom'
import GradientButton from '../../components/ui/GradientButton'

function Registration() {
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

      <form className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Full Name</span>
          <input className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2" placeholder="Enter your full name" type="text" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Academic Email</span>
          <input className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2" placeholder="name@university.edu" type="email" />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Department</span>
          <select className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2">
            <option>Computer Science & Engineering</option>
            <option>Mathematics & Logic</option>
            <option>Physics & Astrophysics</option>
            <option>Humanities & Social Sciences</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">Password</span>
          <input className="rounded-xl bg-surface-container-high px-4 py-3 text-sm outline-none ring-primary/20 transition focus:ring-2" placeholder="Minimum 8 characters" type="password" />
        </label>

        <GradientButton className="mt-3 w-full py-3" type="submit">
          Complete Registration
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