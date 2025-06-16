"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronUp, ChevronDown, Save, RotateCcw, Edit2 } from "lucide-react"
import type { FormField } from "@/types/case-data"
import { toast } from "@/hooks/use-toast"

interface FormTemplateSidebarProps {
  formFields: FormField[]
  setFormFields: (fields: FormField[]) => void
}

export function FormTemplateSidebar({ formFields = [], setFormFields }: FormTemplateSidebarProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [templateName, setTemplateName] = useState("Default Template")

  const toggleField = (fieldId: string, enabled: boolean) => {
    if (!fieldId || !Array.isArray(formFields)) return

    setFormFields(
      formFields
        .map((field) => (field && field.id === fieldId ? { ...field, enabled: enabled } : field))
        .filter(Boolean),
    )
  }

  const moveField = (fieldId: string, direction: "up" | "down") => {
    if (!fieldId || !Array.isArray(formFields)) return

    const currentIndex = formFields.findIndex((field) => field && field.id === fieldId)
    if (currentIndex === -1) return

    const newFields = [...formFields]
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newFields.length) return
    ;[newFields[currentIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[currentIndex]]
    setFormFields(newFields)
  }

  const startEditing = (field: FormField) => {
    if (!field || !field.id) return

    setEditingField(field.id)
    setEditLabel(field.label || "")
  }

  const saveEdit = (fieldId: string) => {
    if (!editLabel.trim() || !fieldId || !Array.isArray(formFields)) return

    setFormFields(
      formFields
        .map((field) => (field && field.id === fieldId ? { ...field, label: editLabel.trim() } : field))
        .filter(Boolean),
    )
    setEditingField(null)
    setEditLabel("")
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditLabel("")
  }

  const saveTemplate = () => {
    toast({
      title: "Template Saved",
      description: `"${templateName}" has been saved successfully`,
    })
  }

  const revertTemplate = () => {
    const defaultFields: FormField[] = [
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
    ]
    setFormFields(defaultFields)
    toast({
      title: "Template Reverted",
      description: "Form has been reset to default template",
    })
  }

  // Safe filtering of form fields
  const safeFormFields = Array.isArray(formFields) ? formFields.filter((field) => field && field.id && field.name) : []

  return (
    <Card className="glass-panel shadow-lg h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Form Template</CardTitle>
        <div className="space-y-2">
          <Label htmlFor="templateName" className="text-sm text-slate-700 dark:text-slate-300">
            Template Name
          </Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {safeFormFields.map((field, index) => (
            <div
              key={field.id}
              className="group flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Switch
                  checked={field.enabled !== false}
                  onCheckedChange={(checked) => toggleField(field.id, checked)}
                />

                <div className="flex-1">
                  {editingField === field.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="text-sm h-8 bg-white dark:bg-slate-800"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(field.id)
                          if (e.key === "Escape") cancelEdit()
                        }}
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={() => saveEdit(field.id)} className="h-8 w-8 p-0">
                        ✓
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0">
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {field.label || field.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(field)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {field.required && <span className="text-xs text-red-500">Required</span>}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveField(field.id, "up")}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveField(field.id, "down")}
                  disabled={index === safeFormFields.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {safeFormFields.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No form fields available. Click "Revert" to load default fields.</p>
          </div>
        )}

        <div className="flex space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={saveTemplate}
            className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-sm text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={revertTemplate}
            variant="outline"
            className="flex-1 text-sm border-slate-300 dark:border-slate-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Revert
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Active fields:</strong> {safeFormFields.filter((f) => f.enabled !== false).length} of{" "}
            {safeFormFields.length}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
