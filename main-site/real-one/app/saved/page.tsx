"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { type Product, platforms } from "@/lib/types"
import { getLowestPrice } from "@/lib/utils/price-helpers"
import { Minus, Plus, Trash2, ShoppingCart, Heart, ExternalLink, Clock, CheckSquare, Square } from "lucide-react"
import { useSaved } from "@/lib/contexts/saved-context"
import { useCart } from "@/lib/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function SavedPage() {
  const { savedItems, removeFromSaved, moveToCart, clearSaved } = useSaved()
  const { addToCart } = useCart()
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1)
    moveToCart(product)
  }

  const handleMoveSelectedToCart = () => {
    selectedItems.forEach((productId) => {
      const item = savedItems.find((savedItem) => savedItem.product.id === productId)
      if (item) {
        addToCart(item.product, item.quantity)
        moveToCart(item.product)
      }
    })
    setSelectedItems([])
    router.push("/cart")
  }

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === savedItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(savedItems.map((item) => item.product.id))
    }
  }

  const getTotalItems = () => {
    return savedItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const groupedItems = savedItems.reduce((groups, item) => {
    const dateKey = item.savedAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
    return groups
  }, {} as Record<string, typeof savedItems>)

  if (savedItems.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphism p-12 rounded-2xl">
            <Heart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">No Saved Items</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Save items for later from your cart to keep them here.
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover-glow"
              size="lg"
              onClick={() => router.push("/categories")}
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Saved for Later
          </h1>
          <p className="text-lg text-muted-foreground">{getTotalItems()} items saved</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      {selectedItems.length === savedItems.length && savedItems.length > 0 ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </Button>
                    <Heart className="w-5 h-5" />
                    <span>Your Saved Items</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearSaved} className="hover-glow bg-transparent">
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedItems).map(([dateKey, items]) => (
                  <div key={dateKey} className="space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{dateKey}</h3>
                      <span className="text-sm text-muted-foreground">({items.length} items)</span>
                    </div>
                    {items.map((item) => {
                      const product = item.product
                      const lowestPrice = getLowestPrice(product.prices)

                      return (
                        <div
                          key={product.id}
                          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors border"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSelectItem(product.id)}
                            className="p-0 h-auto hover:bg-transparent"
                          >
                            {selectedItems.includes(product.id) ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </Button>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-muted-foreground">Best price: ₹{lowestPrice}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm text-muted-foreground">Rating:</span>
                              <span className="text-sm font-medium">{product.rating.toString()}★</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Saved at {item.savedAt.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Qty</div>
                              <div className="font-semibold">{item.quantity.toString()}</div>
                            </div>

                            <Button
                              className="bg-gradient-to-r from-primary to-secondary hover-glow"
                              size="sm"
                              onClick={() => handleMoveToCart(product)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Move to Cart
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromSaved(product)}
                              className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover-glow bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Saved Items Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-semibold">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Products:</span>
                    <span className="font-semibold">{savedItems.length}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary hover-glow"
                  onClick={handleMoveSelectedToCart}
                  disabled={selectedItems.length === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move Selected to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
