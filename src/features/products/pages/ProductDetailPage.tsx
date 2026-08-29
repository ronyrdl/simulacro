import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getProductById, deleteProduct } from "../services/productService"
import { useAuth } from "../../auth/context/useContext"
import FavoriteButton from "../../favorites/components/FavoriteButton"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProductById(id)
      .then(setProduct)
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar producto")
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!product || !confirm("¿Eliminar este producto?")) return
    try {
      await deleteProduct(product.id)
      navigate("/products")
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || "Error al eliminar")
    }
  }

  if (loading) return <p className="p-8 text-center">Cargando...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>
  if (!product) return <p className="p-8 text-center">Producto no encontrado</p>

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <FavoriteButton productId={product.id} />
        </div>

        {product.images?.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`${product.name} ${i + 1}`}
                className="h-48 rounded object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ))}
          </div>
        )}

        <p className="mb-4 text-gray-600">{product.description}</p>
        <p className="mb-2 text-2xl font-bold text-green-600">${product.price}</p>
        <p className="mb-6 text-gray-500">Stock: {product.stock}</p>

        {token && (
          <div className="flex gap-3">
            <Link
              to={`/products/${product.id}/edit`}
              className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
