const TOKEN_KEY = "accessToken"
const USER_KEY = "user"

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  remove: (): void => localStorage.removeItem(TOKEN_KEY),
}

export const userStorage = {
  get: (): import("../types/user").User | null => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  set: (user: import("../types/user").User): void =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  remove: (): void => localStorage.removeItem(USER_KEY),
}