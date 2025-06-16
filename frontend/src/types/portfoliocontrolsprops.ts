interface PortfolioControlsProps {
  readonly searchQuery: string
  readonly sortBy: 'symbol' | 'value' | 'return' | 'sentiment'
  readonly onSearchChange: (query: string) => void
  readonly onSortChange: (sort: 'symbol' | 'value' | 'return' | 'sentiment') => void
}

export default PortfolioControlsProps
