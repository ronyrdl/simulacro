import { useState } from "react"
import Input from "../../../shared/components/imput"
import { createProduct, updateProduct } from "../services/productService"
import { getCategories } from "../../categories/services/categoryService"
import type { Product } from "../../../types/product"
import type { CreateProduct } from "../../../types/createProduct"
import type { UpdateProduct } from "../../../types/updateProducts"
import type { ApiError } from "../../../types/api"
import type { Category } from "../../../types/category"
import { useEffect } from "react"

interface ProductFormProps {
  product?: Product
  defaultCategoryId?: string
  onSuccess: () => void
}

export default function ProductForm({ product, defaultCategoryId, onSuccess }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product?.price?.toString() ?? "")
  const [stock, setStock] = useState(product?.stock?.toString() ?? "")
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() ?? defaultCategoryId?.toString() ?? "")
  const [images, setImages] = useState(
    product?.images?.map((img) => img.url).join(", ") ?? ""
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const showCategorySelect = !defaultCategoryId

  useEffect(() => {
    if (showCategorySelect) {
      getCategories()
        .then(setCategories)
        .catch(() => {})
    }
  }, [showCategorySelect])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const imagesArray = images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0)

    try {
      if (product) {
        const data: UpdateProduct = {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          categoryId,
          images: imagesArray,
        }
        await updateProduct(product.id, data)
      } else {
        const data: CreateProduct = {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          categoryId,
          images: imagesArray,
        }
        await createProduct(data)
      }
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Error al guardar producto")
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
      <Input
        label="Precio"
        name="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        label="Stock"
        name="stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      {showCategorySelect ? (
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="categoryId" value={categoryId} />
      )}

      <Input
        label="Imágenes (URLs separadas por coma)"
        name="images"
        value={images}
        onChange={(e) => setImages(e.target.value)}
      />

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
      </button>
    </form>
  )
}
