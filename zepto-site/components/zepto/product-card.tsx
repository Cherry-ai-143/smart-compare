"use client"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  quantity: number
  onAddToCart: () => void
  onViewDetails: () => void
}

export default function ZeptoProductCard({ product, quantity, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div
      id={`zepto-product-${product._id}`}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={onViewDetails}
    >
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-orange-600 mt-2">₹{product.price}</p>

        {quantity === 0 ? (
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              onAddToCart()
            }}
            className="w-full mt-3 bg-orange-600 text-white hover:bg-orange-700"
            size="sm"
          >
            Add
          </Button>
        ) : (
          <div className="flex items-center justify-between mt-3 bg-orange-100 rounded p-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-orange-600">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm text-orange-600">{quantity}</span>
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                onAddToCart()
              }}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-orange-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
