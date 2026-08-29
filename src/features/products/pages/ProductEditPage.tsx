import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../services/productService"
import ProductForm from "../components/ProductForm"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    getProductById(id)
      .then(setProduct)
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar producto")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-8 text-center">Cargando...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>
  if (!product) return <p className="p-8 text-center">No encontrado</p>

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Editar Producto</h1>
      <div className="mx-auto max-w-md">
        <ProductForm
          product={product}
          onSuccess={() => navigate(`/products/${product.id}`)}
        />
      </div>
    </div>
  )
}
