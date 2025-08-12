"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, MoreHorizontal } from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  caption: string
  author: {
    username: string
    displayName: string
    avatar: string
    verified: boolean
  }
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
  location: {
    latitude: number
    longitude: number
    name?: string
  }
}

interface LocationMediaViewerProps {
  latitude: number
  longitude: number
  locationName?: string
}

export default function LocationMediaViewer({ latitude, longitude, locationName }: LocationMediaViewerProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchLocationMedia()
  }, [latitude, longitude])

  const fetchLocationMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/media/location?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error("Failed to fetch location media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/media/${mediaId}/like`, {
        method: "POST",
      })
      if (response.ok) {
        setMedia((prev) =>
          prev.map((item) =>
            item.id === mediaId
              ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
              : item,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to like media:", error)
    }
  }

  const toggleVideoPlay = (mediaId: string) => {
    setPlayingVideo((prev) => (prev === mediaId ? null : mediaId))
  }

  const toggleVideoMute = (mediaId: string) => {
    setMutedVideos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(mediaId)) {
        newSet.delete(mediaId)
      } else {
        newSet.add(mediaId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
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
        <CardTitle className="flex items-center justify-between">
          <span>Media at {locationName || "This Location"}</span>
          <Badge variant="outline">{media.length} posts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {media.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No media shared at this location yet.</p>
            <p className="text-sm mt-1">Be the first to share something!</p>
          </div>
        ) : (
          media.map((item) => (
            <div key={item.id} className="space-y-3">
              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.author.avatar || "/placeholder.svg"} alt={item.author.displayName} />
                    <AvatarFallback>{item.author.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm">{item.author.displayName}</span>
                      {item.author.verified && <Badge className="bg-blue-500 text-white text-xs px-1 py-0">✓</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">@{item.author.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Media content */}
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                {item.type === "image" ? (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.caption}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={item.url}
                      className="w-full h-auto max-h-96 object-cover"
                      controls={false}
                      muted={mutedVideos.has(item.id)}
                      autoPlay={playingVideo === item.id}
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => toggleVideoPlay(item.id)}
                      >
                        {playingVideo === item.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                      onClick={() => toggleVideoMute(item.id)}
                    >
                      {mutedVideos.has(item.id) ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>

              {/* Caption */}
              {item.caption && <p className="text-sm text-gray-700">{item.caption}</p>}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 ${item.isLiked ? "text-red-500" : "text-gray-500"}`}
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${item.isLiked ? "fill-current" : ""}`} />
                    {item.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {item.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
