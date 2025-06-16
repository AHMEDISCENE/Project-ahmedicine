export interface CaseData {
  id?: string
  createdAt?: Date
  ownerName: string
  hospitalName: string
  state: string
  city: string
  patientName: string
  species: string
  breed: string
  age: number
  sex: string
  tumourType: string
  location: string
  diagnosticMethod: string
  diagnosisDate: string
  treatmentProtocol?: string
  followUpDate?: string
  outcome?: string
  notes?: string
  diagnosticImages?: File[]
  [key: string]: any
}

export interface FormField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "select" | "textarea" | "date" | "file"
  required: boolean
  enabled?: boolean
  options?: string[]
}
