"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Users, Eye, Heart } from "lucide-react"

interface LiveStreamProps {
  latitude: number
  longitude: number
  locationName?: string
  currentUser?: any
}

export default function LiveStream({ latitude, longitude, locationName, currentUser }: LiveStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [viewers, setViewers] = useState(0)
  const [likes, setLikes] = useState(0)
  const [activeStreams, setActiveStreams] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    fetchActiveStreams()
    const interval = setInterval(fetchActiveStreams, 10000)
    return () => clearInterval(interval)
  }, [latitude, longitude])

  const fetchActiveStreams = async () => {
    try {
      const response = await fetch(`/api/streams/location?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      setActiveStreams(data.streams || [])
    } catch (error) {
      console.error("Failed to fetch active streams:", error)
    }
  }

  const startStream = async () => {
    if (!currentUser) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Start streaming to server
      const response = await fetch("/api/streams/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          title: `Live from ${locationName || "this location"}`,
          isVideoEnabled,
          isAudioEnabled,
        }),
      })

      if (response.ok) {
        setIsStreaming(true)
        // Simulate viewer count updates
        const viewerInterval = setInterval(() => {
          setViewers((prev) => prev + Math.floor(Math.random() * 3))
        }, 5000)

        return () => clearInterval(viewerInterval)
      }
    } catch (error) {
      console.error("Failed to start stream:", error)
    }
  }

  const stopStream = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    try {
      await fetch("/api/streams/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      })
    } catch (error) {
      console.error("Failed to stop stream:", error)
    }

    setIsStreaming(false)
    setViewers(0)
    setLikes(0)
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      }
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
        setIsAudioEnabled(!isAudioEnabled)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Your Stream */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Stream</span>
            {isStreaming && (
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  LIVE
                </Badge>
                <Badge variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  {viewers}
                </Badge>
                <Badge variant="outline">
                  <Heart className="w-3 h-3 mr-1" />
                  {likes}
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isStreaming ? (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted className="w-full h-48 object-cover" />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVideo}
                    className={!isVideoEnabled ? "bg-red-100 text-red-600" : ""}
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAudio}
                    className={!isAudioEnabled ? "bg-red-100 text-red-600" : ""}
                  >
                    {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={stopStream}>
                  End Stream
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Start a live stream to share what's happening at {locationName || "this location"}
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={startStream} disabled={!currentUser}>
                  <Video className="w-4 h-4 mr-2" />
                  Start Live Stream
                </Button>
                {!currentUser && <p className="text-xs text-gray-500 mt-2">Sign in to start streaming</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Streams */}
      {activeStreams.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-600" />
              Live Streams Nearby
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeStreams.map((stream) => (
              <div key={stream.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={stream.author.avatar || "/placeholder.svg"} alt={stream.author.displayName} />
                  <AvatarFallback>{stream.author.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{stream.author.displayName}</span>
                    <Badge className="bg-red-500 text-white text-xs">LIVE</Badge>
                  </div>
                  <p className="text-xs text-gray-600">{stream.title}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {stream.viewers}
                    </span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 500)}m away</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Watch
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
