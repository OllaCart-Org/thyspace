import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
const ownedLands: any[] = []
let landIdCounter = 1

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude, name, rules, allowPublicPosts, requireApproval, ownerId, ownerName } = body

    // Check if location is already owned
    const existingLand = ownedLands.find(
      (land) => Math.abs(land.latitude - latitude) < 0.001 && Math.abs(land.longitude - longitude) < 0.001,
    )

    if (existingLand) {
      return NextResponse.json({ error: "This location is already owned" }, { status: 400 })
    }

    // Create new land ownership
    const newLand = {
      id: landIdCounter++,
      latitude,
      longitude,
      name: name || `Land ${landIdCounter}`,
      rules: rules || "",
      allowPublicPosts: allowPublicPosts ?? true,
      requireApproval: requireApproval ?? false,
      ownerId,
      ownerName,
      purchasedAt: new Date().toISOString(),
      defenseLevel: 1,
      contentCount: 0,
      lastActivity: new Date().toISOString(),
    }

    ownedLands.push(newLand)

    return NextResponse.json({
      success: true,
      land: newLand,
    })
  } catch (error) {
    console.error("Land purchase error:", error)
    return NextResponse.json({ error: "Failed to purchase land" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    lands: ownedLands,
  })
}
