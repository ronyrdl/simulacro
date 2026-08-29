import { Navigate } from "react-router-dom"
import { useAuth } from "../../features/auth/context/useContext"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()

  if (loading) return <p className="p-8 text-center">Cargando...</p>
  if (!token) return <Navigate to="/login" replace />

  return <>{children}</>
}