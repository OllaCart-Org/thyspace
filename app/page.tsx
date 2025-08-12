"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to landing page since that's our home page
    router.push("/landing")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🔄</div>
        <p className="text-xl">Redirecting to ThySpace...</p>
      </div>
    </div>
  )
}
