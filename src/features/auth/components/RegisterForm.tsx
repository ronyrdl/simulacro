import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../../shared/components/imput"
import { useAuth } from "../context/useContext"
import { register } from "../services/authService"
import type { ApiError } from "../../../types/api"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setGeneralError("")
    setLoading(true)

    try {
      await register({ name, email, password })
      await login(email, password)
      navigate("/")
    } catch (error) {
      const apiError = error as ApiError

      if (apiError.statusCode === 409) {
        setErrors({ email: "El email ya está registrado" })
      } else if (apiError.statusCode === 400) {
        const msg = apiError.message
        const fieldErrors: Record<string, string> = {}

        if (msg.includes("name")) fieldErrors.name = msg
        else if (msg.includes("email")) fieldErrors.email = msg
        else if (msg.includes("password")) fieldErrors.password = msg
        else setGeneralError(msg)

        if (Object.keys(fieldErrors).length === 0) setGeneralError(msg)
        else setErrors(fieldErrors)
      } else {
        setGeneralError(apiError.message || "Error al registrar")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      {generalError && (
        <p className="mb-4 text-center text-sm text-red-500">{generalError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  )
}
