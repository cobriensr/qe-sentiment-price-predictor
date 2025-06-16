// src/hooks/useStockPrice.ts
import { useState, useEffect } from 'react'

export function useStockPrice(symbol: string) {
  const [price, setPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setPrice(null)
      return
    }

    const fetchPrice = async () => {
      setLoading(true)
      setError(null)

      try {
        // Mock API call - replace with actual Alpha Vantage call
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
        )
        const data = await response.json()
        console.log('Stock price data:', data)
        // Mock price for now
        const mockPrice = Math.random() * 200 + 50
        setPrice(mockPrice)

        // Real implementation would be:
        // const currentPrice = parseFloat(data['Global Quote']['05. price'])
        // setPrice(currentPrice)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock price'
        setError(errorMessage)
        setPrice(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
  }, [symbol])

  return { price, loading, error }
}
