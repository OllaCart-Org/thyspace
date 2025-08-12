"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Crown, Shield, DollarSign, MapPin, AlertTriangle, CheckCircle } from "lucide-react"

interface LandPurchaseProps {
  latitude: number
  longitude: number
  locationName?: string
  currentUser?: any
  onPurchaseComplete: (landData: any) => void
}

export default function LandPurchase({
  latitude,
  longitude,
  locationName,
  currentUser,
  onPurchaseComplete,
}: LandPurchaseProps) {
  const [step, setStep] = useState(1) // 1: confirm, 2: rules, 3: payment, 4: complete
  const [landRules, setLandRules] = useState("")
  const [landName, setLandName] = useState(locationName || "")
  const [allowPublicPosts, setAllowPublicPosts] = useState(true)
  const [requireApproval, setRequireApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const LAND_PRICE = 20

  const handlePurchase = async () => {
    if (!currentUser) {
      setError("You must be signed in to purchase land")
      return
    }

    setLoading(true)
    setError("")

    try {
      const landData = {
        latitude,
        longitude,
        name: landName,
        rules: landRules,
        allowPublicPosts,
        requireApproval,
        price: LAND_PRICE,
        ownerId: currentUser.id,
        ownerName: currentUser.displayName,
        purchasedAt: new Date().toISOString(),
        defenseLevel: 1,
        contentCount: 0,
      }

      const response = await fetch("/api/land/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landData),
      })

      if (!response.ok) {
        throw new Error("Failed to purchase land")
      }

      const result = await response.json()
      setStep(4)
      onPurchaseComplete(result.land)
    } catch (err) {
      setError("Failed to purchase land. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-600" />
            Purchase Virtual Land
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
            </div>
            <p className="text-sm text-gray-600">This location is available for purchase</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Land Price:</span>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">{LAND_PRICE}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">One-time purchase gives you permanent ownership</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">As a land owner, you can:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <Shield className="w-3 h-3 mr-2 text-blue-500" />
                Control who can post content
              </li>
              <li className="flex items-center">
                <Crown className="w-3 h-3 mr-2 text-yellow-500" />
                Set rules for your location
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                Moderate and delete posts
              </li>
              <li className="flex items-center">
                <AlertTriangle className="w-3 h-3 mr-2 text-orange-500" />
                Must defend with regular content
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-semibold">Defense Requirement:</p>
                <p>You must post content regularly to maintain ownership. Inactive land can be claimed by others.</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setStep(2)}
            disabled={!currentUser}
          >
            Continue Purchase
          </Button>

          {!currentUser && <p className="text-xs text-gray-500 text-center">Sign in to purchase land</p>}
        </CardContent>
      </Card>
    )
  }

  if (step === 2) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Set Land Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="landName">Location Name</Label>
            <Input
              id="landName"
              value={landName}
              onChange={(e) => setLandName(e.target.value)}
              placeholder="Give your land a name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="landRules">Land Rules (Optional)</Label>
            <Textarea
              id="landRules"
              value={landRules}
              onChange={(e) => setLandRules(e.target.value)}
              placeholder="Set rules for visitors (e.g., 'No spam', 'Family-friendly content only')"
              className="mt-1 h-20"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Content Settings:</h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow Public Posts</p>
                <p className="text-xs text-gray-600">Let anyone post content here</p>
              </div>
              <Button
                variant={allowPublicPosts ? "default" : "outline"}
                size="sm"
                onClick={() => setAllowPublicPosts(!allowPublicPosts)}
              >
                {allowPublicPosts ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require Approval</p>
                <p className="text-xs text-gray-600">Review posts before they appear</p>
              </div>
              <Button
                variant={requireApproval ? "default" : "outline"}
                size="sm"
                onClick={() => setRequireApproval(!requireApproval)}
              >
                {requireApproval ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep(3)}>
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
            Complete Purchase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Purchase Summary:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Location:</span>
                <span>{landName || "Unnamed Location"}</span>
              </div>
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span>
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Public Posts:</span>
                <span>{allowPublicPosts ? "Allowed" : "Restricted"}</span>
              </div>
              <div className="flex justify-between">
                <span>Approval Required:</span>
                <span>{requireApproval ? "Yes" : "No"}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-600">${LAND_PRICE}</span>
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
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handlePurchase} disabled={loading}>
              {loading ? "Processing..." : `Pay $${LAND_PRICE}`}
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
            Land Purchased Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto" />
            <h3 className="font-semibold text-lg">You now own this land!</h3>
            <p className="text-sm text-gray-600">{landName || "Your new location"} is now under your control</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Next Steps:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Start posting content to defend your land</li>
              <li>• Moderate posts from other users</li>
              <li>• Customize your land rules anytime</li>
              <li>• Earn points for active land management</li>
            </ul>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => window.location.reload()}>
            Start Managing Your Land
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
