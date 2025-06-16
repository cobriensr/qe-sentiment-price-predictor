// src/app/portfolio/page.tsx (Refactored)
'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/NavBar'
import PortfolioPageHeader from '@/components/portfolio/PortfolioPageHeader'
import PortfolioSummaryCards from '@/components/portfolio/PortfolioSummaryCards'
import PortfolioPhaseNotice from '@/components/portfolio/PortfolioPhaseNotice'
import PortfolioControls from '@/components/portfolio/PortfolioControls'
import PortfolioHoldingsTable, { PortfolioHolding } from '@/components/portfolio/PortfolioHoldingsTable'

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalReturn: number
  totalReturnPercent: number
  avgSentiment: number
  upcomingEarnings: number
}

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'symbol' | 'value' | 'return' | 'sentiment'>('value')

  // Mock portfolio data - in Phase 3 this would come from user's actual portfolio
  const portfolioHoldings: PortfolioHolding[] = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      shares: 50,
      avgCost: 150.00,
      currentPrice: 185.00,
      marketValue: 9250.00,
      totalReturn: 1750.00,
      totalReturnPercent: 23.33,
      lastSentiment: 0.78,
      nextEarnings: '2025-01-30',
      sentimentTrend: 'stable',
      riskLevel: 'low'
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      shares: 25,
      avgCost: 280.00,
      currentPrice: 320.00,
      marketValue: 8000.00,
      totalReturn: 1000.00,
      totalReturnPercent: 14.29,
      lastSentiment: 0.82,
      nextEarnings: '2025-01-29',
      sentimentTrend: 'up',
      riskLevel: 'low'
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      shares: 15,
      avgCost: 250.00,
      currentPrice: 180.00,
      marketValue: 2700.00,
      totalReturn: -1050.00,
      totalReturnPercent: -28.00,
      lastSentiment: 0.65,
      nextEarnings: '2025-01-17',
      sentimentTrend: 'up',
      riskLevel: 'high'
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      shares: 20,
      avgCost: 140.00,
      currentPrice: 165.00,
      marketValue: 3300.00,
      totalReturn: 500.00,
      totalReturnPercent: 17.86,
      lastSentiment: 0.58,
      nextEarnings: '2025-02-04',
      sentimentTrend: 'down',
      riskLevel: 'medium'
    },
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      shares: 10,
      avgCost: 450.00,
      currentPrice: 520.00,
      marketValue: 5200.00,
      totalReturn: 700.00,
      totalReturnPercent: 15.56,
      lastSentiment: 0.88,
      nextEarnings: '2025-02-20',
      sentimentTrend: 'stable',
      riskLevel: 'high'
    }
  ]

  const portfolioSummary: PortfolioSummary = {
    totalValue: portfolioHoldings.reduce((sum, holding) => sum + holding.marketValue, 0),
    totalCost: portfolioHoldings.reduce((sum, holding) => sum + (holding.avgCost * holding.shares), 0),
    totalReturn: portfolioHoldings.reduce((sum, holding) => sum + holding.totalReturn, 0),
    totalReturnPercent: 0, // Calculated below
    avgSentiment: portfolioHoldings.reduce((sum, holding) => sum + (holding.lastSentiment ?? 0), 0) / portfolioHoldings.length,
    upcomingEarnings: portfolioHoldings.filter(holding => {
      if (!holding.nextEarnings) return false
      const earningsDate = new Date(holding.nextEarnings)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return earningsDate <= nextWeek
    }).length
  }

  portfolioSummary.totalReturnPercent = (portfolioSummary.totalReturn / portfolioSummary.totalCost) * 100

  const filterAndSortHoldings = () => {
    let filtered = portfolioHoldings

    if (searchQuery) {
      filtered = filtered.filter(holding => 
        holding.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol)
        case 'value':
          return b.marketValue - a.marketValue
        case 'return':
          return b.totalReturnPercent - a.totalReturnPercent
        case 'sentiment':
          return (b.lastSentiment ?? 0) - (a.lastSentiment ?? 0)
        default:
          return 0
      }
    })
  }

  const handleAddHolding = () => {
    // Phase 3: Open add holding modal/form
    console.log('Add holding clicked')
  }

  const handleAnalyzeAll = () => {
    // Phase 3: Batch analyze all holdings
    console.log('Analyze all clicked')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <PortfolioPageHeader 
          onAddHolding={handleAddHolding}
          onAnalyzeAll={handleAnalyzeAll}
        />

        <PortfolioSummaryCards summary={portfolioSummary} />

        <PortfolioPhaseNotice />

        <PortfolioControls
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
        />

        <PortfolioHoldingsTable holdings={filterAndSortHoldings()} />
      </div>
    </div>
  )
}