import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
const events: any[] = []
let eventIdCounter = 1

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      date,
      time,
      duration,
      latitude,
      longitude,
      bountyAmount,
      broadcastRadius,
      creatorId,
      creatorName,
      costs,
      estimatedParticipants,
    } = body

    // Create new event
    const newEvent = {
      id: eventIdCounter++,
      title,
      description,
      date,
      time,
      duration,
      latitude,
      longitude,
      bountyAmount,
      broadcastRadius,
      creatorId,
      creatorName,
      costs,
      estimatedParticipants,
      currentParticipants: 0,
      participants: [],
      createdAt: new Date().toISOString(),
      status: "upcoming",
      totalPayout: 0,
    }

    events.push(newEvent)

    return NextResponse.json({
      success: true,
      event: newEvent,
    })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      creatorName: e.creatorName,
      bountyAmount: e.bountyAmount,
      currentParticipants: e.currentParticipants,
      status: e.status,
    })),
  })
}
