import axios, { isAxiosError } from "axios"
import { tokenStorage } from "./storage"
import type { ApiError } from "../types/api"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,    
})
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
  })
  
  api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message ?? "Error desconocido",
        statusCode: error.response?.status ?? 0,
      }

      return Promise.reject(apiError)
    }

    return Promise.reject(error)
  }
)

export default api