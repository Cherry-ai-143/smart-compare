"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import BigBasketHeader from "@/components/bigbasket/header"
import BigBasketProductGrid from "@/components/bigbasket/product-grid"
import BigBasketProductDetail from "@/components/bigbasket/product-detail"

export default function BigBasketHome() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productId)

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId)
      setTimeout(() => {
        const element = document.getElementById(`bigbasket-product-${productId}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [productId])

  return (
    <main className="min-h-screen bg-background">
      <BigBasketHeader />
      <div className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <BigBasketProductDetail productId={selectedProduct} onClose={() => setSelectedProduct(null)} />
        ) : (
          <BigBasketProductGrid onSelectProduct={setSelectedProduct} />
        )}
      </div>
    </main>
  )
}
