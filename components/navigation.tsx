"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Activity, Settings, PlusCircle, FileText, Lightbulb, FolderOpen, Menu, LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { supabase } from "@/lib/supabase" // Import supabase for client-side sign out
import { useRouter } from "next/navigation" // Import useRouter for client-side navigation
import { toast } from "@/hooks/use-toast" // Import toast for notifications

interface NavigationProps {
  user: any // Supabase user object
  profile: any // User profile from your 'profiles' table
}

export function Navigation({ user, profile }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      })
      router.push("/auth") // Redirect to auth page after sign out
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/", icon: null },
    { id: "new-case", label: "New Case", href: "/new-case", icon: PlusCircle },
    { id: "case-records", label: "Case Records", href: "/case-records", icon: FolderOpen },
    { id: "analytics", label: "Analytics", href: "/analytics", icon: FileText },
    { id: "insights", label: "Insights", href: "/insights", icon: Lightbulb },
    { id: "reports", label: "Reports", href: "/reports", icon: FileText },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ]

  const NavButton = ({ item, mobile = false }: { item: any; mobile?: boolean }) => {
    const Icon = item.icon
    // Determine if the current path matches the item's href for active state
    const isActive = router.pathname === item.href || (item.href === "/" && router.pathname === "/dashboard") // Handle root path for dashboard

    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        asChild
        onClick={() => {
          if (mobile) setIsMobileMenuOpen(false)
        }}
        className={`${
          isActive
            ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
        } ${mobile ? "w-full justify-start" : ""}`}
      >
        <Link href={item.href}>
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {item.label}
        </Link>
      </Button>
    )
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-teal-600 dark:text-teal-500" />
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">VetOncoData</span>
        </div>

        {/* Desktop Navigation - Centered */}
        {user && (
          <div className="hidden md:flex items-center justify-center flex-1 space-x-2 mx-8">
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{profile?.full_name || user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <Activity className="h-6 w-6 text-teal-600 dark:text-teal-500" />
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">VetOncoData</span>
                </div>

                {user && (
                  <>
                    {navItems.map((item) => (
                      <NavButton key={item.id} item={item} mobile />
                    ))}

                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 mb-4">
                        <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {profile?.full_name || user.email}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full justify-start border-slate-300/50 dark:border-slate-600/50 bg-transparent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}

                {!user && (
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                      <Link href="/auth">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
