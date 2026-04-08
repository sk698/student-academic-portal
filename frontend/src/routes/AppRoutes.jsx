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

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/results" element={<ResultsOverview />} />
        <Route path="/timetable" element={<AcademicTimetable />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
