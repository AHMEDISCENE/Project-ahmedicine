"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, MapPin, User, Stethoscope } from "lucide-react"
import type { CaseData } from "@/types/case-data"

interface RecentEntriesProps {
  cases: CaseData[]
}

export function RecentEntries({ cases }: RecentEntriesProps) {
  if (cases.length === 0) {
    return (
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p>No cases entered yet. Add your first case to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Entries</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">Last 5 cases entered</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases.map((case_) => (
            <Sheet key={case_.id}>
              <SheetTrigger asChild>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full">
                      <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{case_.patientName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {case_.ownerName}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {case_.clinicName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {case_.diagnosisDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {case_.species}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {case_.tumourType}
                    </Badge>
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Case Details - {case_.patientName}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Patient Information</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Name:</span> {case_.patientName}
                        </p>
                        <p>
                          <span className="font-medium">Species:</span> {case_.species}
                        </p>
                        <p>
                          <span className="font-medium">Breed:</span> {case_.breed}
                        </p>
                        <p>
                          <span className="font-medium">Age:</span> {case_.age} years
                        </p>
                        <p>
                          <span className="font-medium">Sex:</span> {case_.sex}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Owner & Clinic</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Owner:</span> {case_.ownerName}
                        </p>
                        <p>
                          <span className="font-medium">Clinic:</span> {case_.clinicName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Oncology Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Tumour Type:</span> {case_.tumourType}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {case_.location}
                      </p>
                      <p>
                        <span className="font-medium">Diagnostic Method:</span> {case_.diagnosticMethod}
                      </p>
                      <p>
                        <span className="font-medium">Diagnosis Date:</span> {case_.diagnosisDate}
                      </p>
                      {case_.treatmentProtocol && (
                        <p>
                          <span className="font-medium">Treatment:</span> {case_.treatmentProtocol}
                        </p>
                      )}
                      {case_.outcome && (
                        <p>
                          <span className="font-medium">Outcome:</span> {case_.outcome}
                        </p>
                      )}
                    </div>
                  </div>

                  {case_.notes && (
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Additional Notes</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        {case_.notes}
                      </p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
