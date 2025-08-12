"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogIn, LogOut } from "lucide-react"

export default function AccountSystem({ user, setUser }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setUser(data)
      setUsername("")
      setPassword("")
      setShowLogin(false)
      setError("")
    } catch (error) {
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setError("")
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm">
          <User className="w-4 h-4" />
          <span>Welcome, {user.username}!</span>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    )
  }

  if (!showLogin) {
    return (
      <Button onClick={() => setShowLogin(true)} variant="outline" size="sm">
        <LogIn className="w-4 h-4 mr-1" />
        Login
      </Button>
    )
  }

  return (
    <Card className="absolute top-16 right-4 z-50 w-80">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Login to ThySpace</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowLogin(false)}>
              ×
            </Button>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

          <div className="bg-blue-50 p-3 rounded text-sm">
            <p className="font-medium mb-1">Demo Accounts:</p>
            <p>
              Username: <code>demo</code> Password: <code>demo123</code>
            </p>
            <p>
              Username: <code>user1</code> Password: <code>password1</code>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
