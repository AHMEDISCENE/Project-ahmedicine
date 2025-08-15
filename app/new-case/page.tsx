"use client"

import { useState } from "react"
import { CaseEntryForm } from "@/components/case-entry-form"
import { FormTemplateSidebar } from "@/components/form-template-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FormField } from "@/types/case-data"

export default function NewCasePage() {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "1", name: "ownerName", label: "Owner Name", type: "text", required: true, enabled: true },
    { id: "2", name: "hospitalName", label: "Hospital/Clinic Name", type: "text", required: true, enabled: true },
    { id: "3", name: "state", label: "State", type: "select", required: true, enabled: true },
    { id: "4", name: "city", label: "City", type: "text", required: true, enabled: true },
    { id: "5", name: "patientName", label: "Patient Name", type: "text", required: true, enabled: true },
    { id: "6", name: "species", label: "Species", type: "select", required: true, enabled: true },
    { id: "7", name: "breed", label: "Breed", type: "text", required: true, enabled: true },
    { id: "8", name: "age", label: "Age", type: "number", required: true, enabled: true },
    { id: "9", name: "sex", label: "Sex", type: "select", required: true, enabled: true },
    { id: "10", name: "tumourType", label: "Tumour Type", type: "select", required: true, enabled: true },
    { id: "11", name: "location", label: "Anatomical Location", type: "text", required: true, enabled: true },
    { id: "12", name: "diagnosticMethod", label: "Diagnostic Method", type: "select", required: true, enabled: true },
    { id: "13", name: "diagnosisDate", label: "Date of Diagnosis", type: "date", required: true, enabled: true },
    {
      id: "14",
      name: "treatmentProtocol",
      label: "Treatment Protocol",
      type: "select",
      required: false,
      enabled: true,
    },
    { id: "15", name: "followUpDate", label: "Follow-up Date", type: "date", required: false, enabled: true },
    { id: "16", name: "outcome", label: "Follow-Up Outcome", type: "textarea", required: false, enabled: true },
    { id: "17", name: "notes", label: "Additional Notes", type: "textarea", required: false, enabled: true },
    { id: "18", name: "diagnosticImages", label: "Radiographs", type: "file", required: false, enabled: true },
    { id: "19", name: "histopathImages", label: "Histopath Slides", type: "file", required: false, enabled: true },
  ])

  // This component will handle the submission logic internally
  const handleSubmit = (data: any) => {
    console.log("New case submitted:", data)
    // You might want to redirect the user or show a success message here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="case-entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="case-entry">Case Entry</TabsTrigger>
          <TabsTrigger value="form-template">Form Template</TabsTrigger>
        </TabsList>

        <TabsContent value="case-entry" className="space-y-6">
          <CaseEntryForm onSubmit={handleSubmit} />
        </TabsContent>

        <TabsContent value="form-template" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <FormTemplateSidebar formFields={formFields} setFormFields={setFormFields} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
