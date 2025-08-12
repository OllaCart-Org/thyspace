"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Users, MapPin, Mic, MicOff } from "lucide-react"

interface ChatMessage {
  id: string
  author: {
    username: string
    displayName: string
    avatar: string
    verified: boolean
  }
  message: string
  timestamp: string
  type: "text" | "system" | "location_join" | "location_leave"
}

interface LocationChatProps {
  latitude: number
  longitude: number
  locationName?: string
  currentUser?: any
}

export default function LocationChat({ latitude, longitude, locationName, currentUser }: LocationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    connectToLocationChat()
    fetchActiveUsers()

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        addRandomMessage()
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      disconnectFromLocationChat()
    }
  }, [latitude, longitude])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const connectToLocationChat = async () => {
    try {
      const response = await fetch("/api/chat/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      })

      if (response.ok) {
        setIsConnected(true)
        fetchMessages()

        // Add join message
        if (currentUser) {
          addSystemMessage(`${currentUser.displayName} joined the conversation`)
        }
      }
    } catch (error) {
      console.error("Failed to connect to location chat:", error)
    }
  }

  const disconnectFromLocationChat = async () => {
    if (currentUser) {
      addSystemMessage(`${currentUser.displayName} left the conversation`)
    }
    setIsConnected(false)
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch(`/api/chat/users?lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      setActiveUsers(data.users || [])
    } catch (error) {
      console.error("Failed to fetch active users:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return

    const message = {
      id: Date.now().toString(),
      author: currentUser,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text" as const,
    }

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...message,
          latitude,
          longitude,
        }),
      })

      if (response.ok) {
        setMessages((prev) => [...prev, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const addSystemMessage = (text: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      author: {
        username: "system",
        displayName: "System",
        avatar: "",
        verified: false,
      },
      message: text,
      timestamp: new Date().toISOString(),
      type: "system",
    }
    setMessages((prev) => [...prev, systemMessage])
  }

  const addRandomMessage = () => {
    const randomMessages = [
      "Anyone else see that amazing sunset?",
      "Great spot for photos!",
      "Love this location",
      "First time here, any recommendations?",
      "The view from here is incredible",
    ]

    const randomUsers = [
      { username: "explorer1", displayName: "Alex Explorer", avatar: "/placeholder.svg", verified: false },
      { username: "photographer", displayName: "Sarah Photos", avatar: "/placeholder.svg", verified: true },
      { username: "local_guide", displayName: "Mike Local", avatar: "/placeholder.svg", verified: false },
    ]

    const randomMessage: ChatMessage = {
      id: Date.now().toString(),
      author: randomUsers[Math.floor(Math.random() * randomUsers.length)],
      message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages((prev) => [...prev, randomMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice message recording
  }

  return (
    <Card className="w-full h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Chat at {locationName || "This Location"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {activeUsers.length} here
            </Badge>
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-2 ${msg.type === "system" ? "justify-center" : ""}`}>
              {msg.type === "system" ? (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{msg.message}</div>
              ) : (
                <>
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage src={msg.author.avatar || "/placeholder.svg"} alt={msg.author.displayName} />
                    <AvatarFallback className="text-xs">{msg.author.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-semibold text-gray-900">{msg.author.displayName}</span>
                      {msg.author.verified && <Badge className="bg-blue-500 text-white text-xs px-1 py-0 h-4">✓</Badge>}
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 break-words">{msg.message}</p>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentUser ? "Type a message..." : "Sign in to chat"}
              disabled={!currentUser || !isConnected}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRecording}
              disabled={!currentUser || !isConnected}
              className={isRecording ? "bg-red-100 text-red-600" : ""}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !currentUser || !isConnected}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
