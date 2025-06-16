"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { FormField, CaseData } from "@/types/case-data"

interface BulkImportProps {
  formFields: FormField[]
  onImportComplete: (cases: CaseData[]) => void
}

export function BulkImport({ formFields, onImportComplete }: BulkImportProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<Record<string, any>[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    if (!selectedFile.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)

    // Read file
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const rows = text.split("\n").map((row) => row.split(",").map((cell) => cell.trim()))

        // Extract headers and data
        const fileHeaders = rows[0]
        const data = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""))

        setHeaders(fileHeaders)
        setFileData(data)

        // Initialize mappings with best guesses
        const initialMappings: Record<string, string> = {}
        fileHeaders.forEach((header) => {
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "")
          const matchingField = formFields.find((field) => {
            const normalizedFieldName = field.name.toLowerCase().replace(/[^a-z0-9]/g, "")
            const normalizedFieldLabel = (field.label || "").toLowerCase().replace(/[^a-z0-9]/g, "")
            return normalizedFieldName === normalizedHeader || normalizedFieldLabel === normalizedHeader
          })

          if (matchingField) {
            initialMappings[header] = matchingField.name
          }
        })

        setMappings(initialMappings)
        setActiveStep(2)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        toast({
          title: "Error Parsing File",
          description: "The file could not be parsed. Please check the format.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(selectedFile)
  }

  const handleMappingChange = (header: string, fieldName: string) => {
    setMappings((prev) => ({
      ...prev,
      [header]: fieldName,
    }))
  }

  const generatePreview = () => {
    try {
      // Convert file data to array of objects based on mappings
      const preview = fileData.map((row) => {
        const obj: Record<string, any> = {}
        headers.forEach((header, index) => {
          const fieldName = mappings[header]
          if (fieldName) {
            // Convert to appropriate type
            const field = formFields.find((f) => f.name === fieldName)
            if (field) {
              const value = row[index]
              if (field.type === "number") {
                obj[fieldName] = value ? Number(value) : null
              } else {
                obj[fieldName] = value || ""
              }
            }
          }
        })
        return obj
      })

      setPreviewData(preview)

      // Validate data
      const errors: Record<number, string[]> = {}
      preview.forEach((row, index) => {
        const rowErrors: string[] = []

        // Check required fields
        formFields
          .filter((f) => f.required)
          .forEach((field) => {
            if (!row[field.name] && row[field.name] !== 0) {
              rowErrors.push(`Missing required field: ${field.label || field.name}`)
            }
          })

        // Type validation
        formFields.forEach((field) => {
          if (row[field.name] !== undefined && row[field.name] !== "") {
            if (field.type === "number" && isNaN(Number(row[field.name]))) {
              rowErrors.push(`Invalid number for ${field.label || field.name}`)
            }
            if (field.type === "date" && isNaN(Date.parse(row[field.name]))) {
              rowErrors.push(`Invalid date for ${field.label || field.name}`)
            }
          }
        })

        if (rowErrors.length > 0) {
          errors[index] = rowErrors
        }
      })

      setValidationErrors(errors)
      setActiveStep(3)
    } catch (error) {
      console.error("Error generating preview:", error)
      toast({
        title: "Error",
        description: "Failed to generate preview. Please check your mappings.",
        variant: "destructive",
      })
    }
  }

  const processImport = async () => {
    setIsProcessing(true)

    try {
      // Filter out rows with validation errors
      const validData = previewData.filter((_, index) => !validationErrors[index])

      // Process in batches to show progress
      const batchSize = 10
      const totalBatches = Math.ceil(validData.length / batchSize)

      const importedCases: CaseData[] = []

      for (let i = 0; i < totalBatches; i++) {
        const batch = validData.slice(i * batchSize, (i + 1) * batchSize)

        // Process batch (in a real app, this would be an API call)
        const processedBatch = batch.map((item) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }))

        importedCases.push(...processedBatch)

        // Update progress
        setProgress(Math.round(((i + 1) / totalBatches) * 100))

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Complete import
      toast({
        title: "Import Successful",
        description: `Successfully imported ${importedCases.length} cases.`,
      })

      if (Object.keys(validationErrors).length > 0) {
        toast({
          title: "Some Rows Skipped",
          description: `${Object.keys(validationErrors).length} rows were skipped due to validation errors.`,
          variant: "warning",
        })
      }

      onImportComplete(importedCases as CaseData[])

      // Reset state
      setActiveStep(4)
    } catch (error) {
      console.error("Error importing data:", error)
      toast({
        title: "Import Failed",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetImport = () => {
    setFile(null)
    setFileData([])
    setHeaders([])
    setMappings({})
    setPreviewData([])
    setValidationErrors({})
    setProgress(0)
    setActiveStep(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="glass-panel shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Bulk Import Cases</CardTitle>
        <CardDescription>Import multiple cases from a CSV file</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={`step-${activeStep}`} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="step-1" disabled={activeStep !== 1}>
              1. Upload File
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={activeStep !== 2}>
              2. Map Fields
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={activeStep !== 3}>
              3. Preview & Validate
            </TabsTrigger>
            <TabsTrigger value="step-4" disabled={activeStep !== 4}>
              4. Complete
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
              <FileSpreadsheet className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                Upload a CSV file containing case data. The first row should contain column headers.
              </p>

              <div className="flex items-center space-x-2">
                <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
              </div>
            </div>
          </TabsContent>

          {/* Additional steps would be implemented here */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
