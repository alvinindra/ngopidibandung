"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Star, Wifi, MapPin, Coffee } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import cafesData from "@/data/cafes.json"

interface CafeProperties {
  id: number
  name: string
  address: string
  rating: number
  wifiSpeed: string
  image: string
}

interface CafeFeature {
  type: string
  properties: CafeProperties
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

interface CafeListPanelProps {
  searchQuery: string
}

export default function CafeListPanel({ searchQuery }: CafeListPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const filteredCafes = cafesData.features.filter(
    (feature: CafeFeature) =>
      feature.properties.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.properties.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-40 bg-card rounded-t-3xl shadow-2xl border-t border-border/50 transition-all duration-300 ${
        isExpanded ? "h-[60vh]" : "h-auto"
      }`}
    >
      {/* Handle */}
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex flex-col items-center pt-3 pb-2">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mb-2" />
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Coffee className="h-4 w-4" />
          <span className="font-medium">{filteredCafes.length} Cafes in Bandung</span>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </button>

      {/* Cafe List */}
      {isExpanded && (
        <ScrollArea className="h-[calc(60vh-60px)] px-4 pb-4">
          <div className="grid gap-3">
            {filteredCafes.map((feature: CafeFeature) => {
              const cafe = feature.properties
              return (
                <div
                  key={cafe.id}
                  className="flex gap-4 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
                >
                  <img
                    src={cafe.image || "/placeholder.svg"}
                    alt={cafe.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground truncate">{cafe.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{cafe.address}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {cafe.rating}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        {cafe.wifiSpeed}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
