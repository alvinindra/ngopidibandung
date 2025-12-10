"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Globe2, Moon, SunMedium } from "lucide-react"
import FloatingSearchBar from "@/features/search/components/floating-search-bar"
import MapControls from "@/features/map/components/map-controls"
import { Button } from "@/components/ui/button"
import type { MapHandle } from "@/features/map/components/cafe-map"
import { cn } from "@/lib/utils"

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
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState<"en" | "id">("en")
  const mapRef = useRef<MapHandle>(null)

  const t = {
    en: {
      searchPlaceholder: "Search cafes in Bandung...",
      filterTitle: "Filter Cafes",
      fastWifi: "Fast WiFi (40+ Mbps)",
      highRating: "High Rating (4.5+)",
      search: "Search",
      clear: "Clear search",
      myLocation: "My Location",
      layers: "Toggle Map Layer",
      reset: "Back to Bandung",
      languageToggle: "Switch to Bahasa",
      themeToggle: "Toggle light / dark",
      locateFailed: "Unable to fetch location. Allow permission or use HTTPS/localhost.",
    },
    id: {
      searchPlaceholder: "Cari kafe di Bandung...",
      filterTitle: "Filter Kafe",
      fastWifi: "WiFi Cepat (40+ Mbps)",
      highRating: "Rating Tinggi (4.5+)",
      search: "Cari",
      clear: "Hapus pencarian",
      myLocation: "Lokasi Saya",
      layers: "Ganti Peta",
      reset: "Kembali ke Bandung",
      languageToggle: "Ganti ke English",
      themeToggle: "Ubah mode terang/gelap",
      locateFailed: "Lokasi tidak bisa diambil. Izinkan akses atau gunakan HTTPS/localhost.",
    },
  }[language]

  const currentTheme = resolvedTheme ?? theme ?? "light"

  const handleLocate = () => mapRef.current?.locateUser()
  const handleLayerToggle = () => mapRef.current?.toggleBaseLayer()
  const handleReset = () => mapRef.current?.resetView()
  const handleThemeToggle = () => setTheme(currentTheme === "dark" ? "light" : "dark")
  const handleLanguageToggle = () => setLanguage((prev) => (prev === "en" ? "id" : "en"))

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleLanguageToggle} aria-label={t.languageToggle}>
          <Globe2 className={cn("h-4 w-4", currentTheme === "dark" && "text-white")} />
          <span className="sr-only">{t.languageToggle}</span>
        </Button>
        <Button variant="outline" size="icon" onClick={handleThemeToggle} aria-label={t.themeToggle}>
          {currentTheme === "dark" ? <SunMedium className={cn("h-4 w-4", currentTheme === "dark" && "text-white")} /> : <Moon className={cn("h-4 w-4", currentTheme === "dark" && "text-white")} />}
          <span className="sr-only">{t.themeToggle}</span>
        </Button>
      </div>

      {/* Map Layer */}
      <CafeMap ref={mapRef} language={language} theme={currentTheme} />

      {/* Floating Search Bar */}
      <FloatingSearchBar
        onSearch={setSearchQuery}
        labels={{
          placeholder: t.searchPlaceholder,
          filterTitle: t.filterTitle,
          fastWifi: t.fastWifi,
          highRating: t.highRating,
          search: t.search,
          clear: t.clear,
        }}
      />

      {/* Map Controls */}
      <MapControls
        onLocate={handleLocate}
        onToggleLayer={handleLayerToggle}
        onReset={handleReset}
        labels={{
          myLocation: t.myLocation,
          layers: t.layers,
          reset: t.reset,
          locateFailed: t.locateFailed,
        }}
      />
    </main>
  )
}
