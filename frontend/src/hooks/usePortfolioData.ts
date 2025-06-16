// src/hooks/usePortfolioData.ts
import { useState } from 'react'
import PortfolioHolding from '../types/portfolioholding'

export function usePortfolioData() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Fetch from DynamoDB via API
      console.log('Fetching portfolio data...')

      // Mock implementation - replace with actual API call
      const mockPortfolio: PortfolioHolding[] = [
        // Example mock data
        {
          symbol: 'AAPL',
          company: 'Apple Inc.',
          shares: 50,
          avgCost: 150.0,
          currentPrice: 185.0,
          marketValue: 9250.0,
          totalReturn: 1750.0,
          totalReturnPercent: 23.33,
          sentimentTrend: 'up',
          riskLevel: 'low',
        },
      ]

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPortfolio(mockPortfolio)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addHolding = async (holding: PortfolioHolding): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Add to portfolio via API
      console.log('Adding holding:', holding.symbol)

      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Add to local state
      setPortfolio(prev => [...prev, holding])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add holding'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const removeHolding = async (symbol: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      console.log('Removing holding:', symbol)

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Remove from local state
      setPortfolio(prev => prev.filter(holding => holding.symbol !== symbol))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove holding'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    portfolio,
    loading,
    error,
    fetchPortfolio,
    addHolding,
    removeHolding,
  }
}
