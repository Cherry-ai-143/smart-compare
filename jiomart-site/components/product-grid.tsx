"use client"

import { useState, useEffect } from "react"
import JioMartProductCard from "./jiomart/product-card"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
}

interface ProductGridProps {
  onSelectProduct: (productId: string) => void
}

export default function ProductGrid({ onSelectProduct }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-blue-900">JioMart Groceries</h1>
      <p className="text-blue-700 mb-8">Fresh products, great prices</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <JioMartProductCard
            key={product._id}
            product={product}
            quantity={cart[product._id] || 0}
            onAddToCart={() => handleAddToCart(product._id)}
            onViewDetails={() => onSelectProduct(product._id)}
          />
        ))}
      </div>
    </div>
  )
}
