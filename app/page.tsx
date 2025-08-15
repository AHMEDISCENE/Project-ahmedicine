"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FormTemplateSidebar } from "@/components/form-template-sidebar"
import { CaseEntryForm } from "@/components/case-entry-form"
import { CaseRecords } from "@/components/case-records"
import { RecentEntries } from "@/components/recent-entries"
import { AnalyticsTeaser } from "@/components/analytics-teaser"
import { AIInsights } from "@/components/ai-insights"
import { SettingsPage } from "@/components/settings-page"
import { ReportsPage } from "@/components/reports-page"
import { Footer } from "@/components/footer"
import type { CaseData, FormField } from "@/types/case-data"

export default function Home() {
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "new-case" | "case-records" | "form-builder" | "insights" | "reports" | "settings"
  >("dashboard")
  const [cases, setCases] = useState<CaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 100)
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("Initialization error:", err)
      setError("Failed to initialize application")
      setIsLoading(false)
    }
  }, [])

  const addCase = (newCase: CaseData) => {
    try {
      if (!newCase || typeof newCase !== "object") {
        console.error("Invalid case data:", newCase)
        return
      }

      const caseWithId = {
        ...newCase,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }
      setCases((prev) => [caseWithId, ...prev])
    } catch (err) {
      console.error("Error adding case:", err)
    }
  }

  const safeSetFormFields = (fields: FormField[]) => {
    try {
      if (Array.isArray(fields)) {
        const validFields = fields.filter((field) => field && field.id && field.name && field.type)
        setFormFields(validFields)
      }
    } catch (err) {
      console.error("Error setting form fields:", err)
    }
  }

  // Filter enabled fields for form rendering
  const enabledFields = Array.isArray(formFields) ? formFields.filter((field) => field && field.enabled !== false) : []

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Application Error</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {activeSection === "dashboard" && (
        <>
          <HeroSection onNewCase={() => setActiveSection("new-case")} />
          <div className="container mx-auto px-4 py-8 space-y-12">
            <RecentEntries cases={cases.slice(0, 5)} />
            <AnalyticsTeaser />
          </div>
        </>
      )}

      {activeSection === "new-case" && (
        <div className="container mx-auto px-4 py-8">
          <CaseEntryForm formFields={enabledFields} onSubmit={addCase} />
        </div>
      )}

      {activeSection === "case-records" && (
        <div className="container mx-auto px-4 py-8">
          <CaseRecords cases={cases} />
        </div>
      )}

      {activeSection === "form-builder" && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FormTemplateSidebar formFields={formFields} setFormFields={safeSetFormFields} />
            </div>
            <div className="lg:col-span-3">
              <div className="glass-panel rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Form Preview</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  This is how your form will appear to users. Use the sidebar to customize fields.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enabledFields.map((field) =>
                    field && field.id ? (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {field.label || field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600"></div>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "insights" && <AIInsights />}

      {activeSection === "reports" && <ReportsPage />}

      {activeSection === "settings" && <SettingsPage />}

      <Footer />
    </div>
  )
}
