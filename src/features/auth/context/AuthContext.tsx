import { createContext, useEffect, useState } from "react"
import type { Role, User } from "../../../types/user"
import {
  login as loginService,
  logout as logoutService,
} from "../services/authService"
import { tokenStorage, userStorage } from "../../../lib/storage"
import api from "../../../lib/axios"

interface AuthContextType {
  user: User | null
  token: string | null
  role: Role | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
})

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = tokenStorage.get()
    const storedUser = userStorage.get()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
      setRole(storedUser.role)

      api
        .get<User>("/users/me")
        .then((res) => {
          setUser(res.data)
          setRole(res.data.role)
          userStorage.set(res.data)
        })
        .catch(() => {
          tokenStorage.remove()
          userStorage.remove()
          setToken(null)
          setUser(null)
          setRole(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password })

    tokenStorage.set(response.accessToken)
    userStorage.set(response.user)

    setToken(response.accessToken)
    setUser(response.user)
    setRole(response.user.role)
  }

  const logout = async () => {
    try {
      await logoutService()
    } finally {
      tokenStorage.remove()
      userStorage.remove()
      setToken(null)
      setUser(null)
      setRole(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}