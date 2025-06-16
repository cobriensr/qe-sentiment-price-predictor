// src/app/portfolio/page.tsx (Refactored)
'use client'

import { useState } from 'react'
import Navbar from '../../components/ui/NavBar'
import PortfolioPageHeader from '../../components/portfolio/PortfolioPageHeader'
import PortfolioSummaryCards from '../../components/portfolio/PortfolioSummaryCards'
import PortfolioPhaseNotice from '../../components/portfolio/PortfolioPhaseNotice'
import PortfolioControls from '../../components/portfolio/PortfolioControls'
import PortfolioHoldingsTable from '../../components/portfolio/PortfolioHoldingsTable'
import PortfolioHolding from '../../types/portfolioholding'
import PortfolioSummary from '../../types/portfoliosummary'

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'symbol' | 'value' | 'return' | 'sentiment'>('value')

  // Mock portfolio data - in Phase 3 this would come from user's actual portfolio
  const portfolioHoldings: PortfolioHolding[] = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      shares: 50,
      avgCost: 150.0,
      currentPrice: 185.0,
      marketValue: 9250.0,
      totalReturn: 1750.0,
      totalReturnPercent: 23.33,
      lastSentiment: 0.78,
      nextEarnings: '2025-01-30',
      sentimentTrend: 'stable',
      riskLevel: 'low',
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corporation',
      shares: 25,
      avgCost: 280.0,
      currentPrice: 320.0,
      marketValue: 8000.0,
      totalReturn: 1000.0,
      totalReturnPercent: 14.29,
      lastSentiment: 0.82,
      nextEarnings: '2025-01-29',
      sentimentTrend: 'up',
      riskLevel: 'low',
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      shares: 15,
      avgCost: 250.0,
      currentPrice: 180.0,
      marketValue: 2700.0,
      totalReturn: -1050.0,
      totalReturnPercent: -28.0,
      lastSentiment: 0.65,
      nextEarnings: '2025-01-17',
      sentimentTrend: 'up',
      riskLevel: 'high',
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      shares: 20,
      avgCost: 140.0,
      currentPrice: 165.0,
      marketValue: 3300.0,
      totalReturn: 500.0,
      totalReturnPercent: 17.86,
      lastSentiment: 0.58,
      nextEarnings: '2025-02-04',
      sentimentTrend: 'down',
      riskLevel: 'medium',
    },
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      shares: 10,
      avgCost: 450.0,
      currentPrice: 520.0,
      marketValue: 5200.0,
      totalReturn: 700.0,
      totalReturnPercent: 15.56,
      lastSentiment: 0.88,
      nextEarnings: '2025-02-20',
      sentimentTrend: 'stable',
      riskLevel: 'high',
    },
  ]

  const portfolioSummary: PortfolioSummary = {
    totalValue: portfolioHoldings.reduce((sum, holding) => sum + holding.marketValue, 0),
    totalCost: portfolioHoldings.reduce(
      (sum, holding) => sum + holding.avgCost * holding.shares,
      0
    ),
    totalReturn: portfolioHoldings.reduce((sum, holding) => sum + holding.totalReturn, 0),
    totalReturnPercent: 0, // Calculated below
    avgSentiment:
      portfolioHoldings.reduce((sum, holding) => sum + (holding.lastSentiment ?? 0), 0) /
      portfolioHoldings.length,
    upcomingEarnings: portfolioHoldings.filter(holding => {
      if (!holding.nextEarnings) return false
      const earningsDate = new Date(holding.nextEarnings)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return earningsDate <= nextWeek
    }).length,
  }

  portfolioSummary.totalReturnPercent =
    (portfolioSummary.totalReturn / portfolioSummary.totalCost) * 100

  const filterAndSortHoldings = () => {
    let filtered = portfolioHoldings

    if (searchQuery) {
      filtered = filtered.filter(
        holding =>
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
        <PortfolioPageHeader onAddHolding={handleAddHolding} onAnalyzeAll={handleAnalyzeAll} />

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
