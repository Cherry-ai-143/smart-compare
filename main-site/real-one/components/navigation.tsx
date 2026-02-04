"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search, Menu, X, User, LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/contexts/auth-context"
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name: string, email: string) => {
    if (name && name.trim().length > 0) {
      return name.trim().charAt(0).toUpperCase()
    }
    if (email && email.trim().length > 0) {
      return email.trim().charAt(0).toUpperCase()
    }
    return "U"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/compare", label: "Compare Products" },
    { href: "/cart", label: "Cart" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
  <nav className="sticky top-0 z-[100] glassmorphism-strong animate-slide-in pointer-events-auto overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover-glow hover-scale rounded-lg p-2 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-gentle">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart Compare
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-foreground hover:text-primary transition-all duration-300 font-medium hover-glow hover-lift rounded px-3 py-2 animate-fade-in-up animate-delay-${index * 100}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search Bar and Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative animate-slide-in-right">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-accent glassmorphism transition-all duration-300 hover-lift"
                />
              </form>

              {!user ? (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover-glow hover-scale bg-transparent transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              ) : (
                <UserAvatarDropdown />
              )}
            </div>
          </div>

          {/* Dropdown Menu (visible on all devices) */}
          {isMenuOpen && (
            <div className="absolute right-4 top-16 glassmorphism-strong rounded-lg mt-2 p-4 animate-slide-in mobile-stack shadow-lg z-[100] min-w-[250px]">
              <div className="flex flex-col space-y-4">
                {/* Only user actions remain in the menu */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  {user && (
                    <>
                      <div className="flex items-center space-x-3 p-3 rounded-lg glassmorphism ring-1 ring-primary/10">
                        <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                          <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-secondary text-white font-bold text-xl">
                            {getInitials(user.displayName || "", user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.displayName || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          router.push("/profile")
                          setIsMenuOpen(false)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start hover-glow bg-transparent"
                      >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        onClick={() => {
                          router.push("/settings")
                          setIsMenuOpen(false)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start hover-glow bg-transparent"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start hover-glow text-destructive hover:text-destructive bg-transparent"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
            {/* Dropdown menu now handled by UserAvatarDropdown only */}
        </div>
      </nav>
    </>
  )
}