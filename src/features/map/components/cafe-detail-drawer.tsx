"use client"

import { useEffect, useState } from "react"
import { CafeFeature, UserLocation } from "../types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Coffee,
  MapPin,
  Star,
  ArrowDownToLine,
  ArrowUpToLine,
  DoorOpen,
  Waves,
  Wallet,
  Clock,
  Percent,
  Navigation,
  ParkingCircle,
  Car,
  Bike,
  Instagram,
  BookOpenText,
  ExternalLink,
  Menu,
  Map,
} from "lucide-react"

interface CafeDetailDrawerProps {
  cafe: CafeFeature | null
  onClose: () => void
  language: "en" | "id"
  userLocation?: UserLocation | null
}

export default function CafeDetailDrawer({ cafe, onClose, language, userLocation }: CafeDetailDrawerProps) {
  const isOpen = Boolean(cafe)
  const [localLocation, setLocalLocation] = useState<UserLocation | null>(null)
  const hasCoordinates = (coords: unknown): coords is [number, number] =>
    Array.isArray(coords) && coords.length === 2 && coords.every((value) => Number.isFinite(value))
  const haversineDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  const formatDistance = (km: number) => {
    if (!Number.isFinite(km)) return ""
    if (km >= 1) return `${km.toFixed(1)} km`
    return `${Math.round(km * 1000)} m`
  }
  const copy = {
    en: {
      close: "Close",
      hours: "Hours",
      price: "Beverages Price",
      referencePrice: "Reference price",
      lattePrice: "Latte price",
      icedCoffeePrice: "Iced coffee price",
      afternoonTea: "Afternoon tea set",
      menu: "Menu link",
      service: "Service/Tax",
      connection: "Connection",
      wifi: "Download speed",
      upload: "Upload speed",
      musala: "Musala",
      parking: "Parking",
      payment: "Payment",
      map: "Map",
      instagram: "Instagram",
      distance: "Distance",
      takeaway: "Takeaway",
      comment: "Comment",
      fallbackComment: "Tap a marker to see cafe details.",
      distanceBadge: "Distance from you",
    },
    id: {
      close: "Tutup",
      hours: "Jam operasional",
      price: "Harga makanan & minuman",
      referencePrice: "Harga referensi",
      lattePrice: "Harga latte",
      icedCoffeePrice: "Es kopi susu",
      afternoonTea: "Afternoon tea",
      menu: "Link menu",
      service: "Layanan/Pajak",
      connection: "Koneksi",
      wifi: "Kecepatan unduh",
      upload: "Kecepatan unggah",
      musala: "Musala",
      parking: "Parkir",
      payment: "Pembayaran",
      map: "Peta",
      instagram: "Instagram",
      distance: "Jarak",
      takeaway: "Catatan",
      comment: "Komentar",
      fallbackComment: "Ketuk marker untuk lihat detail kafe.",
      distanceBadge: "Jarak dari lokasi kamu",
    },
  }[language]

  const coordinates = cafe?.geometry.coordinates
  const coordinatesText =
    cafe && cafe.properties.coordinatesText
      ? cafe.properties.coordinatesText
      : hasCoordinates(coordinates)
        ? `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`
        : ""
  const activeLocation = userLocation ?? localLocation
  const distanceFromUser =
    cafe && activeLocation && hasCoordinates(coordinates)
      ? formatDistance(haversineDistanceKm(activeLocation.latitude, activeLocation.longitude, coordinates[1], coordinates[0]))
      : ""

  useEffect(() => {
    if (!isOpen) return
    if (userLocation || localLocation) return
    if (typeof window === "undefined" || window.isSecureContext === false) return
    if (typeof navigator === "undefined" || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocalLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        // ignore failures; badge will just stay hidden
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    )
  }, [isOpen, userLocation, localLocation])

  const isYes = (value?: string | boolean) => {
    if (typeof value === "boolean") return value
    if (typeof value !== "string") return false
    return ["yes", "available", "true"].includes(value.toLowerCase().trim())
  }

  const hasParkingMotor = isYes(cafe?.properties.parkingMotor)
  const hasParkingCar = isYes(cafe?.properties.parkingCar)

  const getLinkLabel = (label: string, url: string) => {
    if (label.toLowerCase().includes("menu")) return language === "id" ? "Lihat Menu" : "View Menu"
    if (label.toLowerCase().includes("instagram")) {
      // Extract username from Instagram URL
      const match = url.match(/instagram\.com\/([^/?]+)/)
      return match ? `@${match[1]}` : "Instagram"
    }
    if (label.toLowerCase().includes("map") || label.toLowerCase().includes("peta")) return language === "id" ? "Buka Google Maps" : "Open Google Maps"
    return language === "id" ? "Buka Link" : "Open Link"
  }

  const getLinkIcon = (label: string) => {
    if (label.toLowerCase().includes("menu")) return BookOpenText
    if (label.toLowerCase().includes("instagram")) return Instagram
    if (label.toLowerCase().includes("map") || label.toLowerCase().includes("peta")) return Map
    return ExternalLink
  }

  const detailItems =
    cafe?.properties
      ? [
        { label: copy.hours, value: cafe.properties.operationalHours, icon: Clock },
        { label: copy.price, value: cafe.properties.priceRange, icon: Percent },
        { label: copy.referencePrice, value: cafe.properties.referencePrice, icon: Wallet },
        { label: copy.lattePrice, value: cafe.properties.lattePrice, icon: Coffee },
        { label: copy.icedCoffeePrice, value: cafe.properties.icedCoffeePrice, icon: Coffee },
        { label: copy.afternoonTea, value: cafe.properties.afternoonTeaSet, icon: Coffee },
        {
          label: copy.menu,
          value: cafe.properties.menuLink,
          icon: Menu,
          isLink: true,
          renderValue: () => {
            const url = cafe.properties.menuLink
            if (!url) return null
            return (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-xs font-medium"
                asChild
              >
                <a href={url} target="_blank" rel="noreferrer">
                  {getLinkLabel(copy.menu, url)}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )
          }
        },
        { label: copy.service, value: cafe.properties.serviceTax, icon: Percent },
        { label: copy.connection, value: cafe.properties.connection, icon: Waves },
        { label: copy.musala, value: language === "id" ? (cafe.properties.musala === "Available" ? "Tersedia" : "Tidak tersedia") : (cafe.properties.musala === "Available" ? "Available" : "Not Available"), icon: DoorOpen },
        {
          label: copy.parking,
          value: hasParkingMotor || hasParkingCar || cafe.properties.parkingPaid,
          icon: ParkingCircle,
          renderValue: () => (
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-card-foreground">
              {hasParkingMotor ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1">
                  <Bike className="h-3.5 w-3.5" />
                  <span>{language === "id" ? "Motor" : "Motorcycle"}</span>
                </span>
              ) : null}
              {hasParkingCar ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1">
                  <Car className="h-3.5 w-3.5" />
                  <span>{language === "id" ? "Mobil" : "Car"}</span>
                </span>
              ) : null}
              {!hasParkingMotor && !hasParkingCar && cafe.properties.parkingPaid ? (
                <span className="text-sm font-semibold text-card-foreground">{cafe.properties.parkingPaid}</span>
              ) : null}
            </div>
          ),
        },
        {
          label: copy.payment,
          value:
            typeof cafe.properties.cashAccepted === "boolean" || typeof cafe.properties.cashlessAccepted === "boolean"
              ? "payment"
              : "",
          icon: Wallet,
          renderValue: () => (
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-card-foreground">
              <span className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cafe?.properties.cashAccepted ? "bg-green-500" : "bg-red-500"}`} />
                <span>{language === "id" ? "Tunai" : "Cash"}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cafe?.properties.cashlessAccepted ? "bg-green-500" : "bg-red-500"}`} />
                <span>Cashless</span>
              </span>
            </div>
          ),
        },
        {
          label: copy.instagram,
          value: cafe.properties.instagram,
          icon: Instagram,
          isLink: true,
          renderValue: () => {
            const url = cafe.properties.instagram
            if (!url) return null
            return (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-xs font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20"
                asChild
              >
                <a href={url} target="_blank" rel="noreferrer">
                  {/* <Instagram className="h-3.5 w-3.5 text-pink-500" /> */}
                  {getLinkLabel(copy.instagram, url)}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )
          }
        },
        {
          label: copy.map,
          value: cafe.properties.mapUrl,
          icon: Navigation,
          isLink: true,
          renderValue: () => {
            const url = cafe.properties.mapUrl
            if (!url) return null
            return (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 text-xs font-medium bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-green-500/20"
                asChild
              >
                <a href={url} target="_blank" rel="noreferrer">
                  {/* <Map className="h-3.5 w-3.5 text-blue-500" /> */}
                  {getLinkLabel(copy.map, url)}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </Button>
            )
          }
        },
        { label: copy.takeaway, value: cafe.properties.keyTakeaway, icon: Coffee },
      ].filter((item) => item.value && `${item.value}`.trim() !== "")
      : []

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="mx-auto max-w-3xl rounded-t-3xl border border-border/60 bg-card shadow-2xl">
        <DrawerHeader className="flex items-center justify-between px-5 pt-4 pb-2">
          <DrawerTitle asChild>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="h-4 w-4" />
              <span>{language === "id" ? "Detail Tempat Ngopi" : "Cafe Details"}</span>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        {cafe ? (
          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-5 pb-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-card-foreground">{cafe.properties.name}</h3>
              <div className="flex flex-nowrap items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    <span>{cafe.properties.downloadSpeed}</span>
                  </Badge>
                ) : null}
                {cafe.properties.uploadSpeed ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ArrowUpToLine className="h-3.5 w-3.5" />
                    <span>{cafe.properties.uploadSpeed}</span>
                  </Badge>
                ) : null}
                {distanceFromUser || cafe.properties.distance ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5" />
                    <span>
                      {copy.distanceBadge}: {distanceFromUser || cafe.properties.distance}
                    </span>
                  </Badge>
                ) : null}
              </div>
            </div>

            {detailItems.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/70">
                <div className="grid grid-cols-2 divide-y divide-border/50 last:border-b-0">
                  {detailItems.map((item) => {
                    const Icon = item.icon
                    const value =
                      item.renderValue?.() ??
                      (item.isLink && typeof item.value === "string" ? (
                        <a
                          href={item.value}
                          className="text-sm font-semibold text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-card-foreground">{item.value}</span>
                      ))

                    return (
                      <div key={item.label} className="relative flex items-start gap-3 px-3 py-2">
                        <div className="mt-0.5 text-muted-foreground">
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                        </div>
                        <div className="min-w-0 flex flex-1 flex-col gap-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {item.label}
                          </p>
                          <div className="wrap-break-word whitespace-pre-line text-sm leading-snug text-card-foreground">
                            {value}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.comment}</p>
              <p className="mt-1 text-sm text-card-foreground">
                {cafe.properties.notes || cafe.properties.comment || "-"}
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
      </DrawerContent>
    </Drawer>
  )
}
