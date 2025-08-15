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
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface CaseEntryFormProps {
  onSubmit: (data: any) => void
}

export function CaseEntryForm({ onSubmit }: CaseEntryFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showCustomBreed, setShowCustomBreed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    setMounted(true)

    const getUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Get user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setUserProfile(profile)
      }
    }
    getUserAndProfile()
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

  const species = [
    { value: "Dog", label: "🐶 Dog", emoji: "🐶" },
    { value: "Cat", label: "🐱 Cat", emoji: "🐱" },
    { value: "Bird", label: "🐦 Bird", emoji: "🐦" },
    { value: "Rabbit", label: "🐰 Rabbit", emoji: "🐰" },
    { value: "Other", label: "🐾 Other", emoji: "🐾" },
  ]

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
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required field validation
    const requiredFields = [
      "ownerName",
      "hospitalName",
      "state",
      "city",
      "patientName",
      "species",
      "breed",
      "age",
      "sex",
      "tumourType",
      "anatomicalLocation",
      "diagnosticMethod",
      "diagnosisDate",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`
      }
    })

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

    if (!user || !userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a case",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Process form data - if custom breed is specified, use that instead
      const processedData = { ...formData }
      if (showCustomBreed && processedData.customBreed) {
        processedData.breed = processedData.customBreed
        delete processedData.customBreed
      }

      // Insert into Supabase with proper field mapping
      const { data, error } = await supabase
        .from("cases")
        .insert([
          {
            owner_name: processedData.ownerName,
            hospital_name: processedData.hospitalName,
            state: processedData.state,
            city: processedData.city,
            patient_name: processedData.patientName,
            species: processedData.species,
            breed: processedData.breed,
            age: processedData.age,
            sex: processedData.sex,
            tumour_type: processedData.tumourType,
            anatomical_location: processedData.anatomicalLocation,
            diagnostic_method: processedData.diagnosticMethod,
            diagnosis_date: processedData.diagnosisDate,
            treatment_protocol: processedData.treatmentProtocol,
            follow_up_date: processedData.followUpDate,
            follow_up_outcome: processedData.followUpOutcome,
            additional_notes: processedData.additionalNotes,
            clinic_code: userProfile.clinic_code,
            created_by: user.id,
          },
        ])
        .select()

      if (error) throw error

      onSubmit(data[0])
      setFormData({})
      setShowCustomBreed(false)

      toast({
        title: "Case Saved Successfully",
        description: "The new oncology case has been added to your records.",
      })
    } catch (error: any) {
      console.error("Error saving case:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save case. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto glass-panel shadow-2xl">
          <CardHeader className="text-center border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              New Oncology Case Entry
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Enter comprehensive patient and treatment details</p>
            {userProfile && (
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Clinic: {userProfile.clinic_code}</span>
                {userProfile.role === "admin" && (
                  <span className="bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-2 py-1 rounded text-xs">
                    Admin
                  </span>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Name */}
                <div>
                  <Label
                    htmlFor="ownerName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Owner Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName || ""}
                    onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter owner's full name"
                  />
                  {errors.ownerName && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.ownerName}
                    </div>
                  )}
                </div>

                {/* Hospital/Clinic Name */}
                <div>
                  <Label
                    htmlFor="hospitalName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Hospital/Clinic Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName || ""}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter hospital or clinic name"
                  />
                  {errors.hospitalName && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.hospitalName}
                    </div>
                  )}
                </div>

                {/* State */}
                <div>
                  <Label
                    htmlFor="state"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    State <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.state || ""} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.state}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    City <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter city name"
                  />
                  {errors.city && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.city}
                    </div>
                  )}
                </div>

                {/* Patient Name */}
                <div>
                  <Label
                    htmlFor="patientName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Patient Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName || ""}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter patient's name"
                  />
                  {errors.patientName && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.patientName}
                    </div>
                  )}
                </div>

                {/* Species */}
                <div>
                  <Label
                    htmlFor="species"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Species <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.species || ""} onValueChange={(value) => handleInputChange("species", value)}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {species.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.species && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.species}
                    </div>
                  )}
                </div>

                {/* Breed */}
                <div>
                  <Label
                    htmlFor="breed"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Breed <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={formData.breed || ""}
                    onValueChange={(value) => handleInputChange("breed", value)}
                    disabled={!formData.species}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder={formData.species ? "Select breed" : "Select species first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getBreedOptions().map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
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
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                      />
                      {errors.customBreed && (
                        <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.customBreed}
                        </div>
                      )}
                    </div>
                  )}

                  {errors.breed && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.breed}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div>
                  <Label
                    htmlFor="age"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Age (years) <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => handleInputChange("age", Number(e.target.value))}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="Enter age in years"
                    min="0"
                    max="30"
                  />
                  {errors.age && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.age}
                    </div>
                  )}
                </div>

                {/* Sex */}
                <div>
                  <Label
                    htmlFor="sex"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Sex <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select value={formData.sex || ""} onValueChange={(value) => handleInputChange("sex", value)}>
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexOptions.map((sex) => (
                        <SelectItem key={sex} value={sex}>
                          {sex}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sex && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.sex}
                    </div>
                  )}
                </div>

                {/* Tumour Type */}
                <div>
                  <Label
                    htmlFor="tumourType"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Tumour Type <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={formData.tumourType || ""}
                    onValueChange={(value) => handleInputChange("tumourType", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select tumour type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tumourTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tumourType && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.tumourType}
                    </div>
                  )}
                </div>

                {/* Anatomical Location */}
                <div>
                  <Label
                    htmlFor="anatomicalLocation"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Anatomical Location <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="anatomicalLocation"
                    value={formData.anatomicalLocation || ""}
                    onChange={(e) => handleInputChange("anatomicalLocation", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    placeholder="e.g., Left forelimb, Abdomen, Head/neck"
                  />
                  {errors.anatomicalLocation && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.anatomicalLocation}
                    </div>
                  )}
                </div>

                {/* Diagnostic Method */}
                <div>
                  <Label
                    htmlFor="diagnosticMethod"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Diagnostic Method <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={formData.diagnosticMethod || ""}
                    onValueChange={(value) => handleInputChange("diagnosticMethod", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select diagnostic method" />
                    </SelectTrigger>
                    <SelectContent>
                      {diagnosticMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.diagnosticMethod && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.diagnosticMethod}
                    </div>
                  )}
                </div>

                {/* Date of Diagnosis */}
                <div>
                  <Label
                    htmlFor="diagnosisDate"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center"
                  >
                    Date of Diagnosis <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="diagnosisDate"
                      type="date"
                      value={formData.diagnosisDate || ""}
                      onChange={(e) => handleInputChange("diagnosisDate", e.target.value)}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  </div>
                  {errors.diagnosisDate && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.diagnosisDate}
                    </div>
                  )}
                </div>

                {/* Treatment Protocol */}
                <div>
                  <Label
                    htmlFor="treatmentProtocol"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Treatment Protocol
                  </Label>
                  <Select
                    value={formData.treatmentProtocol || ""}
                    onValueChange={(value) => handleInputChange("treatmentProtocol", value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      <SelectValue placeholder="Select treatment protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentProtocols.map((protocol) => (
                        <SelectItem key={protocol} value={protocol}>
                          {protocol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Follow-Up Date */}
                <div>
                  <Label htmlFor="followUpDate" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Follow-Up Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate || ""}
                      onChange={(e) => handleInputChange("followUpDate", e.target.value)}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  </div>
                  {errors.followUpDate && (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.followUpDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Full-width fields */}
              <div className="space-y-6">
                {/* Follow-Up Outcome */}
                <div>
                  <Label
                    htmlFor="followUpOutcome"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Follow-Up Outcome
                  </Label>
                  <Textarea
                    id="followUpOutcome"
                    value={formData.followUpOutcome || ""}
                    onChange={(e) => handleInputChange("followUpOutcome", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 resize-none"
                    rows={3}
                    placeholder="Describe the follow-up outcome..."
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <Label
                    htmlFor="additionalNotes"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes || ""}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 resize-none"
                    rows={4}
                    placeholder="Any additional clinical notes, observations, or comments..."
                  />
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radiographs */}
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Radiographs</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold">Click to upload</span> radiographs
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or PDF (MAX. 10MB)</p>
                        </div>
                        <input type="file" className="hidden" multiple accept="image/*,.pdf" />
                      </label>
                    </div>
                  </div>

                  {/* Histopath Slides */}
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Histopath Slides
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold">Click to upload</span> histopath slides
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or PDF (MAX. 10MB)</p>
                        </div>
                        <input type="file" className="hidden" multiple accept="image/*,.pdf" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Decision Support */}
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Clinical Decision Support</h4>
                <p className="text-sm text-teal-700 dark:text-teal-400">
                  💡 Remember to follow WHO staging guidelines for accurate tumour classification. Consider genetic
                  markers for targeted therapy options.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
    </div>
  )
}
