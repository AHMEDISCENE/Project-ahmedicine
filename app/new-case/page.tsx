"use client"

import { CaseEntryForm } from "@/components/case-entry-form"

export default function NewCasePage() {
  // This component will handle the submission logic internally
  const handleSubmit = (data: any) => {
    console.log("New case submitted:", data)
    // You might want to redirect the user or show a success message here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CaseEntryForm onSubmit={handleSubmit} />
    </div>
  )
}
