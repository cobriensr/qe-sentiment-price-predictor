interface SearchResult {
  symbol: string
  name: string
  exchange: string
  type: 'stock' | 'etf' | 'index'
  lastPrice?: number
  marketCap?: number
}

export default SearchResult
