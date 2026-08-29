import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCategoryById } from "../services/categoryService"
import CategoryForm from "../components/CategoryForm"
import type { Category } from "../../../types/category"
import type { ApiError } from "../../../types/api"

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    getCategoryById(id)
      .then(setCategory)
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar categoría")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-8 text-center">Cargando...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>
  if (!category) return <p className="p-8 text-center">No encontrada</p>

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Editar Categoría</h1>
      <div className="mx-auto max-w-md">
        <CategoryForm
          category={category}
          onSuccess={() => navigate("/categories")}
        />
      </div>
    </div>
  )
}
