interface SentimentAnalysis {
  symbol: string
  sentiment: number
  confidence: number
  earningsDate: string
  analysisDate: string
  transcript?: string
  keyPhrases?: string[]
}

export default SentimentAnalysis
