interface PortfolioHolding {
  symbol: string
  company: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
  totalReturn: number
  totalReturnPercent: number
  lastSentiment?: number
  nextEarnings?: string
  sentimentTrend: 'up' | 'down' | 'stable'
  riskLevel: 'low' | 'medium' | 'high'
}

export default PortfolioHolding
