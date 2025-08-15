"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter for client-side navigation

export function AnalyticsTeaser() {
  const router = useRouter()

  return (
    <Card className="glass-panel shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Analytics Overview</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">Quick insights from your data</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6">
          <BarChart className="w-20 h-20 text-teal-500 dark:text-teal-600 opacity-70" />
        </div>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total Cases:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">2,345</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Top Species:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Dog (65%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>New Cases (Last 30 days):</span>
            <span className="font-semibold text-teal-600 dark:text-teal-500">+120</span>
          </div>
        </div>
        <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/analytics")}>
          View Full Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
