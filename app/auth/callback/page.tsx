"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Activity, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
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

    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setStatus("error")
          setMessage(error.message)
          return
        }

        if (data.session) {
          // Create or update user profile
          const user = data.session.user
          const { error: profileError } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || "",
              clinic_code: user.user_metadata?.clinic_code || "",
              role: user.user_metadata?.role || "user",
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "id",
            },
          )

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }

          setStatus("success")
          setMessage("Email confirmed successfully! Redirecting...")

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("No session found. Please try signing in again.")
        }
      } catch (error: any) {
        console.error("Callback handling error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router, hasMounted])

  // Don't render until mounted to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md glass-panel border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
            {status === "loading" && <Activity className="w-8 h-8 text-teal-600 animate-pulse" />}
            {status === "success" && (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle>
            {status === "loading" && "Confirming Email..."}
            {status === "success" && "Email Confirmed!"}
            {status === "error" && "Confirmation Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "error" && (
            <div className="text-center space-y-4">
              <Button onClick={() => router.push("/auth")} className="w-full bg-teal-600 hover:bg-teal-700">
                Back to Sign In
              </Button>
            </div>
          )}
          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">You will be redirected automatically...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
