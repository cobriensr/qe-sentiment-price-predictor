import PortfolioHolding from './portfolioholding'

interface Portfolio {
  id: string
  name: string
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
  createdAt: string
  updatedAt: string
}

export default Portfolio
