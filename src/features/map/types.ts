export interface CafeProperties {
  id: number
  name: string
  address: string
  rating?: number
  operationalHours?: string
  priceRange?: string
  menuLink?: string
  cashAccepted?: boolean
  cashlessAccepted?: boolean
  serviceTax?: string
  connection?: string
  wifiSpeed?: string
  downloadSpeed?: string
  uploadSpeed?: string
  musala?: string
  parkingMotor?: string
  parkingCar?: string
  parkingPaid?: string
  notes?: string
  keyTakeaway?: string
  mapUrl?: string
  instagram?: string
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
    coordinates: [number, number] | []
  }
}

export interface UserLocation {
  latitude: number
  longitude: number
}
