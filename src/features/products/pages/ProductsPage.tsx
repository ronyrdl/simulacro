import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { getProducts } from "../services/productService"
import { getCategories } from "../../categories/services/categoryService"
import FavoriteButton from "../../favorites/components/FavoriteButton"
import type { Product } from "../../../types/product"
import type { Category } from "../../../types/category"
import type { ApiError } from "../../../types/api"

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const page = Number(searchParams.get("page") || 1)
  const search = searchParams.get("search") || ""
  const categoryId = searchParams.get("categoryId") || ""

  const load = () => {
    setLoading(true)
    setError("")
    getProducts({
      page,
      limit: 9,
      search: search || undefined,
      categoryId: categoryId || undefined,
    })
      .then((res) => {
        setProducts(res.data)
        setTotalPages(res.totalPages)
      })
      .catch((err) => {
        const apiError = err as ApiError
        setError(apiError.message || "Error al cargar productos")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    load()
  }, [page, search, categoryId])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("search") as HTMLInputElement
    const params = new URLSearchParams(searchParams)
    if (input.value) params.set("search", input.value)
    else params.delete("search")
    params.set("page", "1")
    setSearchParams(params)
  }

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(p))
    setSearchParams(params)
  }

  if (loading) return <p className="p-8 text-center">Cargando productos...</p>
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          to="/products/new"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Buscar productos..."
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-gray-200 px-3 py-2 hover:bg-gray-300"
          >
            Buscar
          </button>
        </form>
        <select
          value={categoryId}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams)
            if (e.target.value) params.set("categoryId", e.target.value)
            else params.delete("categoryId")
            params.set("page", "1")
            setSearchParams(params)
          }}
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => (
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
                  <FavoriteButton productId={prod.id} />
                </div>
                <p className="mt-1 text-sm text-gray-600">{prod.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-bold text-green-600">${prod.price}</p>
                  <p className="text-sm text-gray-400">Stock: {prod.stock}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}
