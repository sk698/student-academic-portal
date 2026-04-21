import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectIsAuthenticated, selectIsAdmin } from '../features/auth/authSelectors'

function ProtectedRoute({ adminOnly = false }) {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const isAdmin = useAppSelector(selectIsAdmin)

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	if (adminOnly && !isAdmin) {
		return <Navigate to="/dashboard" replace />
	}

	return <Outlet />
}

export default ProtectedRoute
