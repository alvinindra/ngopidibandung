"use client"

import { useState } from "react"
import { Search, Coffee, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FloatingSearchBarProps {
  onSearch: (query: string) => void
  onOpenResults?: () => void
  labels: {
    placeholder: string
    filterTitle: string
    fastWifi: string
    highRating: string
    search: string
    clear: string
  }
}

export default function FloatingSearchBar({
  onSearch,
  onOpenResults,
  labels,
}: FloatingSearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-2 flex items-center">
        <div className="flex items-center gap-3 pl-3 flex-1">
          <Coffee className="h-5 w-5 text-primary" />
          <Input
            type="text"
            placeholder={labels.placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-0 shadow-none text-sm pl-0 lg:pl-3 lg:text-lg bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 text-foreground"
          />
          {query && (
            <button onClick={() => handleSearch("")} className="p-1 hover:bg-muted rounded-full transition-colors">
              <X className="h-4 w-4 text-muted-foreground" aria-label={labels.clear} />
            </button>
          )}
        </div>
        <Button
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4"
          onClick={() => {
            onSearch(query)
            onOpenResults?.()
          }}
        >
          <Search className="h-4 w-4" />
          {labels.search}
        </Button>
      </div>
    </div>
  )
}
