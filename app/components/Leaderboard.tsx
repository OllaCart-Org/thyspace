"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Leaderboard() {
  const [activeBoard, setActiveBoard] = useState("xp")
  const [leaderboardData, setLeaderboardData] = useState({
    xp: [],
    coins: [],
    land: [],
    events: [],
  })

  useEffect(() => {
    // Simulate leaderboard data
    setLeaderboardData({
      xp: [
        { rank: 1, username: "LandLord_Mike", value: 15420, badge: "👑" },
        { rank: 2, username: "PhotoExplorer", value: 12890, badge: "📸" },
        { rank: 3, username: "EventMaster", value: 11250, badge: "🎉" },
        { rank: 4, username: "MapWanderer", value: 9870, badge: "🗺️" },
        { rank: 5, username: "ContentKing", value: 8940, badge: "✨" },
      ],
      coins: [
        { rank: 1, username: "BusinessTycoon", value: 2840, badge: "💰" },
        { rank: 2, username: "EventMaster", value: 2150, badge: "🎉" },
        { rank: 3, username: "LandLord_Mike", value: 1920, badge: "👑" },
        { rank: 4, username: "BountyHunter", value: 1680, badge: "🎯" },
        { rank: 5, username: "PhotoExplorer", value: 1450, badge: "📸" },
      ],
      land: [
        { rank: 1, username: "LandLord_Mike", value: 12, badge: "🏰" },
        { rank: 2, username: "TerritoryKing", value: 8, badge: "🗺️" },
        { rank: 3, username: "PropertyMogul", value: 6, badge: "🏢" },
        { rank: 4, username: "LandGrabber", value: 5, badge: "⛳" },
        { rank: 5, username: "AreaDefender", value: 4, badge: "🛡️" },
      ],
      events: [
        { rank: 1, username: "EventMaster", value: 47, badge: "🎪" },
        { rank: 2, username: "PartyPlanner", value: 32, badge: "🎉" },
        { rank: 3, username: "CommunityHost", value: 28, badge: "👥" },
        { rank: 4, username: "BountyCreator", value: 21, badge: "💎" },
        { rank: 5, username: "SocialButterfly", value: 19, badge: "🦋" },
      ],
    })
  }, [])

  const boards = [
    { id: "xp", label: "Experience", icon: "⭐", suffix: "XP" },
    { id: "coins", label: "Wealth", icon: "💰", suffix: "Coins" },
    { id: "land", label: "Land Owners", icon: "🏰", suffix: "Plots" },
    { id: "events", label: "Event Hosts", icon: "🎉", suffix: "Events" },
  ]

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">Leaderboards</h2>
        <p className="text-gray-600">See who's dominating ThySpace</p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {boards.map((board) => (
          <Button
            key={board.id}
            variant={activeBoard === board.id ? "default" : "outline"}
            onClick={() => setActiveBoard(board.id)}
            className={activeBoard === board.id ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <span className="mr-2">{board.icon}</span>
            {board.label}
          </Button>
        ))}
      </div>

      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-800 flex items-center">
            <span className="mr-2">{boards.find((b) => b.id === activeBoard)?.icon}</span>
            {boards.find((b) => b.id === activeBoard)?.label} Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {leaderboardData[activeBoard].map((player, index) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 border-b last:border-b-0 ${
                  index === 0 ? "bg-yellow-50" : index === 1 ? "bg-gray-50" : index === 2 ? "bg-orange-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                          ? "bg-gray-400 text-gray-900"
                          : index === 2
                            ? "bg-orange-400 text-orange-900"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {player.rank}
                  </div>
                  <span className="mr-2">{player.badge}</span>
                  <span className="font-semibold">{player.username}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600">
                    {player.value.toLocaleString()} {boards.find((b) => b.id === activeBoard)?.suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
