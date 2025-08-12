"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RulesPanel() {
  const rules = [
    {
      title: "Land Ownership",
      content: [
        "All locations cost $20 to purchase",
        "Land owners control content posted to their location",
        "Owners can delete posts and set location rules",
        "Defend your land by posting content regularly",
        "Abandoned land (no posts for 30 days) becomes available",
      ],
    },
    {
      title: "Content & Posting",
      content: [
        "Take a photo at your location to create a profile",
        "Post photos, videos, and text to locations",
        "Respect land owner rules and guidelines",
        "No spam, harassment, or inappropriate content",
        "Quality content earns more XP and rewards",
      ],
    },
    {
      title: "Events & Bounties",
      content: [
        "Create events by paying to broadcast to an area",
        "50% of event bounty is distributed to participants",
        "Join events in your area to earn rewards",
        "Event creators set participation requirements",
        "Bounties are split equally among eligible participants",
      ],
    },
    {
      title: "Gamification",
      content: [
        "Earn XP by posting content, joining events, and interacting",
        "Level up to unlock new features and abilities",
        "Collect coins through events, land ownership, and activities",
        "Compete on leaderboards for additional rewards",
        "Achievements unlock special badges and bonuses",
      ],
    },
    {
      title: "Community Guidelines",
      content: [
        "Be respectful to other users and land owners",
        "Follow local laws and regulations",
        "Report inappropriate content or behavior",
        "Help maintain a positive community environment",
        "Collaborate and engage with others in your area",
      ],
    },
  ]

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">ThySpace Rules & Guidelines</h2>
        <p className="text-gray-600">Learn how to make the most of your location-based social experience</p>
      </div>

      {rules.map((section, index) => (
        <Card key={index} className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {section.content.map((rule, ruleIndex) => (
                <li key={ruleIndex} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Ready to Start?</h3>
          <p className="text-gray-700">
            Take a photo at your current location to create your profile and begin exploring ThySpace!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
