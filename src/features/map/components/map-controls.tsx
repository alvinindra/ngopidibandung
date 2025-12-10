"use client"

import { useState } from "react"
import { Globe2, Locate, Moon, Navigation, SlidersHorizontal, SunMedium } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MapControlsProps {
  onLocate: () => Promise<void> | void
  onReset: () => void
  onToggleTheme: () => void
  onToggleLanguage: () => void
  onOpenFilters: () => void
  currentTheme: "light" | "dark" | string
  activeFilterCount?: number
  labels: {
    myLocation: string
    reset: string
    languageToggle: string
    themeToggle: string
    locateFailed: string
    filterTitle: string
  }
}

export default function MapControls({
  onLocate,
  onReset,
  onToggleTheme,
  onToggleLanguage,
  onOpenFilters,
  currentTheme,
  activeFilterCount,
  labels,
}: MapControlsProps) {
  const [isLocating, setIsLocating] = useState(false)

  const handleLocate = async () => {
    try {
      setIsLocating(true)
      await onLocate()
    } catch (error) {
      const message = error instanceof Error ? error.message : labels.locateFailed
      toast.error(message)
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="absolute right-4 top-24 z-40 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="relative rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
              onClick={onOpenFilters}
              aria-label={labels.filterTitle}
            >
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              {activeFilterCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{labels.filterTitle}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
              onClick={onToggleLanguage}
              aria-label={labels.languageToggle}
            >
              <Globe2 className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{labels.languageToggle}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
              onClick={onToggleTheme}
              aria-label={labels.themeToggle}
            >
              {currentTheme === "dark" ? (
                <SunMedium className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{labels.themeToggle}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
              onClick={handleLocate}
              disabled={isLocating}
            >
              <Locate className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{labels.myLocation}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
              onClick={onReset}
            >
              <Navigation className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{labels.reset}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
