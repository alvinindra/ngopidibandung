"use client"

import { CafeFeature } from "../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, MapPin, Star, ArrowDownToLine, ArrowUpToLine, X } from "lucide-react"

interface CafeDetailDrawerProps {
  cafe: CafeFeature | null
  onClose: () => void
  language: "en" | "id"
}

export default function CafeDetailDrawer({ cafe, onClose, language }: CafeDetailDrawerProps) {
  const isOpen = Boolean(cafe)
  const copy = {
    en: {
      close: "Close",
      wifi: "Download speed",
      upload: "Upload speed",
      distance: "Distance",
      price: "Reference price",
      latte: "Latte",
      iced: "Iced coffee",
      afternoon: "Afternoon tea set",
      coordinates: "Coordinates",
      comment: "Comment",
      fallbackComment: "Tap a marker to see cafe details.",
    },
    id: {
      close: "Tutup",
      wifi: "Kecepatan unduh",
      upload: "Kecepatan unggah",
      distance: "Jarak",
      price: "Harga referensi",
      latte: "Latte",
      iced: "Kopi dingin",
      afternoon: "Paket afternoon tea",
      coordinates: "Koordinat",
      comment: "Komentar",
      fallbackComment: "Ketuk marker untuk lihat detail kafe.",
    },
  }[language]

  const coordinatesText =
    cafe && cafe.properties.coordinatesText
      ? cafe.properties.coordinatesText
      : cafe
        ? `${cafe.geometry.coordinates[1].toFixed(4)}, ${cafe.geometry.coordinates[0].toFixed(4)}`
        : ""

  const detailItems =
    cafe?.properties
      ? [
        { label: copy.wifi, value: cafe.properties.downloadSpeed || cafe.properties.wifiSpeed },
        { label: copy.upload, value: cafe.properties.uploadSpeed },
        { label: copy.distance, value: cafe.properties.distance },
        { label: copy.price, value: cafe.properties.referencePrice },
        { label: copy.latte, value: cafe.properties.lattePrice },
        { label: copy.iced, value: cafe.properties.icedCoffeePrice },
        { label: copy.afternoon, value: cafe.properties.afternoonTeaSet },
        { label: copy.coordinates, value: coordinatesText },
      ].filter((item) => item.value && `${item.value}`.trim() !== "")
      : []

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <section
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        aria-hidden={!isOpen}
      >
        <div className="mx-auto max-w-3xl rounded-t-3xl border border-border/60 bg-card shadow-2xl">
          <div className="flex items-center justify-between px-5 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              <span>{language === "id" ? "Detail kafe" : "Cafe details"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label={copy.close}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {cafe ? (
            <div className="flex flex-col gap-4 px-5 pb-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-card-foreground">{cafe.properties.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{cafe.properties.address}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {cafe.properties.rating ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{cafe.properties.rating}</span>
                    </Badge>
                  ) : null}
                  {cafe.properties.downloadSpeed ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      <span>{cafe.properties.downloadSpeed}</span>
                    </Badge>
                  ) : null}
                  {cafe.properties.uploadSpeed ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ArrowUpToLine className="h-3.5 w-3.5" />
                      <span>{cafe.properties.uploadSpeed}</span>
                    </Badge>
                  ) : null}
                </div>
              </div>

              {detailItems.length > 0 && (
                <div className="rounded-2xl border border-border/60 bg-card/70">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {detailItems.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-3 px-3 py-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-card-foreground text-right leading-snug">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.comment}</p>
                <p className="mt-1 text-sm text-card-foreground">
                  {cafe.properties.comment || copy.fallbackComment}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 pb-6 pt-2">
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                {copy.fallbackComment}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
