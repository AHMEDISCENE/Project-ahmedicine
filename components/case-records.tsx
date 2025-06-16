"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Calendar, MapPin, User, Stethoscope, Search, Eye } from "lucide-react"
import type { CaseData } from "@/types/case-data"
import { CaseDetailView } from "@/components/case-detail-view"

interface CaseRecordsProps {
  cases: CaseData[]
}

export function CaseRecords({ cases = [] }: CaseRecordsProps) {
  const [openHospitals, setOpenHospitals] = useState<Set<string>>(new Set())
  const [openTumourTypes, setOpenTumourTypes] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null)
  const [detailViewOpen, setDetailViewOpen] = useState(false)

  // Group cases by hospital (name + location), then by tumour type
  const groupedCases = useMemo(() => {
    const grouped: Record<string, Record<string, CaseData[]>> = {}

    // Safe iteration over cases
    if (Array.isArray(cases)) {
      cases.forEach((case_) => {
        // Null check for case data
        if (!case_ || typeof case_ !== "object") return

        const hospitalName = case_.hospitalName || "Unknown Hospital"
        const location = case_.city && case_.state ? `${case_.city}, ${case_.state}` : "Unknown Location"
        const hospitalKey = `${hospitalName} - ${location}`
        const tumourType = case_.tumourType || "Unknown Type"

        if (!grouped[hospitalKey]) {
          grouped[hospitalKey] = {}
        }
        if (!grouped[hospitalKey][tumourType]) {
          grouped[hospitalKey][tumourType] = []
        }
        grouped[hospitalKey][tumourType].push(case_)
      })
    }

    return grouped
  }, [cases])

  // Filter grouped cases based on search query
  const filteredGroupedCases = useMemo(() => {
    if (!searchQuery.trim()) return groupedCases

    const filtered: Record<string, Record<string, CaseData[]>> = {}
    const query = searchQuery.toLowerCase()

    Object.entries(groupedCases).forEach(([hospitalKey, tumourGroups]) => {
      const hospitalMatches = hospitalKey.toLowerCase().includes(query)

      Object.entries(tumourGroups).forEach(([tumourType, cases]) => {
        const tumourMatches = tumourType.toLowerCase().includes(query)

        if (hospitalMatches || tumourMatches) {
          if (!filtered[hospitalKey]) {
            filtered[hospitalKey] = {}
          }
          filtered[hospitalKey][tumourType] = cases
        }
      })
    })

    return filtered
  }, [groupedCases, searchQuery])

  const toggleHospital = (hospital: string) => {
    if (!hospital) return

    const newOpen = new Set(openHospitals)
    if (newOpen.has(hospital)) {
      newOpen.delete(hospital)
    } else {
      newOpen.add(hospital)
    }
    setOpenHospitals(newOpen)
  }

  const toggleTumourType = (key: string) => {
    if (!key) return

    const newOpen = new Set(openTumourTypes)
    if (newOpen.has(key)) {
      newOpen.delete(key)
    } else {
      newOpen.add(key)
    }
    setOpenTumourTypes(newOpen)
  }

  const handleViewDetails = (caseData: CaseData) => {
    setSelectedCase(caseData)
    setDetailViewOpen(true)
  }

  if (!Array.isArray(cases) || cases.length === 0) {
    return (
      <Card className="glass-panel shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Case Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p>No cases recorded yet. Add your first case to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalFilteredCases = Object.values(filteredGroupedCases).reduce(
    (total, tumourGroups) => total + Object.values(tumourGroups).flat().length,
    0,
  )

  return (
    <>
      <Card className="glass-panel shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Case Records</CardTitle>
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery ? `${totalFilteredCases} filtered cases` : `${cases.length} total cases`} across{" "}
            {Object.keys(filteredGroupedCases).length} hospitals
          </p>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search hospitals or tumour types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {Object.keys(filteredGroupedCases).length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try adjusting your search terms</p>
              </div>
            ) : (
              Object.entries(filteredGroupedCases).map(([hospitalKey, tumourGroups]) => {
                if (!hospitalKey || !tumourGroups) return null

                const hospitalCaseCount = Object.values(tumourGroups).flat().length
                const isHospitalOpen = openHospitals.has(hospitalKey)

                return (
                  <div key={hospitalKey}>
                    <Button
                      variant="ghost"
                      onClick={() => toggleHospital(hospitalKey)}
                      className="flex items-center justify-between w-full p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all h-auto"
                    >
                      <div className="flex items-center space-x-3">
                        {isHospitalOpen ? (
                          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        )}
                        <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full">
                          <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{hospitalKey}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{hospitalCaseCount} cases</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(tumourGroups).length} tumour types
                      </Badge>
                    </Button>

                    {isHospitalOpen && (
                      <div className="mt-2 ml-8 space-y-2">
                        {Object.entries(tumourGroups).map(([tumourType, tumourCases]) => {
                          if (!tumourType || !Array.isArray(tumourCases)) return null

                          const tumourKey = `${hospitalKey}-${tumourType}`
                          const isTumourOpen = openTumourTypes.has(tumourKey)

                          return (
                            <div key={tumourKey}>
                              <Button
                                variant="ghost"
                                onClick={() => toggleTumourType(tumourKey)}
                                className="flex items-center justify-between w-full p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-teal-200 dark:hover:border-teal-700 transition-all h-auto"
                              >
                                <div className="flex items-center space-x-3">
                                  {isTumourOpen ? (
                                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                  )}
                                  <div className="bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full">
                                    <Stethoscope className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-medium text-slate-700 dark:text-slate-300">{tumourType}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {tumourCases.length} cases
                                    </p>
                                  </div>
                                </div>
                              </Button>

                              {isTumourOpen && (
                                <div className="mt-2 ml-6 space-y-2">
                                  {tumourCases.map((case_) => {
                                    // Null check for individual case
                                    if (!case_ || !case_.id) return null

                                    return (
                                      <div
                                        key={case_.id}
                                        className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-teal-200 dark:hover:border-teal-700 hover:shadow-sm transition-all"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h5 className="font-medium text-slate-800 dark:text-slate-200">
                                              {case_.patientName || "Unknown Patient"}
                                            </h5>
                                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                              <span className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                {case_.ownerName || "Unknown Owner"}
                                              </span>
                                              <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {case_.diagnosisDate || "No date"}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="text-xs">
                                              {case_.species || "Unknown"}
                                            </Badge>
                                            {case_.outcome && (
                                              <Badge variant="secondary" className="text-xs">
                                                {case_.outcome}
                                              </Badge>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                              onClick={() => handleViewDetails(case_)}
                                            >
                                              <Eye className="h-3.5 w-3.5 mr-1 text-teal-600 dark:text-teal-500" />
                                              View
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Detail Modal */}
      <CaseDetailView caseData={selectedCase} isOpen={detailViewOpen} onClose={() => setDetailViewOpen(false)} />
    </>
  )
}
