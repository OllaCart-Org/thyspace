import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiting for development
const requests = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit = 10, windowMs = 10000): boolean {
  const now = Date.now()
  const userRequests = requests.get(ip)

  if (!userRequests || now > userRequests.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userRequests.count >= limit) {
    return false
  }

  userRequests.count++
  return true
}

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"

  // Apply rate limiting
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })
  }

  const res = NextResponse.next()

  // CORS headers - allowing all origins for development
  res.headers.append("Access-Control-Allow-Origin", "*")
  res.headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return res
}

export const config = {
  matcher: "/api/:path*",
}
