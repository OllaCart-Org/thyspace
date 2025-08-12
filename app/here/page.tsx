"use client"

import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useGeolocation } from "../hooks/useGeolocation"
import RulesPanel from "../components/RulesPanel"
import Leaderboard from "../components/Leaderboard"
import ContentList from "../components/ContentList"
import PostContent from "../components/PostContent"
import ManualLocationInput from "../components/ManualLocationInput"
import LocationInfo from "../components/LocationInfo"
import FeatureMarketplace from "../components/FeatureMarketplace"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, User, Calendar, BookOpen, Trophy, LogOut, Settings, Shield, Hammer } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface MapPoint {
  id: string
  lat: number
  lon: number
  type: 'content' | 'event' | 'landmark' | 'user'
  title: string
  description?: string
  intensity: number
  timestamp: number
  owner?: string
}

interface OwnedLocation {
  id: string
  name: string
  lat: number
  lon: number
  type: 'landmark' | 'event' | 'content'
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { latitude, longitude, error, permissionState } = useGeolocation()
  const [activeTab, setActiveTab] = useState("map")
  const [content, setContent] = useState([])
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [manualLocation, setManualLocation] = useState<{ lat: number | null; lon: number | null }>({ lat: null, lon: null })
  const [mapZoom, setMapZoom] = useState(1)
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null)
  
  // User stats - starting fresh for new users
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    coins: 50,
    ownedLand: 0,
    isBuilder: false,
  })

  // Owned locations - empty for new users
  const [ownedLocations, setOwnedLocations] = useState<OwnedLocation[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/landing")
    }
  }, [status, router])

  useEffect(() => {
    if (latitude && longitude) {
      fetchData(latitude, longitude)
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (manualLocation.lat && manualLocation.lon) {
      fetchData(manualLocation.lat, manualLocation.lon)
    }
  }, [manualLocation])

  // Update user stats based on owned locations
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      ownedLand: ownedLocations.length
    }))
  }, [ownedLocations])

  const fetchData = async (lat: number, lon: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/content?lat=${lat}&lon=${lon}`)
      const data = await response.json()
      setContent(data.content || [])
      setLocation(data.location || null)
    } catch (error) {
      console.error('Error fetching data:', error)
      setContent([])
      setLocation(null)
    }
    setLoading(false)
  }

  const handleManualLocationSubmit = (lat: number, lon: number) => {
    setManualLocation({ lat, lon })
  }

  const handleContentPosted = () => {
    const currentLat = latitude || manualLocation.lat
    const currentLon = longitude || manualLocation.lon
    if (currentLat && currentLon) {
      fetchData(currentLat, currentLon)
      setUserStats((prev) => ({ ...prev, xp: prev.xp + 25 }))
    }
  }

  const handleLocationPurchased = (newLocation: any) => {
    setLocation(newLocation)
    setUserStats((prev) => ({
      ...prev,
      ownedLand: prev.ownedLand + 1,
      coins: prev.coins - 20,
      xp: prev.xp + 100,
    }))

    // Add to owned locations
    const newOwnedLocation: OwnedLocation = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLocation.name || `Location ${ownedLocations.length + 1}`,
      lat: newLocation.lat || (latitude || manualLocation.lat),
      lon: newLocation.lon || (longitude || manualLocation.lon),
      type: 'landmark'
    }
    setOwnedLocations(prev => [...prev, newOwnedLocation])
  }

  const handleFeaturePurchased = (updatedLocation: any) => {
    setLocation(updatedLocation)
  }

  const handleMapPointClick = (point: MapPoint) => {
    setSelectedMapPoint(point)
    // You can add navigation logic here
  }

  const handleMapUpdate = (bounds: { north: number; south: number; east: number; west: number }) => {
    // Handle map bounds update for fetching new content
    console.log('Map bounds updated:', bounds)
  }

  const toggleBuilderStatus = () => {
    setUserStats(prev => ({
      ...prev,
      isBuilder: !prev.isBuilder
    }))
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/landing" })
  }

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "rules":
        return <RulesPanel />
      case "leaderboard":
        return <Leaderboard />
      case "profile":
        return (
          <div className="p-4 pt-24">
            <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl text-white">
                      {session?.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <p className="font-semibold text-white">{session?.user?.name || 'Explorer'}</p>
                    <p className="text-sm text-gray-300">{session?.user?.email}</p>
                    <p className="font-semibold text-white mt-2">Level {userStats.level}</p>
                  </div>
                  
                  {/* Builder Status */}
                  <div className="text-center">
                    <Button
                      onClick={toggleBuilderStatus}
                      variant={userStats.isBuilder ? "default" : "outline"}
                      className={`w-full ${
                        userStats.isBuilder 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                          : 'border-orange-400/50 text-orange-300 hover:bg-orange-400/10'
                      }`}
                    >
                      <Hammer className="w-4 h-4 mr-2" />
                      {userStats.isBuilder ? 'Builder Mode Active' : 'Become a Builder'}
                    </Button>
                    {userStats.isBuilder && (
                      <p className="text-xs text-orange-300 mt-2">
                        You can now receive feature requests from other users
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-cyan-400">{userStats.xp}</p>
                      <p className="text-sm text-gray-300">Experience</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">${userStats.coins}</p>
                      <p className="text-sm text-gray-300">Coins</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{userStats.ownedLand}</p>
                      <p className="text-sm text-gray-300">Land Owned</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-400">{content.length}</p>
                      <p className="text-sm text-gray-300">Content Posted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "events":
        return (
          <div className="p-4 pt-24">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Nearby Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-300 mb-4">
                    Create and join location-based events with bounty rewards.
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Create Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default: // map
        return (
          <div className="p-4 pt-24">
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                Error: {error}
              </div>
            )}

            {permissionState === "granted" ? (
              <p className="mb-4 text-center text-white">
                📍 Your location: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
              </p>
            ) : (
              <div className="mb-4 text-center">
                <p className="mb-2 text-white">Geolocation permission: {permissionState || "unknown"}</p>
                {permissionState === "prompt" ? (
                  <Button
                    onClick={() => navigator.geolocation.getCurrentPosition(() => {})}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    📍 Allow Geolocation
                  </Button>
                ) : (
                  <ManualLocationInput onSubmit={handleManualLocationSubmit} />
                )}
              </div>
            )}

            {/* Simple Map Placeholder */}
            <div className="mb-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-cyan-400" />
                    Interactive Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] bg-gradient-to-br from-slate-800 to-blue-900 rounded-lg border border-white/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-xl mb-2">Map Coming Soon!</p>
                      <p className="text-gray-300">Interactive 3D map with location-based content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Point Info */}
            {selectedMapPoint && (
              <Card className="mb-6 bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Point Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{selectedMapPoint.title}</h3>
                    {selectedMapPoint.description && (
                      <p className="text-gray-300 mt-2">{selectedMapPoint.description}</p>
                    )}
                    <div className="mt-3 text-sm text-gray-400">
                      <p>Type: {selectedMapPoint.type}</p>
                      <p>Intensity: {selectedMapPoint.intensity.toFixed(2)}</p>
                      <p>Location: {selectedMapPoint.lat.toFixed(4)}, {selectedMapPoint.lon.toFixed(4)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Management */}
            {location && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl">
                  <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="text-white">Features</TabsTrigger>
                  <TabsTrigger value="content" className="text-white">Content</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <LocationInfo
                    location={location}
                    onPurchase={handleLocationPurchased}
                    lat={latitude || manualLocation.lat || 0}
                    lon={longitude || manualLocation.lon || 0}
                  />
                  <PostContent
                    latitude={latitude || manualLocation.lat || 0}
                    longitude={longitude || manualLocation.lon || 0}
                    onPost={handleContentPosted}
                    user={{ id: session?.user?.email || "user", name: session?.user?.name || "Explorer", avatar: session?.user?.image || "👤" }}
                  />
                </TabsContent>

                <TabsContent value="features">
                  <FeatureMarketplace
                    location={location}
                    lat={latitude || manualLocation.lat || 0}
                    lon={longitude || manualLocation.lon || 0}
                    onFeaturePurchased={handleFeaturePurchased}
                    userStats={userStats}
                  />
                </TabsContent>

                <TabsContent value="content">
                  {loading ? (
                    <div className="text-center py-8 text-white">Loading content...</div>
                  ) : (
                    <ContentList content={content} user={{ id: session?.user?.email || "user", name: session?.user?.name || "Explorer", avatar: session?.user?.image || "👤" }} location={location} />
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-cyan-400" />
                ThySpace
              </h1>
              <span className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                Dashboard
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="text-sm font-medium">Welcome, {session?.user?.name || 'Explorer'}!</p>
                <p className="text-xs text-gray-300">Level {userStats.level} • {userStats.xp} XP</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 flex-wrap justify-center">
            {[
              { id: "map", label: "Map", icon: MapPin, color: "from-blue-500 to-cyan-500" },
              { id: "profile", label: "Profile", icon: User, color: "from-purple-500 to-pink-500" },
              { id: "events", label: "Events", icon: Calendar, color: "from-orange-500 to-red-500" },
              { id: "rules", label: "Rules", icon: BookOpen, color: "from-green-500 to-emerald-500" },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy, color: "from-yellow-500 to-orange-500" },
            ].map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` 
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {renderMainContent()}
    </div>
  )
} 