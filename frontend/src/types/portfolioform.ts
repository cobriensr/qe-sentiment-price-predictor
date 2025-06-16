interface PortfolioForm {
  name: string
  holdings: {
    symbol: string
    shares: number
    avgCost: number
  }[]
}

export default PortfolioForm
