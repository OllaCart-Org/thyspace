import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
const profiles: any[] = []
let profileIdCounter = 1

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, displayName, bio, verificationPhoto, location } = body

    // Check if username already exists
    const existingProfile = profiles.find((p) => p.username === username)
    if (existingProfile) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create new profile
    const newProfile = {
      id: profileIdCounter++,
      username,
      displayName,
      bio,
      verificationPhoto,
      location,
      verified: true,
      level: 1,
      points: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }

    profiles.push(newProfile)

    return NextResponse.json({
      success: true,
      profile: newProfile,
    })
  } catch (error) {
    console.error("Profile creation error:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    profiles: profiles.map((p) => ({
      id: p.id,
      username: p.username,
      displayName: p.displayName,
      verified: p.verified,
      level: p.level,
      points: p.points,
    })),
  })
}
