"use client"

import { Search, ShoppingCart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ZeptoHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-2xl font-bold text-white">Zepto</div>
          <div className="flex items-center gap-2 text-sm text-white">
            <MapPin className="w-4 h-4" />
            <span>15 mins delivery</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-purple-600">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>
    </header>
  )
}
