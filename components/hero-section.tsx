"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, FolderOpen, FileText, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter for client-side navigation

interface HeroSectionProps {
  onNewCase?: () => void // Optional prop for direct new case action
}

export function HeroSection({ onNewCase }: HeroSectionProps) {
  const router = useRouter()

  const handleNewCaseClick = () => {
    if (onNewCase) {
      onNewCase()
    } else {
      router.push("/new-case") // Navigate using Next.js router
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-700 dark:to-teal-900 text-white py-20 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" fill="none" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 L 0 80" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="100" cy="100" r="50" fill="currentColor" fillOpacity="0.1" />
          <circle cx="600" cy="300" r="100" fill="currentColor" fillOpacity="0.1" />
          <circle cx="1100" cy="500" r="70" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Empowering Veterinary Oncology with Data
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
          Streamline case management, gain actionable insights, and advance research with VetOncoData.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="bg-white text-teal-600 hover:bg-teal-50 hover:text-teal-700 px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleNewCaseClick}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Case
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 bg-transparent"
            onClick={() => router.push("/case-records")} // Navigate using Next.js router
          >
            <FolderOpen className="w-5 h-5 mr-2" />
            View Case Records
          </Button>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Comprehensive Analytics
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI-Powered Insights
          </div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Secure Data Storage
          </div>
        </div>
      </div>
    </section>
  )
}
