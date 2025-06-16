"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Stethoscope, FileText, ImageIcon, History } from "lucide-react"
import type { CaseData } from "@/types/case-data"

interface CaseDetailViewProps {
  caseData: CaseData | null
  isOpen: boolean
  onClose: () => void
}

export function CaseDetailView({ caseData, isOpen, onClose }: CaseDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details")

  if (!caseData) {
    return null
  }

  // Mock audit trail data
  const auditTrail = [
    {
      id: "1",
      action: "CREATE",
      timestamp: "2023-11-15T10:30:00Z",
      user: "Dr. Sarah Johnson",
      details: "Case created",
    },
    {
      id: "2",
      action: "UPDATE",
      timestamp: "2023-11-16T14:22:00Z",
      user: "Dr. Sarah Johnson",
      details: "Updated diagnosis details",
    },
    {
      id: "3",
      action: "UPDATE",
      timestamp: "2023-11-20T09:15:00Z",
      user: "Dr. Michael Wong",
      details: "Added treatment protocol",
    },
  ]

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Stethoscope className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-500" />
            Case: {caseData.patientName}
          </DialogTitle>
          <DialogDescription>
            {caseData.species} • {caseData.breed} • {caseData.tumourType}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Patient Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{caseData.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Species:</span>
                      <span className="text-sm">{caseData.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Breed:</span>
                      <span className="text-sm">{caseData.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Age:</span>
                      <span className="text-sm">{caseData.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Sex:</span>
                      <span className="text-sm">{caseData.sex}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Owner & Hospital</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Owner:</span>
                      <span className="text-sm">{caseData.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Hospital:</span>
                      <span className="text-sm">{caseData.hospitalName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">
                        {caseData.city}, {caseData.state}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Oncology Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Tumour Type:</span>
                      <span className="text-sm">{caseData.tumourType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Location:</span>
                      <span className="text-sm">{caseData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Diagnostic Method:</span>
                      <span className="text-sm">{caseData.diagnosticMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Diagnosis Date:</span>
                      <span className="text-sm">{formatDate(caseData.diagnosisDate)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Treatment & Outcome</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Treatment Protocol:</span>
                      <span className="text-sm">{caseData.treatmentProtocol || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Follow-up Date:</span>
                      <span className="text-sm">
                        {caseData.followUpDate ? formatDate(caseData.followUpDate) : "Not scheduled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Outcome:</span>
                      <span className="text-sm">{caseData.outcome || "Not recorded"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {caseData.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Additional Notes</h3>
                  <p className="mt-2 text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-md">{caseData.notes}</p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="images" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <ImageIcon className="h-5 w-5 mr-2 text-slate-600 dark:text-slate-400" />
                  <h3 className="text-sm font-medium">Diagnostic Images</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Placeholder for images */}
                  <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">No images</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <ImageIcon className="h-5 w-5 mr-2 text-slate-600 dark:text-slate-400" />
                  <h3 className="text-sm font-medium">Histopathology Slides</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Placeholder for histopath images */}
                  <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">No images</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4 pt-4">
            <div className="space-y-3">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <History className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm font-medium">{entry.action}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(entry.timestamp).toLocaleString()}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>
                      {entry.details} by {entry.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
