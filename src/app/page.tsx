"use client"

import { useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import FloatingSearchBar from "@/features/search/components/floating-search-bar"
import MapControls from "@/features/map/components/map-controls"
import CafeDetailDrawer from "@/features/map/components/cafe-detail-drawer"
import CafeListPanel from "@/features/map/components/cafe-list-panel"
import { FilterDrawer } from "@/features/search/components/filter-drawer"
import cafesData from "@/data/cafes.json"
import type { MapHandle } from "@/features/map/components/cafe-map"
import { CafeFeature } from "@/features/map/types"
import {
  FilterState,
  countActiveFilters,
  defaultFilters,
  matchesFilters,
} from "@/features/search/filter-utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const INTRO_STORAGE_KEY = "ngopidibandung_intro_seen"

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
  const [language, setLanguage] = useState<"en" | "id">("id")
  const [selectedCafe, setSelectedCafe] = useState<CafeFeature | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isIntroOpen, setIsIntroOpen] = useState(false)
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
      reset: "Back to Bandung",
      languageToggle: "Switch to Bahasa",
      themeToggle: "Toggle light / dark",
      locateFailed: "Unable to fetch location. Allow permission or use HTTPS/localhost.",
    },
    id: {
      searchPlaceholder: "Cari tempat ngopi di Bandung",
      filterTitle: "Filter Kafe",
      fastWifi: "WiFi normal (40+ Mbps)",
      highRating: "Rating Tinggi (4.5+)",
      search: "Cari",
      clear: "Hapus pencarian",
      myLocation: "Lokasi Saya",
      reset: "Kembali ke Bandung",
      languageToggle: "Ganti ke English",
      themeToggle: "Ubah mode terang/gelap",
      locateFailed: "Lokasi tidak bisa diambil. Izinkan akses atau gunakan HTTPS/localhost.",
    },
  }[language]

  const currentTheme = resolvedTheme ?? theme ?? "light"

  const handleLocate = () => mapRef.current?.locateUser()
  const handleReset = () => mapRef.current?.resetView()
  const handleThemeToggle = () => setTheme(currentTheme === "dark" ? "light" : "dark")
  const handleLanguageToggle = () => setLanguage((prev) => (prev === "en" ? "id" : "en"))
  const handleSelectCafe = (cafe: CafeFeature) => setSelectedCafe(cafe)
  const handleCloseDrawer = () => setSelectedCafe(null)
  const handleFiltersChange = (next: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...next }))
  const handleResetFilters = () => setFilters(defaultFilters)

  const handleAppReady = () => {
    if (typeof window === "undefined") return
    const hasSeen = localStorage.getItem(INTRO_STORAGE_KEY)
    if (hasSeen) return

    setIsIntroOpen(true)
    localStorage.setItem(INTRO_STORAGE_KEY, "1")
  }

  const handleCloseIntro = () => setIsIntroOpen(false)

  const allCafes = cafesData.features as CafeFeature[]

  const filteredCafes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return allCafes.filter((feature) => matchesFilters(feature, filters, query))
  }, [allCafes, filters, searchQuery])

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* Map Layer */}
      <CafeMap
        ref={mapRef}
        language={language}
        theme={currentTheme}
        cafes={filteredCafes}
        onLoad={handleAppReady}
        onSelectCafe={handleSelectCafe}
      />

      {/* Floating Search Bar */}
      <FloatingSearchBar
        onSearch={setSearchQuery}
        onOpenResults={() => setIsListOpen(true)}
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
        onReset={handleReset}
        onToggleTheme={handleThemeToggle}
        onToggleLanguage={handleLanguageToggle}
        onOpenFilters={() => setIsFilterOpen(true)}
        currentTheme={currentTheme === "dark" ? "dark" : "light"}
        activeFilterCount={activeFilterCount}
        labels={{
          myLocation: t.myLocation,
          reset: t.reset,
          languageToggle: t.languageToggle,
          themeToggle: t.themeToggle,
          locateFailed: t.locateFailed,
          filterTitle: t.filterTitle,
        }}
      />

      <CafeListPanel
        language={language}
        cafes={filteredCafes}
        isOpen={isListOpen}
        onOpenChange={setIsListOpen}
        onSelectCafe={handleSelectCafe}
        onResetFilters={handleResetFilters}
      />

      <FilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
        language={language}
      />

      <CafeDetailDrawer cafe={selectedCafe} onClose={handleCloseDrawer} language={language} />

      {isIntroOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Selamat datang di Tongkrongan</p>
                <h2 className="mt-1 text-xl font-semibold">Tempat Ngopi di Bandung</h2>
              </div>
              <button
                type="button"
                onClick={handleCloseIntro}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted"
                aria-label="Tutup pengantar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>
                Aplikasi ini membantu kamu mencari tempat ngopi di Bandung. Proyek ini open source, jadi
                kamu bisa ikut kontribusi atau memberi masukan.
              </p>
              <p>
                Dukung pengembangan lewat GitHub atau berdonasi. Dukunganmu bikin data makin lengkap dan
                pengalaman makin nyaman.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="https://github.com/alvinindra/ngopidibandung"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Lihat & dukung di GitHub
              </a>
              <a
                href="https://saweria.co/alvinindra"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                Donasi via Saweria
              </a>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseIntro}
              >
                Mulai jelajah
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
