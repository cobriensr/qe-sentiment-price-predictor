// src/app/portfolio/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Calendar, Search } from 'lucide-react'
import Navbar from '@/components/ui/NavBar'
import PageHeader from '@/components/ui/PageHeader'
import SentimentBadge from '@/components/sentiment/SentimentBadge'

interface PortfolioHolding {
  symbol: string
  company: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
  totalReturn: number
  totalReturnPercent: number
  lastSentiment?: number
  nextEarnings?: string
  sentimentTrend: 'up' | 'down' | 'stable'
  riskLevel: 'low' | 'medium' | 'high'
}

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

  const getSentimentTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-sentiment-positive" />
      case 'down': return <TrendingDown className="h-3 w-3 text-sentiment-negative" />
      default: return <BarChart3 className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${colors[risk as keyof typeof colors]}`}>
        {risk.toUpperCase()}
      </span>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <PageHeader
            title="Portfolio Analysis"
            description="Track your holdings with sentiment-based insights and performance metrics"
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-input rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Holding
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Analyze All
            </button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</div>
            <div className="text-sm text-muted-foreground">
              Cost: {formatCurrency(portfolioSummary.totalCost)}
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              {portfolioSummary.totalReturn >= 0 ? (
                <TrendingUp className="h-4 w-4 text-sentiment-positive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-sentiment-negative" />
              )}
              <span className="text-sm font-medium text-muted-foreground">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${portfolioSummary.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
              {formatCurrency(portfolioSummary.totalReturn)}
            </div>
            <div className={`text-sm ${portfolioSummary.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
              {formatPercent(portfolioSummary.totalReturnPercent)}
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Avg Sentiment</span>
            </div>
            <div className="mb-2">
              <SentimentBadge sentiment={portfolioSummary.avgSentiment} size="md" />
            </div>
            <div className="text-sm text-muted-foreground">
              {(portfolioSummary.avgSentiment * 100).toFixed(0)}% positive
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Upcoming Earnings</span>
            </div>
            <div className="text-2xl font-bold">{portfolioSummary.upcomingEarnings}</div>
            <div className="text-sm text-muted-foreground">Next 7 days</div>
          </div>
        </div>

        {/* Phase 3 Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Phase 3 Feature Preview</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Portfolio management will be available in Phase 3 with user authentication and real portfolio tracking. 
            This is a preview with sample data.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search holdings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="value">Sort by Value</option>
            <option value="symbol">Sort by Symbol</option>
            <option value="return">Sort by Return</option>
            <option value="sentiment">Sort by Sentiment</option>
          </select>
        </div>

        {/* Holdings Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-right p-4 font-medium">Shares</th>
                  <th className="text-right p-4 font-medium">Avg Cost</th>
                  <th className="text-right p-4 font-medium">Current</th>
                  <th className="text-right p-4 font-medium">Market Value</th>
                  <th className="text-right p-4 font-medium">Return</th>
                  <th className="text-center p-4 font-medium">Sentiment</th>
                  <th className="text-center p-4 font-medium">Risk</th>
                  <th className="text-center p-4 font-medium">Next Earnings</th>
                  <th className="text-center p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filterAndSortHoldings().map((holding) => (
                  <tr key={holding.symbol} className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold">{holding.symbol}</div>
                          <div className="text-sm text-muted-foreground">{holding.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">{holding.shares}</td>
                    <td className="p-4 text-right">${holding.avgCost.toFixed(2)}</td>
                    <td className="p-4 text-right">${holding.currentPrice.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium">{formatCurrency(holding.marketValue)}</td>
                    <td className="p-4 text-right">
                      <div className={`font-medium ${holding.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
                        {formatCurrency(holding.totalReturn)}
                      </div>
                      <div className={`text-sm ${holding.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}>
                        {formatPercent(holding.totalReturnPercent)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {holding.lastSentiment && <SentimentBadge sentiment={holding.lastSentiment} size="sm" />}
                        {getSentimentTrendIcon(holding.sentimentTrend)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {getRiskBadge(holding.riskLevel)}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {holding.nextEarnings ? new Date(holding.nextEarnings).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/analyze?symbol=${holding.symbol}`}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                      >
                        Analyze
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filterAndSortHoldings().length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No holdings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Add some stocks to your portfolio to get started.'}
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Add Your First Holding
            </button>
          </div>
        )}
      </div>
    </div>
  )
}