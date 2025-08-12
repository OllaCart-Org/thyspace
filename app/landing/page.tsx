"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Camera, Users, Shield, Zap, Globe, Star, Compass, Mountain, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Map-like grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-400/20 rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-cyan-400/20 rounded-lg opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-indigo-400/20 transform rotate-45 opacity-25 animate-pulse delay-2000" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">ThySpace</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Floating icons above title */}
            <div className="flex justify-center space-x-8 mb-8 opacity-60">
              <Compass className="w-8 h-8 text-cyan-400 animate-bounce" />
              <Mountain className="w-8 h-8 text-blue-400 animate-bounce delay-100" />
              <Star className="w-8 h-8 text-indigo-400 animate-bounce delay-200" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-100 mb-6 leading-tight">
              Discover Your World
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">One Location at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              ThySpace is the ultimate location-based social platform where you can explore, share, and connect with the world around you. Every place has a story - start writing yours today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link href="/here">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                  Start Exploring Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg font-semibold border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="text-center">
              <p className="text-gray-400 mb-4">Trusted by explorers worldwide</p>
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <span>🌍 50+ Countries</span>
                <span>📱 1K+ Users</span>
                <span>📍 1M+ Locations</span>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-16">
            Why Choose ThySpace?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Location-Based Discovery</h3>
                <p className="text-gray-300 leading-relaxed">
                  Explore content tied to real-world locations. Discover hidden gems and local stories wherever you go.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Rich Media Sharing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Share photos, videos, and stories with stunning quality. Every moment becomes a memory worth sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Community Building</h3>
                <p className="text-gray-300 leading-relaxed">
                  Connect with people in your area. Build meaningful relationships through shared experiences and locations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Virtual Land Ownership</h3>
                <p className="text-gray-300 leading-relaxed">
                  Own and control virtual locations. Set rules, moderate content, and create your own digital spaces.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Exploration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Discover content within a 2km radius. Find events, landmarks, and stories happening right now.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Global Community</h3>
                <p className="text-gray-300 leading-relaxed">
                  Connect with people worldwide while staying rooted in your local community. The world is your playground.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Sign Up & Explore</h3>
              <p className="text-gray-300">
                Create your account and start exploring the world around you. Discover content from other users in your area.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Share Your Story</h3>
              <p className="text-gray-300">
                Capture moments and share them with the world. Every photo, video, or story adds to the global tapestry.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Connect & Grow</h3>
              <p className="text-gray-300">
                Build your community, own virtual land, and level up as you explore. The more you discover, the more you grow.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of explorers who are already discovering the world one location at a time. Your next adventure is just a sign-up away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/here">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                  Start Exploring Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-12 py-5 text-xl font-semibold border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300">
                  I Already Have an Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/40 backdrop-blur-xl border-t border-cyan-400/20 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <MapPin className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">ThySpace</span>
            </div>
            <p className="text-gray-400 mb-6">
              Discover the world, one location at a time. Connect, explore, and share your story with the global community.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <Link href="/about" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                About
              </Link>
              <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                Contact
              </Link>
            </div>
            <p className="text-gray-500">&copy; 2024 ThySpace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
