"use client"

import { useState } from "react"
import { Search, Coffee, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FloatingSearchBarProps {
  onSearch: (query: string) => void
  labels: {
    placeholder: string
    filterTitle: string
    fastWifi: string
    highRating: string
    search: string
    clear: string
  }
}

export default function FloatingSearchBar({ onSearch, labels }: FloatingSearchBarProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState({
    fastWifi: false,
    highRating: false,
  })

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-2 flex items-center gap-2">
        <div className="flex items-center gap-3 px-3 flex-1">
          <Coffee className="h-5 w-5 text-primary" />
          <Input
            type="text"
            placeholder={labels.placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 text-foreground"
          />
          {query && (
            <button onClick={() => handleSearch("")} className="p-1 hover:bg-muted rounded-full transition-colors">
              <X className="h-4 w-4 text-muted-foreground" aria-label={labels.clear} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{labels.filterTitle}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.fastWifi}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, fastWifi: checked }))}
              >
                {labels.fastWifi}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.highRating}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, highRating: checked }))}
              >
                {labels.highRating}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            onClick={() => onSearch(query)}
          >
            <Search className="h-4 w-4" />
            {labels.search}
          </Button>
        </div>
      </div>
    </div>
  )
}
