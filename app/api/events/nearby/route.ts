import { type NextRequest, NextResponse } from "next/server"

// Mock nearby events data
const generateNearbyEvents = (lat: number, lon: number, radius: number) => {
  const events = []
  const count = Math.floor(Math.random() * 5) + 2 // 2-6 events

  const mockTitles = [
    "Coffee Meetup",
    "Street Art Tour",
    "Sunset Photography",
    "Food Truck Festival",
    "Live Music Session",
    "Community Cleanup",
    "Pop-up Market",
    "Yoga in the Park",
  ]

  const mockDescriptions = [
    "Join us for a casual meetup!",
    "Explore the local scene together",
    "Capture the perfect moment",
    "Taste amazing local food",
    "Enjoy live performances",
    "Help make our community better",
    "Discover unique local vendors",
    "Relax and stretch with us",
  ]

  const mockCreators = [
    { name: "Alex Community", avatar: "/placeholder.svg" },
    { name: "Sarah Events", avatar: "/placeholder.svg" },
    { name: "Mike Local", avatar: "/placeholder.svg" },
    { name: "Emma Organizer", avatar: "/placeholder.svg" },
  ]

  for (let i = 0; i < count; i++) {
    // Generate random locations within radius
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radius
    const deltaLat = (distance * Math.cos(angle)) / 111000
    const deltaLon = (distance * Math.sin(angle)) / (111000 * Math.cos((lat * Math.PI) / 180))

    const eventDate = new Date()
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 7))

    const eventTime = new Date()
    eventTime.setHours(Math.floor(Math.random() * 12) + 9, Math.floor(Math.random() * 4) * 15, 0, 0)

    const bountyAmount = [25, 50, 75, 100, 150][Math.floor(Math.random() * 5)]
    const broadcastRadius = [200, 300, 500, 800, 1000][Math.floor(Math.random() * 5)]
    const estimatedParticipants = Math.floor(Math.random() * 20) + 5
    const currentParticipants = Math.floor(Math.random() * estimatedParticipants)

    events.push({
      id: `event_${i + 1}`,
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      description: mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)],
      date: eventDate.toISOString().split("T")[0],
      time: eventTime.toTimeString().slice(0, 5),
      duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
      latitude: lat + deltaLat,
      longitude: lon + deltaLon,
      bountyAmount,
      broadcastRadius,
      estimatedParticipants,
      currentParticipants,
      creatorName: mockCreators[Math.floor(Math.random() * mockCreators.length)].name,
      creator: mockCreators[Math.floor(Math.random() * mockCreators.length)],
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.7 ? "active" : "upcoming",
    })
  }

  return events.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")
  const radius = Number.parseInt(searchParams.get("radius") || "2000")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const events = generateNearbyEvents(lat, lon, radius)

  return NextResponse.json({
    events,
    center: { latitude: lat, longitude: lon },
    radius,
  })
}
