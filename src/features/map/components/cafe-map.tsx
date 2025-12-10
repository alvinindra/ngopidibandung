"use client"

import { useEffect, useRef, useState } from "react"
import cafesData from "@/data/cafes.json"

declare global {
  interface Window {
    L: any
  }
}

interface CafeProperties {
  id: number
  name: string
  address: string
  rating: number
  wifiSpeed: string
  image: string
}

interface CafeFeature {
  type: string
  properties: CafeProperties
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

export default function CafeMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const initAttempts = useRef(0)

  useEffect(() => {
    const initMap = () => {
      if (initAttempts.current > 50) {
        console.log("[v0] Max init attempts reached, forcing load state")
        setIsLoaded(true)
        return
      }

      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L
      if (!L) {
        initAttempts.current++
        console.log("[v0] Leaflet not ready, attempt:", initAttempts.current)
        setTimeout(initMap, 100)
        return
      }

      try {
        console.log("[v0] Initializing map...")

        // Initialize map centered on Bandung
        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([-6.9025, 107.6191], 13)

        mapInstanceRef.current = map

        // Add zoom control to bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map)

        // Add OpenStreetMap tiles with clean style
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map)

        // Create custom coffee icon
        const createCoffeeIcon = () => {
          return L.divIcon({
            className: "custom-div-icon",
            html: `
              <div class="custom-marker">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                  <line x1="6" x2="6" y1="2" y2="4"/>
                  <line x1="10" x2="10" y1="2" y2="4"/>
                  <line x1="14" x2="14" y1="2" y2="4"/>
                </svg>
              </div>
            `,
            iconSize: [44, 52],
            iconAnchor: [22, 52],
            popupAnchor: [0, -52],
          })
        }

          // Add markers for each cafe
          ; (cafesData.features as CafeFeature[]).forEach((feature) => {
            const { coordinates } = feature.geometry
            const props = feature.properties

            const marker = L.marker([coordinates[1], coordinates[0]], {
              icon: createCoffeeIcon(),
            }).addTo(map)

            // Create popup content
            const popupContent = `
            <div class="cafe-popup-content">
              <img src="${props.image}" alt="${props.name}" class="cafe-popup-image" />
              <div class="cafe-popup-body">
                <h3 class="cafe-popup-title">${props.name}</h3>
                <div class="cafe-popup-address">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>${props.address}</span>
                </div>
                <div class="cafe-popup-meta">
                  <div class="cafe-popup-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>${props.rating}</span>
                  </div>
                  <div class="cafe-popup-wifi">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                      <line x1="12" x2="12.01" y1="20" y2="20"/>
                    </svg>
                    <span>${props.wifiSpeed}</span>
                  </div>
                </div>
              </div>
            </div>
          `

            marker.bindPopup(popupContent, {
              maxWidth: 300,
              minWidth: 280,
              className: "cafe-popup",
            })
          })

        console.log("[v0] Map initialized successfully")
        setIsLoaded(true)
      } catch (error) {
        console.log("[v0] Error initializing map:", error)
        setIsLoaded(true)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </>
  )
}
