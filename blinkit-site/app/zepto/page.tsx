"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ZeptoHeader from "@/components/zepto/header"
import ZeptoProductGrid from "@/components/zepto/product-grid"
import ZeptoProductDetail from "@/components/zepto/product-detail"

export default function ZeptoHome() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productId)

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId)
      setTimeout(() => {
        const element = document.getElementById(`zepto-product-${productId}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [productId])

  return (
    <main className="min-h-screen bg-background">
      <ZeptoHeader />
      <div className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <ZeptoProductDetail productId={selectedProduct} onClose={() => setSelectedProduct(null)} />
        ) : (
          <ZeptoProductGrid onSelectProduct={setSelectedProduct} />
        )}
      </div>
    </main>
  )
}
