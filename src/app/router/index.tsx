import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../features/auth/context/useContext"
import AuthGuard from "../../shared/components/AuthGuard"
import RoleGuard from "../../shared/components/RoleGuard"
import LoginPage from "../../features/auth/pages/LoginPage"
import RegisterPage from "../../features/auth/pages/RegisterPage"
import CategoriesPage from "../../features/categories/pages/CategoriesPage"
import CategoryDetailPage from "../../features/categories/pages/CategoryDetailPage"
import CategoryFormPage from "../../features/categories/pages/CategoryFormPage"
import CategoryEditPage from "../../features/categories/pages/CategoryEditPage"
import ProductsPage from "../../features/products/pages/ProductsPage"
import ProductDetailPage from "../../features/products/pages/ProductDetailPage"
import ProductFormPage from "../../features/products/pages/ProductFormPage"
import ProductEditPage from "../../features/products/pages/ProductEditPage"
import FavoritesPage from "../../features/favorites/pages/FavoritesPage"

function Navbar() {
  const { user, logout, token } = useAuth()

  return (
    <nav className="bg-gray-800 px-6 py-3 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold hover:text-gray-300">
            Inicio
          </Link>
          <Link to="/categories" className="hover:text-gray-300">
            Categorías
          </Link>
          <Link to="/products" className="hover:text-gray-300">
            Productos
          </Link>
          {token && (
            <Link to="/favorites" className="hover:text-gray-300">
              Favoritos
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Iniciar sesión
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function Layout() {
  const location = useLocation()
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "" : "min-h-screen bg-gray-50"}>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<CategoryDetailPage />} />
          <Route
            path="/categories/new"
            element={
              <AuthGuard>
                <RoleGuard allowedRole="admin">
                  <CategoryFormPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/categories/:id/edit"
            element={
              <AuthGuard>
                <RoleGuard allowedRole="admin">
                  <CategoryEditPage />
                </RoleGuard>
              </AuthGuard>
            }
          />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/products/new"
            element={
              <AuthGuard>
                <ProductFormPage />
              </AuthGuard>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <AuthGuard>
                <ProductEditPage />
              </AuthGuard>
            }
          />

          <Route
            path="/favorites"
            element={
              <AuthGuard>
                <FavoritesPage />
              </AuthGuard>
            }
          />

          <Route
            path="*"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">404</h1>
                <p className="text-gray-500">Página no encontrada</p>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
