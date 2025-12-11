"use client"

import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"

type Placement = "right" | "left" | "bottom" | "top"

export interface OnboardingPopoverStep {
  id: string
  title: string
  description: string
  targetRef: RefObject<HTMLElement | null>
  placement?: Placement
}

interface OnboardingPopoverProps {
  stepIndex: number
  totalSteps: number
  step: OnboardingPopoverStep
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

type PopoverPosition = {
  highlight: { top: number; left: number; width: number; height: number }
  popover: { top: number; left: number }
}

export function OnboardingPopover({
  stepIndex,
  totalSteps,
  step,
  onNext,
  onPrev,
  onSkip,
}: OnboardingPopoverProps) {
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const [isReady, setIsReady] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const isLastStep = stepIndex === totalSteps - 1
  const placement: Placement = step.placement ?? "right"

  const computePosition = useMemo(
    () => () => {
      const el = step.targetRef.current
      if (!el) {
        setPosition(null)
        return
      }
      const rect = el.getBoundingClientRect()
      const scrollX = window.scrollX || 0
      const scrollY = window.scrollY || 0
      const padding = 8
      const highlight = {
        top: rect.top + scrollY - padding,
        left: rect.left + scrollX - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }

      const popoverEl = popoverRef.current
      const estimated = { width: 280, height: 220 }
      const size = popoverEl ? popoverEl.getBoundingClientRect() : estimated
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const margin = 12
      const gap = 12

      const optionOrder = (() => {
        if (placement === "left") return ["left", "bottom", "right", "top"] as Placement[]
        if (placement === "bottom") return ["bottom", "right", "left", "top"] as Placement[]
        if (placement === "top") return ["top", "right", "left", "bottom"] as Placement[]
        return ["right", "bottom", "left", "top"] as Placement[]
      })()

      const noIntersect = (top: number, left: number) => {
        const right = left + size.width
        const bottom = top + size.height
        const targetRight = rect.left + scrollX + rect.width
        const targetBottom = rect.top + scrollY + rect.height
        const separated =
          right < rect.left + scrollX - 4 ||
          left > targetRight + 4 ||
          bottom < rect.top + scrollY - 4 ||
          top > targetBottom + 4
        return separated
      }

      const fitsWithin = (top: number, left: number) =>
        top >= scrollY + margin &&
        left >= scrollX + margin &&
        top + size.height <= scrollY + viewportHeight - margin &&
        left + size.width <= scrollX + viewportWidth - margin &&
        noIntersect(top, left)

      const positionFor = (dir: Placement) => {
        if (dir === "right") return { top: rect.top + scrollY, left: rect.right + scrollX + gap }
        if (dir === "left") return { top: rect.top + scrollY, left: rect.left + scrollX - size.width - gap }
        if (dir === "bottom") return { top: rect.bottom + scrollY + gap, left: rect.left + scrollX }
        return { top: rect.top + scrollY - size.height - gap, left: rect.left + scrollX } // top
      }

      let popoverLeft = rect.right + scrollX + gap
      let popoverTop = rect.top + scrollY

      for (const dir of optionOrder) {
        const candidate = positionFor(dir)
        if (fitsWithin(candidate.top, candidate.left)) {
          popoverTop = candidate.top
          popoverLeft = candidate.left
          break
        }
      }

      // Clamp within viewport as a last resort
      popoverTop = Math.max(scrollY + margin, Math.min(popoverTop, scrollY + viewportHeight - size.height - margin))
      popoverLeft = Math.max(scrollX + margin, Math.min(popoverLeft, scrollX + viewportWidth - size.width - margin))

      setPosition({
        highlight,
        popover: { top: popoverTop, left: popoverLeft },
      })
      setIsReady(true)
    },
    [placement, step.targetRef],
  )

  useEffect(() => {
    computePosition()
    const handle = () => computePosition()
    window.addEventListener("resize", handle)
    window.addEventListener("scroll", handle, true)
    return () => {
      window.removeEventListener("resize", handle)
      window.removeEventListener("scroll", handle, true)
    }
  }, [computePosition, step.id])

  if (typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onSkip} />

      {position && isReady ? (
        <>
          <div
            className="absolute rounded-xl border-2 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
            style={{
              top: position.highlight.top,
              left: position.highlight.left,
              width: position.highlight.width,
              height: position.highlight.height,
            }}
          />

          <div
            ref={popoverRef}
            className="absolute w-[280px] max-w-[92vw] rounded-2xl border bg-card p-3.5 shadow-2xl"
            style={{
              top: position.popover.top,
              left: position.popover.left,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Langkah {stepIndex + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-card-foreground">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
              <button
                type="button"
                onClick={onSkip}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted"
                aria-label="Lewati tur"
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <span
                    key={`onboarding-dot-${idx}`}
                    className={`h-2 w-2 rounded-full ${idx === stepIndex ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onPrev} disabled={stepIndex === 0}>
                  Sebelumnya
                </Button>
                <Button size="sm" onClick={onNext}>
                  {isLastStep ? "Mulai" : "Lanjut"}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow">
            Menyiapkan tur...
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
