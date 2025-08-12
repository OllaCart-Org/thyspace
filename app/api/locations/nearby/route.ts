import { type NextRequest, NextResponse } from "next/server"

// Mock nearby locations data
const generateNearbyLocations = (lat: number, lon: number, radius: number) => {
  const locations = []
  const count = Math.floor(Math.random() * 8) + 3 // 3-10 locations

  for (let i = 0; i < count; i++) {
    // Generate random locations within radius
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radius
    const deltaLat = (distance * Math.cos(angle)) / 111000 // rough conversion
    const deltaLon = (distance * Math.sin(angle)) / (111000 * Math.cos((lat * Math.PI) / 180))

    locations.push({
      id: `loc_${i + 1}`,
      name: `Location ${i + 1}`,
      latitude: lat + deltaLat,
      longitude: lon + deltaLon,
      hasContent: Math.random() > 0.3,
      contentCount: Math.floor(Math.random() * 20) + 1,
      activeUsers: Math.floor(Math.random() * 5),
      isOwned: Math.random() > 0.7,
      hasDefense: Math.random() > 0.8,
      price: 20,
      owner: Math.random() > 0.7 ? "demo_user" : null,
    })
  }

  return locations
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")
  const radius = Number.parseInt(searchParams.get("radius") || "2000")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const locations = generateNearbyLocations(lat, lon, radius)

  return NextResponse.json({
    locations,
    center: { latitude: lat, longitude: lon },
    radius,
  })
}
