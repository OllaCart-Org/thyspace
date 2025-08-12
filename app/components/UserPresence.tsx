"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Clock } from "lucide-react"

export default function UserPresence({ latitude, longitude, user }) {
  const [isPresent, setIsPresent] = useState(false)
  const [nearbyUsers, setNearbyUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyUsers()
    }
  }, [latitude, longitude])

  const fetchNearbyUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/presence?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      setNearbyUsers(data.users || [])
      setIsPresent(data.isPresent || false)
    } catch (error) {
      console.error("Failed to fetch nearby users:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePresence = async () => {
    if (!user) {
      alert("Please log in to show your presence.")
      return
    }

    try {
      const response = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: latitude,
          lon: longitude,
          userId: user.id,
          action: isPresent ? "leave" : "join",
        }),
      })

      if (response.ok) {
        setIsPresent(!isPresent)
        fetchNearbyUsers()
      }
    } catch (error) {
      console.error("Failed to update presence:", error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading nearby users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Presence Toggle */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Presence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isPresent ? "You're showing as present in this area" : "Show others that you're here"}
              </p>
            </div>
            <Button
              onClick={togglePresence}
              className={`${
                isPresent ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"
              } text-white`}
            >
              <Users className="w-4 h-4 mr-2" />
              {isPresent ? "Leave Area" : "I'm Here"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Users */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Who's Here ({nearbyUsers.length})</h3>
        {nearbyUsers.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No one else is showing their presence in this area right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {nearbyUsers.map((nearbyUser, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">{nearbyUser.username}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {nearbyUser.distance}m away
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {nearbyUser.lastSeen}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
