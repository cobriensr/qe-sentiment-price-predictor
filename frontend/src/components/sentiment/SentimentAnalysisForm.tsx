// src/components/sentiment/SentimentAnalysisForm.tsx
'use client'

import { Search, Loader2 } from 'lucide-react'
import SentimentAnalysisFormProps from '../../types/sentimentanalysisformprops'

export default function SentimentAnalysisForm({
  symbol,
  onSymbolChange,
  onSubmit,
  loading,
}: Readonly<SentimentAnalysisFormProps>) {
  return (
    <div className="mb-8">
      <form onSubmit={onSubmit} className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={symbol}
            onChange={e => onSymbolChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !symbol.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </form>
    </div>
  )
}
