"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Clock, Play, Plus, Filter } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ReportsPage() {
  const [runningReport, setRunningReport] = useState<string | null>(null)

  const savedReports = [
    {
      id: "1",
      name: "Monthly Oncology Summary",
      description: "Summary of all oncology cases for the current month",
      lastRun: "2 days ago",
      schedule: "Monthly",
      format: "PDF",
    },
    {
      id: "2",
      name: "Treatment Outcomes by Tumour Type",
      description: "Analysis of treatment outcomes categorized by tumour type",
      lastRun: "1 week ago",
      schedule: "Weekly",
      format: "Excel",
    },
    {
      id: "3",
      name: "Species Distribution Report",
      description: "Distribution of cases by species and breed",
      lastRun: "3 days ago",
      schedule: "On-demand",
      format: "PDF",
    },
    {
      id: "4",
      name: "Survival Rate Analysis",
      description: "Detailed survival rate analysis for different cancer types",
      lastRun: "2 weeks ago",
      schedule: "Monthly",
      format: "Excel",
    },
  ]

  const scheduledReports = [
    {
      id: "5",
      name: "Weekly Case Summary",
      description: "Summary of new cases added in the past week",
      nextRun: "Tomorrow",
      schedule: "Weekly",
      recipients: "Oncology Team",
    },
    {
      id: "6",
      name: "Monthly Analytics Report",
      description: "Comprehensive analytics on treatment outcomes and trends",
      nextRun: "In 12 days",
      schedule: "Monthly",
      recipients: "Management, Oncology Team",
    },
  ]

  const handleRunReport = async (id: string, name: string) => {
    setRunningReport(id)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setRunningReport(null)
    toast({
      title: "Report Generated",
      description: `${name} has been generated successfully.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-0 shadow-xl">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-teal-600 dark:text-teal-500" />
                Reports
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">Generate and manage your oncology data reports</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="saved">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="saved">
                <Download className="h-4 w-4 mr-2" />
                Saved Reports
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                <Calendar className="h-4 w-4 mr-2" />
                Scheduled Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-4">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-200">{report.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{report.description}</p>

                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3 mr-1" />
                          Last run: {report.lastRun}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.schedule}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {report.format}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleRunReport(report.id, report.name)}
                      disabled={runningReport === report.id}
                      className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                    >
                      {runningReport === report.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Run Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              {scheduledReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-200">{report.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{report.description}</p>

                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          Next run: {report.nextRun}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.schedule}
                        </Badge>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Recipients: {report.recipients}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRunReport(report.id, report.name)}
                        disabled={runningReport === report.id}
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                      >
                        {runningReport === report.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Run Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
