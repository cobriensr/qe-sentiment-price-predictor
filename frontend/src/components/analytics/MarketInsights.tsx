// src/components/analytics/MarketInsights.tsx
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import MarketInsightsProps from '@/types/marketinsightprops'

export default function MarketInsights({ insights }: Readonly<MarketInsightsProps>) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-sentiment-positive'
      case 'negative':
        return 'text-sentiment-negative'
      default:
        return 'text-sentiment-neutral'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />
      case 'negative':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">AI-Generated Market Insights</h3>
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <div
            key={`insight-${insight.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
            className="p-4 bg-secondary/30 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={getImpactColor(insight.impact)}>
                    {getImpactIcon(insight.impact)}
                  </span>
                  <h4 className="font-medium">{insight.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
