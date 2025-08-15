import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "VetOncoData",
  description: "Veterinary Oncology Data Management Platform",
    generator: 'v0.app'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = headers()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let user = null
  let profile = null

  if (session?.user) {
    user = session.user
    const { data: fetchedProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = fetchedProfile
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navigation user={user} profile={profile} />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
