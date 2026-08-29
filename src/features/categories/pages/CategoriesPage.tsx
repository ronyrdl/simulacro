import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getCategories, deleteCategory } from "../services/categoryService"
import { useAuth } from "../../auth/context/useContext"
import type { Category } from "../../../types/category"
import type { ApiError } from "../../../types/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { role } = useAuth()

  const load = () => {
    setLoading(true)
    setError("")
    getCategories()
      .then(setCategories)
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar categorías")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || "Error al eliminar")
    }
  }

  if (loading) return <p className="p-8 text-center">Cargando categorías...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        {role === "admin" && (
          <Link
            to="/categories/new"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            + Nueva categoría
          </Link>
        )}
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No hay categorías.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border p-4 shadow-sm">
              <Link to={`/categories/${cat.id}`} className="hover:underline">
                <h2 className="text-lg font-semibold">{cat.name}</h2>
              </Link>
              <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
              {role === "admin" && (
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/categories/${cat.id}/edit`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
