"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import cafesData from "@/data/cafes.json"
import { CafeFeature, UserLocation } from "../types"

export interface MapHandle {
  locateUser: () => Promise<void>
  toggleBaseLayer: () => void
  resetView: () => void
}

type SupportedTheme = "light" | "dark"

const hasCoordinates = (
  feature: CafeFeature,
): feature is CafeFeature & { geometry: { coordinates: [number, number] } } => {
  const coords = feature.geometry.coordinates
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords.every((value) => typeof value === "number" && Number.isFinite(value))
  )
}

interface CafeMapProps {
  language: "en" | "id"
  theme: string | undefined
  onSelectCafe?: (feature: CafeFeature) => void
  onLoad?: () => void
  cafes?: CafeFeature[]
  onUserLocationChange?: (coords: UserLocation) => void
}

declare global {
  interface Window {
    L: any
  }
}

const CafeMap = forwardRef<MapHandle, CafeMapProps>(function CafeMap(
  { language, theme, onSelectCafe, onLoad, cafes, onUserLocationChange },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const initAttempts = useRef(0)
  const [baseLayer, setBaseLayer] = useState<SupportedTheme>("light")
  const tileLayersRef = useRef<Record<SupportedTheme, any> | null>(null)
  const cafeMarkerLayerRef = useRef<any>(null)
  const cafeClusterLayerRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const userAccuracyRef = useRef<any>(null)
  const onSelectCafeRef = useRef<typeof onSelectCafe>(onSelectCafe)
  const onUserLocationChangeRef = useRef<typeof onUserLocationChange>(onUserLocationChange)
  const cafesRef = useRef<CafeFeature[]>(cafes ?? ((cafesData.features as CafeFeature[]) ?? []))

  useEffect(() => {
    onSelectCafeRef.current = onSelectCafe
  }, [onSelectCafe])

  useEffect(() => {
    onUserLocationChangeRef.current = onUserLocationChange
  }, [onUserLocationChange])

  useEffect(() => {
    if (!isLoaded) return
    onLoad?.()
  }, [isLoaded, onLoad])

  useEffect(() => {
    cafesRef.current = cafes ?? ((cafesData.features as CafeFeature[]) ?? [])
    if (cafeMarkerLayerRef.current && cafeClusterLayerRef.current && mapInstanceRef.current) {
      renderCafeLayers()
    }
  }, [cafes])

  const getTileLayer = (type: SupportedTheme, L: any) => {
    const urls: Record<SupportedTheme, string> = {
      light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    }

    return L.tileLayer(urls[type], {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    })
  }

  const applyBaseLayer = (nextLayer: SupportedTheme) => {
    const map = mapInstanceRef.current
    const layers = tileLayersRef.current
    if (!map || !layers) return

    Object.values(layers).forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer)
      }
    })

    const selectedLayer = layers[nextLayer]
    if (selectedLayer) {
      selectedLayer.addTo(map)
      setBaseLayer(nextLayer)
    }
  }

  const locateUser = async () => {
    const map = mapInstanceRef.current
    if (!map) {
      throw new Error(language === "id" ? "Peta belum siap" : "Map is not ready yet")
    }
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      throw new Error(
        language === "id"
          ? "Lokasi hanya bisa diakses di HTTPS atau localhost"
          : "Location is only available on HTTPS or localhost",
      )
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      throw new Error(language === "id" ? "Geolokasi tidak tersedia" : "Geolocation is not available")
    }

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const accuracy = Math.min(Math.max(position.coords.accuracy || 80, 30), 500)
          const L = window.L

          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current)
          }
          if (userAccuracyRef.current) {
            map.removeLayer(userAccuracyRef.current)
          }

          const userIcon = L.divIcon({
            className: "user-location-icon user-location-marker-container",
            html: `
              <div class="user-location-marker">
                <span class="user-location-dot"></span>
                <span class="user-location-pulse"></span>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14],
          })

          userMarkerRef.current = L.marker([latitude, longitude], {
            title: "You are here",
            icon: userIcon,
          }).addTo(map)

          userAccuracyRef.current = L.circle([latitude, longitude], {
            radius: accuracy,
            color: "#3b82f6",
            weight: 1,
            fillColor: "#3b82f6",
            fillOpacity: 0.15,
          }).addTo(map)

          userMarkerRef.current.bindPopup(
            `<div style="font-weight:600;margin-bottom:4px;">${language === "id" ? "Lokasi Anda" : "Your location"
            }</div><div style="color:#666;font-size:13px;">Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(
              5,
            )}</div>`,
          )

          userMarkerRef.current.openPopup()
          const targetZoom = Math.max(map.getZoom() ?? 13, 16)
          map.flyTo([latitude, longitude], targetZoom, { animate: true, duration: 0.6 })
          onUserLocationChangeRef.current?.({ latitude, longitude })
          resolve()
        },
        (error) => {
          const message =
            language === "id"
              ? "Tidak dapat mengambil lokasi. Pastikan izin lokasi diberikan."
              : "Unable to fetch location. Please allow location permission."
          reject(new Error(message))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    })
  }

  const toggleBaseLayer = () => {
    applyBaseLayer(baseLayer === "light" ? "dark" : "light")
  }

  const resetView = () => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo([-6.9025, 107.6191], 13)
  }

  const createClusterIcon = (count: number, L: any) =>
    L.divIcon({
      className: "cafe-cluster-icon",
      html: `
        <div class="cluster-circle">
          <span class="cluster-count">${count}</span>
        </div>
      `,
      iconSize: [46, 46],
      iconAnchor: [23, 23],
      popupAnchor: [0, -18],
    })

  const createCoffeeIcon = (L: any) =>
    L.divIcon({
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

  const renderCafeLayers = () => {
    const map = mapInstanceRef.current
    const markerLayer = cafeMarkerLayerRef.current
    const clusterLayer = cafeClusterLayerRef.current
    const L = typeof window !== "undefined" ? window.L : null

    if (!map || !markerLayer || !clusterLayer || !L) return

    const zoom = map.getZoom() ?? 13
    const shouldCluster = zoom < 15

    markerLayer.clearLayers()
    clusterLayer.clearLayers()

    const cafeFeatures = cafesRef.current.filter(hasCoordinates)

    const handleCafeClick = (feature: CafeFeature) => {
      if (onSelectCafeRef.current) {
        onSelectCafeRef.current(feature)
      }
    }

    if (!shouldCluster) {
      cafeFeatures.forEach((feature) => {
        const { coordinates } = feature.geometry
        const marker = L.marker([coordinates[1], coordinates[0]], {
          icon: createCoffeeIcon(L),
        })
        marker.on("click", () => handleCafeClick(feature))
        markerLayer.addLayer(marker)
      })
      return
    }

    const cellSize = zoom >= 14 ? 0.02 : zoom >= 12 ? 0.05 : 0.1
    const clusters = new Map<
      string,
      { count: number; latSum: number; lngSum: number; samples: CafeFeature[] }
    >()

    cafeFeatures.forEach((feature) => {
      const { coordinates } = feature.geometry
      const lat = coordinates[1]
      const lng = coordinates[0]
      const key = `${Math.floor(lat / cellSize)}-${Math.floor(lng / cellSize)}`
      const existing = clusters.get(key)
      if (existing) {
        existing.count += 1
        existing.latSum += lat
        existing.lngSum += lng
        existing.samples.push(feature)
      } else {
        clusters.set(key, { count: 1, latSum: lat, lngSum: lng, samples: [feature] })
      }
    })

    clusters.forEach((cluster) => {
      if (cluster.count === 1) {
        const feature = cluster.samples[0]
        const { coordinates } = feature.geometry
        const marker = L.marker([coordinates[1], coordinates[0]], {
          icon: createCoffeeIcon(L),
        })
        marker.on("click", () => handleCafeClick(feature))
        markerLayer.addLayer(marker)
        return
      }

      const centerLat = cluster.latSum / cluster.count
      const centerLng = cluster.lngSum / cluster.count
      const clusterMarker = L.marker([centerLat, centerLng], {
        icon: createClusterIcon(cluster.count, L),
      })

      clusterMarker.on("click", () => {
        const targetZoom = Math.min((map.getZoom() ?? 13) + 2, 18)
        map.flyTo([centerLat, centerLng], targetZoom, { animate: true, duration: 0.4 })
      })

      clusterLayer.addLayer(clusterMarker)
    })
  }

  useImperativeHandle(
    ref,
    () => ({
      locateUser,
      toggleBaseLayer,
      resetView,
    }),
    [baseLayer, language],
  )

  useEffect(() => {
    // Helper: get lat/lng/zoom from URL
    function getMapParamsFromUrl() {
      if (typeof window === 'undefined') return null;
      const params = new URLSearchParams(window.location.search);
      const lat = parseFloat(params.get('lat') || '');
      const lng = parseFloat(params.get('lng') || '');
      const zoom = parseInt(params.get('zoom') || '');
      if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        return { lat, lng, zoom };
      }
      return null;
    }

    // Helper: update URL with lat/lng/zoom
    function setMapParamsToUrl(lat: number, lng: number, zoom: number) {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      params.set('lat', lat.toFixed(6));
      params.set('lng', lng.toFixed(6));
      params.set('zoom', zoom.toString());
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }

    const initMap = () => {
      if (initAttempts.current > 50) {
        setIsLoaded(true)
        return
      }

      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L
      if (!L) {
        initAttempts.current++
        setTimeout(initMap, 100)
        return
      }

      try {
        // Ambil dari URL jika ada, jika tidak default Bandung
        const params = getMapParamsFromUrl();
        const initialLat = params?.lat ?? -6.9025;
        const initialLng = params?.lng ?? 107.6191;
        const initialZoom = params?.zoom ?? 15;

        const map = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([initialLat, initialLng], initialZoom);

        mapInstanceRef.current = map;

        // Create tile layers for light and dark mode
        tileLayersRef.current = {
          light: getTileLayer("light", L),
          dark: getTileLayer("dark", L),
        }

        tileLayersRef.current.light.addTo(map)

        // Add zoom control to bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map)

        cafeMarkerLayerRef.current = L.layerGroup().addTo(map)
        cafeClusterLayerRef.current = L.layerGroup().addTo(map)
        renderCafeLayers()
        map.on("zoomend", renderCafeLayers)

        // Update URL on move/zoom
        const updateUrl = () => {
          const center = map.getCenter();
          const zoom = map.getZoom();
          setMapParamsToUrl(center.lat, center.lng, zoom);
        };
        map.on("moveend", updateUrl);
        map.on("zoomend", updateUrl);

        setIsLoaded(true)
      } catch (error) {
        setIsLoaded(true)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("zoomend", renderCafeLayers)
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const mappedTheme: SupportedTheme = theme === "dark" ? "dark" : "light"
    applyBaseLayer(mappedTheme)
  }, [theme])

  return (
    <>
      <div ref={mapRef} className="absolute inset-0 z-0" />
    </>
  )
})

export default CafeMap
