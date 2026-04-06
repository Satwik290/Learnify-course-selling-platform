import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = ({ allowedRoles = ['student', 'instructor', 'admin'] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
