"use client"

import { CafeFeature } from "../map/types"

export type FilterState = {
  fastWifi: boolean
  minDownload?: number
  minRating?: number
  hasMusala: boolean
  parkingMotor: boolean
  parkingCar: boolean
  cashless: boolean
  cash: boolean
  hasServiceTax: boolean
  maxPrice?: number
  hasMenu: boolean
  hasInstagram: boolean
  hasTakeaway: boolean
}

export const defaultFilters: FilterState = {
  fastWifi: false,
  minDownload: undefined,
  minRating: undefined,
  hasMusala: false,
  parkingMotor: false,
  parkingCar: false,
  cashless: false,
  cash: false,
  hasServiceTax: false,
  maxPrice: undefined,
  hasMenu: false,
  hasInstagram: false,
  hasTakeaway: false,
}

const parseFirstNumber = (value?: string | number | null) => {
  if (typeof value === "number") return value
  if (!value) return null
  const match = `${value}`.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

const parsePrice = (value?: string | number | null) => {
  const num = parseFirstNumber(value)
  if (num == null) return null
  const stringValue =
    typeof value === "number" ? `${value}` : value?.toLowerCase() ?? ""
  return stringValue.includes("k") ? num * 1000 : num
}

const isYes = (value?: string | boolean) => {
  if (typeof value === "boolean") return value
  if (typeof value !== "string") return false
  return ["yes", "available", "true", "paid"].includes(
    value.toLowerCase().trim()
  )
}

export const matchesFilters = (
  feature: CafeFeature,
  filters: FilterState,
  query: string
) => {
  const cafe = feature.properties
  const text = `${cafe.name} ${cafe.address}`.toLowerCase()
  if (query && !text.includes(query)) return false

  const download = parseFirstNumber(cafe.downloadSpeed || cafe.wifiSpeed)
  const price = parsePrice(
    cafe.referencePrice || cafe.priceRange || cafe.lattePrice
  )

  if (filters.fastWifi && (!download || download < 40)) return false
  if (filters.minDownload && (!download || download < filters.minDownload))
    return false
  if (filters.minRating && (!cafe.rating || cafe.rating < filters.minRating))
    return false
  if (filters.hasMusala && !isYes(cafe.musala)) return false
  if (filters.parkingMotor && !isYes(cafe.parkingMotor)) return false
  if (filters.parkingCar && !isYes(cafe.parkingCar)) return false
  if (filters.cashless && cafe.cashlessAccepted !== true) return false
  if (filters.cash && cafe.cashAccepted !== true) return false
  if (filters.hasServiceTax && !(cafe.serviceTax && cafe.serviceTax !== "-"))
    return false
  if (filters.maxPrice && price && price > filters.maxPrice) return false
  if (filters.hasMenu && !cafe.menuLink) return false
  if (filters.hasInstagram && !cafe.instagram) return false
  if (filters.hasTakeaway && !cafe.keyTakeaway) return false

  return true
}

export const countActiveFilters = (filters: FilterState) =>
  [
    filters.fastWifi,
    filters.hasMusala,
    filters.parkingMotor,
    filters.parkingCar,
    filters.cashless,
    filters.cash,
    filters.hasServiceTax,
    filters.hasMenu,
    filters.hasInstagram,
    filters.hasTakeaway,
    filters.minDownload ? "minDownload" : null,
    filters.minRating ? "minRating" : null,
    filters.maxPrice ? "maxPrice" : null,
  ].filter(Boolean).length
