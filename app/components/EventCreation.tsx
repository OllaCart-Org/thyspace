"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, DollarSign, AlertTriangle, CheckCircle } from "lucide-react"

interface EventCreationProps {
  latitude: number
  longitude: number
  currentUser?: any
  onEventCreated: (eventData: any) => void
}

export default function EventCreation({ latitude, longitude, currentUser, onEventCreated }: EventCreationProps) {
  const [step, setStep] = useState(1) // 1: details, 2: bounty, 3: payment, 4: complete
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventDuration, setEventDuration] = useState(60) // minutes
  const [bountyAmount, setBountyAmount] = useState(50)
  const [broadcastRadius, setBroadcastRadius] = useState(500) // meters
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const calculateCosts = () => {
    const baseCost = 10 // Base event creation cost
    const radiusCost = Math.floor(broadcastRadius / 100) * 2 // $2 per 100m radius
    const durationCost = Math.floor(eventDuration / 30) * 5 // $5 per 30min
    const totalCost = baseCost + radiusCost + durationCost + bountyAmount

    return {
      baseCost,
      radiusCost,
      durationCost,
      bountyAmount,
      totalCost,
    }
  }

  const estimateParticipants = () => {
    // Rough estimate based on radius
    const area = Math.PI * Math.pow(broadcastRadius / 1000, 2) // km²
    const density = 50 // people per km² (rough urban estimate)
    return Math.floor(area * density * 0.1) // 10% participation rate
  }

  const handleCreateEvent = async () => {
    if (!currentUser) {
      setError("You must be signed in to create events")
      return
    }

    setLoading(true)
    setError("")

    try {
      const costs = calculateCosts()
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        duration: eventDuration,
        latitude,
        longitude,
        bountyAmount,
        broadcastRadius,
        creatorId: currentUser.id,
        creatorName: currentUser.displayName,
        costs,
        estimatedParticipants: estimateParticipants(),
        createdAt: new Date().toISOString(),
        status: "upcoming",
      }

      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const result = await response.json()
      setStep(4)
      onEventCreated(result.event)
    } catch (err) {
      setError("Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const costs = calculateCosts()
  const estimatedParticipants = estimateParticipants()

  if (step === 1) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Create Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Event Title</Label>
            <Input
              id="eventTitle"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="What's happening?"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Tell people about your event..."
              className="mt-1 h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="eventDuration">Duration (minutes)</Label>
            <Input
              id="eventDuration"
              type="number"
              value={eventDuration}
              onChange={(e) => setEventDuration(Number(e.target.value))}
              min="15"
              max="480"
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>
              Event location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => setStep(2)}
            disabled={!eventTitle.trim() || !eventDate || !eventTime}
          >
            Next: Set Bounty
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
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Set Bounty & Radius
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bountyAmount">Bounty Pool ($)</Label>
            <Input
              id="bountyAmount"
              type="number"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(Number(e.target.value))}
              min="10"
              max="1000"
              className="mt-1"
            />
            <p className="text-xs text-gray-600 mt-1">This amount will be split among all participants in the area</p>
          </div>

          <div>
            <Label htmlFor="broadcastRadius">Broadcast Radius (meters)</Label>
            <Input
              id="broadcastRadius"
              type="number"
              value={broadcastRadius}
              onChange={(e) => setBroadcastRadius(Number(e.target.value))}
              min="100"
              max="2000"
              step="100"
              className="mt-1"
            />
            <p className="text-xs text-gray-600 mt-1">People within this radius will see your event and earn bounty</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Event Estimates:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Estimated participants:</span>
                <span className="font-medium">{estimatedParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span>Bounty per person:</span>
                <span className="font-medium text-green-600">
                  ${estimatedParticipants > 0 ? (bountyAmount / estimatedParticipants).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Coverage area:</span>
                <span className="font-medium">{(Math.PI * Math.pow(broadcastRadius / 1000, 2)).toFixed(2)} km²</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-semibold">How it works:</p>
                <p>Everyone within the radius during your event gets an equal share of the bounty pool.</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 3) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Cost Breakdown:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Base event fee:</span>
                <span>${costs.baseCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Radius cost ({broadcastRadius}m):</span>
                <span>${costs.radiusCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration cost ({eventDuration}min):</span>
                <span>${costs.durationCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Bounty pool:</span>
                <span>${costs.bountyAmount}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${costs.totalCost}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Event Summary:</h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Title:</strong> {eventTitle}
              </div>
              <div>
                <strong>Date:</strong> {eventDate} at {eventTime}
              </div>
              <div>
                <strong>Duration:</strong> {eventDuration} minutes
              </div>
              <div>
                <strong>Radius:</strong> {broadcastRadius}m
              </div>
              <div>
                <strong>Est. participants:</strong> {estimatedParticipants}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This is a demo. In a real app, this would integrate with a payment processor.
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleCreateEvent} disabled={loading}>
              {loading ? "Creating..." : `Pay $${costs.totalCost}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 4) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Event Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <Calendar className="w-12 h-12 text-purple-500 mx-auto" />
            <h3 className="font-semibold text-lg">{eventTitle}</h3>
            <p className="text-sm text-gray-600">Your event is now live and broadcasting to the area!</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">What happens next:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• People in your area will see the event notification</li>
              <li>• Participants earn bounty by being present during the event</li>
              <li>• You can track participation and engagement</li>
              <li>• Bounty is automatically distributed after the event</li>
            </ul>
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => window.location.reload()}>
            View Your Event
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
