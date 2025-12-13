"use client"

import { type ComponentType, type ReactNode } from "react"
import { Wifi, Star, DoorOpen, ParkingCircle, Car, Bike, Wallet, Receipt, Link2, Instagram, StickyNote, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { FilterState } from "../filter-utils"

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onChange: (next: Partial<FilterState>) => void
  onReset: () => void
  language: "en" | "id"
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
)

const FilterChip = ({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) => (
  <Button
    variant={active ? "secondary" : "outline"}
    size="sm"
    className="rounded-full border-border/70 px-3 py-2 text-xs"
    onClick={onClick}
    aria-pressed={active}
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
)

export function FilterDrawer({ open, onOpenChange, filters, onChange, onReset, language }: FilterDrawerProps) {
  const copy = {
    en: {
      title: "Filters",
      quick: "WiFi",
      comfort: "Amenities",
      payments: "Payment & tax",
      price: "Budget",
      extras: "Extras",
      fastWifi: "Fast WiFi (40+ Mbps)",
      ultraWifi: "Ultra WiFi (80+ Mbps)",
      rating4: "Rating 4.0+",
      rating45: "Rating 4.5+",
      musala: "Musala",
      parkingMotor: "Motorcycle parking",
      parkingCar: "Car parking",
      cashless: "Cashless",
      cash: "Cash",
      tax: "Has service/tax",
      price20: "≤ 20K",
      price30: "≤ 30K",
      price40: "≤ 40K",
      menu: "Has menu link",
      instagram: "Instagram",
      takeaway: "Notes / takeaway",
      reset: "Reset filters",
      close: "Apply & close",
    },
    id: {
      title: "Filter",
      quick: "WiFi",
      comfort: "Fasilitas",
      payments: "Pembayaran & pajak",
      price: "Budget",
      extras: "Lainnya",
      fastWifi: "WiFi normal (40+ Mbps)",
      ultraWifi: "WiFi cepat (80+ Mbps)",
      rating4: "Rating 4.0+",
      rating45: "Rating 4.5+",
      musala: "Musala",
      parkingMotor: "Parkir motor",
      parkingCar: "Parkir mobil",
      cashless: "Non-tunai",
      cash: "Tunai",
      tax: "Ada pajak/servis",
      price20: "≤ 20K",
      price30: "≤ 30K",
      price40: "≤ 40K",
      menu: "Punya menu",
      instagram: "Instagram",
      takeaway: "Catatan / takeaway",
      reset: "Atur ulang",
      close: "Terapkan & tutup",
    },
  }[language]

  const toggle = (key: keyof FilterState, value?: boolean) => {
    const current = filters[key]
    const nextValue = typeof value === "boolean" ? value : !current
    onChange({ [key]: nextValue } as Partial<FilterState>)
  }

  const toggleNumber = (key: keyof FilterState, value: number) => {
    const current = filters[key]
    const nextValue = current === value ? undefined : value
    onChange({ [key]: nextValue } as Partial<FilterState>)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-3xl border border-border/60 bg-card shadow-2xl">
        <DrawerHeader className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <DrawerTitle className="text-base font-semibold text-card-foreground">{copy.title}</DrawerTitle>
            <p className="text-sm text-muted-foreground">{language === "id" ? "Cari tempat ngopi sesuai kebutuhanmu" : "Narrow cafes to what you need"}</p>
          </div>
          <Button variant="default" size="sm" onClick={onReset}>
            {copy.reset}
          </Button>
        </DrawerHeader>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-5 pb-5">
          <Section title={language === "id" ? "Kerja" : "Work"}>
            <FilterChip active={filters.wfcAble} icon={Laptop} label={language === "id" ? "WFC-able" : "WFC-able"} onClick={() => toggle("wfcAble")} />
          </Section>

          <Section title={copy.quick}>
            <FilterChip active={filters.fastWifi} icon={Wifi} label={copy.fastWifi} onClick={() => toggle("fastWifi")} />
            <FilterChip active={filters.minDownload === 80} icon={Wifi} label={copy.ultraWifi} onClick={() => toggleNumber("minDownload", 80)} />
            {/* <FilterChip active={filters.minRating === 4} icon={Star} label={copy.rating4} onClick={() => toggleNumber("minRating", 4)} />
            <FilterChip active={filters.minRating === 4.5} icon={Star} label={copy.rating45} onClick={() => toggleNumber("minRating", 4.5)} /> */}
          </Section>

          <Section title={copy.comfort}>
            <FilterChip active={filters.hasMusala} icon={DoorOpen} label={copy.musala} onClick={() => toggle("hasMusala")} />
            <FilterChip active={filters.parkingMotor} icon={Bike} label={copy.parkingMotor} onClick={() => toggle("parkingMotor")} />
            <FilterChip active={filters.parkingCar} icon={Car} label={copy.parkingCar} onClick={() => toggle("parkingCar")} />
          </Section>

          <Section title={copy.payments}>
            <FilterChip active={filters.cashless} icon={Wallet} label={copy.cashless} onClick={() => toggle("cashless")} />
            <FilterChip active={filters.cash} icon={Receipt} label={copy.cash} onClick={() => toggle("cash")} />
            <FilterChip active={filters.hasServiceTax} icon={ParkingCircle} label={copy.tax} onClick={() => toggle("hasServiceTax")} />
          </Section>

          <Section title={copy.price}>
            <FilterChip active={filters.maxPrice === 20000} icon={Wallet} label={copy.price20} onClick={() => toggleNumber("maxPrice", 20000)} />
            <FilterChip active={filters.maxPrice === 30000} icon={Wallet} label={copy.price30} onClick={() => toggleNumber("maxPrice", 30000)} />
            <FilterChip active={filters.maxPrice === 40000} icon={Wallet} label={copy.price40} onClick={() => toggleNumber("maxPrice", 40000)} />
          </Section>

          <Section title={copy.extras}>
            <FilterChip active={filters.hasMenu} icon={Link2} label={copy.menu} onClick={() => toggle("hasMenu")} />
            <FilterChip active={filters.hasInstagram} icon={Instagram} label={copy.instagram} onClick={() => toggle("hasInstagram")} />
            <FilterChip active={filters.hasTakeaway} icon={StickyNote} label={copy.takeaway} onClick={() => toggle("hasTakeaway")} />
          </Section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border/60 px-5 py-3">
          <DrawerClose asChild>
            <Button variant="secondary" className="rounded-xl">
              {copy.close}
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
