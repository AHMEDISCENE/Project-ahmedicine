"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, TrendingUp, Users, MapPin, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AnalyticsPage() {
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentChart, setCurrentChart] = useState(0)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMounted(true)
    }
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    fetchCases()
  }, [hasMounted])

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase.from("cases").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary statistics
  const totalCases = cases.length
  const speciesBreakdown = cases.reduce((acc, case_) => {
    acc[case_.species] = (acc[case_.species] || 0) + 1
    return acc
  }, {})
  const stateBreakdown = cases.reduce((acc, case_) => {
    acc[case_.state] = (acc[case_.state] || 0) + 1
    return acc
  }, {})
  const topSpecies = Object.entries(speciesBreakdown).sort(([, a], [, b]) => (b as number) - (a as number))[0]
  const topState = Object.entries(stateBreakdown).sort(([, a], [, b]) => (b as number) - (a as number))[0]

  const charts = [
    {
      title: "Top Tumour Types",
      data: cases.reduce((acc, case_) => {
        acc[case_.tumour_type] = (acc[case_.tumour_type] || 0) + 1
        return acc
      }, {}),
    },
    {
      title: "Monthly Trends",
      data: cases.reduce((acc, case_) => {
        const month = new Date(case_.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {}),
    },
    {
      title: "Clinic Distribution",
      data: cases.reduce((acc, case_) => {
        acc[case_.hospital_name] = (acc[case_.hospital_name] || 0) + 1
        return acc
      }, {}),
    },
  ]

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % charts.length)
  }

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length)
  }

  if (!hasMounted || loading) {
    return (
      <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Comprehensive insights from your oncology data</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Cases</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalCases}</p>
                </div>
                <Activity className="h-8 w-8 text-teal-600 dark:text-teal-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Top Species</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {topSpecies ? `${topSpecies[0]} (${topSpecies[1]})` : "N/A"}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Top State</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {topState ? `${topState[0]} (${topState[1]})` : "N/A"}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-500">+12%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-teal-600 dark:text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Carousel */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {charts[currentChart]?.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevChart}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {currentChart + 1} of {charts.length}
              </span>
              <Button variant="outline" size="sm" onClick={nextChart}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-center space-x-4">
              {Object.entries(charts[currentChart]?.data || {})
                .slice(0, 8)
                .map(([key, value], index) => (
                  <div key={key} className="flex flex-col items-center space-y-2">
                    <div
                      className="w-12 bg-teal-500 dark:bg-teal-600 rounded-t-md transition-all duration-1000 ease-out"
                      style={{
                        height: `${Math.max(((value as number) / Math.max(...Object.values(charts[currentChart]?.data || {}))) * 200, 20)}px`,
                      }}
                    />
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center max-w-16 truncate">
                      {key}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{value as number}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
