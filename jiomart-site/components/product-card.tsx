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

export default function ProductCard({ product, quantity, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div
      id={`product-${product._id}`}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
      onClick={onViewDetails}
    >
      <div className="relative h-40 bg-muted overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-card-foreground line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-primary mt-2">₹{product.price}</p>

        {quantity === 0 ? (
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation()
              onAddToCart()
            }}
            className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            Add
          </Button>
        ) : (
          <div className="flex items-center justify-between mt-3 bg-primary/10 rounded p-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm">{quantity}</span>
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                onAddToCart()
              }}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
