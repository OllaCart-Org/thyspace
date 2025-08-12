"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ImageIcon, Type, X } from "lucide-react"

export default function PostContent({ latitude, longitude, onPost, user }) {
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [postType, setPostType] = useState("photo") // "photo" or "text"
  const [textContent, setTextContent] = useState("")
  const [preview, setPreview] = useState(null)
  const [isPosting, setIsPosting] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!latitude || !longitude) return
    if (!user) {
      alert("Please log in to post content.")
      return
    }

    if (postType === "photo" && !file) return
    if (postType === "text" && !textContent.trim()) return

    setIsPosting(true)

    try {
      const formData = new FormData()
      if (postType === "photo") {
        formData.append("file", file)
        formData.append("caption", caption)
      } else {
        formData.append("textContent", textContent)
      }
      formData.append("lat", latitude.toString())
      formData.append("lon", longitude.toString())
      formData.append("userId", user.id)
      formData.append("type", postType)

      const response = await fetch("/api/content", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setFile(null)
        setCaption("")
        setTextContent("")
        setPreview(null)
        onPost()
      }
    } catch (error) {
      console.error("Failed to post content:", error)
    } finally {
      setIsPosting(false)
    }
  }

  const clearPreview = () => {
    setFile(null)
    setPreview(null)
  }

  if (!user) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please log in to share content.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Post Type Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={postType === "photo" ? "default" : "outline"}
              onClick={() => setPostType("photo")}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Photo/Video
            </Button>
            <Button
              variant={postType === "text" ? "default" : "outline"}
              onClick={() => setPostType("text")}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-2" />
              Text Post
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {postType === "photo" ? (
              <>
                {/* File Upload */}
                {!preview && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Choose a photo or video to share</p>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}

                {/* Preview */}
                {preview && (
                  <div className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={clearPreview}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Caption */}
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </>
            ) : (
              /* Text Content */
              <Textarea
                placeholder="What's happening at this location?"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                required
              />
            )}

            <Button
              type="submit"
              disabled={isPosting || (postType === "photo" && !file) || (postType === "text" && !textContent.trim())}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isPosting ? "Posting..." : "Share"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
