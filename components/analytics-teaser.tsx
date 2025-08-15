"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Eye } from "lucide-react"

export function AnalyticsTeaser() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Delay mounting to ensure hydration is complete
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      {/* Blurred background for the chart area */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg opacity-20 dark:opacity-10"
        style={{
          backgroundImage: "url(/placeholder.svg?height=400&width=800)",
          filter: "blur(6px)",
          transform: "scale(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 rounded-lg" />

      <Card className="relative glass-panel shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-500" />
            Spot Trends at a Glance
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Visual insights from your oncology data</p>
        </CardHeader>

        <CardContent>
          {isMounted ? (
            <div className="h-[300px] mb-6 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                {/* Simple bar chart representation */}
                <div className="flex items-end justify-center space-x-4 h-48">
                  {[
                    { month: "Jan", cases: 12, height: "30%" },
                    { month: "Feb", cases: 19, height: "48%" },
                    { month: "Mar", cases: 15, height: "38%" },
                    { month: "Apr", cases: 25, height: "63%" },
                    { month: "May", cases: 22, height: "55%" },
                    { month: "Jun", cases: 18, height: "45%" },
                  ].map((data, index) => (
                    <div key={data.month} className="flex flex-col items-center space-y-2">
                      <div
                        className="w-12 bg-teal-500 dark:bg-teal-600 rounded-t-md transition-all duration-1000 ease-out"
                        style={{ height: data.height }}
                      />
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{data.month}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">{data.cases}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[300px] mb-6 flex items-center justify-center">
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md w-full h-full"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 text-center border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">127</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Cases</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 text-center border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-2xl font-bold text-teal-600 dark:text-teal-500">85%</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Success Rate</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 text-center border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">12</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Clinics</p>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white">
              <Eye className="w-4 h-4 mr-2" />
              View Full Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
