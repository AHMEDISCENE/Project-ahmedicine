"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { HeroSection } from "@/components/hero-section"
import { RecentEntries } from "@/components/recent-entries"
import { AnalyticsTeaser } from "@/components/analytics-teaser"
import { Activity, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [configError, setConfigError] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  // Fix hydration issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMounted(true)
    }
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setConfigError(true)
      setIsLoading(false)
      return
    }

    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          // If no session, redirect to auth page
          router.push("/auth")
          return
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user)
            await fetchUserProfile(session.user.id)
          } else {
            setUser(null)
            setProfile(null)
            router.push("/auth") // Redirect to auth page on sign out
          }
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [hasMounted, router])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Profile fetch error:", error)
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  // Show configuration error
  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="w-full max-w-2xl">
          <Card className="glass-panel border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
              </div>
              <CardTitle className="text-3xl">Setup Required</CardTitle>
              <CardDescription className="text-lg">
                Welcome to VetOncoData! Let's get your environment configured.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="text-red-500">Missing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    <span className="text-red-500">Missing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SUPABASE_SERVICE_ROLE_KEY</span>
                    <span className="text-amber-500">Server-only</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Quick Setup:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Create a Supabase project at supabase.com</li>
                  <li>Copy your project URL and anon key</li>
                  <li>Add them to your Vercel environment variables</li>
                  <li>Run the database setup script</li>
                  <li>Deploy and enjoy!</li>
                </ol>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Open Supabase Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Activity className="h-12 w-12 text-teal-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is null after loading, it means they are not authenticated,
  // and the useEffect should have redirected them. This return null
  // prevents rendering content before the redirect happens.
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <HeroSection onNewCase={() => router.push("/new-case")} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentEntries />
          </div>
          <div>
            <AnalyticsTeaser />
          </div>
        </div>
      </main>
    </div>
  )
}
