import { type NextRequest, NextResponse } from "next/server"

// Simulate a database with an in-memory object
interface MediaContent {
  id: string
  type: "image" | "video"
  url: string
  timestamp: number
  userId: string
  lat: number
  lon: number
}

const contentDatabase: { [key: string]: MediaContent[] } = {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  // Get all content within 2000m radius
  const nearbyContent: MediaContent[] = []

  Object.entries(contentDatabase).forEach(([locationKey, contents]) => {
    const [locLat, locLon] = locationKey.split(",").map(Number)
    const distance = calculateDistance(lat, lon, locLat, locLon)

    if (distance <= 2000) {
      contents.forEach((content) => {
        nearbyContent.push({
          ...content,
          lat: locLat,
          lon: locLon,
        })
      })
    }
  })

  // Sort by timestamp (newest first)
  nearbyContent.sort((a, b) => b.timestamp - a.timestamp)

  return NextResponse.json({ content: nearbyContent })
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
