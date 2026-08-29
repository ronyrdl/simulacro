import { useSearchParams } from "react-router-dom"
import ProductForm from "../components/ProductForm"

export default function ProductFormPage() {
  const [searchParams] = useSearchParams()
  const categoryIdParam = searchParams.get("categoryId")

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">
        {categoryIdParam ? "Agregar producto a categoría" : "Nuevo producto"}
      </h1>
      <div className="mx-auto max-w-md">
        <ProductForm
          defaultCategoryId={categoryIdParam ?? undefined}
          onSuccess={() => {
            window.history.back()
          }}
        />
      </div>
    </div>
  )
}
