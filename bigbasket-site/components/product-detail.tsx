"use client"

import { X, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const PRODUCTS: Record<string, any> = {
  "1": {
    id: "1",
    name: "Fresh Tomatoes",
    price: 45,
    image: "/fresh-red-tomatoes.jpg",
    category: "Vegetables",
    description: "Juicy, ripe tomatoes perfect for salads and cooking. Sourced fresh daily from local farms.",
  },
  "2": {
    id: "2",
    name: "Organic Milk",
    price: 65,
    image: "/milk-bottle-dairy.jpg",
    category: "Dairy",
    description: "Pure organic milk from grass-fed cows. Rich in nutrients and calcium.",
  },
  "3": {
    id: "3",
    name: "Whole Wheat Bread",
    price: 55,
    image: "/whole-wheat-bread-loaf.jpg",
    category: "Bakery",
    description: "Freshly baked whole wheat bread. High in fiber and perfect for a healthy diet.",
  },
  "4": {
    id: "4",
    name: "Banana Bunch",
    price: 40,
    image: "/fresh-yellow-bananas.jpg",
    category: "Fruits",
    description: "Golden ripe bananas packed with potassium and natural energy.",
  },
  "5": {
    id: "5",
    name: "Cheddar Cheese",
    price: 280,
    image: "/cheddar-cheese-block.png",
    category: "Dairy",
    description: "Premium aged cheddar cheese with a sharp, rich flavor.",
  },
  "6": {
    id: "6",
    name: "Olive Oil",
    price: 450,
    image: "/olive-oil-bottle-premium.jpg",
    category: "Oils",
    description: "Extra virgin olive oil from Mediterranean vineyards. Perfect for cooking and salads.",
  },
  "7": {
    id: "7",
    name: "Spinach Bundle",
    price: 35,
    image: "/fresh-green-spinach-leaves.jpg",
    category: "Vegetables",
    description: "Fresh, crisp spinach leaves. Packed with iron and vitamins.",
  },
  "8": {
    id: "8",
    name: "Greek Yogurt",
    price: 120,
    image: "/greek-yogurt-container.png",
    category: "Dairy",
    description: "Creamy Greek yogurt with live cultures. High in protein.",
  },
  "9": {
    id: "9",
    name: "Almonds",
    price: 380,
    image: "/raw-almonds-nuts.jpg",
    category: "Nuts",
    description: "Raw, unsalted almonds. Great source of healthy fats and protein.",
  },
  "10": {
    id: "10",
    name: "Honey Jar",
    price: 220,
    image: "/honey-jar-golden.jpg",
    category: "Condiments",
    description: "Pure, raw honey from local beekeepers. Natural sweetener with health benefits.",
  },
  "11": {
    id: "11",
    name: "Carrots",
    price: 50,
    image: "/fresh-orange-carrots.jpg",
    category: "Vegetables",
    description: "Sweet, crunchy carrots. Rich in beta-carotene and vitamin A.",
  },
  "12": {
    id: "12",
    name: "Eggs (12)",
    price: 85,
    image: "/dozen-eggs-carton.jpg",
    category: "Dairy",
    description: "Fresh farm eggs from free-range chickens. High in protein and nutrients.",
  },
}

interface ProductDetailProps {
  productId: string
  onClose: () => void
}

export default function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const product = PRODUCTS[productId]
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-card-foreground">Product Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center bg-muted rounded-lg h-80">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-card-foreground mb-2">{product.name}</h1>
                <p className="text-4xl font-bold text-primary mb-4">₹{product.price}</p>
                <p className="text-card-foreground/80 leading-relaxed mb-6">{product.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-card-foreground">Quantity:</span>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Continue Shopping
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
