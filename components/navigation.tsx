"use client"

import { Button } from "@/components/ui/button"
import { Activity, Settings, PlusCircle, FileText, Lightbulb, FolderOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface NavigationProps {
  activeSection: "dashboard" | "new-case" | "case-records" | "form-builder" | "insights" | "reports" | "settings"
  setActiveSection: (
    section: "dashboard" | "new-case" | "case-records" | "form-builder" | "insights" | "reports" | "settings",
  ) => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-teal-600 dark:text-teal-500" />
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">VetOncoData</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            onClick={() => setActiveSection("dashboard")}
            className={
              activeSection === "dashboard"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            Dashboard
          </Button>
          <Button
            variant={activeSection === "new-case" ? "default" : "ghost"}
            onClick={() => setActiveSection("new-case")}
            className={
              activeSection === "new-case"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Case
          </Button>
          <Button
            variant={activeSection === "case-records" ? "default" : "ghost"}
            onClick={() => setActiveSection("case-records")}
            className={
              activeSection === "case-records"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Case Records
          </Button>
          <Button
            variant={activeSection === "form-builder" ? "default" : "ghost"}
            onClick={() => setActiveSection("form-builder")}
            className={
              activeSection === "form-builder"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            Form Builder
          </Button>
          <Button
            variant={activeSection === "insights" ? "default" : "ghost"}
            onClick={() => setActiveSection("insights")}
            className={
              activeSection === "insights"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </Button>
          <Button
            variant={activeSection === "reports" ? "default" : "ghost"}
            onClick={() => setActiveSection("reports")}
            className={
              activeSection === "reports"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            onClick={() => setActiveSection("settings")}
            className={
              activeSection === "settings"
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
          >
            <Link href="/auth">Sign Out</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
