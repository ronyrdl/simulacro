import { Navigate } from "react-router-dom"
import { useAuth } from "../../features/auth/context/useContext"

export default function RoleGuard({
  children,
  allowedRole,
}: {
  children: React.ReactNode
  allowedRole: "admin" | "user"
}) {
  const { role } = useAuth()

  if (role !== allowedRole) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-xl font-bold text-red-600">403 — Acceso denegado</h2>
        <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
      </div>
    )
  }

  return <>{children}</>
}