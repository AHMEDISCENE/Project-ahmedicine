"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Brain, Sparkles, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function AIInsights() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateInsight = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate insights.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse("")
    setError(null)

    try {
      // Simulate API call to an AI model
      const res = await fetch("/api/generate-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to generate insight")
      }

      const data = await res.json()
      setResponse(data.insight)
      toast({
        title: "Insight Generated",
        description: "AI has provided a new insight.",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error Generating Insight",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass-panel shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Insights</CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Leverage AI to uncover patterns and insights from your oncology data.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ai-prompt" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Enter your query or area of interest:
            </Label>
            <Textarea
              id="ai-prompt"
              placeholder="e.g., 'Summarize common treatment outcomes for canine lymphoma' or 'Identify trends in feline mammary tumors by age group.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 resize-none"
              disabled={isLoading}
            />
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleGenerateInsight} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insight
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}

          {response && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI Response:
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
