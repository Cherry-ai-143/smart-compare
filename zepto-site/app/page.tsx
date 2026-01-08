"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import ProductDetail from "@/components/product-detail"

export default function Home() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productId)

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId)
      // Scroll to the product
      setTimeout(() => {
        const element = document.getElementById(`product-${productId}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [productId])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <ProductDetail productId={selectedProduct} onClose={() => setSelectedProduct(null)} />
        ) : (
          <ProductGrid onSelectProduct={setSelectedProduct} />
        )}
      </div>
    </main>
  )
}
