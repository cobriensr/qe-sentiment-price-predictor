interface StockPrediction {
  symbol: string
  prediction: string
  predictionValue: number
  confidence: number
  timeframe: number // days
  targetDate: string
  factors?: string[]
}

export default StockPrediction
