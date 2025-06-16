interface EarningsEvent {
  symbol: string
  company: string
  date: string
  time: string
  quarter: string
  lastSentiment?: number
  expectedSentiment?: number
  importance: 'high' | 'medium' | 'low'
}

export default EarningsEvent;