"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Download, FileText, Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function ReportsPage() {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [clinicCode, setClinicCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Missing Report Type",
        description: "Please select a report type.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    toast({
      title: "Generating Report",
      description: `Generating ${reportType} report...`,
    })

    try {
      // Simulate API call for report generation
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

      // In a real app, you'd make an API call here, e.g.:
      // const response = await fetch('/api/generate-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reportType, dateRange, clinicCode }),
      // });
      // if (!response.ok) throw new Error('Failed to generate report');
      // const reportData = await response.json();

      toast({
        title: "Report Generated",
        description: `${reportType} report is ready for download.`,
      })
    } catch (error: any) {
      toast({
        title: "Report Generation Failed",
        description: error.message || "An error occurred while generating the report.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass-panel shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Custom Reports Builder</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">Generate detailed reports based on your oncology data.</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Report Type */}
          <div>
            <Label htmlFor="reportType" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report Type
            </Label>
            <Select value={reportType} onValueChange={setReportType} disabled={isLoading}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary Report</SelectItem>
                <SelectItem value="species-breakdown">Species Breakdown</SelectItem>
                <SelectItem value="tumour-trends">Tumour Type Trends</SelectItem>
                <SelectItem value="treatment-outcomes">Treatment Outcomes</SelectItem>
                <SelectItem value="clinic-performance">Clinic Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <Label htmlFor="dateRange" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date Range
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 ${
                    !dateRange.from ? "text-slate-500 dark:text-slate-400" : ""
                  }`}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange as any} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clinic Code Filter */}
          <div>
            <Label htmlFor="clinicCode" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Clinic Code (Optional)
            </Label>
            <Input
              id="clinicCode"
              placeholder="Filter by clinic code"
              value={clinicCode}
              onChange={(e) => setClinicCode(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            className="px-6 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
            disabled={isLoading}
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            onClick={handleGenerateReport}
            disabled={isLoading || !reportType}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate & Download
              </>
            )}
          </Button>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Recent Reports</h3>
          <div className="space-y-4">
            {/* Placeholder for recent reports */}
            <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">Summary Report - Q1 2024</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Generated: 2024-03-31</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">Tumour Trends - Feb 2024</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Generated: 2024-02-29</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
