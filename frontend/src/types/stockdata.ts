interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  lastUpdate: string
}

export default StockData
