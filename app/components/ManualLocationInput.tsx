"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManualLocationInput({ onSubmit }) {
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (lat && lon) {
      const latitude = Number.parseFloat(lat)
      const longitude = Number.parseFloat(lon)
      if (!isNaN(latitude) && !isNaN(longitude)) {
        onSubmit(latitude, longitude)
      }
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">Or enter your location manually:</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Latitude (e.g., 40.7128)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            step="any"
            required
          />
          <Input
            type="number"
            placeholder="Longitude (e.g., -74.0060)"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            step="any"
            required
          />
        </div>
        <Button type="submit">Set Location</Button>
      </form>
    </div>
  )
}
