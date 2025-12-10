"use client"

import { useState } from "react"
import { Locate, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MapControlsProps {
  onLocate: () => Promise<void> | void
  onReset: () => void
  labels: {
    myLocation: string
    reset: string
    locateFailed: string
  }
}

export default function MapControls({ onLocate, onReset, labels }: MapControlsProps) {
  const [isLocating, setIsLocating] = useState(false)

  const handleLocate = async () => {
    try {
      setIsLocating(true)
      await onLocate()
    } catch (error) {
      const message = error instanceof Error ? error.message : labels.locateFailed
      alert(message)
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
