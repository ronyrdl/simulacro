import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getFavorites } from "../services/favoriteService"
import FavoriteButton from "../components/FavoriteButton"
import type { Product } from "../../../types/product"
import type { ApiError } from "../../../types/api"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = () => {
    setLoading(true)
    setError("")
    getFavorites()
      .then(setFavorites)
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar favoritos")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p className="p-8 text-center">Cargando favoritos...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No tienes productos favoritos.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((prod) => (
            <div key={prod.id} className="rounded-lg border p-4 shadow-sm">
              {prod.images?.[0] && (
                <img
                  src={prod.images[0].url}
                  alt={prod.name}
                  className="mb-2 h-40 w-full rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              )}
              <div className="flex items-start justify-between">
                <Link to={`/products/${prod.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{prod.name}</h3>
                </Link>
                <FavoriteButton productId={prod.id} onToggle={load} />
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
