"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { platforms } from "@/lib/types"
import { getLowestPrice, getLowestPricePlatform } from "@/lib/utils/price-helpers"
import { MapPin, ShoppingCart, ExternalLink, TrendingDown, Clock, CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react"
import { useCompare } from "@/lib/contexts/compare-context"
import { useCart } from "@/lib/contexts/cart-context"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)



const LOCATION_STORAGE_KEY = "smartcompare_detected_location"

export default function ComparePage() {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare()
  const { setCartFromCompare } = useCart()
  const router = useRouter()
  const [detectedLocation, setDetectedLocation] = useState<{city: string, area: string, landmark: string, pincode: string} | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [isComparing, setIsComparing] = useState(false)

  const getProductId = (product: Product): string => {
    return product._id || `${product.category}-${product.id}`
  }

  // Load detected location from localStorage on component mount
  useEffect(() => {
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (storedLocation) {
      try {
        setDetectedLocation(JSON.parse(storedLocation))
      } catch (error) {
        console.error("Error loading location from localStorage:", error)
        setDetectedLocation(null)
      }
    }
  }, [])

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsDetecting(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          const data = await response.json()

          let city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || data.address?.county || data.address?.state_district || data.address?.state || ""
          let area = data.address?.suburb || data.address?.neighbourhood || data.address?.subarea || data.address?.locality || data.address?.quarter || data.address?.residential || data.address?.commercial || ""
          let landmark = data.address?.amenity || data.address?.building || data.address?.shop || data.address?.tourism || data.address?.historic || data.address?.leisure || data.address?.road || data.address?.highway || data.address?.place || ""
          let postcode = data.address?.postcode || ""

          // Fallback to parsing display_name if address fields are empty
          if (!city || !area || !landmark) {
            const displayParts = data.display_name?.split(', ') || []
            if (displayParts.length >= 3) {
              if (!landmark) landmark = displayParts[0] || ""
              if (!area) area = displayParts[1] || ""
              if (!city) city = displayParts[2] || ""
            }
          }

          // Ensure we have some values, even if generic
          if (!city) city = "Unknown City"
          if (!area) area = "Unknown Area"
          if (!landmark) landmark = "Unknown Landmark"
          if (!postcode) postcode = "Unknown Pincode"

          const locationData = { city, area, landmark, pincode: postcode }
          setDetectedLocation(locationData)
          // Save to localStorage
          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData))
        } catch (error) {
          console.error("Error fetching location data:", error)
          alert("Unable to detect location. Please try again.")
        } finally {
          setIsDetecting(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("Unable to access location. Please try again.")
        setIsDetecting(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleCompare = async () => {
    if (compareProducts.length < 1) {
      alert("Please add at least 1 product to compare")
      return
    }

    if (!detectedLocation) {
      alert("Please detect your location first")
      return
    }

    setIsComparing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const selectedProductsData = compareProducts

    // --- Stats Tracking ---
    // Total Comparisons
    const totalComparisons = Number(localStorage.getItem("smartcompare_total_comparisons") || 0) + 1
    localStorage.setItem("smartcompare_total_comparisons", String(totalComparisons))

    // Recently Viewed
    const recentlyViewedCount = Number(localStorage.getItem("smartcompare_recently_viewed") || 0) + selectedProductsData.length
    localStorage.setItem("smartcompare_recently_viewed", String(recentlyViewedCount))

    // Favorite Category (most frequent in current comparison)
    const categoryCounts: Record<string, number> = {}
    selectedProductsData.forEach((product) => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1
    })
    const favoriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
    localStorage.setItem("smartcompare_favorite_category", favoriteCategory)

    // Most Compared Category (across all comparisons)
    let allCategoryCounts: Record<string, number> = {}
    try {
      allCategoryCounts = JSON.parse(localStorage.getItem("smartcompare_all_category_counts") || "{}")
    } catch {}
    selectedProductsData.forEach((product) => {
      allCategoryCounts[product.category] = (allCategoryCounts[product.category] || 0) + 1
    })
    localStorage.setItem("smartcompare_all_category_counts", JSON.stringify(allCategoryCounts))
    const mostComparedCategory = Object.entries(allCategoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
    localStorage.setItem("smartcompare_most_compared_category", mostComparedCategory)

    // Saved Comparisons (if you have a save feature, increment here)
    // Example: localStorage.setItem("smartcompare_saved_comparisons", String(savedComparisons))

    // --- End Stats Tracking ---

    // Calculate basket totals for each platform
    const basketTotals = platforms.reduce((acc, platform) => {
      const total = selectedProductsData.reduce((sum, product) => {
        if (product.availability[platform.id as keyof typeof product.availability]) {
          return sum + product.prices[platform.id as keyof typeof product.prices]
        }
        return sum
      }, 0)

      const availableCount = selectedProductsData.filter(
        (product) => product.availability[platform.id as keyof typeof product.availability],
      ).length

      acc[platform.id] = {
        total,
        availableCount,
        totalProducts: selectedProductsData.length,
        savings: 0,
      }
      return acc
    }, {} as any)

    // Find cheapest platform
    const cheapestPlatform = Object.entries(basketTotals)
      .filter(([_, data]: [string, any]) => data.availableCount === selectedProductsData.length)
      .reduce((a, b) => (basketTotals[a[0]].total <= basketTotals[b[0]].total ? a : b))

    // Calculate savings
    Object.keys(basketTotals).forEach((platformId) => {
      if (
        platformId !== cheapestPlatform[0] &&
        basketTotals[platformId].availableCount === selectedProductsData.length
      ) {
        basketTotals[platformId].savings = basketTotals[platformId].total - basketTotals[cheapestPlatform[0]].total
      }
    })

    setComparisonData({
      products: selectedProductsData,
      basketTotals,
      cheapestPlatform: cheapestPlatform[0],
      location: detectedLocation.city || detectedLocation.pincode,
    })

    setIsComparing(false)
  }

  const openPlatformCheckout = (platformId: string) => {
    const urls = {
      blinkit: "https://smart-compare-cy2n.vercel.app/checkout",
      zepto: "https://smart-compare-13mt.vercel.app/checkout",
      bigbasket: "https://smart-compare-7sls.vercel.app/checkout",
      jiomart: "https://smart-compare-9s1l.vercel.app/checkout",
    }

    // Create cart items from compare products with quantity 1
    const cartItems = compareProducts.map(product => ({
      product,
      quantity: 1
    }))

    // Encode cart items as query parameter
    const cartData = encodeURIComponent(JSON.stringify(cartItems))
    const url = `${urls[platformId as keyof typeof urls]}?cart=${cartData}`

    window.location.href = url
  }

  const handleAddToCart = () => {
    if (compareProducts.length === 0) {
      alert("No products to add to cart")
      return
    }
    setCartFromCompare(compareProducts)
    // Don't clear compare list - user may want to keep comparing
    router.push("/cart")
  }

  const compareProductsList = compareProducts

  // Chart data for basket comparison visual
  const chartData = comparisonData ? {
    labels: platforms.map(p => p.name),
    datasets: [{
      label: 'Total Cost (₹)',
      data: platforms.map(platform => comparisonData.basketTotals[platform.id].total),
      backgroundColor: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return 'rgba(239, 68, 68, 0.8)' // Red for out of stock items
        }
        return isCheapest
          ? 'rgba(16, 185, 129, 0.8)' // Green for cheapest
          : platform.color + '80' // Original color with transparency
      }),
      borderColor: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return '#dc2626' // Red border for out of stock
        }
        return isCheapest
          ? '#10b981' // Solid green border for cheapest
          : platform.color
      }),
      borderWidth: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return 3 // Thicker border for out of stock
        }
        return isCheapest ? 3 : 1
      }),
      borderRadius: 12,
      borderSkipped: false,
      hoverBackgroundColor: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return 'rgba(239, 68, 68, 0.9)' // Darker red for out of stock on hover
        }
        return isCheapest
          ? 'rgba(16, 185, 129, 0.9)'
          : platform.color + '90'
      }),
      hoverBorderColor: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return '#b91c1c' // Darker red border for out of stock on hover
        }
        return isCheapest
          ? '#059669'
          : platform.color
      }),
      hoverBorderWidth: platforms.map(platform => {
        const data = comparisonData.basketTotals[platform.id]
        const isCheapest = platform.id === comparisonData.cheapestPlatform
        const isFullyAvailable = data.availableCount === data.totalProducts

        if (!isFullyAvailable) {
          return 4 // Even thicker border for out of stock on hover
        }
        return isCheapest ? 4 : 2
      }),
    }]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context: any) {
            const platform = platforms[context.dataIndex]
            const data = comparisonData.basketTotals[platform.id]
            const isFullyAvailable = data.availableCount === data.totalProducts
            const outOfStockCount = data.totalProducts - data.availableCount

            let label = `₹${context.parsed.y}`
            if (!isFullyAvailable) {
              label += ` (${outOfStockCount} out of stock)`
            }
            return label
          }
        }
      },
      datalabels: {
        display: true,
        color: '#333',
        font: {
          weight: 'bold' as const,
          size: 14
        },
        formatter: function(value: any, context: any) {
          const platform = platforms[context.dataIndex]
          const data = comparisonData.basketTotals[platform.id]
          const isFullyAvailable = data.availableCount === data.totalProducts
          const outOfStockCount = data.totalProducts - data.availableCount

          let label = '₹' + value
          if (!isFullyAvailable) {
            label += `\n(${outOfStockCount} OOS)`
          }
          return label
        },
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 4,
        textAlign: 'center' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + value;
          },
          color: '#666',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as any
    }
  }

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphism p-12 rounded-2xl">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">No products selected for comparison</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Please add items from Categories to start comparing prices across platforms.
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover-glow"
              size="lg"
              onClick={() => router.push("/categories")}
            >
              Browse Categories
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Compare Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Compare prices across all platforms for your selected products
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Selected Products ({compareProducts.length})</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCompare} className="hover-glow bg-transparent">
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {compareProductsList.map((product) => {
                    const uniqueProductId = getProductId(product)
                    return (
                      <div
                        key={uniqueProductId}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <p className="text-sm text-muted-foreground">From ₹{getLowestPrice(product.prices)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCompare(uniqueProductId)}
                          className="hover-glow bg-transparent text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
                {/* Save Comparison Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-primary to-secondary hover-glow"
                    onClick={() => {
                      const savedComparisons = Number(localStorage.getItem("smartcompare_saved_comparisons") || 0) + 1
                      localStorage.setItem("smartcompare_saved_comparisons", String(savedComparisons))
                      // Show a toast or alert
                      alert("Comparison saved!")
                    }}
                  >
                    Save Comparison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location & Compare */}
          <div className="space-y-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className="w-full"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Detect My Location
                    </>
                  )}
                </Button>

                {detectedLocation && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">Detected:</p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>City: {detectedLocation.city}</p>
                      <p>Area: {detectedLocation.area}</p>
                      <p>Landmark: {detectedLocation.landmark}</p>
                      <p>Pincode: {detectedLocation.pincode}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleCompare}
              disabled={compareProducts.length < 1 || !detectedLocation || isComparing}
              className="w-full bg-gradient-to-r from-primary to-secondary hover-glow text-lg py-6"
            >
              {isComparing ? "Comparing..." : "Compare Basket"}
            </Button>

            {comparisonData && (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover-glow text-lg py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <div className="mt-12 space-y-8">
            {/* Basket Summary */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5" />
                  <span>Basket Comparison - {comparisonData.location}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platforms.map((platform) => {
                    const data = comparisonData.basketTotals[platform.id]
                    const isCheapest = platform.id === comparisonData.cheapestPlatform
                    const isFullyAvailable = data.availableCount === data.totalProducts

                    return (
                      <Card
                        key={platform.id}
                        className={`glassmorphism ${isCheapest && isFullyAvailable ? "ring-2 ring-green-500 animate-glow" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: platform.color }}></div>
                              <span className="font-semibold">{platform.name}</span>
                            </div>
                            {isCheapest && isFullyAvailable && (
                              <Badge className="bg-green-500 text-white">Cheapest</Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Total:</span>
                              <span className="font-bold text-lg">₹{data.total}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Available:</span>
                              <span className={`text-sm ${isFullyAvailable ? "text-green-600" : "text-red-600"}`}>
                                {data.availableCount}/{data.totalProducts}
                              </span>
                            </div>

                            {data.savings > 0 && (
                              <div className="text-sm text-red-600">+₹{data.savings} vs cheapest</div>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 hover-glow bg-transparent"
                              onClick={() => openPlatformCheckout(platform.id)}
                              disabled={!isFullyAvailable}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Go to {platform.name}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Product Comparison */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Product-wise Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-semibold">Product</th>
                        {platforms.map((platform) => (
                          <th key={platform.id} className="text-center p-4 font-semibold">
                            <div className="flex items-center justify-center space-x-2">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: platform.color }}></div>
                              <span>{platform.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.products.map((product: Product, index: number) => {
                        const lowestPricePlatform = getLowestPricePlatform(product.prices)
                        const uniqueProductId = getProductId(product)

                        return (
                          <tr
                            key={uniqueProductId}
                            className={`border-b border-border hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">Rating: {product.rating}★</div>
                                </div>
                              </div>
                            </td>
                            {platforms.map((platform) => {
                              const price = product.prices[platform.id as keyof typeof product.prices]
                              const isAvailable = product.availability[platform.id as keyof typeof product.availability]
                              const isLowest = platform.id === lowestPricePlatform
                              const deliveryTime =
                                product.deliveryTime[platform.id as keyof typeof product.deliveryTime]

                              return (
                                <td key={platform.id} className="p-4 text-center">
                                  {isAvailable ? (
                                    <div className="space-y-1">
                                      <div
                                        className={`font-semibold ${isLowest ? "text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200" : "text-foreground"}`}
                                      >
                                        ₹{price}
                                        {isLowest && (
                                          <Badge
                                            variant="secondary"
                                            className="ml-1 bg-green-100 text-green-800 text-xs"
                                          >
                                            Lowest
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{deliveryTime}</span>
                                      </div>
                                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-red-500 text-sm bg-red-50 px-2 py-1 rounded-md border border-red-200">Out of Stock</div>
                                      <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                                    </div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Basket Comparison Visual */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Basket Comparison Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96">
                  {chartData && (
                    <Bar
                      data={chartData}
                      options={chartOptions}
                      plugins={[ChartDataLabels]}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
