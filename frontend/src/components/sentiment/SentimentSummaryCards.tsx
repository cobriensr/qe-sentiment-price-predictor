// src/components/sentiment/SentimentSummaryCards.tsx
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react'
import SentimentSummaryCardsProps from '@/types/sentimentsummarycardsprops'

export default function SentimentSummaryCards({ result }: Readonly<SentimentSummaryCardsProps>) {
  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.7) return 'Bullish'
    if (sentiment >= 0.4) return 'Neutral'
    return 'Bearish'
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.7) return 'text-sentiment-positive'
    if (sentiment >= 0.4) return 'text-sentiment-neutral'
    return 'text-sentiment-negative'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Current Sentiment Card */}
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Current Sentiment</span>
        </div>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${getSentimentColor(result.sentiment)}`}>
            {getSentimentLabel(result.sentiment)}
          </div>
          <div className="text-sm text-muted-foreground">
            {(result.sentiment * 100).toFixed(0)}% positive
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                result.sentiment >= 0.7
                  ? 'bg-sentiment-positive'
                  : result.sentiment >= 0.4
                    ? 'bg-sentiment-neutral'
                    : 'bg-sentiment-negative'
              }`}
              style={{ width: `${result.sentiment * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Confidence Card */}
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Confidence</span>
        </div>
        <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(0)}%</div>
        <div className="text-sm text-muted-foreground">Model confidence</div>
      </div>

      {/* Prediction Card */}
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          {result.predictionValue >= 0 ? (
            <TrendingUp className="h-4 w-4 text-sentiment-positive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-sentiment-negative" />
          )}
          <span className="text-sm font-medium text-muted-foreground">90-Day Prediction</span>
        </div>
        <div
          className={`text-2xl font-bold ${result.predictionValue >= 0 ? 'text-sentiment-positive' : 'text-sentiment-negative'}`}
        >
          {result.prediction}
        </div>
        <div className="text-sm text-muted-foreground">Expected return</div>
      </div>

      {/* Earnings Date Card */}
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Next Earnings</span>
        </div>
        <div className="text-2xl font-bold">{result.earningsDate}</div>
        <div className="text-sm text-muted-foreground">Estimated date</div>
      </div>
    </div>
  )
}
