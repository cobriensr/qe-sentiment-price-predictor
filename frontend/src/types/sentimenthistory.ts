interface SentimentHistory {
  quarter: string
  sentiment: number
  actualReturn: number
  predictedReturn: number
  accuracy?: number
}

export default SentimentHistory
