"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Shield, Trash2, Check, X, Settings, AlertTriangle, Camera } from "lucide-react"

interface LandManagementProps {
  landData: any
  currentUser?: any
  onUpdate: (updatedLand: any) => void
}

export default function LandManagement({ landData, currentUser, onUpdate }: LandManagementProps) {
  const [activeTab, setActiveTab] = useState("overview") // overview, posts, rules, defense
  const [pendingPosts, setPendingPosts] = useState<any[]>([])
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [landRules, setLandRules] = useState(landData.rules || "")
  const [allowPublicPosts, setAllowPublicPosts] = useState(landData.allowPublicPosts ?? true)
  const [requireApproval, setRequireApproval] = useState(landData.requireApproval ?? false)
  const [defenseStatus, setDefenseStatus] = useState<any>(null)

  useEffect(() => {
    fetchPendingPosts()
    fetchAllPosts()
    fetchDefenseStatus()
  }, [])

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch(`/api/land/${landData.id}/pending-posts`)
      const data = await response.json()
      setPendingPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to fetch pending posts:", error)
    }
  }

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`/api/land/${landData.id}/posts`)
      const data = await response.json()
      setAllPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  const fetchDefenseStatus = async () => {
    try {
      const response = await fetch(`/api/land/${landData.id}/defense-status`)
      const data = await response.json()
      setDefenseStatus(data.status)
    } catch (error) {
      console.error("Failed to fetch defense status:", error)
    }
  }

  const approvePost = async (postId: string) => {
    try {
      await fetch(`/api/land/posts/${postId}/approve`, { method: "POST" })
      setPendingPosts((prev) => prev.filter((p) => p.id !== postId))
      fetchAllPosts()
    } catch (error) {
      console.error("Failed to approve post:", error)
    }
  }

  const rejectPost = async (postId: string) => {
    try {
      await fetch(`/api/land/posts/${postId}/reject`, { method: "POST" })
      setPendingPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Failed to reject post:", error)
    }
  }

  const deletePost = async (postId: string) => {
    try {
      await fetch(`/api/land/posts/${postId}`, { method: "DELETE" })
      setAllPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  const updateLandSettings = async () => {
    try {
      const response = await fetch(`/api/land/${landData.id}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rules: landRules,
          allowPublicPosts,
          requireApproval,
        }),
      })

      if (response.ok) {
        const updatedLand = { ...landData, rules: landRules, allowPublicPosts, requireApproval }
        onUpdate(updatedLand)
      }
    } catch (error) {
      console.error("Failed to update land settings:", error)
    }
  }

  const getDefenseLevel = () => {
    if (!defenseStatus) return 1
    const { lastPost, postCount } = defenseStatus
    const daysSinceLastPost = lastPost
      ? Math.floor((Date.now() - new Date(lastPost).getTime()) / (1000 * 60 * 60 * 24))
      : 999

    if (daysSinceLastPost > 7) return 1 // Weak defense
    if (daysSinceLastPost > 3) return 2 // Moderate defense
    if (postCount > 10) return 4 // Strong defense
    return 3 // Good defense
  }

  const getDefenseColor = (level: number) => {
    switch (level) {
      case 1:
        return "text-red-600 bg-red-100"
      case 2:
        return "text-orange-600 bg-orange-100"
      case 3:
        return "text-blue-600 bg-blue-100"
      case 4:
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const defenseLevel = getDefenseLevel()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-600" />
            <span>Managing: {landData.name}</span>
          </div>
          <Badge className={getDefenseColor(defenseLevel)}>
            <Shield className="w-3 h-3 mr-1" />
            Defense Level {defenseLevel}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          {[
            { id: "overview", label: "Overview", icon: Crown },
            { id: "posts", label: "Posts", icon: Camera },
            { id: "rules", label: "Rules", icon: Settings },
            { id: "defense", label: "Defense", icon: Shield },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center"
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
              {tab.id === "posts" && pendingPosts.length > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0">{pendingPosts.length}</Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Posts</span>
                  <span className="text-lg font-bold text-blue-600">{allPosts.length}</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Users</span>
                  <span className="text-lg font-bold text-green-600">{Math.floor(Math.random() * 20) + 5}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Land Information</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span>
                    {landData.latitude?.toFixed(4)}, {landData.longitude?.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Purchased:</span>
                  <span>{new Date(landData.purchasedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Public Posts:</span>
                  <span>{allowPublicPosts ? "Allowed" : "Restricted"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approval Required:</span>
                  <span>{requireApproval ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {pendingPosts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
                  Pending Approval ({pendingPosts.length})
                </h4>
                <div className="space-y-2">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.displayName} />
                            <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{post.author.displayName}</p>
                            <p className="text-xs text-gray-600">{post.caption}</p>
                            {post.type === "image" && (
                              <img
                                src={post.url || "/placeholder.svg"}
                                alt=""
                                className="mt-2 w-20 h-20 object-cover rounded"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => approvePost(post.id)}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => rejectPost(post.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">All Posts ({allPosts.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.displayName} />
                          <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{post.author.displayName}</p>
                          <p className="text-xs text-gray-600">{post.caption}</p>
                          <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => deletePost(post.id)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === "rules" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Land Rules</label>
              <Textarea
                value={landRules}
                onChange={(e) => setLandRules(e.target.value)}
                placeholder="Set rules for your land..."
                className="mt-1 h-20"
              />
            </div>

            <div className="space-y-3">
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

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={updateLandSettings}>
              Save Settings
            </Button>
          </div>
        )}

        {/* Defense Tab */}
        {activeTab === "defense" && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getDefenseColor(defenseLevel)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Defense Level {defenseLevel}</h4>
                  <p className="text-sm">
                    {defenseLevel === 1 && "Your land is vulnerable! Post content to strengthen defense."}
                    {defenseLevel === 2 && "Moderate defense. Keep posting to improve."}
                    {defenseLevel === 3 && "Good defense! Your land is well protected."}
                    {defenseLevel === 4 && "Excellent defense! Your land is highly secure."}
                  </p>
                </div>
                <Shield className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Defense Requirements</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Post content at least once per week</li>
                <li>• Engage with community posts</li>
                <li>• Maintain active moderation</li>
                <li>• Respond to land challenges</li>
              </ul>
            </div>

            {defenseStatus && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Defense Statistics</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Last Post:</span>
                    <span>
                      {defenseStatus.lastPost ? new Date(defenseStatus.lastPost).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Posts:</span>
                    <span>{defenseStatus.postCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Days:</span>
                    <span>{defenseStatus.activeDays || 0}</span>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Post Content to Defend</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
