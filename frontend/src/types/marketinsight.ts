interface MarketInsight {
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  confidence: number
}

export default MarketInsight
