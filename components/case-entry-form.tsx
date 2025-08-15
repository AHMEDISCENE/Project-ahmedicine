"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Save, AlertCircle, Calendar } from "lucide-react"
import type { CaseData, FormField } from "@/types/case-data"
import { toast } from "@/hooks/use-toast"

interface CaseEntryFormProps {
  formFields: FormField[]
  onSubmit: (data: CaseData) => void
}

export function CaseEntryForm({ formFields = [], onSubmit }: CaseEntryFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showCustomBreed, setShowCustomBreed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ]

  const species = ["Dog", "Cat", "Bird", "Rabbit", "Other"]

  const dogBreeds = [
    "Mixed Breed",
    "Labrador Retriever",
    "German Shepherd",
    "Rottweiler",
    "Golden Retriever",
    "Boxer",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Dachshund",
    "Chihuahua",
    "Great Dane",
    "Doberman Pinscher",
    "Siberian Husky",
    "Shih Tzu",
    "Pug",
    "Maltese",
    "Cocker Spaniel",
    "Yorkshire Terrier",
    "Pit Bull",
    "Nigerian Local Breed",
    "Other (specify)",
  ]

  const catBreeds = [
    "Domestic Shorthair",
    "Domestic Longhair",
    "Siamese",
    "Persian",
    "Maine Coon",
    "Ragdoll",
    "Bengal",
    "Abyssinian",
    "British Shorthair",
    "Sphynx",
    "Scottish Fold",
    "Burmese",
    "Ragamuffin",
    "Devon Rex",
    "Oriental",
    "Nigerian Local Breed",
    "Other (specify)",
  ]

  const sexOptions = ["Male", "Female", "Male (Neutered)", "Female (Spayed)"]
  const tumourTypes = [
    "Mast Cell Tumour",
    "Lymphoma",
    "Osteosarcoma",
    "Hemangiosarcoma",
    "Squamous Cell Carcinoma",
    "Melanoma",
    "Soft Tissue Sarcoma",
    "Mammary Tumour",
    "Transitional Cell Carcinoma",
    "Other",
  ]
  const diagnosticMethods = [
    "Fine Needle Aspirate",
    "Biopsy",
    "Histopathology",
    "Cytology",
    "Imaging",
    "Clinical Diagnosis",
    "Other",
  ]
  const treatmentProtocols = [
    "Surgery Only",
    "Chemotherapy Only",
    "Radiation Only",
    "Surgery + Chemotherapy",
    "Surgery + Radiation",
    "Chemotherapy + Radiation",
    "Multimodal (Surgery + Chemo + Radiation)",
    "Palliative Care",
    "Immunotherapy",
    "Clinical Trial",
    "Other",
  ]

  // Get breed options based on selected species
  const getBreedOptions = () => {
    const selectedSpecies = formData.species || ""
    if (selectedSpecies === "Dog") return dogBreeds
    if (selectedSpecies === "Cat") return catBreeds
    return ["Other (specify)"]
  }

  useEffect(() => {
    // Reset breed when species changes
    if (formData.species) {
      setFormData((prev) => ({ ...prev, breed: "" }))
      setShowCustomBreed(false)
    }
  }, [formData.species])

  useEffect(() => {
    // Show custom breed input if "Other (specify)" is selected
    if (formData.breed === "Other (specify)") {
      setShowCustomBreed(true)
    } else {
      setShowCustomBreed(false)
    }
  }, [formData.breed])

  const handleInputChange = (name: string, value: string | number) => {
    if (!name) return

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Inline validation
    if (name === "age" && typeof value === "number") {
      if (value < 0) {
        setErrors((prev) => ({ ...prev, [name]: "Age cannot be negative" }))
      } else if (value > 25) {
        setErrors((prev) => ({ ...prev, [name]: "Age seems high for most companion animals. Please verify." }))
      }
    }

    if (name === "ownerName" && typeof value === "string" && value.length < 2) {
      setErrors((prev) => ({ ...prev, [name]: "Owner name must be at least 2 characters" }))
    }

    if (name === "patientName" && typeof value === "string" && value.length < 1) {
      setErrors((prev) => ({ ...prev, [name]: "Patient name is required" }))
    }

    if (name === "hospitalName" && typeof value === "string" && value.length < 2) {
      setErrors((prev) => ({ ...prev, [name]: "Hospital/Clinic name must be at least 2 characters" }))
    }

    if (name === "city" && typeof value === "string" && value.length < 2) {
      setErrors((prev) => ({ ...prev, [name]: "City name must be at least 2 characters" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Safe iteration over form fields
    if (Array.isArray(formFields)) {
      formFields.forEach((field) => {
        if (field && field.name && field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label || field.name} is required`
        }
      })
    }

    // Additional validation
    if (formData.age && (formData.age < 0 || formData.age > 30)) {
      newErrors.age = "Please enter a valid age"
    }

    if (formData.diagnosisDate && formData.followUpDate) {
      const diagnosisDate = new Date(formData.diagnosisDate)
      const followUpDate = new Date(formData.followUpDate)
      if (followUpDate < diagnosisDate) {
        newErrors.followUpDate = "Follow-up date cannot be before diagnosis date"
      }
    }

    // Validate custom breed if needed
    if (showCustomBreed && (!formData.customBreed || formData.customBreed.trim() === "")) {
      newErrors.customBreed = "Please specify the breed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Process form data - if custom breed is specified, use that instead
      const processedData = { ...formData }
      if (showCustomBreed && formData.customBreed) {
        processedData.breed = formData.customBreed
        delete processedData.customBreed
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log audit trail
      console.log("AUDIT: Case created", {
        user: "current-user-id",
        timestamp: new Date().toISOString(),
        action: "CREATE_CASE",
        patientId: "MASKED-" + Math.random().toString(36).substr(2, 9),
        hospital: processedData.hospitalName,
        location: `${processedData.city}, ${processedData.state}`,
      })

      onSubmit(processedData as CaseData)
      setFormData({})
      setShowCustomBreed(false)

      toast({
        title: "Case Saved Successfully",
        description: "The new oncology case has been added to your records.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save case. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldType = (fieldName: string): FormField["type"] => {
    if (!fieldName) return "text"

    // Text inputs
    if (["ownerName", "patientName", "location", "hospitalName", "city", "customBreed"].includes(fieldName)) {
      return "text"
    }
    // Select dropdowns
    if (
      ["species", "sex", "tumourType", "diagnosticMethod", "treatmentProtocol", "state", "breed"].includes(fieldName)
    ) {
      return "select"
    }
    // Date pickers
    if (["diagnosisDate", "followUpDate"].includes(fieldName)) {
      return "date"
    }
    // Textareas
    if (["notes", "outcome"].includes(fieldName)) {
      return "textarea"
    }
    // File uploaders
    if (["diagnosticImages", "histopathImages"].includes(fieldName)) {
      return "file"
    }
    return "text"
  }

  const renderField = (field: FormField) => {
    // Comprehensive null checks
    if (!field || !field.name || !field.id) {
      return null
    }

    // Skip rendering breed field if it's handled separately
    if (field.name === "breed") {
      return (
        <>
          <Select
            value={formData.breed || ""}
            onValueChange={(value) => handleInputChange("breed", value)}
            disabled={!formData.species}
          >
            <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-teal-500">
              <SelectValue
                placeholder={formData.species ? `Select ${field.label || field.name}` : "Select species first"}
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
              {getBreedOptions().map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomBreed && (
            <div className="mt-2">
              <Input
                id="customBreed"
                value={formData.customBreed || ""}
                onChange={(e) => handleInputChange("customBreed", e.target.value)}
                placeholder="Please specify the breed"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
              />
              {errors.customBreed && (
                <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customBreed}
                </div>
              )}
            </div>
          )}
        </>
      )
    }

    const fieldType = getFieldType(field.name)
    const fieldValue = formData[field.name] || ""

    const commonProps = {
      id: field.name,
      value: fieldValue,
    }

    try {
      switch (fieldType) {
        case "select":
          let options: string[] = []
          if (field.name === "species") options = species
          else if (field.name === "sex") options = sexOptions
          else if (field.name === "tumourType") options = tumourTypes
          else if (field.name === "diagnosticMethod") options = diagnosticMethods
          else if (field.name === "treatmentProtocol") options = treatmentProtocols
          else if (field.name === "state") options = nigerianStates

          return (
            <Select value={fieldValue} onValueChange={(value) => handleInputChange(field.name, value)}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder={`Select ${(field.label || field.name).toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                {options.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "textarea":
          return (
            <Textarea
              {...commonProps}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500 resize-none"
              rows={3}
              placeholder={`Enter ${(field.label || field.name).toLowerCase()}`}
            />
          )

        case "date":
          return (
            <div className="relative">
              <Input
                {...commonProps}
                type="date"
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:border-teal-500 focus:ring-teal-500 transition-all duration-200"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>
          )

        case "file":
          return (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Click to upload</span> {(field.label || field.name).toLowerCase()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or PDF (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" multiple accept="image/*,.pdf" />
              </label>
            </div>
          )

        default:
          return (
            <Input
              {...commonProps}
              type={field.name === "age" ? "number" : "text"}
              onChange={(e) =>
                handleInputChange(field.name, field.name === "age" ? Number(e.target.value) : e.target.value)
              }
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500 transition-all duration-200"
              placeholder={`Enter ${(field.label || field.name).toLowerCase()}`}
            />
          )
      }
    } catch (error) {
      console.error("Error rendering field:", field, error)
      return (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
          Error rendering field: {field.name}
        </div>
      )
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
        <Card className="max-w-4xl mx-auto glass-panel shadow-2xl">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safe check for form fields
  const safeFormFields = Array.isArray(formFields) ? formFields.filter((field) => field && field.id && field.name) : []

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <Card className="max-w-4xl mx-auto glass-panel shadow-2xl">
        <CardHeader className="text-center border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            New Oncology Case Entry
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Enter comprehensive patient and treatment details</p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safeFormFields.map((field) => (
                <div key={field.id} className={getFieldType(field.name) === "textarea" ? "md:col-span-2" : ""}>
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    {field.label || field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {renderField(field)}

                  {errors[field.name] && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {safeFormFields.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No form fields configured. Please configure form fields in the Form Builder.</p>
              </div>
            )}

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
              <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Clinical Decision Support</h4>
              <p className="text-sm text-teal-700 dark:text-teal-400">
                💡 Remember to follow WHO staging guidelines for accurate tumour classification. Consider genetic
                markers for targeted therapy options.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                className="px-6 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || safeFormFields.length === 0}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white px-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Case
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
