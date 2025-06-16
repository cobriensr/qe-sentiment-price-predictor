// src/hooks/useSentimentAnalysis.ts
import { useState } from 'react'
import { SentimentResult } from '@/types/sentimentresult'

export function useSentimentAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SentimentResult | null>(null)

  const analyzeSentiment = async (symbol: string): Promise<SentimentResult | null> => {
    setLoading(true)
    setError(null)

    try {
      // Your API call logic here
      const response = await fetch(`/api/sentiment/${symbol}`)
      const data = await response.json()
      setResult(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze sentiment'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { analyzeSentiment, loading, error, result }
}
