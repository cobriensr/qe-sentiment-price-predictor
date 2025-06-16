// src/app/analyze/page.tsx (Updated)
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/ui/NavBar'
import PageHeader from '@/components/ui/PageHeader'
import ErrorDisplay from '@/components/ui/ErrorDisplay'
import SentimentAnalysisForm from '@/components/sentiment/SentimentAnalysisForm'
import SentimentSummaryCards from '@/components/sentiment/SentimentSummaryCards'
import SentimentCharts from '@/components/sentiment/SentimentCharts'
import SentimentAnalysisSummary from '@/components/sentiment/SentimentAnalysisSummary'
import SentimentResult from '@/types/sentimentresult'


export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const [symbol, setSymbol] = useState(searchParams?.get('symbol') ?? '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SentimentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
     
      // Mock data - replace with actual API response
      const mockResult: SentimentResult = {
        symbol: symbol.toUpperCase(),
        sentiment: 0.75,
        confidence: 0.89,
        prediction: '+14.2%',
        predictionValue: 14.2,
        earningsDate: '2025-01-28',
        targetDate: '2025-04-28',
        historicalData: [
          { date: '2024-01', price: 150, sentiment: 0.6 },
          { date: '2024-04', price: 165, sentiment: 0.7 },
          { date: '2024-07', price: 170, sentiment: 0.8 },
          { date: '2024-10', price: 180, sentiment: 0.75 },
          { date: '2025-01', price: 185, sentiment: 0.75 },
        ],
        sentimentHistory: [
          { quarter: 'Q1 2024', sentiment: 0.6, actualReturn: 10.0, predictedReturn: 8.5 },
          { quarter: 'Q2 2024', sentiment: 0.7, actualReturn: 2.9, predictedReturn: 4.2 },
          { quarter: 'Q3 2024', sentiment: 0.8, actualReturn: 5.9, predictedReturn: 6.1 },
          { quarter: 'Q4 2024', sentiment: 0.75, actualReturn: 8.8, predictedReturn: 9.2 },
        ]
      }
     
      setResult(mockResult)
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to analyze stock: ${err.message}`)
        console.error(err)
      } else {
        setError('Failed to analyze stock. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Stock Sentiment Analysis"
          description="Analyze earnings call sentiment to predict quarterly stock performance"
        />

        <SentimentAnalysisForm
          symbol={symbol}
          onSymbolChange={setSymbol}
          onSubmit={handleAnalyze}
          loading={loading}
        />

        {error && <ErrorDisplay error={error} className="mb-8" />}

        {result && (
          <div className="space-y-8">
            <SentimentSummaryCards result={result} />
           
            <SentimentCharts
              historicalData={result.historicalData}
              sentimentHistory={result.sentimentHistory}
            />
           
            <SentimentAnalysisSummary result={result} />
          </div>
        )}
      </div>
    </div>
  )
}