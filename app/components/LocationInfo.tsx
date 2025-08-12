"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LocationInfo({ location, onPurchase, lat, lon }) {
  const handlePurchase = async () => {
    const formData = new FormData()
    formData.append("lat", lat.toString())
    formData.append("lon", lon.toString())
    formData.append("action", "buy")

    const response = await fetch("/api/content", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      onPurchase(data.location)
    }
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Location Info</CardTitle>
        <CardDescription>{location.owner ? `Owned by ${location.owner}` : "Available for purchase"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-semibold">${location.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Computational Draw</p>
            <p className="text-lg">{location.computationalDraw.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Horizontal Land</p>
            <p className="text-lg">{location.horizontalLand.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Virtual Height</p>
            <p className="text-lg">{location.virtualHeight.toFixed(1)}</p>
          </div>
        </div>

        {location.features && location.features.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Active Features</p>
            <div className="flex flex-wrap gap-2">
              {location.features.map((featureId) => (
                <Badge key={featureId} variant="outline">
                  {featureId.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!location.owner && (
          <Button onClick={handlePurchase} className="w-full">
            Purchase Location
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
