import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCategories } from "../services/categoryService"
import CategoryForm from "../components/CategoryForm"
import type { Category } from "../../../types/category"

export default function CategoryFormPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8 text-center">Cargando...</p>

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Nueva Categoría</h1>
      <div className="mx-auto max-w-md">
        <CategoryForm
          onSuccess={() => {
            navigate("/categories")
          }}
        />
      </div>
    </div>
  )
}
