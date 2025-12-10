"use client"

import { Locate, Layers, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MapControls() {
  return (
    <TooltipProvider>
      <div className="absolute right-4 top-24 z-40 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
            >
              <Locate className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>My Location</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
            >
              <Layers className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Map Layers</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-xl bg-card shadow-lg border border-border/50 hover:bg-muted"
            >
              <Navigation className="h-5 w-5 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Directions</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
