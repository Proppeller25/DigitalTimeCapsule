// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SkeletonPage from '../pages/SkeletonPage'

const ProtectedRoute = () => {
  const { isLoggedIn, loading} = useAuth()

  if (loading) return <SkeletonPage />
  return isLoggedIn ? <Outlet /> : <Navigate to="/NotFound" replace />
};

export default ProtectedRoute