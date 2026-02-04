"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"
import { useAuth } from "@/lib/contexts/auth-context"

export interface SavedItem {
  product: Product
  quantity: number
  savedAt: Date
}

interface SavedContextType {
  savedItems: SavedItem[]
  addToSaved: (product: Product, quantity?: number) => void
  removeFromSaved: (product: Product) => void
  moveToCart: (product: Product) => void
  clearSaved: () => void
  isInSaved: (product: Product) => boolean
  getSavedCount: () => number
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

const getSavedStorageKey = (userId?: string) => {
  return userId ? `smartcompare_saved_items_${userId}` : "smartcompare_saved_items_guest"
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  // Load from localStorage on mount or when user changes
  useEffect(() => {
    const storageKey = getSavedStorageKey(user?.uid)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert savedAt back to Date objects
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          savedAt: new Date(item.savedAt)
        }))
        setSavedItems(itemsWithDates)
        console.log(`[v0] Saved items loaded from localStorage for user ${user?.uid || 'guest'}:`, itemsWithDates)
      } catch (error) {
        console.error("[v0] Error loading saved items from localStorage:", error)
        setSavedItems([])
      }
    } else {
      // Clear saved items when switching users
      setSavedItems([])
    }
  }, [user?.uid])

  // Save to localStorage whenever savedItems or user changes
  useEffect(() => {
    const storageKey = getSavedStorageKey(user?.uid)
    localStorage.setItem(storageKey, JSON.stringify(savedItems))
    console.log(`[v0] Saved items saved to localStorage for user ${user?.uid || 'guest'}:`, savedItems)
  }, [savedItems, user?.uid])

  const addToSaved = (product: Product, quantity = 1) => {
    setSavedItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity, savedAt: new Date() }]
    })
  }

  const removeFromSaved = (product: Product) => {
    setSavedItems((prev) => prev.filter((item) => item.product.id !== product.id))
  }

  const moveToCart = (product: Product) => {
    // This will be handled by the cart context, just remove from saved
    removeFromSaved(product)
  }

  const clearSaved = () => {
    console.log("[v0] clearSaved called - clearing ONLY saved items")
    setSavedItems([])
    console.log("[v0] Saved items cleared successfully")
  }

  const isInSaved = (product: Product) => {
    return savedItems.some((item) => item.product.id === product.id)
  }

  const getSavedCount = () => {
    return savedItems.length
  }

  return (
    <SavedContext.Provider
      value={{
        savedItems,
        addToSaved,
        removeFromSaved,
        moveToCart,
        clearSaved,
        isInSaved,
        getSavedCount,
      }}
    >
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (context === undefined) {
    throw new Error("useSaved must be used within a SavedProvider")
  }
  return context
}
