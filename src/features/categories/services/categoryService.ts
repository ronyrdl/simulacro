import api from "../../../lib/axios"
import type { Category, CreateCategory, UpdateCategory } from "../../../types/category"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories")
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const getCategoryProducts = async (id: string): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>(`/categories/${id}/products`)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const createCategory = async (data: CreateCategory): Promise<Category> => {
  try {
    const response = await api.post<Category>("/categories", data)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const updateCategory = async (id: string, data: UpdateCategory): Promise<Category> => {
  try {
    const response = await api.patch<Category>(`/categories/${id}`, data)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`)
  } catch (error) {
    throw error as ApiError
  }
}
