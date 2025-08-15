"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Search, BarChart2, Sparkles, Clock, Save } from "lucide-react"

export function AIInsights() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string | null>(null)
  const [savedQueries, setSavedQueries] = useState([
    { id: "1", query: "Show grade II mast cell tumours in cats", timestamp: "2 days ago" },
    { id: "2", query: "Compare survival rates for lymphoma in dogs vs cats", timestamp: "1 week ago" },
    { id: "3", query: "Identify treatment protocols with highest success for osteosarcoma", timestamp: "2 weeks ago" },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResults(null)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate response based on query
    let response = ""
    if (query.toLowerCase().includes("mast cell") && query.toLowerCase().includes("cat")) {
      response = `
        <h3 class="text-lg font-semibold mb-2">Grade II Mast Cell Tumours in Cats</h3>
        <p class="mb-4">Found 7 cases matching your criteria.</p>
        
        <div class="space-y-2 mb-4">
          <p><strong>Age Distribution:</strong> 7-14 years (mean: 10.2 years)</p>
          <p><strong>Common Locations:</strong> Head/neck (42%), limbs (29%), trunk (29%)</p>
          <p><strong>Treatment Outcomes:</strong> 57% complete response, 29% partial response, 14% progressive disease</p>
        </div>
        
        <div class="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-md">
          <p class="text-sm text-teal-800 dark:text-teal-300 font-medium">Clinical Insight:</p>
          <p class="text-sm text-teal-700 dark:text-teal-400">Grade II MCTs in cats showed better response to wide surgical excision compared to chemotherapy alone. Consider adjuvant radiation for incompletely excised tumours.</p>
        </div>
      `
    } else if (query.toLowerCase().includes("lymphoma")) {
      response = `
        <h3 class="text-lg font-semibold mb-2">Lymphoma Comparative Analysis</h3>
        <p class="mb-4">Analysis based on 42 canine and 28 feline cases.</p>
        
        <div class="space-y-2 mb-4">
          <p><strong>Median Survival Time:</strong></p>
          <p>- Dogs: 12.8 months with multi-agent chemotherapy</p>
          <p>- Cats: 9.4 months with similar protocols</p>
          <p><strong>Complete Response Rate:</strong></p>
          <p>- Dogs: 68% initial CR</p>
          <p>- Cats: 52% initial CR</p>
        </div>
        
        <div class="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-md">
          <p class="text-sm text-teal-800 dark:text-teal-300 font-medium">Clinical Insight:</p>
          <p class="text-sm text-teal-700 dark:text-teal-400">Feline lymphoma patients showed higher treatment sensitivity but shorter remission duration. Consider more frequent monitoring in feline patients.</p>
        </div>
      `
    } else {
      response = `
        <h3 class="text-lg font-semibold mb-2">Analysis Results</h3>
        <p class="mb-4">I've analyzed your database for "${query}"</p>
        
        <div class="space-y-2 mb-4">
          <p>Your query returned limited results. Consider refining your search terms or expanding your criteria.</p>
          <p>Try including specific tumour types, treatment protocols, or patient demographics.</p>
        </div>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">Suggestion:</p>
          <p class="text-sm text-blue-700 dark:text-blue-400">Try using more specific terminology or check our suggested queries for examples.</p>
        </div>
      `
    }

    setResults(response)
    setIsLoading(false)
  }

  const handleSavedQuery = (query: string) => {
    setQuery(query)
    handleSubmit(new Event("submit") as any)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-0 shadow-xl">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-teal-600 dark:text-teal-500" />
            AI Insights
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400">
            Ask questions about your oncology data to discover patterns and insights
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="query">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="query">
                <Search className="h-4 w-4 mr-2" />
                Query Data
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Save className="h-4 w-4 mr-2" />
                Saved Queries
              </TabsTrigger>
              <TabsTrigger value="suggested">
                <Sparkles className="h-4 w-4 mr-2" />
                Suggested
              </TabsTrigger>
            </TabsList>

            <TabsContent value="query" className="space-y-6">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Show grade II mast cell tumours in cats"
                    className="pr-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Ask AI"
                  )}
                </Button>
              </form>

              {results && (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-md">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-500 mr-2" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">AI Response</h3>
                  </div>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: results }} />
                </div>
              )}

              {!results && !isLoading && (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Ask a question about your oncology data to get started
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-slate-500" />
                  Recent Queries
                </h3>

                {savedQueries.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 cursor-pointer transition-all"
                    onClick={() => handleSavedQuery(item.query)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{item.query}</p>
                      <span className="text-xs text-slate-500">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggested">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left flex flex-col items-start gap-2 bg-white/60 dark:bg-slate-800/60"
                  onClick={() => handleSavedQuery("Show treatment outcomes for dogs with osteosarcoma by age group")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-500" />
                    <span className="font-medium">Treatment Outcomes Analysis</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Show treatment outcomes for dogs with osteosarcoma by age group
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left flex flex-col items-start gap-2 bg-white/60 dark:bg-slate-800/60"
                  onClick={() => handleSavedQuery("Compare survival rates for lymphoma in dogs vs cats")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-500" />
                    <span className="font-medium">Species Comparison</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Compare survival rates for lymphoma in dogs vs cats
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left flex flex-col items-start gap-2 bg-white/60 dark:bg-slate-800/60"
                  onClick={() => handleSavedQuery("Show grade II mast cell tumours in cats")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-500" />
                    <span className="font-medium">Specific Tumour Analysis</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Show grade II mast cell tumours in cats
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left flex flex-col items-start gap-2 bg-white/60 dark:bg-slate-800/60"
                  onClick={() => handleSavedQuery("Identify treatment protocols with highest success for osteosarcoma")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-500" />
                    <span className="font-medium">Protocol Effectiveness</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Identify treatment protocols with highest success for osteosarcoma
                  </span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
