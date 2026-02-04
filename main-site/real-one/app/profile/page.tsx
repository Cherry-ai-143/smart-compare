"use client"

import { ProfileCard } from "@/components/ProfileCard"
import { useAuth } from "@/lib/contexts/auth-context"
import { useSaved } from "@/lib/contexts/saved-context"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Settings } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const { getSavedCount } = useSaved()
  const [stats, setStats] = useState({
    totalComparisons: 0,
    savedComparisons: 0,
    favoriteCategory: "-",
    recentlyViewedCount: 0,
    mostComparedCategory: "-",
  })

  useEffect(() => {
    // Example: fetch stats from localStorage or API
    const totalComparisons = Number(localStorage.getItem("smartcompare_total_comparisons") || 0)
    const savedComparisons = Number(localStorage.getItem("smartcompare_saved_comparisons") || 0)
    const favoriteCategory = localStorage.getItem("smartcompare_favorite_category") || "-"
    const recentlyViewedCount = Number(localStorage.getItem("smartcompare_recently_viewed") || 0)
    const mostComparedCategory = localStorage.getItem("smartcompare_most_compared_category") || "-"
    setStats({
      totalComparisons,
      savedComparisons,
      favoriteCategory,
      recentlyViewedCount,
      mostComparedCategory,
    })
  }, [])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to view your profile.</p>
      </div>
    )
  }

  // Format member since date
  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      })
    : "-"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <ProfileCard
        name={user.displayName || user.email || "User"}
        email={user.email || "-"}
        photoURL={user.photoURL || ""}
        memberSince={memberSince}
        totalComparisons={stats.totalComparisons}
        savedComparisons={stats.savedComparisons}
        favoriteCategory={stats.favoriteCategory}
        recentlyViewedCount={stats.recentlyViewedCount}
        mostComparedCategory={stats.mostComparedCategory}
      />

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mt-8">
        <Link href="/saved">
          <Button variant="outline" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Saved Items ({getSavedCount()})</span>
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
