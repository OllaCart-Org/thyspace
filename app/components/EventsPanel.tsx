"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, DollarSign, Users, Clock, Play, CheckCircle, AlertTriangle } from "lucide-react"

interface EventsPanelProps {
  latitude: number
  longitude: number
  currentUser?: any
}

export default function EventsPanel({ latitude, longitude, currentUser }: EventsPanelProps) {
  const [activeTab, setActiveTab] = useState("nearby") // nearby, participating, created
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([])
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([])
  const [createdEvents, setCreatedEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNearbyEvents()
    if (currentUser) {
      fetchParticipatingEvents()
      fetchCreatedEvents()
    }
  }, [latitude, longitude, currentUser])

  const fetchNearbyEvents = async () => {
    try {
      const response = await fetch(`/api/events/nearby?lat=${latitude}&lon=${longitude}&radius=2000`)
      const data = await response.json()
      setNearbyEvents(data.events || [])
    } catch (error) {
      console.error("Failed to fetch nearby events:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipatingEvents = async () => {
    try {
      const response = await fetch(`/api/events/participating?userId=${currentUser.id}`)
      const data = await response.json()
      setParticipatingEvents(data.events || [])
    } catch (error) {
      console.error("Failed to fetch participating events:", error)
    }
  }

  const fetchCreatedEvents = async () => {
    try {
      const response = await fetch(`/api/events/created?userId=${currentUser.id}`)
      const data = await response.json()
      setCreatedEvents(data.events || [])
    } catch (error) {
      console.error("Failed to fetch created events:", error)
    }
  }

  const joinEvent = async (eventId: string) => {
    if (!currentUser) return

    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, latitude, longitude }),
      })

      if (response.ok) {
        fetchNearbyEvents()
        fetchParticipatingEvents()
      }
    } catch (error) {
      console.error("Failed to join event:", error)
    }
  }

  const getEventStatus = (event: any) => {
    const now = new Date()
    const eventStart = new Date(`${event.date}T${event.time}`)
    const eventEnd = new Date(eventStart.getTime() + event.duration * 60000)

    if (now < eventStart) return "upcoming"
    if (now >= eventStart && now <= eventEnd) return "active"
    return "completed"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const calculateDistance = (eventLat: number, eventLon: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (latitude * Math.PI) / 180
    const φ2 = (eventLat * Math.PI) / 180
    const Δφ = ((eventLat - latitude) * Math.PI) / 180
    const Δλ = ((eventLon - longitude) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c)
  }

  const EventCard = ({ event, showDistance = true, showJoinButton = true }: any) => {
    const status = getEventStatus(event)
    const distance = showDistance ? calculateDistance(event.latitude, event.longitude) : 0
    const isWithinRadius = distance <= event.broadcastRadius

    return (
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold">{event.title}</h4>
                <Badge className={`${getStatusColor(status)} text-white text-xs`}>{status}</Badge>
                {status === "active" && (
                  <Badge className="bg-red-500 text-white text-xs animate-pulse">
                    <Play className="w-2 h-2 mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src={event.creator?.avatar || "/placeholder.svg"} alt={event.creatorName} />
              <AvatarFallback>{event.creatorName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  {event.date} {event.time}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-3 h-3 mr-1" />
                  {event.duration}min
                </div>
              </div>
              {showDistance && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {distance}m away
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-green-600">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span className="font-semibold">
                    $
                    {event.estimatedParticipants > 0
                      ? (event.bountyAmount / event.estimatedParticipants).toFixed(2)
                      : "0.00"}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">per person</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Users className="w-3 h-3 mr-1" />
                  <span className="text-sm">{event.currentParticipants || 0}</span>
                </div>
              </div>

              {showJoinButton && currentUser && status !== "completed" && (
                <div className="flex space-x-2">
                  {isWithinRadius ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => joinEvent(event.id)}
                      disabled={status !== "active"}
                    >
                      {status === "active" ? "Join & Earn" : "Join Event"}
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Too far away
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {!isWithinRadius && showDistance && (
              <div className="bg-orange-50 p-2 rounded text-xs text-orange-800">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                You need to be within {event.broadcastRadius}m to participate
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Events & Bounties
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          {[
            { id: "nearby", label: "Nearby", count: nearbyEvents.length },
            { id: "participating", label: "Joined", count: participatingEvents.length },
            { id: "created", label: "Created", count: createdEvents.length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center"
              disabled={tab.id !== "nearby" && !currentUser}
            >
              {tab.label}
              {tab.count > 0 && <Badge className="ml-1 bg-purple-500 text-white text-xs px-1 py-0">{tab.count}</Badge>}
            </Button>
          ))}
        </div>

        {/* Nearby Events */}
        {activeTab === "nearby" && (
          <div className="space-y-3">
            {nearbyEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No events happening nearby</p>
                <p className="text-sm mt-1">Be the first to create one!</p>
              </div>
            ) : (
              nearbyEvents.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>
        )}

        {/* Participating Events */}
        {activeTab === "participating" && (
          <div className="space-y-3">
            {!currentUser ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sign in to see your events</p>
              </div>
            ) : participatingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>You haven't joined any events yet</p>
                <p className="text-sm mt-1">Join nearby events to earn bounties!</p>
              </div>
            ) : (
              participatingEvents.map((event) => <EventCard key={event.id} event={event} showJoinButton={false} />)
            )}
          </div>
        )}

        {/* Created Events */}
        {activeTab === "created" && (
          <div className="space-y-3">
            {!currentUser ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sign in to see your created events</p>
              </div>
            ) : createdEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>You haven't created any events yet</p>
                <p className="text-sm mt-1">Create an event to engage your community!</p>
              </div>
            ) : (
              createdEvents.map((event) => (
                <EventCard key={event.id} event={event} showDistance={false} showJoinButton={false} />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
