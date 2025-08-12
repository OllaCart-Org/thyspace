"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Music, 
  ListTodo, 
  Ticket, 
  Hammer, 
  Plus, 
  DollarSign, 
  Lightbulb,
  Users,
  Calendar,
  Star
} from "lucide-react"

interface FeatureMarketplaceProps {
  location: any
  lat: number
  lon: number
  onFeaturePurchased: (location: any) => void
  userStats: {
    coins: number
    isBuilder: boolean
  }
}

interface FeatureRequest {
  id: string
  title: string
  description: string
  requester: string
  timestamp: number
  status: 'pending' | 'in-progress' | 'completed'
  builder?: string
}

export default function FeatureMarketplace({ 
  location, 
  lat, 
  lon, 
  onFeaturePurchased, 
  userStats 
}: FeatureMarketplaceProps) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<any>(null)
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([])
  const [newFeatureRequest, setNewFeatureRequest] = useState({
    title: '',
    description: '',
    budget: ''
  })

  // Initial features that are available for purchase
  const availableFeatures = [
    {
      id: 'playlist',
      name: 'Start a Playlist',
      description: 'Create and manage music playlists for your location',
      icon: Music,
      price: 25,
      color: 'from-purple-500 to-pink-500',
      benefits: ['Curate music for your space', 'Collaborative playlists', 'Mood-based selections']
    },
    {
      id: 'rules',
      name: 'Create Rules List',
      description: 'Set community guidelines and rules for your location',
      icon: ListTodo,
      price: 15,
      color: 'from-green-500 to-emerald-500',
      benefits: ['Community guidelines', 'Moderation tools', 'Custom rule sets']
    },
    {
      id: 'tickets',
      name: 'Sell Tickets',
      description: 'Sell event tickets and manage bookings',
      icon: Ticket,
      price: 35,
      color: 'from-orange-500 to-red-500',
      benefits: ['Event ticketing', 'Booking management', 'Revenue tracking']
    }
  ]

  const handleFeaturePurchase = (feature: any) => {
    setSelectedFeature(feature)
    setIsPurchaseModalOpen(true)
  }

  const confirmPurchase = () => {
    if (userStats.coins >= selectedFeature.price) {
      // Simulate purchase
      const updatedLocation = {
        ...location,
        features: [...(location.features || []), selectedFeature.id]
      }
      onFeaturePurchased(updatedLocation)
      setIsPurchaseModalOpen(false)
      setSelectedFeature(null)
    }
  }

  const submitFeatureRequest = () => {
    if (newFeatureRequest.title && newFeatureRequest.description) {
      const request: FeatureRequest = {
        id: Math.random().toString(36).substr(2, 9),
        title: newFeatureRequest.title,
        description: newFeatureRequest.description,
        requester: 'Current User',
        timestamp: Date.now(),
        status: 'pending'
      }
      
      setFeatureRequests(prev => [...prev, request])
      setNewFeatureRequest({ title: '', description: '', budget: '' })
      setIsBuildModalOpen(false)
    }
  }

  const claimFeatureRequest = (requestId: string) => {
    if (userStats.isBuilder) {
      setFeatureRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'in-progress', builder: 'Current User' }
            : req
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Available Features */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Available Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {availableFeatures.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card key={feature.id} className="bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all duration-300">
                <CardHeader className="text-center pb-3">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">{feature.name}</CardTitle>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {feature.price} coins
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <Star className="w-3 h-3 mr-2 text-yellow-400" />
                          {benefit}
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleFeaturePurchase(feature)}
                      className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white`}
                      disabled={userStats.coins < feature.price}
                    >
                      {userStats.coins >= feature.price ? 'Purchase Feature' : 'Insufficient Coins'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Build Custom Feature */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Build Custom Feature</h3>
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Need Something Custom?</h4>
              <p className="text-gray-300 mb-4">
                Suggest a new feature and builders in the community can implement it for you.
              </p>
              
              <Dialog open={isBuildModalOpen} onOpenChange={setIsBuildModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Custom Feature
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Request Custom Feature</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Describe the feature you'd like to see implemented at this location.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white">Feature Title</label>
                      <Input
                        value={newFeatureRequest.title}
                        onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Weather Integration"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white">Description</label>
                      <Textarea
                        value={newFeatureRequest.description}
                        onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this feature should do, how it should work, and any specific requirements..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white">Budget (Optional)</label>
                      <Input
                        value={newFeatureRequest.budget}
                        onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="e.g., 50-100 coins"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBuildModalOpen(false)} className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button onClick={submitFeatureRequest} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                      Submit Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Requests (for builders) */}
      {userStats.isBuilder && featureRequests.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Feature Requests</h3>
          <div className="space-y-4">
            {featureRequests.map((request) => (
              <Card key={request.id} className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{request.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            request.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-green-500/20 text-green-300 border-green-500/30'
                          }`}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Requested by: {request.requester}</span>
                        <span>•</span>
                        <span>{new Date(request.timestamp).toLocaleDateString()}</span>
                        {request.builder && (
                          <>
                            <span>•</span>
                            <span>Builder: {request.builder}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <Button
                        onClick={() => claimFeatureRequest(request.id)}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        <Hammer className="w-4 h-4 mr-2" />
                        Claim
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="bg-slate-800 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Purchase Feature</DialogTitle>
            <DialogDescription className="text-gray-300">
              Confirm your purchase of this feature for your location.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeature && (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-r ${selectedFeature.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <selectedFeature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{selectedFeature.name}</h3>
                <p className="text-gray-300">{selectedFeature.description}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Feature Cost:</span>
                  <span className="text-yellow-400 font-semibold">{selectedFeature.price} coins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Your Balance:</span>
                  <span className="text-cyan-400 font-semibold">{userStats.coins} coins</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/20 pt-2 mt-2">
                  <span className="text-white">Remaining:</span>
                  <span className={`font-semibold ${userStats.coins - selectedFeature.price >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {userStats.coins - selectedFeature.price} coins
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPurchaseModalOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={confirmPurchase}
              disabled={!selectedFeature || userStats.coins < selectedFeature.price}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
