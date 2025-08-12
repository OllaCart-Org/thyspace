import { type NextRequest, NextResponse } from "next/server"

// Mock chat messages
const generateChatMessages = () => {
  const messages = []
  const mockAuthors = [
    { username: "explorer1", displayName: "Alex Explorer", avatar: "/placeholder.svg", verified: false },
    { username: "photographer", displayName: "Sarah Photos", avatar: "/placeholder.svg", verified: true },
    { username: "local_guide", displayName: "Mike Local", avatar: "/placeholder.svg", verified: false },
  ]

  const mockMessages = [
    "Hey everyone! Beautiful day here",
    "Anyone know what time the sunset is?",
    "Great spot for photos!",
    "First time visiting this location",
    "Love the view from here",
    "Perfect weather today",
  ]

  for (let i = 0; i < 5; i++) {
    messages.push({
      id: `msg_${i + 1}`,
      author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)],
      message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
      timestamp: new Date(Date.now() - (5 - i) * 60000).toISOString(),
      type: "text",
    })
  }

  return messages
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")

  const messages = generateChatMessages()

  return NextResponse.json({
    messages,
    location: { latitude: lat, longitude: lon },
  })
}
