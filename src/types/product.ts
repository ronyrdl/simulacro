export interface ProductImage {
  id: string
  url: string
  order: number
  productId: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  images: ProductImage[]
  category?: {
    id: string
    name: string
    description: string
  }
  createdAt: string
}
