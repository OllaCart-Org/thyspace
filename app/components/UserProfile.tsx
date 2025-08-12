"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Crown, Shield, Star, Camera, Calendar } from "lucide-react"

interface UserProfileProps {
  userId?: string
  isCurrentUser?: boolean
}

export default function UserProfile({ userId, isCurrentUser = false }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const endpoint = userId ? `/api/profile/${userId}` : "/api/profile/me"
      const response = await fetch(endpoint)
      const data = await response.json()
      setProfile(data.profile)
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Profile not found</p>
        </CardContent>
      </Card>
    )
  }

  const getLevelColor = (level: number) => {
    if (level >= 10) return "bg-purple-500"
    if (level >= 5) return "bg-blue-500"
    if (level >= 3) return "bg-green-500"
    return "bg-gray-500"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="relative mx-auto">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.verificationPhoto || "/placeholder.svg"} alt={profile.displayName} />
            <AvatarFallback className="text-lg">
              {profile.displayName?.charAt(0) || profile.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {profile.verified && (
            <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1">
              <Shield className="w-3 h-3" />
            </Badge>
          )}
        </div>
        <CardTitle className="space-y-1">
          <h2 className="text-xl">{profile.displayName}</h2>
          <p className="text-sm text-gray-600 font-normal">@{profile.username}</p>
        </CardTitle>
        {profile.bio && <p className="text-sm text-gray-600">{profile.bio}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div
              className={`w-12 h-12 ${getLevelColor(profile.level)} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-1`}
            >
              {profile.level}
            </div>
            <p className="text-xs text-gray-600">Level</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-5 h-5 text-yellow-500 mr-1" />
              <span className="font-bold">{profile.points || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Points</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Camera className="w-4 h-4 text-emerald-600 mr-1" />
                <span className="font-semibold">{stats.postsCount || 0}</span>
              </div>
              <p className="text-xs text-gray-600">Posts</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{stats.ownedLocations || 0}</span>
              </div>
              <p className="text-xs text-gray-600">Owned</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-purple-500 mr-1" />
                <span className="font-semibold">{stats.eventsCreated || 0}</span>
              </div>
              <p className="text-xs text-gray-600">Events</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          {profile.verified && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {profile.location && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <MapPin className="w-3 h-3 mr-1" />
              Location Verified
            </Badge>
          )}
          {stats?.ownedLocations > 0 && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              <Crown className="w-3 h-3 mr-1" />
              Land Owner
            </Badge>
          )}
        </div>

        {isCurrentUser && (
          <Button variant="outline" className="w-full bg-transparent">
            Edit Profile
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
