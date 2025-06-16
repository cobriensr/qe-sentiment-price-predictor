// src/components/portfolio/PortfolioHoldingsTable.tsx
import Link from 'next/link'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import SentimentBadge from '@/components/sentiment/SentimentBadge'
import PortfolioHoldingsTableProps from '@/types/portfolioholdingstableprops'

export default function PortfolioHoldingsTable({
  holdings,
}: Readonly<PortfolioHoldingsTableProps>) {
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

  const getSentimentTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-sentiment-positive" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-sentiment-negative" />
      default:
        return <BarChart3 className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    }
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full border ${colors[risk as keyof typeof colors]}`}
      >
        {risk.toUpperCase()}
      </span>
    )
  }

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No holdings found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search criteria or add some stocks to your portfolio.
        </p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Add Your First Holding
        </button>
      </div>
    )
  }

  return (
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
            {holdings.map(holding => (
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
                <td className="p-4 text-right font-medium">
                  {formatCurrency(holding.marketValue)}
                </td>
                <td className="p-4 text-right">
                  <div
                    className={`font-medium ${holding.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
                  >
                    {formatCurrency(holding.totalReturn)}
                  </div>
                  <div
                    className={`text-sm ${holding.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
                  >
                    {formatPercent(holding.totalReturnPercent)}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {holding.lastSentiment && (
                      <SentimentBadge sentiment={holding.lastSentiment} size="sm" />
                    )}
                    {getSentimentTrendIcon(holding.sentimentTrend)}
                  </div>
                </td>
                <td className="p-4 text-center">{getRiskBadge(holding.riskLevel)}</td>
                <td className="p-4 text-center text-sm">
                  {holding.nextEarnings
                    ? new Date(holding.nextEarnings).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
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
  )
}
