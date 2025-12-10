"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Coffee, Search, Undo2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CafeFeature } from "../types"

interface CafeListPanelProps {
  language: "en" | "id"
  cafes: CafeFeature[]
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSelectCafe?: (feature: CafeFeature) => void
  onResetFilters?: () => void
}

export default function CafeListPanel({
  language,
  cafes,
  isOpen,
  onOpenChange,
  onSelectCafe,
  onResetFilters,
}: CafeListPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const open = isOpen ?? isExpanded
  const handleOpenChange = onOpenChange ?? setIsExpanded
  const hasResults = cafes.length > 0

  const stopMapScroll = (event: React.UIEvent | React.TouchEvent | React.PointerEvent) => {
    event.stopPropagation()
  }

  const headerLabel =
    language === "id"
      ? `${cafes.length} Tempat Ngopi`
      : `${cafes.length} Cafe Results`

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button
          aria-label={open ? "Hide cafe results" : "Show cafe results"}
          className="text-nowrap pointer-events-auto fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-primary p-4 text-white shadow-2xl transition hover:shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Search className="mr-2 h-4 w-4" /> {headerLabel}
        </button>
      </DrawerTrigger>

      <DrawerContent className="pointer-events-auto mx-auto w-full max-w-3xl rounded-t-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-sm">
        <DrawerHeader className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <DrawerTitle asChild>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Coffee className="h-4 w-4 text-primary" />
              <span>{headerLabel}</span>
            </div>
          </DrawerTitle>
          {onResetFilters ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full text-slate-600 hover:text-white"
              onClick={onResetFilters}
            >
              <Undo2 className="h-4 w-4" />
              {language === "id" ? "Atur ulang filter" : "Reset filters"}
            </Button>
          ) : null}
        </DrawerHeader>

        <div onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} className="px-4 pb-6 pt-3">
          <div
            className="max-h-[70vh] px-1 pb-15 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
            onWheelCapture={stopMapScroll}
            onTouchStart={stopMapScroll}
            onTouchMove={stopMapScroll}
            onPointerDown={stopMapScroll}
          >
            {hasResults ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {cafes.map((feature: CafeFeature) => {
                  const cafe = feature.properties
                  return (
                    <div
                      key={cafe.id}
                      className="group flex h-full cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      onClick={() => onSelectCafe?.(feature)}
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <h3 className="truncate font-semibold text-slate-900" title={cafe.name}>
                          {cafe.name}
                        </h3>
                        <div className="flex items-start gap-1.5 text-sm text-slate-500">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span className="block truncate" title={cafe.address}>
                            {cafe.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 text-sm text-slate-500">
                <Search className="h-5 w-5" />
                <p>{language === "id" ? "Tidak ada hasil yang cocok" : "No cafes match your filters"}</p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
