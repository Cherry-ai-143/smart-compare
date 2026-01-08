"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import JioMartHeader from "@/components/jiomart/header"
import JioMartProductGrid from "@/components/jiomart/product-grid"
import JioMartProductDetail from "@/components/jiomart/product-detail"

export default function JioMartHome() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productId)

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId)
      setTimeout(() => {
        const element = document.getElementById(`jiomart-product-${productId}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [productId])

  return (
    <main className="min-h-screen bg-background">
      <JioMartHeader />
      <div className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <JioMartProductDetail productId={selectedProduct} onClose={() => setSelectedProduct(null)} />
        ) : (
          <JioMartProductGrid onSelectProduct={setSelectedProduct} />
        )}
      </div>
    </main>
  )
}
