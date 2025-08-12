"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, User, CheckCircle, AlertCircle } from "lucide-react"

interface ProfileCreationProps {
  latitude: number | null
  longitude: number | null
  onProfileCreated: (profile: any) => void
}

export default function ProfileCreation({ latitude, longitude, onProfileCreated }: ProfileCreationProps) {
  const [step, setStep] = useState(1) // 1: info, 2: photo verification, 3: complete
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [verificationPhoto, setVerificationPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera access to create your profile.")
      setIsCapturing(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    if (context) {
      context.drawImage(video, 0, 0)
      const photoData = canvas.toDataURL("image/jpeg", 0.8)
      setVerificationPhoto(photoData)

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      setIsCapturing(false)
    }
  }

  const retakePhoto = () => {
    setVerificationPhoto(null)
    startCamera()
  }

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      setError("Location is required to create a profile")
      return
    }

    if (!verificationPhoto) {
      setError("Photo verification is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const profileData = {
        username,
        displayName,
        bio,
        verificationPhoto,
        createdAt: new Date().toISOString(),
        location: {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        },
        verified: true,
        level: 1,
        points: 0,
      }

      const response = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error("Failed to create profile")
      }

      const result = await response.json()
      setStep(3)
      onProfileCreated(result.profile)
    } catch (err) {
      setError("Failed to create profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-emerald-600" />
            Create Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself"
              className="mt-1"
            />
          </div>

          {latitude && longitude && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>
                Creating profile at: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
            </div>
          )}

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setStep(2)}
            disabled={!username.trim() || !displayName.trim() || !latitude || !longitude}
          >
            Next: Photo Verification
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 2) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2 text-emerald-600" />
            Photo Verification Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>To create your profile, take a photo of something near your current location.</p>
            <p>This helps verify you're actually at this location and prevents fake profiles.</p>
          </div>

          {!isCapturing && !verificationPhoto && (
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          )}

          {isCapturing && (
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                <Badge className="absolute top-2 left-2 bg-red-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                  Recording
                </Badge>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={capturePhoto}>
                Capture Photo
              </Button>
            </div>
          )}

          {verificationPhoto && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={verificationPhoto || "/placeholder.svg"}
                  alt="Verification photo"
                  className="w-full rounded-lg"
                />
                <Badge className="absolute top-2 left-2 bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Photo Captured
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={retakePhoto}>
                  Retake
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Profile"}
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    )
  }

  if (step === 3) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Profile Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{displayName}</h3>
            <p className="text-gray-600">@{username}</p>
            {bio && <p className="text-sm text-gray-500">{bio}</p>}
          </div>

          <Badge className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Location Verified
          </Badge>

          <div className="text-sm text-gray-600">
            <p>Welcome to ThySpace! You can now:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Share photos and videos at locations</li>
              <li>Buy and defend virtual land</li>
              <li>Create and join events</li>
              <li>Earn points and level up</li>
            </ul>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => window.location.reload()}>
            Start Exploring
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
