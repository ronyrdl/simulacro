import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getCategoryById, getCategoryProducts } from "../services/categoryService"
import { useAuth } from "../../auth/context/useContext"
import FavoriteButton from "../../favorites/components/FavoriteButton"
import type { Category } from "../../../types/category"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const numId = id

    Promise.all([getCategoryById(numId), getCategoryProducts(numId)])
      .then(([cat, prods]) => {
        setCategory(cat)
        setProducts(prods)
      })
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar categoría")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-8 text-center">Cargando...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>
  if (!category) return <p className="p-8 text-center">Categoría no encontrada</p>

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
      <p className="mb-6 text-gray-600">{category.description}</p>

      {token && (
        <Link
          to={`/products/new?categoryId=${category.id}`}
          className="mb-6 inline-block rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Agregar producto a esta categoría
        </Link>
      )}

      <h2 className="mb-4 text-xl font-semibold">Productos</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((prod) => (
            <div key={prod.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <Link to={`/products/${prod.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{prod.name}</h3>
                </Link>
                <FavoriteButton productId={prod.id} />
              </div>
              <p className="mt-1 text-sm text-gray-600">{prod.description}</p>
              <p className="mt-2 font-bold text-green-600">${prod.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
