import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { landId: string } }) {
  const landId = params.landId

  // Mock defense status data
  const mockDefenseStatus = {
    lastPost: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    postCount: Math.floor(Math.random() * 20) + 5,
    activeDays: Math.floor(Math.random() * 30) + 1,
    challengesDefended: Math.floor(Math.random() * 5),
    defenseStrength: Math.floor(Math.random() * 4) + 1,
  }

  return NextResponse.json({
    status: mockDefenseStatus,
  })
}
