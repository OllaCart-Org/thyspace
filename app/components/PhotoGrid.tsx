"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, Trash2, MapPin } from "lucide-react"

export default function PhotoGrid({ content, user, location }) {
  const [likedPosts, setLikedPosts] = useState(new Set())

  const handleLike = (postId) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleDelete = async (contentId) => {
    if (!user || location?.owner !== user.id) {
      alert("You do not have permission to delete this content.")
      return
    }

    const response = await fetch("/api/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId }),
    })

    if (response.ok) {
      window.location.reload()
    }
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content here yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Be the first to share something at this location!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {content.map((item, index) => (
        <Card key={index} className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="p-0">
            {/* Media Content */}
            <div className="relative">
              {item.type === "image" ? (
                <img
                  src={item.url || "/placeholder.svg?height=400&width=600"}
                  alt="User content"
                  className="w-full h-auto max-h-96 object-cover"
                  loading="lazy"
                />
              ) : (
                <video src={item.url} controls className="w-full h-auto max-h-96 object-cover" preload="metadata" />
              )}
            </div>

            {/* Content Footer */}
            <div className="p-4">
              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(item.id)}
                    className={`p-2 ${likedPosts.has(item.id) ? "text-red-500" : "text-gray-500"}`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(item.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-gray-500">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-gray-500">
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
                {user && location?.owner === user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Caption */}
              {item.caption && <p className="text-gray-900 dark:text-white mb-2">{item.caption}</p>}

              {/* Timestamp */}
              <p className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
