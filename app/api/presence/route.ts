import { type NextRequest, NextResponse } from "next/server"

// Simulate a database with an in-memory object
interface UserPresence {
  userId: string
  username: string
  lat: number
  lon: number
  timestamp: number
}

let presenceDatabase: UserPresence[] = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  // Clean up old presence records (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  presenceDatabase = presenceDatabase.filter((p) => p.timestamp > oneHourAgo)

  // Find nearby users within 2000m
  const nearbyUsers = presenceDatabase
    .filter((presence) => {
      const distance = calculateDistance(lat, lon, presence.lat, presence.lon)
      return distance <= 2000
    })
    .map((presence) => ({
      username: presence.username,
      distance: Math.round(calculateDistance(lat, lon, presence.lat, presence.lon)),
      lastSeen: getTimeAgo(presence.timestamp),
    }))

  return NextResponse.json({ users: nearbyUsers })
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lon, userId, action } = await request.json()

    if (!lat || !lon || !userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (action === "join") {
      // Remove any existing presence for this user
      presenceDatabase = presenceDatabase.filter((p) => p.userId !== userId)

      // Add new presence
      presenceDatabase.push({
        userId,
        username: `User${userId}`, // In a real app, get from user database
        lat,
        lon,
        timestamp: Date.now(),
      })
    } else if (action === "leave") {
      // Remove presence for this user
      presenceDatabase = presenceDatabase.filter((p) => p.userId !== userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
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

function getTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
