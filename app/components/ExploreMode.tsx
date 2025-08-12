"use client"

import { useState, useEffect } from "react"
import ContentList from "../components/ContentList"

export default function ExploreMode({ latitude, longitude }) {
  const [nearbyContent, setNearbyContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyContent()
    }
  }, [latitude, longitude])

  const fetchNearbyContent = async () => {
    setLoading(true)
    const response = await fetch(`/api/explore?lat=${latitude}&lon=${longitude}`)
    const data = await response.json()
    setNearbyContent(data.content)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading nearby content...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Explore Nearby (2000m radius)</h2>
      <ContentList content={nearbyContent} />
    </div>
  )
}
