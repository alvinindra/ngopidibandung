export interface CafeProperties {
  id: number
  name: string
  address: string
  rating?: number
  wifiSpeed?: string
  image?: string
  thumbnail?: string
  downloadSpeed?: string
  uploadSpeed?: string
  distance?: string
  coordinatesText?: string
  referencePrice?: string
  lattePrice?: string
  icedCoffeePrice?: string
  afternoonTeaSet?: string
  comment?: string
}

export interface CafeFeature {
  type: string
  properties: CafeProperties
  geometry: {
    type: string
    coordinates: [number, number]
  }
}
