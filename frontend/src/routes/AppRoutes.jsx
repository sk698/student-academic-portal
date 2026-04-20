import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import Login from '../pages/auth/Login'
import Registration from '../pages/auth/Registration'
import AdminPanel from '../pages/admin/AdminPanel'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import Announcements from '../pages/info/Announcements'
import AcademicTimetable from '../pages/info/AcademicTimetable'
import MyProfile from '../pages/info/MyProfile'
import ResultsOverview from '../pages/info/ResultsOverview'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/results" element={<ResultsOverview />} />
          <Route path="/timetable" element={<AcademicTimetable />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/profile" element={<MyProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
