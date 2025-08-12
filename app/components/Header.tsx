"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userStats?: {
    level: number
    xp: number
    coins: number
    ownedLand: number
  }
}

export default function Header({ activeTab, onTabChange, userStats }: HeaderProps) {
  const tabs = [
    { id: "map", label: "Map", icon: "🗺️" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "events", label: "Events", icon: "🎉" },
    { id: "rules", label: "Rules", icon: "📋" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  ]

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">ThySpace</h1>
          {userStats && (
            <Card className="bg-green-700/50 border-green-500">
              <CardContent className="p-3">
                <div className="flex gap-4 text-sm">
                  <span>Level {userStats.level}</span>
                  <span>{userStats.xp} XP</span>
                  <span>${userStats.coins}</span>
                  <span>{userStats.ownedLand} Land</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <nav className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className="text-white hover:bg-green-700"
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}
