// src/types/sentiment.ts

export interface HistoricalDataPoint {
  date: string
  price: number
  sentiment?: number
}

export interface SentimentHistoryPoint {
  quarter: string
  sentiment: number
  actualReturn: number
  predictedReturn: number
}

export interface SentimentResult {
  symbol: string
  sentiment: number
  confidence: number
  prediction: string
  predictionValue: number
  earningsDate: string
  targetDate: string
  historicalData: Array<HistoricalDataPoint>
  sentimentHistory: Array<SentimentHistoryPoint>
}

// Export individual interfaces AND a default
export default SentimentResult
