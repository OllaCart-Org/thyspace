import { type NextRequest, NextResponse } from "next/server"

// Simulate a database with an in-memory object
interface MediaContent {
  id: string
  type: "image" | "video"
  url: string
  timestamp: number
  userId: string
}

interface Location {
  owner: string | null
  price: number
  computationalDraw: number
  horizontalLand: number
  virtualHeight: number
  features: string[] // Added features array to track purchased features
}

const contentDatabase: { [key: string]: MediaContent[] } = {}
const locationDatabase: { [key: string]: Location } = {}
const userDatabase: { [key: string]: { username: string; password: string } } = {}

const FEATURE_PRICES = {
  premium_chat: 15,
  media_boost: 25,
  event_hosting: 50,
  analytics_pro: 20,
  custom_theme: 30,
  security_plus: 35,
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const explore = searchParams.get("explore")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const key = `${lat},${lon}`
  let content = contentDatabase[key] || []
  const location = locationDatabase[key] || {
    owner: null,
    price: calculatePrice(key),
    computationalDraw: Math.random() * 100,
    horizontalLand: Math.random() * 100,
    virtualHeight: Math.random() * 100,
    features: [], // Initialize empty features array
  }

  if (explore === "true") {
    content = Object.values(contentDatabase)
      .flat()
      .filter((item) => calculateDistance(lat, lon, item.lat, item.lon) <= 2000)
  }

  return NextResponse.json({ content, location })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const lat = formData.get("lat") as string
  const lon = formData.get("lon") as string
  const file = formData.get("file") as File
  const action = formData.get("action") as string
  const userId = formData.get("userId") as string

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const key = `${lat},${lon}`

  if (action === "buy_feature") {
    const featureId = formData.get("featureId") as string

    if (!FEATURE_PRICES[featureId]) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 })
    }

    const location = locationDatabase[key]
    if (!location || !location.owner) {
      return NextResponse.json({ error: "Location must be owned to purchase features" }, { status: 400 })
    }

    if (location.features.includes(featureId)) {
      return NextResponse.json({ error: "Feature already purchased" }, { status: 400 })
    }

    location.features.push(featureId)
    locationDatabase[key] = location

    return NextResponse.json({ success: true, location })
  }

  if (action === "buy") {
    const location = locationDatabase[key] || {
      owner: null,
      price: calculatePrice(key),
      computationalDraw: Math.random() * 100,
      horizontalLand: Math.random() * 100,
      virtualHeight: Math.random() * 100,
      features: [], // Initialize empty features array
    }

    if (location.owner) {
      return NextResponse.json({ error: "Location already owned" }, { status: 400 })
    }

    location.owner = userId // In a real app, use authenticated user ID
    locationDatabase[key] = location

    return NextResponse.json({ success: true, location })
  }

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  if (!contentDatabase[key]) {
    contentDatabase[key] = []
  }

  // In a real app, you'd upload this file to a storage service and get a URL
  const fileUrl = URL.createObjectURL(file)
  const fileType = file.type.startsWith("image/") ? "image" : "video"

  const newContent: MediaContent = {
    id: Math.random().toString(36).substr(2, 9),
    type: fileType,
    url: fileUrl,
    timestamp: Date.now(),
    userId,
  }

  contentDatabase[key].push(newContent)

  return NextResponse.json({ success: true })
}

function calculatePrice(key: string): number {
  const location = locationDatabase[key] || {
    computationalDraw: Math.random() * 100,
    horizontalLand: Math.random() * 100,
    virtualHeight: Math.random() * 100,
  }

  return location.computationalDraw * 10 + location.horizontalLand * 5 + location.virtualHeight * 3
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180 // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // in metres
}
