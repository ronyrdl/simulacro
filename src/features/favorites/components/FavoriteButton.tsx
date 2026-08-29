import { useState, useEffect } from "react"
import { addFavorite, removeFavorite, checkFavorite } from "../services/favoriteService"
import { useAuth } from "../../auth/context/useContext"
import type { ApiError } from "../../../types/api"

interface FavoriteButtonProps {
  productId: string
  onToggle?: () => void
}

export default function FavoriteButton({ productId, onToggle }: FavoriteButtonProps) {
  const { token } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    checkFavorite(productId)
      .then(setIsFavorite)
      .catch(() => {})
  }, [productId, token])

  if (!token) return null

  const toggle = async () => {
    setLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(productId)
        setIsFavorite(false)
      } else {
        await addFavorite(productId)
        setIsFavorite(true)
      }
      onToggle?.()
    } catch (err) {
      const apiError = err as ApiError
      if (apiError.statusCode === 409) {
        setIsFavorite(true)
      } else if (apiError.statusCode === 404) {
        setIsFavorite(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-2xl transition ${isFavorite ? "text-red-500" : "text-gray-400"} hover:scale-110 disabled:opacity-50`}
      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  )
}
