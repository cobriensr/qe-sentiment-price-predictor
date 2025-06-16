// src/components/portfolio/PortfolioSummaryCards.tsx
import { BarChart3, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import SentimentBadge from '../../components/sentiment/SentimentBadge'
import PortfolioSummaryCardsProps from '../../types/portfoliosummarycardsprops'

export default function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Total Value</span>
        </div>
        <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
        <div className="text-sm text-muted-foreground">
          Cost: {formatCurrency(summary.totalCost)}
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          {summary.totalReturn >= 0 ? (
            <TrendingUp className="h-4 w-4 text-sentiment-positive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-sentiment-negative" />
          )}
          <span className="text-sm font-medium text-muted-foreground">Total Return</span>
        </div>
        <div
          className={`text-2xl font-bold ${summary.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
        >
          {formatCurrency(summary.totalReturn)}
        </div>
        <div
          className={`text-sm ${summary.totalReturn >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
        >
          {formatPercent(summary.totalReturnPercent)}
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Avg Sentiment</span>
        </div>
        <div className="mb-2">
          <SentimentBadge sentiment={summary.avgSentiment} size="md" />
        </div>
        <div className="text-sm text-muted-foreground">
          {(summary.avgSentiment * 100).toFixed(0)}% positive
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Upcoming Earnings</span>
        </div>
        <div className="text-2xl font-bold">{summary.upcomingEarnings}</div>
        <div className="text-sm text-muted-foreground">Next 7 days</div>
      </div>
    </div>
  )
}
