"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Shield, Zap, BarChart3 } from "lucide-react"

interface HeroSectionProps {
  onNewCase: () => void
}

export function HeroSection({ onNewCase }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background with Gaussian blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/placeholder.svg?height=800&width=1200)",
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Centralise Small-Animal
          <span className="block text-teal-400">Cancer Records</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-slate-200 font-medium">Fast. Secure. Insightful.</p>

        <Button
          onClick={onNewCase}
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Enter a New Case
        </Button>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Zap className="h-8 w-8 text-teal-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-slate-200 text-sm">Quick data entry with intelligent validation</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Shield className="h-8 w-8 text-teal-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Secure & Compliant</h3>
            <p className="text-slate-200 text-sm">NDPR compliant with audit trails</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <BarChart3 className="h-8 w-8 text-teal-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-slate-200 text-sm">Spot trends and patterns in your data</p>
          </div>
        </div>
      </div>
    </section>
  )
}
