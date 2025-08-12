"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContentList({ content, user, location }) {
  if (content.length === 0) {
    return <div className="mt-4">No content available for this location.</div>
  }

  const handleDelete = async (contentId) => {
    if (!user || location?.owner !== user.id) {
      alert("You do not have permission to delete this content.")
      return
    }

    // Implement delete functionality
    const response = await fetch("/api/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId }),
    })

    if (response.ok) {
      // Refresh content list
      window.location.reload()
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {content.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            {item.type === "image" ? (
              <img
                src={item.url || "/placeholder.svg"}
                alt="User content"
                className="w-full h-auto rounded-md"
                loading="lazy"
              />
            ) : (
              <video src={item.url} controls className="w-full h-auto rounded-md" preload="metadata" />
            )}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Posted on: {new Date(item.timestamp).toLocaleString()}</p>
              {user && location?.owner === user.id && (
                <Button onClick={() => handleDelete(item.id)} variant="destructive" size="sm">
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
