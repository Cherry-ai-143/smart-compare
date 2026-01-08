"use client"

import { Search, ShoppingCart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-orange-500 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-2xl font-bold text-primary-foreground">Zepto</div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground">
            <MapPin className="w-4 h-4" />
            <span>Delivery in 10 mins</span>
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </header>
  )
}
