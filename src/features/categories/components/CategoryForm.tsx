import { useState } from "react"
import Input from "../../../shared/components/imput"
import { createCategory, updateCategory } from "../services/categoryService"
import type { Category, CreateCategory, UpdateCategory } from "../../../types/category"
import type { ApiError } from "../../../types/api"

interface CategoryFormProps {
  category?: Category
  onSuccess: () => void
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (category) {
        const data: UpdateCategory = { name, description }
        await updateCategory(category.id, data)
      } else {
        const data: CreateCategory = { name, description }
        await createCategory(data)
      }
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Error al guardar categoría")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Guardando..." : category ? "Actualizar" : "Crear categoría"}
      </button>
    </form>
  )
}
