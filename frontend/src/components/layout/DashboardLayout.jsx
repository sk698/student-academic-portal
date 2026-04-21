import { Outlet, useNavigate } from 'react-router-dom'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { logout } from '../../features/auth/authSlice'

function DashboardLayout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[264px_1fr]">
        <Sidebar onLogout={handleLogout} />
        <main className="min-w-0 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
          <TopHeader />
          <section className="mx-auto max-w-7xl">
            <Outlet />
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default DashboardLayout