"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import FloatingSearchBar from "@/features/search/components/floating-search-bar"
import MapControls from "@/features/map/components/map-controls"

// Dynamically import the map component to avoid SSR issues
const CafeMap = dynamic(() => import("@/features/map/components/cafe-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* Map Layer */}
      <CafeMap />

      {/* Floating Search Bar */}
      <FloatingSearchBar onSearch={setSearchQuery} />

      {/* Map Controls */}
      <MapControls />
    </main>
  )
}
