import { type NextRequest, NextResponse } from "next/server"

// Mock active streams
const generateActiveStreams = () => {
  const streams = []
  const streamCount = Math.floor(Math.random() * 3) + 1

  const mockStreamers = [
    { username: "streamer1", displayName: "Live Explorer", avatar: "/placeholder.svg", verified: true },
    { username: "photographer", displayName: "Sarah Live", avatar: "/placeholder.svg", verified: false },
    { username: "guide", displayName: "Local Guide", avatar: "/placeholder.svg", verified: true },
  ]

  for (let i = 0; i < streamCount; i++) {
    streams.push({
      id: `stream_${i + 1}`,
      author: mockStreamers[i % mockStreamers.length],
      title: `Live from this amazing location!`,
      viewers: Math.floor(Math.random() * 50) + 5,
      startedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      isVideoEnabled: true,
      isAudioEnabled: true,
    })
  }

  return streams
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  const streams = generateActiveStreams()

  return NextResponse.json({
    streams,
    location: { latitude: lat, longitude: lon },
  })
}
