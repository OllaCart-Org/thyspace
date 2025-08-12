import { type NextRequest, NextResponse } from "next/server"

// Mock media data
const generateLocationMedia = (lat: number, lon: number) => {
  const mediaItems = []
  const count = Math.floor(Math.random() * 8) + 2

  const mockAuthors = [
    {
      username: "photographer1",
      displayName: "Sarah Photos",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      username: "explorer",
      displayName: "Alex Explorer",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    {
      username: "local_guide",
      displayName: "Mike Local",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    { username: "traveler", displayName: "Emma Travel", avatar: "/placeholder.svg?height=40&width=40", verified: true },
  ]

  const mockCaptions = [
    "Amazing view from this spot!",
    "Perfect sunset tonight 🌅",
    "Love this hidden gem",
    "Great place for photos",
    "First time here, incredible!",
    "Nature at its finest",
    "Peaceful moment",
    "",
  ]

  for (let i = 0; i < count; i++) {
    const isVideo = Math.random() > 0.7
    mediaItems.push({
      id: `media_${i + 1}`,
      type: isVideo ? "video" : "image",
      url: isVideo
        ? "/placeholder.svg?height=300&width=400"
        : `/placeholder.svg?height=300&width=400&query=photo at location ${i + 1}`,
      caption: mockCaptions[Math.floor(Math.random() * mockCaptions.length)],
      author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 50) + 1,
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.7,
      location: { latitude: lat, longitude: lon },
    })
  }

  return mediaItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const media = generateLocationMedia(lat, lon)

  return NextResponse.json({
    media,
    location: { latitude: lat, longitude: lon },
  })
}
