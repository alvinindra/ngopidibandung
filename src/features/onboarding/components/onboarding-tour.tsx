"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface OnboardingTourStep {
  id: string
  title: string
  description: string
  bullets?: string[]
}

interface OnboardingTourProps {
  stepIndex: number
  totalSteps: number
  step: OnboardingTourStep
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

export function OnboardingTour({
  stepIndex,
  totalSteps,
  step,
  onNext,
  onPrev,
  onSkip,
}: OnboardingTourProps) {
  const isLastStep = stepIndex === totalSteps - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-xl rounded-2xl border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Panduan singkat</p>
            <h3 className="mt-1 text-xl font-semibold text-card-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted"
            aria-label="Tutup tur"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step.bullets?.length ? (
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {step.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-[6px] h-2 w-2 rounded-full bg-primary/70" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={`onboarding-tour-dot-${idx}`}
                className={cn("h-2.5 w-2.5 rounded-full transition-colors", idx === stepIndex ? "bg-primary" : "bg-border")}
              />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={stepIndex === 0}>
              Sebelumnya
            </Button>
            <Button size="sm" onClick={onNext}>
              {isLastStep ? "Ayo jelajah" : "Lanjut"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
