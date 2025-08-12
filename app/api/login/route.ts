import { type NextRequest, NextResponse } from "next/server"

// Demo users for testing
const users = {
  demo: { id: "demo", username: "demo", password: "demo123" },
  user1: { id: "user1", username: "user1", password: "password1" },
  user2: { id: "user2", username: "user2", password: "password2" },
  alice: { id: "alice", username: "alice", password: "alice123" },
  bob: { id: "bob", username: "bob", password: "bob123" },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password }) // Debug log

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Find user by username
    const user = Object.values(users).find((u) => u.username === username && u.password === password)

    if (user) {
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    } else {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
