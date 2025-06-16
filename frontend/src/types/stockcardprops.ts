interface StockCardProps {
  symbol: string
  price: number
  change: number
  sentiment?: number
  onClick?: () => void
}

export default StockCardProps
