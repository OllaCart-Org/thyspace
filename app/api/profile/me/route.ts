import { NextResponse } from "next/server"

// Mock current user profile for demo
const mockProfile = {
  id: 1,
  username: "demo_user",
  displayName: "Demo User",
  bio: "Exploring ThySpace!",
  verified: true,
  level: 3,
  points: 150,
  verificationPhoto: "/placeholder.svg?height=100&width=100",
  location: {
    latitude: 40.7128,
    longitude: -74.006,
    timestamp: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
}

const mockStats = {
  postsCount: 12,
  ownedLocations: 2,
  eventsCreated: 1,
  totalLikes: 45,
  totalViews: 234,
}

export async function GET() {
  return NextResponse.json({
    profile: mockProfile,
    stats: mockStats,
  })
}
