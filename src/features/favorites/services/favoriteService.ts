import api from "../../../lib/axios"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export const getFavorites = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/favorites")
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const addFavorite = async (productId: string): Promise<void> => {
  try {
    await api.post(`/favorites/${productId}`)
  } catch (error) {
    throw error as ApiError
  }
}

export const removeFavorite = async (productId: string): Promise<void> => {
  try {
    await api.delete(`/favorites/${productId}`)
  } catch (error) {
    throw error as ApiError
  }
}

export const checkFavorite = async (productId: string): Promise<boolean> => {
  try {
    await api.get(`/favorites/${productId}`)
    return true
  } catch (error) {
    const apiError = error as ApiError
    if (apiError.statusCode === 404) return false
    throw error
  }
}
