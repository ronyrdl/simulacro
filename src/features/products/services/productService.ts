import api from "../../../lib/axios"
import type { Product } from "../../../types/product"
import type { CreateProduct } from "../../../types/createProduct"
import type { UpdateProduct } from "../../../types/updateProducts"
import type { PaginatedResponse, ApiError } from "../../../types/api"

interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
}

export const getProducts = async (query: ProductQuery = {}): Promise<PaginatedResponse<Product>> => {
  try {
    const params = new URLSearchParams()
    if (query.page) params.append("page", String(query.page))
    if (query.limit) params.append("limit", String(query.limit))
    if (query.search) params.append("search", query.search)
    if (query.categoryId) params.append("categoryId", String(query.categoryId))

    const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const createProduct = async (data: CreateProduct): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products", data)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const updateProduct = async (id: string, data: UpdateProduct): Promise<Product> => {
  try {
    const response = await api.patch<Product>(`/products/${id}`, data)
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`)
  } catch (error) {
    throw error as ApiError
  }
}
